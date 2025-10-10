import BackButton from "@/components/common/buttons/back-button";
import PropertyCard from "@/components/common/cards/property-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountDetails from "./_components/account_details";

export default function Profile() {
  return (
    <div className="py-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <h4 className="text-xl my-4">Мой аккаунт</h4>
      </div>
      <Tabs defaultValue="account_details">
        <TabsList className="h-max w-full flex-col lg:flex-row items-start">
          <TabsTrigger value="account_details">Личная информация</TabsTrigger>
          <TabsTrigger value="saved_properties">
            Сохранённые объекты (2)
          </TabsTrigger>
          <TabsTrigger value="notification">
            Уведомление о поиске (0)
          </TabsTrigger>
          <TabsTrigger value="contact_properties">Контакты (2)</TabsTrigger>
        </TabsList>
        <TabsContent className="min-h-96" value="account_details">
          <AccountDetails />
        </TabsContent>
        <TabsContent className="min-h-96" value="saved_properties">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam
          labore soluta
        </TabsContent>
        <TabsContent className="min-h-96" value="notification"></TabsContent>
        <TabsContent
          className="min-h-96"
          value="contact_properties"
        ></TabsContent>
      </Tabs>
    </div>
  );
}
