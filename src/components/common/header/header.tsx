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
        "sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b border-border/60",
        className,
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 py-3 px-4 lg:px-6">
          {/* Left: Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="lg:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-background">
                <div className="flex flex-col h-full">
                  <Link to="/" className="flex items-center gap-2 border-b border-border/60 p-4">
                    <img
                      className="w-32 h-auto object-contain"
                      src={logo}
                      alt="Amaar Properties"
                      decoding="async"
                    />
                  </Link>

                  <nav className="flex-1 py-6 px-3">
                    <div className="space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground transition-colors"
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
            <Link to="/" className="flex items-center max-w-32 lg:max-w-36">
              <img
                className="w-full h-auto object-contain"
                src={logo}
                alt="Amaar Properties"
                width={2966}
                height={935}
                decoding="async"
              />
            </Link>
          </div>

          {/* Center: Nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-accent transition-colors whitespace-nowrap"
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            {/* Phone */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Call Amaar Properties"
                  className="hidden sm:flex items-center justify-center size-9 rounded-full hover:bg-accent transition-colors animate-pulse-call"
                >
                  <PhoneCall size={16} className="text-foreground/80" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 select-none">
                <DropdownMenuItem asChild>
                  <a href="tel:+601139029480" className="flex items-center gap-2">
                    <span className="text-base">🇲🇾</span>
                    <span className="font-medium">+60 113 902 9480</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="tel:+971562911117" className="flex items-center gap-2">
                    <span className="text-base">🇦🇪</span>
                    <span className="font-medium">+971 56 291 1117</span>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CurrencySwitcher />

            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 rounded-full px-3"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold uppercase hidden sm:inline">
                    {i18n.language}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 select-none">
                {languages.map((lan) => (
                  <DropdownMenuItem
                    key={lan}
                    onClick={() => handleChangeUserLan(lan)}
                    className="flex items-center gap-2 select-none"
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        lan === i18n.language ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                    {t(`common.header.languages.${lan}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User */}
            {user ? (
              <>
                <NotificationIcon />
                <button
                  onClick={() => navigate("/profile")}
                  className="ml-1 rounded-full hover:ring-2 hover:ring-primary/30 transition-all"
                  aria-label="Profile"
                >
                  <Avatar className="size-9 border border-border">
                    <AvatarImage
                      src={user?.avatar ? user.avatar : defaultImageAvatar}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary/10 text-foreground text-xs font-semibold">
                      {user?.first_name?.slice(0, 1) ?? ""}
                      {user?.last_name?.slice(0, 1) ?? ""}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </>
            ) : (
              <Button
                size="sm"
                className="ml-1 hidden sm:flex"
                onClick={openLoginDialog}
              >
                <User className="h-4 w-4" />
                <span>{t("common.login")}</span>
              </Button>
            )}

            {!user && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="sm:hidden"
                onClick={openLoginDialog}
                aria-label="Login"
              >
                <User className="h-4 w-4" />
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
