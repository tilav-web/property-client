import { useTranslation } from "react-i18next";

export default function WhatsAppButton() {
  const { t } = useTranslation();
  return (
    <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
      <span className="whitespace-nowrap">{t("common.buttons.whatsapp")}</span>
    </button>
  );
}
