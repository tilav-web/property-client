import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Bell,
  Search,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/user.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { serverUrl } from "@/utils/shared";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleStorage } from "@/utils/handle-storage";
import { userService } from "@/services/user.service";

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  notificationCount?: number;
}

export default function SellerHeader({
  isSidebarOpen,
  setIsSidebarOpen,
  notificationCount = 0,
}: HeaderProps) {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useUserStore();
  const lanValue = handleStorage({ key: "lan" });

  const languages = ["uz", "ru", "en"];

  const handleChangeUserLan = async (lan: string) => {
    try {
      if (user) {
        const formData = new FormData();
        formData.append("lan", lan);
        const data = await userService.update(formData);
        setUser(data);
      }
      handleStorage({ key: "lan", value: lan });
      i18n.changeLanguage(lan);
    } catch (error) {
      console.error(error);
    }
  };

  // User ism va familiyasidan avatar initial olish
  const getInitials = () => {
    if (!user) return "S";
    const first = user.first_name?.charAt(0) || "";
    const last = user.last_name?.charAt(0) || "";
    return (first + last).toUpperCase() || "S";
  };

  // To'liq ism olish
  const getFullName = () => {
    if (!user) return t("common.seller_header.seller");
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      t("common.seller_header.seller")
    );
  };

  return (
    <header className=" bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between p-4">
        {/* Left Side - Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>

          {/* Welcome Message - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-1 h-6 bg-green-500 rounded-full" />
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                {t("common.seller_header.welcome", {
                  name: user?.first_name || t("common.seller_header.seller"),
                })}
              </h2>
              <p className="text-xs text-gray-500">
                {t("common.seller_header.seller_panel")}
              </p>
            </div>
          </div>
        </div>

        {/* Center - Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder={t("common.seller_header.search_placeholder")}
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          {/* Search Button - Mobile Only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-lg hover:bg-gray-100"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-1"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm uppercase">
                  {user?.lan ? user?.lan : lanValue ? lanValue : "uz"}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 select-none">
              {languages.map((lan) => (
                <DropdownMenuItem
                  key={lan}
                  onClick={() => handleChangeUserLan(lan)}
                  className="flex items-center gap-2 select-none"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      lan === user?.lan || lan === lanValue
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></span>
                  {t(`common.header.languages.${lan}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {getFullName()}
              </span>
              <span className="text-xs text-gray-500">
                {t("common.seller_header.seller")}
              </span>
            </div>

            {/* Avatar with user image or initials */}
            <Avatar className="h-9 w-9 border border-gray-200">
              <AvatarImage
                src={`${serverUrl}/uploads${user?.avatar}`}
                alt={getFullName()}
              />
              <AvatarFallback className="bg-gradient-to-br from-green-50 to-blue-50 text-green-600 font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
