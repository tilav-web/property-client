import Loading from "@/components/common/loadings/loading";
import { useSellerStore } from "@/stores/seller.store";
import YTTProfile from "./ytt-profile";
import MCHJProfile from "./mchj-profile";
import SelfEmployedProfile from "./self-employed-profile";
import PhysicalProfile from "./physical-profile";

export default function SellerProfile() {
  const { seller } = useSellerStore();

  if (seller === undefined) return <Loading />;

  if (!seller) {
    // This should not happen if the user is on this page,
    // but it's good practice to handle it.
    return <div>No seller data found.</div>;
  }

  const renderProfileByBusinessType = () => {
    switch (seller.business_type) {
      case "ytt":
        return <YTTProfile />;
      case "mchj":
        return <MCHJProfile />;
      case "self_employed":
        return <SelfEmployedProfile />;
      case "physical":
        return <PhysicalProfile />;
      default:
        return <div>Unknown business type</div>;
    }
  };

  return <div>{renderProfileByBusinessType()}</div>;
}
