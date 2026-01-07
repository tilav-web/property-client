import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CircleCheck,
  ClipboardList,
  Landmark,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import BusinessTypeTab from "./tabs/business-type.tab";

import BankAccountNumberTab from "./tabs/bank-account-number.tab";
import { Slider } from "@/components/ui/slider";
import UserDetailsTab from "./tabs/user-details.tab";
import BusisessDetailsTab from "./tabs/business-details/busisess-details.tab";
import CommissionerTab from "./tabs/commissioner.tab";
import { useSellerStore } from "@/stores/seller.store";
import FinishTab from "./tabs/finish.tab";
import { useTranslation } from "react-i18next";

export default function SellerLegalRegister() {
  const [selectedTab, setSelectedTab] = useState<string>("business_type");
  const { seller } = useSellerStore();
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      if (!seller?.business_type) return setSelectedTab("business_type");
      if (seller?.business_type && !seller.passport)
        return setSelectedTab("user_details");
      if (
        (seller?.business_type === "mchj" && !seller?.mchj) ||
        (seller?.business_type === "ytt" && !seller?.ytt)
      )
        return setSelectedTab("busisess_details");

      if (
        (seller?.business_type === "mchj" && seller?.mchj) ||
        (seller?.business_type === "ytt" &&
          seller?.ytt &&
          !seller?.bank_account)
      )
        return setSelectedTab("bank_account_number");

      if (
        (seller?.bank_account && !seller?.commissioner) ||
        seller?.status !== "completed"
      )
        return setSelectedTab("commissioner");

      if (seller?.commissioner && seller?.status === "completed")
        return setSelectedTab("finish_tab");
    })();
  }, []);

  const handleSelectTab = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="w-full">
      <div className="bg-white mb-16 p-4 rounded-2xl">
        <h3 className="text-2xl font-bold">
          {t("seller_register_page.business_registration")}
        </h3>
        <p>{t("seller_register_page.fill_your_details")}</p>
      </div>
      <div className="w-full">
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="flex flex-col lg:flex-row gap-4 items-start"
        >
          <div className="w-full lg:max-w-xs bg-white p-8 rounded-2xl">
            <h5 className="mb-4 text-2xl font-bold">
              {t("seller_register_page.process")}
            </h5>
            <TabsList className="flex-col h-full bg-white items-start gap-4 w-full mb-4">
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="business_type"
              >
                <CircleCheck className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  {t("seller_register_page.business_form")}
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="user_details"
              >
                <User className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  {t("seller_register_page.personal_details")}
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="busisess_details"
              >
                <ClipboardList className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  {t("seller_register_page.business_details")}
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="bank_account_number"
              >
                <Landmark className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  {t("seller_register_page.bank_account_number")}
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="commissioner"
              >
                <Users className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  {t("seller_register_page.commissioner")}
                </p>
              </TabsTrigger>
            </TabsList>
            <div className="bg-blue-500/10 px-6 py-4 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="mb-2 text-gray-800 font-medium">
                  {t("seller_register_page.process")}
                </p>
                <p className="text-sm">
                  {selectedTab === "business_type" &&
                    t("seller_register_page.0%")}
                  {selectedTab === "user_details" &&
                    t("seller_register_page.20%")}
                  {selectedTab === "busisess_details" &&
                    t("seller_register_page.40%")}
                  {selectedTab === "bank_account_number" &&
                    t("seller_register_page.60%")}
                  {selectedTab === "commissioner" &&
                    t("seller_register_page.80%")}
                  {selectedTab === "finish_tab" &&
                    t("seller_register_page.100%")}
                </p>
              </div>

              <Slider
                defaultValue={[0]}
                max={100}
                step={20}
                value={
                  selectedTab === "business_type"
                    ? [0]
                    : selectedTab === "user_details"
                    ? [20]
                    : selectedTab === "busisess_details"
                    ? [40]
                    : selectedTab === "bank_account_number"
                    ? [60]
                    : selectedTab === "commissioner"
                    ? [80]
                    : [100]
                }
              />
            </div>
          </div>

          <div className="w-full">
            {/* Business type tab */}
            <TabsContent
              className="bg-white rounded-2xl p-6"
              value="business_type"
            >
              <BusinessTypeTab handleSelectTab={handleSelectTab} />
            </TabsContent>

            {/* User details tab */}
            <TabsContent
              className="bg-white rounded-2xl p-6"
              value="user_details"
            >
              <UserDetailsTab handleSelectTab={handleSelectTab} />
            </TabsContent>

            {/* Business details tab */}
            <TabsContent
              className="bg-white rounded-2xl p-4"
              value="busisess_details"
            >
              <BusisessDetailsTab handleSelectTab={handleSelectTab} />
            </TabsContent>

            {/* Bank account number */}
            <TabsContent
              className="bg-white rounded-2xl p-4"
              value="bank_account_number"
            >
              <BankAccountNumberTab handleSelectTab={handleSelectTab} />
            </TabsContent>

            {/* Commissioner */}
            <TabsContent
              className="bg-white rounded-2xl p-4"
              value="commissioner"
            >
              <CommissionerTab handleSelectTab={handleSelectTab} />
            </TabsContent>
            <TabsContent
              className="bg-white rounded-2xl p-4"
              value="finish_tab"
            >
              <FinishTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
