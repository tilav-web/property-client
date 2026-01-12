import SellerPhysicalData from "./_components/seller-physical-data";
import SellerPhysicalRegister from "./_components/seller-physical-register";
import { useSellerStore } from "@/stores/seller.store";

export default function SelfEmployedProfile() {
  const { seller } = useSellerStore();
  return (
    <>
      {seller?.status === "approved" || seller?.status === "completed" ? (
        <SellerPhysicalData />
      ) : (
        <SellerPhysicalRegister />
      )}
    </>
  );
}
