import { useTranslation } from "react-i18next";
import { courtSvg } from "@/utils/shared";

export default function BidPriceButton() {
  const { t } = useTranslation();
  return (
    <button className="bg-[#FF990063] flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
      <img src={courtSvg} alt="Court svg" className="w-4 h-4" />
      <span className="whitespace-nowrap">{t("common.buttons.bid_price")}</span>
    </button>
  );
}
