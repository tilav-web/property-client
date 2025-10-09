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
import { sellerService } from "@/services/seller.service";
import { useSellerStore } from "@/stores/seller.store";

export default function SellerRegister() {
  const [selectedTab, setSelectedTab] = useState<string>("business_type");
  const { seller, setSeller, logout, handleLoading } = useSellerStore();
  console.log(seller);

  useEffect(() => {
    (async () => {
      try {
        if (seller) return;
        handleLoading(true);
        const data = await sellerService.findSeller();
        setSeller(data);
        if (!data?.business_type) return setSelectedTab("business_type");
        if (data?.business_type && !data.passport)
          return setSelectedTab("user_details");
        if (
          (data?.business_type === "mchj" && !data?.mchj) ||
          (data?.business_type === "ytt" && !data?.ytt) ||
          (data?.business_type === "self_employed" && !data?.self_employed)
        )
          return setSelectedTab("busisess_details");

        if (
          (data?.business_type === "mchj" && data?.mchj) ||
          (data?.business_type === "ytt" && data?.ytt) ||
          (data?.business_type === "self_employed" && data?.self_employed)
        )
          return setSelectedTab("bank_account_number");
      } catch (error) {
        logout();
        console.error(error);
      } finally {
        handleLoading(false);
      }
    })();
  }, [setSeller, logout, handleLoading]);

  const handleSelectTab = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div>
      <div className="bg-white mb-16 p-4 rounded-2xl">
        <h3 className="text-2xl font-bold">Biznes ro'yxatdan o'tish</h3>
        <p>Ma'lumotlaringizni to'ldiring va biznes faoliyatini boshlang</p>
      </div>
      <div className="max-w-7xl mx-auto">
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="flex-row gap-4 items-start"
        >
          <div className="max-w-md w-full bg-white p-8 rounded-2xl">
            <h5 className="mb-4 text-2xl font-bold">Jarayon</h5>
            <TabsList className="flex-col h-full bg-white items-start gap-4 w-full mb-4">
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="business_type"
              >
                <CircleCheck className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  Biznes shakli
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="user_details"
              >
                <User className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  Shaxsiy malumotlar
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="busisess_details"
              >
                <ClipboardList className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  Biznes malumotlar
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="bank_account_number"
              >
                <Landmark className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  Bank hisob raqami
                </p>
              </TabsTrigger>
              <TabsTrigger
                onClick={(e) => e.preventDefault()}
                className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start pointer-events-none"
                value="commissioner"
              >
                <Users className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
                <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
                  Komissioner
                </p>
              </TabsTrigger>
            </TabsList>
            <div className="bg-blue-500/10 px-6 py-4 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="mb-2 text-gray-800 font-medium">Jarayon</p>
                <p className="text-sm">
                  {selectedTab === "business_type" && "0%"}
                  {selectedTab === "user_details" && "20%"}
                  {selectedTab === "busisess_details" && "40%"}
                  {selectedTab === "bank_account_number" && "60%"}
                  {selectedTab === "commissioner" && "80%"}
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
        </Tabs>
      </div>
    </div>
  );
}
