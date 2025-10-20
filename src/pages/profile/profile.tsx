import { useTranslation } from "react-i18next";
import BackButton from "@/components/common/buttons/back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountDetails from "./_components/account_details";
import SavedPropertiesTab from "./_components/saved-properties-tab";
import { useSaveStore } from "@/stores/save.store";
import { useEffect } from "react";

export default function Profile() {
  const { t } = useTranslation();
  const { savedProperties, fetchSavedProperties } = useSaveStore();

  useEffect(() => {
    if (!savedProperties.length) {
      fetchSavedProperties();
    }
  }, [fetchSavedProperties]);

  return (
    <div className="py-4">
      <div className="flex items-center gap-2">
        <BackButton />
        <h4 className="text-xl my-4">{t("pages.profile_page.my_account")}</h4>
      </div>
      <Tabs defaultValue="account_details">
        <TabsList className="h-max w-full flex-col lg:flex-row items-start">
          <TabsTrigger value="account_details">
            {t("pages.profile_page.personal_information")}
          </TabsTrigger>
          <TabsTrigger value="saved_properties">
            {t("pages.profile_page.saved_properties")} ({savedProperties.length}
            )
          </TabsTrigger>
          <TabsTrigger value="notification">
            {t("pages.profile_page.search_notification")} (0)
          </TabsTrigger>
          <TabsTrigger value="contact_properties">
            {t("pages.profile_page.contacts")} (2)
          </TabsTrigger>
        </TabsList>
        <TabsContent className="min-h-96" value="account_details">
          <AccountDetails />
        </TabsContent>
        <TabsContent className="min-h-96" value="saved_properties">
          <SavedPropertiesTab />
        </TabsContent>
        <TabsContent className="min-h-96" value="notification">
          {t("pages.profile_page.search_notification_placeholder")}
        </TabsContent>
        <TabsContent
          className="min-h-96"
          value="contact_properties"
        ></TabsContent>
      </Tabs>
    </div>
  );
}
