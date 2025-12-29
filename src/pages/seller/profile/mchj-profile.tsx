import SellerLegalData from "./_components/seller-legal-data";
import SellerLegalRegister from "./_components/seller-legal-register";
import { useSellerStore } from "@/stores/seller.store";

export default function MCHJProfile() {
  const { seller } = useSellerStore();
  return (
    <>
      {seller?.status === "approved" ? (
        <SellerLegalData />
      ) : (
        <SellerLegalRegister />
      )}
    </>
  );
}
