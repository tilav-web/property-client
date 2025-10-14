import { useTranslation } from "react-i18next";
import { ClipboardPenLine } from "lucide-react";

export default function OnlineContractButton() {
  const { t } = useTranslation();
  return (
    <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
      <ClipboardPenLine className="w-4 h-4" />
      <span className="whitespace-nowrap">{t("common.buttons.online_contract")}</span>
    </button>
  );
}
