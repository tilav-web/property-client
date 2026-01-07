import { useSellerStore } from "@/stores/seller.store";
import YttSection from "./ytt-section";
import MchjSection from "./mchj-section";
import { useTranslation } from "react-i18next";

export default function BusisessDetailsTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const { seller } = useSellerStore();
  const { t } = useTranslation();

  return (
    <div>
      {seller?.business_type === "ytt" ? (
        <YttSection handleSelectTab={handleSelectTab} />
      ) : seller?.business_type === "mchj" ? (
        <MchjSection handleSelectTab={handleSelectTab} />
      ) : (
        <p>{t("busisess_details_tab.business_form_not_selected")}</p>
      )}
    </div>
  );
}
