import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Mic, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/use-voice-recorder";
import { cn } from "@/lib/utils";

interface Props {
  disabled?: boolean;
  onSend: (text: string) => Promise<void> | void;
  onTyping?: (typing: boolean) => void;
  onSendVoice?: (audio: Blob, mimeType: string) => Promise<void> | void;
}

function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MessageInput({
  disabled,
  onSend,
  onTyping,
  onSendVoice,
}: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [voiceSending, setVoiceSending] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingActiveRef = useRef(false);

  const recorder = useVoiceRecorder({
    maxDurationMs: 60_000,
    onAutoStop: () => {
      toast.message(
        t("pages.messages.voice.max_reached", {
          defaultValue: "Maksimal davomiylik (60s) — avtomatik yuborildi",
        }),
      );
    },
  });

  const voiceEnabled = Boolean(onSendVoice) && recorder.isSupported;

  const stopTyping = () => {
    if (typingActiveRef.current) {
      typingActiveRef.current = false;
      onTyping?.(false);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      stopTyping();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (v: string) => {
    setValue(v);
    if (v.length > 0) {
      if (!typingActiveRef.current) {
        typingActiveRef.current = true;
        onTyping?.(true);
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping();
      }, 1500);
    } else {
      stopTyping();
    }
  };

  const submit = async () => {
    const text = value.trim();
    if (!text || sending) return;
    setSending(true);
    stopTyping();
    try {
      await onSend(text);
      setValue("");
    } finally {
      setSending(false);
    }
  };

  const startVoice = async () => {
    if (!onSendVoice || voiceSending || sending) return;
    const ok = await recorder.start();
    if (!ok && recorder.error) toast.error(recorder.error);
  };

  const stopAndSendVoice = async () => {
    if (!onSendVoice) return;
    const result = await recorder.stop();
    if (!result || result.blob.size < 500) {
      toast.message(
        t("pages.messages.voice.too_short", {
          defaultValue: "Yozuv juda qisqa",
        }),
      );
      return;
    }
    setVoiceSending(true);
    try {
      await onSendVoice(result.blob, result.mimeType);
    } catch (err) {
      console.error("voice send failed", err);
      toast.error(
        t("pages.messages.voice.send_error", {
          defaultValue: "Ovozli xabar yuborilmadi",
        }),
      );
    } finally {
      setVoiceSending(false);
    }
  };

  const cancelVoice = () => recorder.cancel();

  const isRecording = recorder.state === "recording";
  const showVoiceUi = voiceEnabled && (isRecording || recorder.state === "stopping");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 border-t bg-white p-3"
    >
      {showVoiceUi ? (
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <span className="font-medium text-red-700">
            {t("pages.messages.voice.recording", { defaultValue: "Yozilmoqda" })}
          </span>
          <span className="ml-auto font-mono text-xs text-red-700">
            {formatElapsed(recorder.elapsedMs)}
          </span>
          <button
            type="button"
            onClick={cancelVoice}
            className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-100"
            aria-label="Cancel"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={t("pages.messages.input_placeholder", {
            defaultValue: "Xabar yozing...",
          })}
          rows={1}
          disabled={disabled || sending || voiceSending}
          className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white disabled:opacity-60"
        />
      )}

      {voiceEnabled && !showVoiceUi && !value.trim() ? (
        <Button
          type="button"
          onClick={startVoice}
          disabled={disabled || sending || voiceSending}
          size="icon"
          className={cn("flex-shrink-0", voiceSending && "opacity-70")}
          aria-label={t("pages.messages.voice.start", {
            defaultValue: "Ovozli xabar",
          })}
        >
          {voiceSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Mic size={16} />
          )}
        </Button>
      ) : showVoiceUi ? (
        <Button
          type="button"
          onClick={stopAndSendVoice}
          disabled={recorder.state === "stopping" || voiceSending}
          size="icon"
          className="flex-shrink-0"
          aria-label={t("pages.messages.voice.send", {
            defaultValue: "Yuborish",
          })}
        >
          {recorder.state === "stopping" || voiceSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={disabled || sending || voiceSending || !value.trim()}
          size="icon"
          className="flex-shrink-0"
        >
          <Send size={16} />
        </Button>
      )}
    </form>
  );
}
