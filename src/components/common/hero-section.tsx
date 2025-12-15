import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useMemo } from "react";

// Search input komponentini alohida ajratib olish
const SearchInput = ({ placeholder }: { placeholder: string }) => (
  <div className="relative border-r-2 border-black h-full flex-1">
    <Search className="absolute left-2 top-0 bottom-0 my-auto" />
    <Input
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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

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
      <SearchInput placeholder={translations.searchPlaceholder} />

      <button className="h-full flex items-center gap-2 px-4 bg-yellow-300 capitalize hover:bg-yellow-400 transition-colors">
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
            className="pl-10 py-6 border border-gray-300 rounded-lg"
            placeholder={translations.searchPlaceholder}
          />
        </div>
        <button className="w-full py-3 bg-yellow-400 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors">
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
    <div className="w-full hidden lg:block relative mb-3">
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
