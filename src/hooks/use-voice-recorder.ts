import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceRecorderState = "idle" | "requesting" | "recording" | "stopping";

interface RecordedAudio {
  blob: Blob;
  mimeType: string;
  durationMs: number;
}

interface Options {
  maxDurationMs?: number;
  onAutoStop?: () => void;
}

const PREFERRED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus",
  "audio/ogg",
  "audio/mp4",
];

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const m of PREFERRED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(m)) return m;
  }
  return undefined;
}

export function useVoiceRecorder(options: Options = {}) {
  const { maxDurationMs = 60_000, onAutoStop } = options;
  const [state, setState] = useState<VoiceRecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolveRef = useRef<((value: RecordedAudio | null) => void) | null>(
    null,
  );

  const cleanup = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const isSupported =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined";

  const start = useCallback(async () => {
    if (!isSupported) {
      setError(
        "Brauzer ovoz yozishni qo'llab-quvvatlamaydi. Chrome yoki Safari'ning yangi versiyasini ishlating.",
      );
      return false;
    }
    if (state !== "idle") return false;
    setError(null);
    setState("requesting");

    // Avval Permissions API'da mikrofon holatini tekshirib olamiz. Agar
    // "denied" bo'lsa, getUserMedia chaqirsak ham brauzer ruxsat so'rovini
    // ko'rsatmaydi — darhol NotAllowedError qaytaradi. Bu holatda user'ga
    // aniq yo'l-yo'riq ko'rsatish kerak: brauzer sozlamalaridan ochish.
    try {
      if (navigator.permissions?.query) {
        const status = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        if (status.state === "denied") {
          setError(
            "Mikrofonga ruxsat bloklangan. Brauzer manzil qatorining chap tomonidagi qulf belgisini bosib, mikrofonga ruxsat bering va sahifani yangilang.",
          );
          setState("idle");
          return false;
        }
      }
    } catch {
      // Permissions API ba'zi brauzerlarda mikrofon nomini bilmaydi —
      // bu xato emas, oddiy getUserMedia bilan davom etamiz
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = () => {
        const blobType =
          recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: blobType });
        const durationMs = Date.now() - startedAtRef.current;
        const resolver = resolveRef.current;
        resolveRef.current = null;
        cleanup();
        setState("idle");
        setElapsedMs(0);
        resolver?.({ blob, mimeType: blobType, durationMs });
      };
      recorder.start();
      startedAtRef.current = Date.now();
      setState("recording");
      setElapsedMs(0);
      tickRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startedAtRef.current);
      }, 200);
      stopTimerRef.current = setTimeout(() => {
        if (recorderRef.current && recorderRef.current.state === "recording") {
          onAutoStop?.();
          recorderRef.current.stop();
        }
      }, maxDurationMs);
      return true;
    } catch (err) {
      console.error("Voice recorder start failed", err);
      const e = err as Error & { name?: string };
      let msg: string;
      if (e?.name === "NotAllowedError" || e?.name === "SecurityError") {
        msg =
          "Mikrofonga ruxsat berilmadi. Brauzer manzil qatorining chap tomonidagi qulf belgisini bosib, mikrofonga ruxsat bering va sahifani yangilang.";
      } else if (e?.name === "NotFoundError" || e?.name === "OverconstrainedError") {
        msg = "Mikrofon topilmadi. Mikrofon ulanganligini tekshiring.";
      } else if (e?.name === "NotReadableError") {
        msg = "Mikrofonni boshqa dastur ishlatyapti. Yopib qayta urining.";
      } else {
        msg = "Mikrofonga kira olmadik. Brauzer sozlamalarini tekshiring.";
      }
      setError(msg);
      cleanup();
      setState("idle");
      return false;
    }
  }, [cleanup, isSupported, maxDurationMs, onAutoStop, state]);

  const stop = useCallback(async (): Promise<RecordedAudio | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") {
      cleanup();
      setState("idle");
      return null;
    }
    setState("stopping");
    return new Promise<RecordedAudio | null>((resolve) => {
      resolveRef.current = resolve;
      recorder.stop();
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    const recorder = recorderRef.current;
    resolveRef.current = null;
    if (recorder && recorder.state === "recording") {
      recorder.onstop = null;
      try {
        recorder.stop();
      } catch {
        // ignore
      }
    }
    cleanup();
    setState("idle");
    setElapsedMs(0);
  }, [cleanup]);

  return {
    state,
    error,
    elapsedMs,
    isSupported,
    start,
    stop,
    cancel,
  };
}
