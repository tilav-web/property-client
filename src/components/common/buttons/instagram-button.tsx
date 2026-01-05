import { useTranslation } from "react-i18next";
import { Instagram } from "lucide-react";

export default function InstagramButton({ username }: { username: string }) {
  const { t } = useTranslation();
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  return (
    <a
      href={cleanUsername}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0"
    >
      <Instagram className="w-4 h-4" />
      <span className="hidden sm:inline">{t("common.buttons.instagram")}</span>
    </a>
  );
}
