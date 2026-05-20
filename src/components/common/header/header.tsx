import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  DollarSign,
  MessageCircle,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  CURRENCIES,
  CurrencyCode,
  SUPPORTED_CURRENCIES,
} from "@/constants/currencies";
import { useCurrencyStore } from "@/stores/currency.store";

interface IHeaderProps {
  className?: string;
}

const LoginDialogContent = lazy(() => import("@/pages/auth/login"));

export default function Header({ className }: IHeaderProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { user, setUser } = useUserStore();
  const { setLanguage } = useLanguageStore();
  const { display, setDisplay } = useCurrencyStore();
  const { isLoginDialogOpen, openLoginDialog, closeLoginDialog } = useUiStore();

  const languages: ILanguage[] = ["en", "ms", "ru", "uz"];
  const currentPath = `${pathname}${search}`;

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

  const accountItems = user
    ? [
        { icon: User, label: t("common.header.profile"), href: "/profile" },
        { icon: MessageCircle, label: t("common.messages", "Messages"), href: "/messages" },
        { icon: Settings, label: t("common.header.settings", t("common.seller_sidebar.settings")), href: "/settings" },
      ]
    : [];

  const phoneNumbers = [
    { flag: "MY", label: "+60 113 902 9480", href: "tel:+601139029480" },
    { flag: "AE", label: "+971 56 291 1117", href: "tel:+971562911117" },
  ];

  const isActiveLink = (href: string) => {
    if (href.startsWith("/filter-nav")) {
      return currentPath === href;
    }

    return pathname === href;
  };

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
              <SheetContent
                side="left"
                className="w-[min(22rem,92vw)] gap-0 overflow-hidden border-r border-border/70 bg-background p-0"
              >
                <div className="flex h-full flex-col">
                  <div className="border-b border-border/70 px-4 pb-4 pt-3">
                    <SheetClose asChild>
                      <Link to="/" className="flex w-fit items-center">
                        <img
                          className="w-32 h-auto object-contain"
                          src={logo}
                          alt="Amaar Properties"
                          decoding="async"
                        />
                      </Link>
                    </SheetClose>

                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 p-3">
                      <Avatar className="size-11 border border-border bg-background">
                        <AvatarImage
                          src={user?.avatar ? user.avatar : defaultImageAvatar}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                          {user?.first_name?.slice(0, 1) ?? "A"}
                          {user?.last_name?.slice(0, 1) ?? ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {user
                            ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
                              t("common.header.profile")
                            : t("common.header.login_title")}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.email?.value ? String(user.email.value) : t("common.sell_or_rent")}
                        </p>
                      </div>
                      {!user ? (
                        <SheetClose asChild>
                          <Button size="sm" onClick={openLoginDialog}>
                            <User className="h-4 w-4" />
                            {t("common.login")}
                          </Button>
                        </SheetClose>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-3 py-4">
                    <nav className="space-y-1">
                      {navItems.map((item) => {
                        const active = isActiveLink(item.href);

                        return (
                          <SheetClose asChild key={item.label}>
                            <Link
                              to={item.href}
                              className={cn(
                                "flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors",
                                active
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-foreground/80 hover:bg-accent hover:text-accent-foreground",
                              )}
                            >
                              <span
                                className={cn(
                                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                                  active ? "bg-white/15" : "bg-muted text-foreground/70",
                                )}
                              >
                                <item.icon className="h-4 w-4" />
                              </span>
                              <span className="truncate">{item.label}</span>
                            </Link>
                          </SheetClose>
                        );
                      })}
                    </nav>

                    {accountItems.length > 0 ? (
                      <div className="mt-5 border-t border-border/70 pt-4">
                        <div className="space-y-1">
                          {accountItems.map((item) => {
                            const active = isActiveLink(item.href);

                            return (
                              <SheetClose asChild key={item.label}>
                                <Link
                                  to={item.href}
                                  className={cn(
                                    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
                                    active
                                      ? "bg-accent text-accent-foreground"
                                      : "text-foreground/75 hover:bg-muted hover:text-foreground",
                                  )}
                                >
                                  <item.icon className="h-4 w-4" />
                                  <span className="truncate">{item.label}</span>
                                </Link>
                              </SheetClose>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-5 border-t border-border/70 pt-4">
                      <div className="grid grid-cols-2 gap-2">
                        {phoneNumbers.map((phone) => (
                          <a
                            key={phone.href}
                            href={phone.href}
                            className="flex min-h-12 items-center gap-2 rounded-xl border border-border/70 bg-background px-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
                          >
                            <PhoneCall className="h-4 w-4 text-primary" />
                            <span className="min-w-0">
                              <span className="block text-xs text-muted-foreground">
                                {phone.flag}
                              </span>
                              <span className="block truncate text-xs">{phone.label}</span>
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/70 bg-muted/30 p-3">
                    <div className="mb-3 grid grid-cols-4 gap-2">
                      {languages.map((lan) => (
                        <button
                          key={lan}
                          type="button"
                          onClick={() => handleChangeUserLan(lan)}
                          className={cn(
                            "h-10 rounded-xl border text-xs font-semibold uppercase transition-colors",
                            lan === i18n.language
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                          )}
                        >
                          {lan}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                      {SUPPORTED_CURRENCIES.map((code) => {
                        const currency = CURRENCIES[code as CurrencyCode];
                        const active = code === display;

                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setDisplay(code as CurrencyCode)}
                            className={cn(
                              "flex h-10 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-colors",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-foreground/70 hover:bg-accent hover:text-accent-foreground",
                            )}
                          >
                            <DollarSign className="h-3.5 w-3.5" />
                            {currency.code}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
              <DialogContent className="w-[95vw] max-w-md max-h-[92vh] overflow-y-auto p-0 sm:p-0 gap-0">
                <DialogHeader className="sr-only">
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
