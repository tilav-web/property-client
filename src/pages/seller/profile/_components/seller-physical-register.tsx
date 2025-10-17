import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelfEmployedForm from "./tabs/self-employed-form";
import PhysicalPersonForm from "./tabs/physical-person-form";
import { useTranslation } from "react-i18next";

export default function SellerPhysicalRegister() {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center">
      <Tabs defaultValue="self_employed" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="self_employed">
            {t("physical_seller_register.self_employed")}
          </TabsTrigger>
          <TabsTrigger value="physical">
            {t("physical_seller_register.physical_person")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="self_employed">
          <div className="bg-white rounded-2xl p-6">
            <SelfEmployedForm />
          </div>
        </TabsContent>
        <TabsContent value="physical">
          <div className="bg-white rounded-2xl p-6">
            <PhysicalPersonForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}