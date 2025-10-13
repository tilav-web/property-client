import { ChevronDown, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import {
  propertyType,
  type PropertyType,
} from "@/interfaces/property.interface";

export default function HeroSection({
  img,
  title,
  className,
  handlePropertyType,
  property_type,
}: {
  title: string;
  img: string;
  className?: string;
  handlePropertyType: (value: PropertyType) => void;
  property_type?: PropertyType;
}) {
  const { t } = useTranslation();
  const [, setIsMobile] = useState(false);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Mobile search toggle
  const toggleMobileSearch = () => {
    setMobileSearchActive(!mobileSearchActive);
  };

  return (
    <>
      {/* Desktop Version (hidden on mobile) */}
      <div className="w-full hidden lg:block relative mb-3">
        <div className="absolute w-full h-full flex items-center justify-between">
          <div className="flex-1 flex items-center justify-center pb-24 pr-12">
            <h1
              className={`text-6xl max-w-[550px] text-center ${className}`}
              style={{ fontFamily: "Edu NSW ACT Foundation" }}
            >
              {title}
            </h1>
          </div>
          <div className="max-w-[500px] w-full"></div>
        </div>
        <img
          className="w-full h-full object-cover"
          src={img}
          alt="main hero image"
        />
        <div className="absolute border bg-white flex items-center h-10 rounded-xl overflow-hidden left-0 right-0 bottom-4 mx-auto max-w-[950px]">
          <div className="relative border-r-2 border-black h-full max-w-[280px]">
            <Search className="absolute left-2 top-0 bottom-0 my-auto" />
            <Input
              className="pl-10 border-0 focus-visible:ring-0 h-full"
              placeholder={t("hero.search.search_placeholder")}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full max-w-[190px] items-center gap-1 borser-r px-2 border-r-2 border-black h-full">
              <span className="opacity-50 flex-1 text-start">
                {property_type ?? t("hero.search.dropdown_menu.first")}
              </span>
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {propertyType.map((item) => {
                return (
                  <DropdownMenuItem
                    onClick={() => handlePropertyType(item)}
                    key={item}
                  >
                    {item}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-1 items-center gap-1 borser-r px-2 border-r-2 border-black h-full">
              <span className="opacity-50">
                {t("hero.search.dropdown_menu.secound")}
              </span>
              <ChevronDown />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="h-full flex items-center gap-2 px-4 bg-yellow-300 capitalize">
            <Search />
            {t("search")}
          </button>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="w-full lg:hidden relative">
        {/* Mobile Header with Search Toggle */}
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: "Edu NSW ACT Foundation" }}
          >
            {title}
          </h1>
          <button
            onClick={toggleMobileSearch}
            className="p-2 rounded-full bg-gray-100"
          >
            {mobileSearchActive ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative h-64">
          <img
            className="w-full h-full object-cover"
            src={img}
            alt="main hero image"
          />
        </div>

        {/* Mobile Search Panel */}
        {mobileSearchActive && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-4 z-10">
            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <Input
                  className="pl-10 py-6 border border-gray-300 rounded-lg"
                  placeholder={t("hero.search.search_placeholder")}
                />
              </div>

              {/* Filter Options */}
              <div className="flex flex-col space-y-3">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
                    <span className="text-gray-500">
                      {t("hero.search.dropdown_menu.first")}
                    </span>
                    <ChevronDown size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex justify-between items-center p-3 border border-gray-300 rounded-lg">
                    <span className="text-gray-500">
                      {t("hero.search.dropdown_menu.secound")}
                    </span>
                    <ChevronDown size={18} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search Button */}
              <button className="w-full py-3 bg-yellow-400 rounded-lg font-medium flex items-center justify-center gap-2">
                <Search size={18} />
                {t("search")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
