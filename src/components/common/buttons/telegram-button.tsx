import { useTranslation } from "react-i18next";
import { Send } from "lucide-react";

export default function TelegramButton({ username }: { username: string }) {
  const { t } = useTranslation();
  return (
    <a
      href={username}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0"
    >
      <Send className="w-4 h-4" />
      <span className="hidden sm:inline">{t("common.buttons.telegram")}</span>
    </a>
  );
}
