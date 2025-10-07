import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CircleCheck,
  ClipboardList,
  Landmark,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import BusinessTypeTab from "./business-type.tab";

import UserDetailsTab from "./user-details.tab";
import BankAccountNumberTab from "./bank-account-number.tab";

export default function SellerRegister() {
  const [selectedTab, setSelectedTab] = useState<string>("business_type");

  return (
    <Tabs defaultValue={selectedTab} className="flex-row gap-4">
      <TabsList className="flex-col h-full bg-white items-start p-8 gap-4">
        <TabsTrigger
          className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start"
          value="business_type"
        >
          <CircleCheck className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
          <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
            Biznes shakli
          </p>
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start"
          value="user_details"
        >
          <User className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
          <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
            Shaxsiy malumotlar
          </p>
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start"
          value="busisess_details"
        >
          <ClipboardList className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
          <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
            Biznes malumotlar
          </p>
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start"
          value="bank_account_number"
        >
          <Landmark className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
          <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
            Bank hisob raqami
          </p>
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-inherit data-[state=active]:shadow-none group w-full justify-start"
          value="commissioner"
        >
          <Users className="group-data-[state=active]:text-blue-500 group-data-[state=active]:opacity-100 opacity-50 !w-6 !h-6" />
          <p className="text-base group-data-[state=active]:border-b-3 border-b-3 border-inherit group-data-[state=active]:border-blue-500 flex-1 text-start">
            Komissioner
          </p>
        </TabsTrigger>
      </TabsList>

      {/* Business type tab */}
      <TabsContent className="bg-white rounded-2xl p-6" value="business_type">
        <BusinessTypeTab />
      </TabsContent>

      {/* User details tab */}
      <TabsContent className="bg-white rounded-2xl p-6" value="user_details">
        <UserDetailsTab />
      </TabsContent>

      {/* Business details tab */}
      <TabsContent
        className="bg-white rounded-2xl p-4"
        value="busisess_details"
      >
        Biznes malumotlar
      </TabsContent>

      {/* Bank account number */}
      <TabsContent
        className="bg-white rounded-2xl p-4"
        value="bank_account_number"
      >
        <BankAccountNumberTab />
      </TabsContent>

      {/* Commissioner */}
      <TabsContent className="bg-white rounded-2xl p-4" value="commissioner">
        Komissioner
      </TabsContent>
    </Tabs>
  );
}
