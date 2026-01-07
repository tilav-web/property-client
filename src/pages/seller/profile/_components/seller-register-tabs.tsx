import { useTranslation } from "react-i18next";
import SellerPhysicalRegister from "./seller-physical-register";
import SellerLegalRegister from "./seller-legal-register";
import { useUserStore } from "@/stores/user.store";

export default function SellerRegisterTabs() {
  const { t } = useTranslation();
  const { user } = useUserStore();

  if (user === undefined) {
    return <div>{t("loading")}</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6">
        {user?.role === "physical" ? (
          <SellerPhysicalRegister />
        ) : (
          <SellerLegalRegister />
        )}
      </div>
    </div>
  );
}
