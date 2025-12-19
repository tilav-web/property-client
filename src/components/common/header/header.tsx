import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Heart,
  Home,
  Building,
  Handshake,
  Star,
  LogIn,
  User,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Login from "@/pages/auth/login";
import { useUserStore } from "@/stores/user.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultImageAvatar, logo } from "@/utils/shared";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { handleStorage } from "@/utils/handle-storage";
import { useSellerStore } from "@/stores/seller.store";
import { useLanguageStore } from "@/stores/language.store";
import type { ILanguage } from "@/interfaces/language/language.interface";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, setUser } = useUserStore();
  const { logout: sellerLogout } = useSellerStore();
  const { setLanguage } = useLanguageStore();

  const languages = Object.values<ILanguage>(["uz", "ru", "en"]);

  const handleChangeUserLan = async (lan: ILanguage) => {
    try {
      if (user) {
        const formData = new FormData();
        formData.append("lan", lan);
        const data = await userService.update(formData);
        setUser(data);
      }
      setLanguage(lan);
      i18n.changeLanguage(lan);
    } catch (error) {
      console.error(error);
    }
  };

  const logoutSystem = async () => {
    try {
      await userService.logout();
      handleStorage({ key: "access_token", value: null });
      logout();
      sellerLogout();
      toast.success(t("common.success"), {
        description: t("common.header.logout_success"),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const navItems = [
    {
      icon: Home,
      label: t("common.buy"),
      href: "/filter-nav?category=APARTMENT_SALE",
    },
    {
      icon: Building,
      label: t("common.rent_apartments"),
      href: "/filter-nav?category=APARTMENT_RENT",
    },
    // {
    //   icon: Home,
    //   label: t("common.rent_land"),
    //   href: "/filter-nav",
    // },
    { icon: Handshake, label: t("common.ai_agent"), href: "/ai-agent" },
    {
      icon: Star,
      label: t("common.new_projects"),
      href: "/filter-nav?is_new=1",
    },
    { icon: Heart, label: t("common.favorites"), href: "/favorites" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 py-3 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col h-full">
                  <Link to="/" className="flex items-center gap-2 border-b p-4">
                    <img
                      className="w-full h-auto object-cover"
                      src={logo}
                      alt="logo"
                    />
                  </Link>

                  <nav className="flex-1 py-6">
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2 max-w-36">
              <img
                className="w-full h-auto object-cover"
                src={logo}
                alt="logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation Menu - Search o'rniga */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors whitespace-nowrap"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Language selector (available for both guest and logged-in users) */}
            {!user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm uppercase hidden sm:inline">
                      {i18n.language}
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
                          lan === i18n.language ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></span>
                      {t(`common.header.languages.${lan}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={`${
                        user?.avatar ? user?.avatar : defaultImageAvatar
                      }`}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user?.first_name?.slice(0, 1) ?? ""}
                      {user?.last_name?.slice(0, 1) ?? ""}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{t("common.header.profile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/favorites")}
                    className="flex items-center gap-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{t("common.favorites")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logoutSystem}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>{t("common.header.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{t("common.login")}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("common.header.login_title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <Login />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
