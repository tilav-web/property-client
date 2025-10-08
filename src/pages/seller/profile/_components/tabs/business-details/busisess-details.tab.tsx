import { useSellerStore } from "@/stores/seller.store";
import YttSection from "./ytt-section";
import MchjSection from "./mchj-section";
import SelfEmployedSection from "./self-employed-section";

export default function BusisessDetailsTab({
  handleSelectTab,
}: {
  handleSelectTab: (tab: string) => void;
}) {
  const { seller } = useSellerStore();

  return (
    <div>
      {seller?.business_type === "ytt" ? (
        <YttSection handleSelectTab={handleSelectTab} />
      ) : seller?.business_type === "mchj" ? (
        <MchjSection handleSelectTab={handleSelectTab} />
      ) : seller?.business_type === "self_employed" ? (
        <SelfEmployedSection handleSelectTab={handleSelectTab} />
      ) : (
        <p>Biznes shakli tanlanmagan</p>
      )}
    </div>
  );
}
