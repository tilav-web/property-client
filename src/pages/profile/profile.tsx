import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/user.store";
import { useLanguageStore } from "@/stores/language.store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AccountDetails from "./_components/account_details";
import SavedPropertiesTab from "./_components/saved-properties-tab";
import { useSaveStore } from "@/stores/save.store";
import { Globe, ChevronDown, LogOut } from "lucide-react";
import type { ILanguage } from "@/interfaces/language/language.interface";
import { userService } from "@/services/user.service";
import { handleStorage } from "@/utils/handle-storage";
import { useSellerStore } from "@/stores/seller.store";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { savedProperties } = useSaveStore();
  const { user, logout } = useUserStore();
  const { logout: sellerLogout } = useSellerStore();
  const { setLanguage } = useLanguageStore();

  const languages = Object.values<ILanguage>(["uz", "ru", "en"]);

  const handleChangeUserLan = async (lan: ILanguage) => {
    try {
      if (user) {
        const formData = new FormData();
        formData.append("lan", lan);
        await userService.update(formData);
      }
      setLanguage(lan);
      i18n.changeLanguage(lan);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await userService.logout();
      handleStorage({ key: "access_token", value: null });
      logout();
      sellerLogout();
      toast.success(t("common.success"), {
        description: t("common.header.logout_success"),
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="">
      <div className="container mx-auto px-4 py-6 lg:py-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t("pages.profile_page.my_account")}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {user?.email.value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 border-gray-300"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm uppercase hidden sm:inline">
                    {i18n.language}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {languages.map((lan) => (
                  <DropdownMenuItem
                    key={lan}
                    onClick={() => handleChangeUserLan(lan)}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        lan === i18n.language ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></span>
                    {t(`common.header.languages.${lan}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => navigate("/seller/profile")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold h-10"
            >
              <span className="hidden sm:inline">
                {t("common.sell_or_rent")}
              </span>
              <span className="sm:hidden">Sell</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">
                    {t("common.header.logout")}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("common.alerts.logout.title")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("common.alerts.logout.description")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("common.alerts.logout.cancel_button")}
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    {t("common.alerts.logout.confirm_button")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Tabs defaultValue="account_details" className="w-full">
            <TabsList className="h-auto w-full flex-col sm:flex-row items-stretch sm:items-center bg-gray-50 border-b border-gray-200 p-0 rounded-none">
              <TabsTrigger
                value="account_details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-gray-600 hover:text-gray-900 flex-1 sm:flex-none"
              >
                {t("pages.profile_page.personal_information")}
              </TabsTrigger>
              <TabsTrigger
                value="saved_properties"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-gray-600 hover:text-gray-900 flex-1 sm:flex-none"
              >
                {t("pages.profile_page.saved_properties")}
                <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {savedProperties.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="notification"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-gray-600 hover:text-gray-900 flex-1 sm:flex-none"
              >
                {t("pages.profile_page.search_notification")}
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  0
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="contact_properties"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-white data-[state=active]:text-blue-600 text-gray-600 hover:text-gray-900 flex-1 sm:flex-none"
              >
                {t("pages.profile_page.contacts")}
                <span className="ml-2 bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  2
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="p-4 sm:p-6 lg:p-8">
              <TabsContent className="min-h-96 m-0" value="account_details">
                <AccountDetails />
              </TabsContent>
              <TabsContent className="min-h-96 m-0" value="saved_properties">
                <SavedPropertiesTab />
              </TabsContent>
              <TabsContent className="min-h-96 m-0" value="notification">
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {t("pages.profile_page.search_notification_placeholder")}
                  </p>
                </div>
              </TabsContent>
              <TabsContent className="min-h-96 m-0" value="contact_properties">
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {t("pages.profile_page.contacts_placeholder")}
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
