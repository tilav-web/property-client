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
  User,
  Globe,
  ChevronDown,
  PhoneCall,
  MapPin,
  Bot,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/stores/user.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultImageAvatar, logo } from "@/utils/shared";
import { userService } from "@/services/user.service";
import { useLanguageStore } from "@/stores/language.store";
import type { ILanguage } from "@/interfaces/language/language.interface";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui.store";
import { ensureLanguageResources } from "@/i18n/i18n";
import { lazy, Suspense } from "react";
import NotificationIcon from "./_components/notification-icon";
import CurrencySwitcher from "./_components/currency-switcher";

interface IHeaderProps {
  className?: string;
}

const LoginDialogContent = lazy(() => import("@/pages/auth/login"));

export default function Header({ className }: IHeaderProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { setLanguage } = useLanguageStore();
  const { isLoginDialogOpen, openLoginDialog, closeLoginDialog } = useUiStore();

  const languages: ILanguage[] = ["en", "ms", "ru", "uz"];

  const handleChangeUserLan = async (lan: ILanguage) => {
    try {
      if (user) {
        const backendLan = lan === "ms" ? "en" : lan;
        const formData = new FormData();
        formData.append("lan", backendLan);
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
    {
      icon: Sparkles,
      label: t("common.new_projects", "New Projects"),
      href: "/projects",
    },
    { icon: MapPin, label: t("common.map_nav"), href: "/map" },
    { icon: Bot, label: t("common.ai_chat", "AI"), href: "/ai-chat" },
    { icon: Heart, label: t("common.favorites"), href: "/favorites" },
  ];

  return (
    <header
      className={cn(
        "w-full bg-white border-b border-gray-200 shadow-sm",
        className,
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 py-3 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
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
                      width={2966}
                      height={935}
                      decoding="async"
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
                width={2966}
                height={935}
                decoding="async"
              />
            </Link>
          </div>

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Call Amaar Properties"
                  className="mr-4 animate-pulse-call border-0 bg-transparent p-0"
                >
                  <PhoneCall size={18} className="cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 select-none">
                <DropdownMenuItem asChild>
                  <a href="tel:+601139029480" className="flex items-center gap-2">
                    <span>🇲🇾</span> +60 113 902 9480
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="tel:+971562911117" className="flex items-center gap-2">
                    <span>🇦🇪</span> +971 56 291 1117
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CurrencySwitcher />
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
            {user ? (
              <>
                <NotificationIcon />
                <div
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  <Avatar>
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
                </div>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={openLoginDialog}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:block">{t("common.login")}</span>
              </Button>
            )}
            <Dialog open={isLoginDialogOpen} onOpenChange={closeLoginDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("common.header.login_title")}</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                {isLoginDialogOpen ? (
                  <Suspense fallback={null}>
                    <LoginDialogContent />
                  </Suspense>
                ) : null}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>
  );
}
