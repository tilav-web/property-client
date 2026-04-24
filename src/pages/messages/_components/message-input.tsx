import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  disabled?: boolean;
  onSend: (text: string) => Promise<void> | void;
  onTyping?: (typing: boolean) => void;
}

export default function MessageInput({ disabled, onSend, onTyping }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingActiveRef = useRef(false);

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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 border-t bg-white p-3"
    >
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
        disabled={disabled || sending}
        className="flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white disabled:opacity-60"
      />
      <Button
        type="submit"
        disabled={disabled || sending || !value.trim()}
        size="icon"
        className="flex-shrink-0"
      >
        <Send size={16} />
      </Button>
    </form>
  );
}
