import { useSellerStore } from "@/stores/seller.store";
import SellerRegister from "./_components/seller-register";
import SellerData from "./_components/seller-data";
import Loading from "@/components/common/loadings/loading";

export default function SellerProfile() {
  const { seller } = useSellerStore();

  if (seller === undefined) return <Loading />;

  return (
    <div>
      {seller?.status === "approved" ? <SellerData /> : <SellerRegister />}
    </div>
  );
}
