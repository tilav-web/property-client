import BackButton from "@/components/common/buttons/back-button";
import PropertyCard from "@/components/common/cards/property-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountDetails from "./_components/account_details";
import { property } from "@/constants/mack-data";
import { useUserStore } from "@/stores/user.store";

export default function Profile() {
  const { user } = useUserStore();

  return (
    <div className="py-4">
      <BackButton />
      <h4 className="text-xl my-4">Мой аккаунт</h4>
      <Tabs defaultValue="account_details">
        <TabsList>
          <TabsTrigger value="account_details">Личная информация</TabsTrigger>
          <TabsTrigger value="saved_properties">
            Сохранённые объекты (2)
          </TabsTrigger>
          <TabsTrigger value="notification">
            Уведомление о поиске (0)
          </TabsTrigger>
          <TabsTrigger value="contact_properties">
            Объекты, с которыми был установлен контакт (2)
          </TabsTrigger>
        </TabsList>
        <TabsContent className="min-h-96" value="account_details">
          <AccountDetails />
        </TabsContent>
        <TabsContent className="min-h-96" value="saved_properties">
          <PropertyCard property={{ ...property, author: user }} />
          <PropertyCard property={{ ...property, author: user }} />
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
