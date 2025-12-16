import { Search, X, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useLanguageStore } from "@/stores/language.store";

// Search input komponentini alohida ajratib olish
const SearchInput = ({
  placeholder,
  value,
  onChange,
  onKeyDown,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => (
  <div className="relative h-full flex-1">
    <Search className="absolute left-2 top-0 bottom-0 my-auto" />
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className="pl-10 border-0 focus-visible:ring-0 h-full"
      placeholder={placeholder}
    />
  </div>
);

export default function HeroSection({
  img,
  title,
  className,
}: {
  title: string;
  img: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [open, setOpen] = useState(false);

  const currentFilterCategory = searchParams.get("filterCategory") || "all";
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentFilterCategory
  );

  useEffect(() => {
    const categoryFromUrl = searchParams.get("filterCategory") || "all";
    setSelectedCategory(categoryFromUrl);
  }, [searchParams]);

  const { data: categories = [] } = useQuery({
    queryKey: ["category-counts", language],
    queryFn: () => propertyService.getCategories(),
  });

  // Responsive check - useCallback bilan optimallashtirish
  const checkScreenSize = useCallback(() => {
    const mobile = window.innerWidth < 1024;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [checkScreenSize]);

  // Mobile search toggle - useCallback
  const toggleMobileSearch = useCallback(() => {
    setMobileSearchActive((prev) => !prev);
  }, []);

  // Handle Category Change (Direct Navigation)
  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value); // Update local state for Select component
      if (value === "all") {
        navigate("/category"); // Navigate to category page without filter
      } else {
        navigate(`/category?filterCategory=${value}`);
      }
      if (isMobile && mobileSearchActive) {
        setMobileSearchActive(false);
      }
    },
    [navigate, isMobile, mobileSearchActive]
  );

  // Search funksiyasi (Only for text search)
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;

    const queryParams = new URLSearchParams();
    queryParams.set("q", encodeURIComponent(searchQuery.trim()));

    navigate(`/search?${queryParams.toString()}`);

    // Mobile holatda search panelni yopish
    if (isMobile && mobileSearchActive) {
      setMobileSearchActive(false);
    }
  }, [searchQuery, navigate, isMobile, mobileSearchActive]);

  // Enter bosganda search
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  // Memoized translations
  const translations = useMemo(
    () => ({
      searchPlaceholder: t("pages.hero.search.search_placeholder"),
      searchButton: t("common.search"),
    }),
    [t]
  );

  // Desktop search panel
  const desktopSearchPanel = (
    <div className="absolute border bg-white flex items-center h-10 rounded-xl overflow-hidden left-0 right-0 bottom-4 mx-auto max-w-[950px]">
      <SearchInput
        placeholder={translations.searchPlaceholder}
        value={searchQuery}
        onChange={setSearchQuery}
        onKeyDown={handleKeyDown}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="border-l border-0">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[280px] justify-between border-l-2 border-black rounded-none h-full focus:ring-0"
          >
            {selectedCategory && selectedCategory !== "all"
              ? t(`categories.${selectedCategory}`)
              : "Category"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0">
          <div className="p-1">
            <div
              onClick={() => {
                handleCategoryChange("all");
                setOpen(false);
              }}
              className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              All
            </div>
            {categories.map((item: { category: string; count: number }) => (
              <div
                key={item.category}
                onClick={() => {
                  handleCategoryChange(item.category);
                  setOpen(false);
                }}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                {t(`categories.${item.category}`)} ({item.count})
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <button
        onClick={handleSearch}
        className="h-full flex items-center gap-2 px-4 bg-yellow-300 capitalize hover:bg-yellow-400 transition-colors"
      >
        <Search size={16} />
        {translations.searchButton}
      </button>
    </div>
  );

  // Mobile search panel
  const mobileSearchPanel = mobileSearchActive && (
    <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-4 z-10">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 py-6 border border-gray-300 rounded-lg w-full"
            placeholder={translations.searchPlaceholder}
          />
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between py-6 border-gray-300"
            >
              {selectedCategory && selectedCategory !== "all"
                ? t(`categories.${selectedCategory}`)
                : "Category"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <div className="p-1 w-full">
              <div
                onClick={() => {
                  handleCategoryChange("all");
                  setOpen(false);
                }}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                All
              </div>
              {categories.map((item: { category: string; count: number }) => (
                <div
                  key={item.category}
                  onClick={() => {
                    handleCategoryChange(item.category);
                    setOpen(false);
                  }}
                  className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                >
                  {t(`categories.${item.category}`)} ({item.count})
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <button
          onClick={handleSearch}
          className="w-full py-3 bg-yellow-400 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors"
        >
          <Search size={18} />
          {translations.searchButton}
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="w-full lg:hidden relative">
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "Edu NSW ACT Foundation" }}
          >
            {t(title)}
          </h1>
          <button
            onClick={toggleMobileSearch}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {mobileSearchActive ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        <div className="relative h-64">
          <img
            className="w-full h-full object-cover"
            src={img}
            alt="main hero image"
            loading="lazy"
          />
        </div>

        {mobileSearchPanel}
      </div>
    );
  }

  return (
    <div className="w-full hidden lg:block relative mb-3 h-[410px]">
      <div className="absolute w-full h-full flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center pb-24 pr-12">
          <h1
            className={`text-6xl max-w-[550px] text-center ${className}`}
            style={{ fontFamily: "Edu NSW ACT Foundation" }}
          >
            {t(title)}
          </h1>
        </div>
        <div className="max-w-[500px] w-full"></div>
      </div>
      <img
        className="w-full h-full object-cover"
        src={img}
        alt="main hero image"
        loading="lazy"
      />
      {desktopSearchPanel}
    </div>
  );
}
