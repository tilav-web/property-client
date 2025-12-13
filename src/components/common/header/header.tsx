import { useState, useEffect, useRef, useCallback } from "react";
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
  Home,
  Building,
  Handshake,
  Star,
  LogIn,
  User,
  X,
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
import { defaultImageAvatar, serverUrl } from "@/utils/shared";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { handleStorage } from "@/utils/handle-storage";
import { useSellerStore } from "@/stores/seller.store";
import { useLikeStore } from "@/stores/like.store";
import { useLanguageStore } from "@/stores/language.store";
import type { ILanguage } from "@/interfaces/language/language.interface";
import type { IProperty } from "@/interfaces/property/property.interface";
import { Spinner } from "@/components/ui/spinner";
import HeaderSearchPropertyCard from "./_components/header-search-property-card";
import { propertyService } from "@/services/property.service";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, setUser } = useUserStore();
  const { logout: sellerLogout } = useSellerStore();
  const { likedProperties } = useLikeStore();
  const { setLanguage } = useLanguageStore();
  const [searchResults, setSearchResults] = useState<IProperty[]>([]);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

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
    {
      icon: Home,
      label: t("common.rent_land"),
      href: "/filter-nav",
    },
    { icon: Handshake, label: t("common.ai_agent"), href: "/ai-agent" },
    // { icon: Calculator, label: t("common.mortgage"), href: "/mortgage" },
    {
      icon: Star,
      label: t("common.new_projects"),
      href: "/filter-nav?category=&is_new=1",
    },
    { icon: Heart, label: t("common.favorites"), href: "/favorites" },
  ];

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

  // Search properties function
  const searchProperties = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const params = {
        search: query,
        limit: 10,
        page: 1,
      };
      const data = await propertyService.findAll(params);
      setSearchResults(data.properties || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (value.trim()) {
      const timeout = setTimeout(() => {
        searchProperties(value);
      }, 300);
      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
    setIsSearchOpen(false);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  };

  // Handle property click
  const handlePropertyClick = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
    clearSearch();
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mobile search uchun
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isSearchOpen]);

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
                      {t("common.header.logo")}
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

                  {user && (
                    <Button
                      onClick={() => navigate("/seller/profile")}
                      variant="default"
                      className="flex items-center gap-2 mx-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <span className="font-semibold">
                        {t("common.sell_or_rent")}
                      </span>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                {t("common.header.logo")}
              </span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-2xl mx-8 relative">
            <div className="relative" ref={searchResultsRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchOpen(true)}
                placeholder={t("common.search_placeholder")}
                className="pl-10 pr-10 py-2 w-full bg-gray-50 border-gray-300 rounded-full focus:bg-white focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {searchOpen && (searchQuery || isLoading) && (
              <div className="absolute top-12 left-0 right-0 bg-white shadow-xl border rounded-lg p-4 max-h-[600px] overflow-y-auto z-50">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Spinner className="size-8" />
                    <p className="mt-2 text-gray-500">
                      {t("common.searching")}
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {t("common.search_results")} ({searchResults.length})
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate(
                            `/filter-nav?search=${encodeURIComponent(
                              searchQuery
                            )}`
                          );
                          clearSearch();
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        {t("common.see_all")}
                      </Button>
                    </div>
                    {searchResults.map((property) => (
                      <div
                        key={property._id}
                        onClick={() => handlePropertyClick(property._id)}
                        className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <HeaderSearchPropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Search className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      {t("common.no_results")}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {t("common.try_different_keywords")}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>

            {user && (
              <Button
                onClick={() => navigate("/seller/profile")}
                variant="default"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <span className="font-semibold">
                  {t("common.sell_or_rent")}
                </span>
              </Button>
            )}

            {user && likedProperties.length > 0 && (
              <Button
                onClick={() => navigate("/favorites")}
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Heart className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {likedProperties.length}
                </span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm uppercase">{i18n.language}</span>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={`${
                        user?.avatar
                          ? `${serverUrl}/uploads/${user?.avatar}`
                          : defaultImageAvatar
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

        {/* Mobile Search Input */}
        {isSearchOpen && (
          <div className="lg:hidden px-4 pb-3" ref={searchResultsRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                ref={mobileSearchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setSearchOpen(true)}
                placeholder={t("common.search_placeholder")}
                className="pl-10 pr-10 py-2 w-full bg-gray-50 border-gray-300 rounded-full"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            {searchOpen && (searchQuery || isLoading) && (
              <div className="absolute left-4 right-4 bg-white shadow-xl border rounded-lg p-4 max-h-[400px] overflow-y-auto z-50 mt-1">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-4">
                    <Spinner className="size-6" />
                    <p className="mt-2 text-gray-500 text-sm">
                      {t("common.searching")}
                    </p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-gray-700">
                        {t("common.search_results")} ({searchResults.length})
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigate(
                            `/filter-nav?search=${encodeURIComponent(
                              searchQuery
                            )}`
                          );
                          clearSearch();
                        }}
                        className="text-blue-600 hover:text-blue-700 text-xs"
                      >
                        {t("common.see_all")}
                      </Button>
                    </div>
                    {searchResults.map((property) => (
                      <div
                        key={property._id}
                        onClick={() => handlePropertyClick(property._id)}
                        className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <HeaderSearchPropertyCard property={property} />
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Search className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium text-sm">
                      {t("common.no_results")}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {t("common.try_different_keywords")}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
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
