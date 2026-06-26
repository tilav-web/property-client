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
import InquiryResponsesTab from "./_components/inquiry-responses-tab";
import MyInquiriesTab from "./_components/my-inquiries-tab";
import NotificationsTab from "./_components/notifications-tab";
import { useNotificationStore } from "@/stores/notification.store";
import { useSaveStore } from "@/stores/save.store";
import { useInquiryResponseStore } from "@/stores/inquiry-response.store";
import {
  Bell,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Globe,
  LogOut,
  SendHorizonal,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react";
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
import { useEffect } from "react";
import { ensureLanguageResources } from "@/i18n/i18n";

export default function Profile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { savedProperties } = useSaveStore();
  const { inquiryResponses, fetchMyInquiryResponses } =
    useInquiryResponseStore();
  const { user, setUser, logout } = useUserStore();
  const { logout: sellerLogout } = useSellerStore();
  const { setLanguage } = useLanguageStore();
  const unreadNotifications = useNotificationStore((s) => s.unreadCount);

  const languages: ILanguage[] = ["en", "ms", "ru", "uz"];
  const approvedOffersCount = inquiryResponses.filter(
    (r) => r.status === "approved",
  ).length;

  useEffect(() => {
    fetchMyInquiryResponses();
  }, [fetchMyInquiryResponses]);

  const handleChangeUserLan = async (lan: ILanguage) => {
    try {
      if (user) {
        const formData = new FormData();
        formData.append("lan", lan);
        const data = await userService.update(formData);
        setUser(data);
      }
      setLanguage(lan);
      await ensureLanguageResources(lan);
      await i18n.changeLanguage(lan);
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
    <div className="bg-gray-50/50">
      <div className="container mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6 lg:py-8">
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mb-6 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold font-display text-foreground sm:text-2xl lg:text-3xl">
                {t("pages.profile_page.my_account")}
              </h1>
              <p className="mt-1 max-w-full truncate text-sm text-gray-600">
                {user?.email.value}
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0 hide-scrollbar">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 shrink-0 rounded-full border-gray-200 px-3"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase">
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
                onClick={() => navigate("/settings")}
                variant="outline"
                size="sm"
                aria-label={t("pages.settings.title", {
                  defaultValue: t("common.seller_sidebar.settings"),
                })}
                className="h-10 shrink-0 rounded-full border-gray-200 px-3"
              >
                <SettingsIcon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {t("pages.settings.title", {
                    defaultValue: t("common.seller_sidebar.settings"),
                  })}
                </span>
              </Button>

              <Button
                onClick={() => navigate("/seller/profile")}
                className="h-10 shrink-0 rounded-full bg-foreground px-4 font-semibold text-background transition-all hover:bg-foreground/90 active:scale-[0.98]"
              >
                {t("common.sell_or_rent")}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 shrink-0 rounded-full border-red-200 px-3 text-red-600 hover:bg-red-50"
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
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <Tabs defaultValue="account_details" className="w-full gap-0">
            <div className="border-b border-gray-200 bg-gray-50/80">
              <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-2 hide-scrollbar">
                <TabsTrigger
                  value="account_details"
                  className="h-11 shrink-0 flex-none rounded-xl px-3 text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <UserRound className="h-4 w-4" />
                  <span>{t("pages.profile_page.personal_information")}</span>
                </TabsTrigger>
                <TabsTrigger
                  value="saved_properties"
                  className="h-11 shrink-0 flex-none rounded-xl px-3 text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>{t("pages.profile_page.saved_properties")}</span>
                  <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-foreground">
                    {savedProperties.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="notification"
                  className="h-11 shrink-0 flex-none rounded-xl px-3 text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <Bell className="h-4 w-4" />
                  <span>{t("pages.profile_page.search_notification")}</span>
                  <span
                    className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      unreadNotifications > 0
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {unreadNotifications}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="contact_properties"
                  className="h-11 shrink-0 flex-none rounded-xl px-3 text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{t("pages.profile_page.my_approved_offers")}</span>
                  <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    {approvedOffersCount}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="my_inquiries"
                  className="h-11 shrink-0 flex-none rounded-xl px-3 text-sm data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  <SendHorizonal className="h-4 w-4" />
                  <span>Mening takliflarim</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-3 sm:p-6 lg:p-8">
              <TabsContent className="min-h-96 m-0" value="account_details">
                <AccountDetails />
              </TabsContent>
              <TabsContent className="min-h-96 m-0" value="saved_properties">
                <SavedPropertiesTab />
              </TabsContent>
              <TabsContent className="min-h-96 m-0" value="notification">
                <NotificationsTab />
              </TabsContent>
              <TabsContent className="min-h-96 m-0" value="contact_properties">
                <InquiryResponsesTab />
              </TabsContent>
              <TabsContent className="min-h-96 m-0" value="my_inquiries">
                <MyInquiriesTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
