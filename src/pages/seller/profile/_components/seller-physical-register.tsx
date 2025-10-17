import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelfEmployedForm from "./tabs/self-employed-form";
import PhysicalPersonForm from "./tabs/physical-person-form";
import { useTranslation } from "react-i18next";
import { useSellerStore } from "@/stores/seller.store";

export default function SellerPhysicalRegister() {
  const { t } = useTranslation();
  const { seller } = useSellerStore();

  if (seller?.status === "completed")
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-yellow-800 font-semibold text-lg">
                Profilingiz Tasdiqlanishini Kutmoqda
              </h3>
              <p className="text-yellow-700 mt-1">
                Sizning seller profilingiz admin tomonidan ko'rib chiqilmoqda.
                Odatda bu jarayon 24-48 soat davom etadi. Profilingiz
                tasdiqlangandan so'ng sizga xabar beramiz.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">
            Tasdiqlash Jarayoni
          </h4>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">1</span>
              </div>
              <span className="ml-3 text-gray-700">
                Ma'lumotlaringiz qabul qilindi
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">2</span>
              </div>
              <span className="ml-3 text-gray-700">
                Admin tomonidan ko'rib chiqilmoqda
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">3</span>
              </div>
              <span className="ml-3 text-gray-500">Profil tasdiqlanadi</span>
            </div>
          </div>
        </div>
      </div>
    );

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
