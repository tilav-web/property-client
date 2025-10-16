import { useSellerStore } from "@/stores/seller.store";
import SellerLegalRegister from "./_components/seller-legal-register";
import SellerLegalData from "./_components/seller-legal-data";
import Loading from "@/components/common/loadings/loading";
import { useUserStore } from "@/stores/user.store";
import SellerPhysicalRegister from "./_components/seller-physical-register";
import SellerPhysicalData from "./_components/seller-physical-data";

export default function SellerProfile() {
  const { user } = useUserStore();
  const { seller } = useSellerStore();
  if (seller === undefined) return <Loading />;

  return (
    <div>
      {user?.role === "legal" && (
        <>
          {seller?.status === "approved" ? (
            <SellerLegalData />
          ) : (
            <SellerLegalRegister />
          )}
        </>
      )}
      {user?.role === "physical" && (
        <>
          {seller?.status === "approved" ? (
            <SellerPhysicalData />
          ) : (
            <SellerPhysicalRegister />
          )}
        </>
      )}
    </div>
  );
}
