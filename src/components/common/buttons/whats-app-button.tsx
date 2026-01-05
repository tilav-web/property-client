import { useTranslation } from "react-i18next";

export default function WhatsAppButton({ phone }: { phone?: string }) {
  const { t } = useTranslation();
  const onClick = () => {
    if (phone) {
      window.open(`https://wa.me/${phone}`, "_blank");
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={!phone}
      className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0 disabled:opacity-50"
    >
      <span className="whitespace-nowrap">{t("common.buttons.whatsapp")}</span>
    </button>
  );
}
