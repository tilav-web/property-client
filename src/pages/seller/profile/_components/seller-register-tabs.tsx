import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import SellerPhysicalRegister from "./seller-physical-register";
import SellerLegalRegister from "./seller-legal-register";

export default function SellerRegisterTabs() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="physical" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="physical">
            {t("seller_register.physical_person")}
          </TabsTrigger>
          <TabsTrigger value="legal">{t("seller_register.legal_entity")}</TabsTrigger>
        </TabsList>
        <TabsContent value="physical">
          <div className="bg-white rounded-2xl p-6">
            <SellerPhysicalRegister />
          </div>
        </TabsContent>
        <TabsContent value="legal">
          <div className="bg-white rounded-2xl p-6">
            <SellerLegalRegister />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
