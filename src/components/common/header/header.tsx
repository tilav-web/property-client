import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChevronDown,
  Globe,
  Search,
  Menu,
  Heart,
  User,
  Home,
  Building,
  Handshake,
  Calculator,
  Star,
  LogIn,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: t("buy"), href: "/buy" },
    { icon: Building, label: t("rent_apartments"), href: "/rent-apartments" },
    { icon: Home, label: t("rent_space"), href: "/rent-space" },
    { icon: Handshake, label: t("find_agent"), href: "/agents" },
    { icon: Calculator, label: t("mortgage"), href: "/mortgage" },
    { icon: Star, label: t("new_projects"), href: "/new-projects" },
    { icon: Heart, label: t("favorites"), href: "/favorites" },
  ];

  const languages = [
    { code: "uz", label: "O'zbek" },
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
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
                  {/* Logo */}
                  <Link
                    to="/"
                    className="flex items-center gap-2 py-4 border-b"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Logo
                    </span>
                  </Link>

                  {/* Navigation Links */}
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

                  {/* Mobile Footer */}
                  <div className="border-t pt-4">
                    <Link
                      to="/login"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t("login")}</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                Logo
              </span>
            </Link>
          </div>
          <div className="hidden lg:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={t("search_placeholder")}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-300 rounded-full focus:bg-white focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <span className="font-semibold">{t("sell_or_rent")}</span>
            </Button>
            <Button
              onClick={() => navigate("/favorites")}
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Heart className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm">UZ</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="flex items-center gap-2"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        lang.code === "uz" ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to={"/auth"}
              className="flex items-center gap-2 hover:underline transition-all"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:block">{t("login")}</span>
            </Link>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{t("login")}</span>
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Sevimlilar</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                  <LogIn className="h-4 w-4" />
                  <span>Chiqish</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={t("search_placeholder")}
                className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-300 rounded-full"
              />
            </div>
          </div>
        )}
        <nav className="hidden lg:flex items-center justify-between py-3 px-6 border-t border-gray-100">
          <div className="flex items-center gap-1 flex-1">
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
          </div>
        </nav>
      </div>
    </header>
  );
}
