import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ITag } from "@/interfaces/tag/tag.interface";
import { propertyService } from "@/services/property.service";
import { tagService } from "@/services/tag.service";
import { useLanguageStore } from "@/stores/language.store";
import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

const BEDROOMS = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
const BATHROOMS = ["1", "2", "3", "4", "5", "6", "7"] as const;
const TAG_DEBOUNCE_MS = 300;

type DealTab = "rent" | "buy" | "new_projects" | "commercial_rent" | "commercial_buy";

interface Category {
  category: string;
  count: number;
}

const DEAL_TAB_TO_CATEGORY: Record<DealTab, string | undefined> = {
  rent: "APARTMENT_RENT",
  buy: "APARTMENT_SALE",
  new_projects: undefined,
  commercial_rent: undefined,
  commercial_buy: undefined,
};

const RoomButton = memo(
  ({
    label,
    isSelected,
    onToggle,
  }: {
    label: string;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        isSelected
          ? "border-yellow-500 bg-yellow-400 text-black"
          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
      }`}
    >
      {label}
    </button>
  )
);

function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
}

function FilterDropdown({
  label,
  children,
  open,
  onOpenChange,
}: {
  label: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
        >
          {label}
          <ChevronDown size={14} className="text-gray-400" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-4"
        align="start"
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default function HeroSearchControls() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [activeTab, setActiveTab] = useState<DealTab>("rent");
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [openBedsBaths, setOpenBedsBaths] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openPropertyType, setOpenPropertyType] = useState(false);
  const [openAmenities, setOpenAmenities] = useState(false);
  const [openArea, setOpenArea] = useState(false);

  const [tagSearch, setTagSearch] = useState("");
  const [debouncedTagSearch] = useDebounce(tagSearch, TAG_DEBOUNCE_MS);
  const [showTagResults, setShowTagResults] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");

  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [furnished, setFurnished] = useState(false);

  const { data: categories = [] } = useQuery({
    queryKey: ["category-counts", language],
    queryFn: propertyService.getCategories,
    staleTime: 5 * 60 * 1000,
  });

  const { data: fetchedTags = [], isFetching: isTagsLoading } = useQuery({
    queryKey: ["tags", debouncedTagSearch],
    queryFn: () => tagService.findTags(debouncedTagSearch),
    enabled: debouncedTagSearch.length > 0,
  });

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag(tag);
    setTagSearch("");
    setShowTagResults(false);
  }, []);

  const handleTagRemove = useCallback(() => {
    setSelectedTag("");
    setTagSearch("");
  }, []);

  const handleSearch = useCallback(() => {
    const queryParams = new URLSearchParams();

    const category = DEAL_TAB_TO_CATEGORY[activeTab];
    if (category) queryParams.set("category", category);
    if (selectedTag) queryParams.set("tag", selectedTag);
    if (tagSearch && !selectedTag) queryParams.set("search", tagSearch);
    selectedBedrooms.forEach((b) => queryParams.append("bdr", b));
    selectedBathrooms.forEach((b) => queryParams.append("bthr", b));
    if (minPrice) queryParams.set("minPrice", minPrice);
    if (maxPrice) queryParams.set("maxPrice", maxPrice);
    if (minArea) queryParams.set("minArea", minArea);
    if (maxArea) queryParams.set("maxArea", maxArea);
    if (furnished) queryParams.set("furnished", "true");

    navigate(`/search?${queryParams.toString()}`);
    setMobileSearchActive(false);
  }, [
    navigate,
    activeTab,
    selectedTag,
    tagSearch,
    selectedBedrooms,
    selectedBathrooms,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    furnished,
  ]);

  const tabs: { key: DealTab; label: string }[] = [
    { key: "rent", label: t("pages.main_page.search_tabs.rent") },
    { key: "buy", label: t("pages.main_page.search_tabs.buy") },
    { key: "new_projects", label: t("pages.main_page.search_tabs.new_projects") },
    { key: "commercial_rent", label: t("pages.main_page.search_tabs.commercial_rent") },
    { key: "commercial_buy", label: t("pages.main_page.search_tabs.commercial_buy") },
  ];

  const bedsBathsContent = (
    <div className="space-y-4">
      <div>
        <p className="mb-2.5 text-sm font-semibold text-gray-800">
          {t("pages.main_page.search_filters.beds")}
        </p>
        <div className="flex flex-wrap gap-2">
          {BEDROOMS.map((room) => (
            <RoomButton
              key={room}
              label={room === "0" ? t("pages.main_page.search_filters.studio") : room === "7" ? "7+" : room}
              isSelected={selectedBedrooms.includes(room)}
              onToggle={() =>
                setSelectedBedrooms((prev) =>
                  prev.includes(room) ? prev.filter((v) => v !== room) : [...prev, room]
                )
              }
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2.5 text-sm font-semibold text-gray-800">
          {t("pages.main_page.search_filters.baths")}
        </p>
        <div className="flex flex-wrap gap-2">
          {BATHROOMS.map((room) => (
            <RoomButton
              key={room}
              label={room === "7" ? "7+" : room}
              isSelected={selectedBathrooms.includes(room)}
              onToggle={() =>
                setSelectedBathrooms((prev) =>
                  prev.includes(room) ? prev.filter((v) => v !== room) : [...prev, room]
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );

  const priceContent = (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-800">
        {t("pages.main_page.search_filters.price")}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={t("pages.main_page.search_filters.min")}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
        />
        <span className="text-gray-400">—</span>
        <input
          type="number"
          placeholder={t("pages.main_page.search_filters.max")}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
        />
      </div>
    </div>
  );

  const amenitiesContent = (
    <div className="space-y-3">
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={furnished}
          onChange={(e) => setFurnished(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-yellow-500"
        />
        <span className="text-sm text-gray-700">
          {t("pages.main_page.search_filters.furnished")}
        </span>
      </label>
    </div>
  );

  const areaContent = (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-800">
        {t("pages.main_page.search_filters.area_sqft")}
      </p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder={t("pages.main_page.search_filters.min")}
          value={minArea}
          onChange={(e) => setMinArea(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
        />
        <span className="text-gray-400">—</span>
        <input
          type="number"
          placeholder={t("pages.main_page.search_filters.max")}
          value={maxArea}
          onChange={(e) => setMaxArea(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
        />
      </div>
    </div>
  );

  // ─── MOBILE ───
  if (isMobile && !mobileSearchActive) {
    return (
      <button
        type="button"
        onClick={() => setMobileSearchActive(true)}
        aria-label={t("common.search")}
        className="absolute bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center rounded-full border border-white/20 bg-white/95 p-2 shadow-xl backdrop-blur"
      >
        <div className="mr-3 rounded-full bg-yellow-400 p-2 text-black">
          <Search size={18} aria-hidden="true" />
        </div>
        <span className="flex-1 text-left text-sm text-gray-500">
          {t("pages.main_page.search_filters.location_placeholder")}
        </span>
        <div className="ml-2 border-l p-2">
          <SlidersHorizontal size={18} className="text-gray-400" aria-hidden="true" />
        </div>
      </button>
    );
  }

  if (isMobile && mobileSearchActive) {
    return (
      <div className="animate-in fade-in zoom-in fixed inset-0 z-[100] flex flex-col bg-white duration-200">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-bold">{t("common.search")}</h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close search"
            onClick={() => setMobileSearchActive(false)}
          >
            <X size={24} />
          </Button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              className="h-12 w-full rounded-lg border border-gray-300 pl-10 pr-4 text-base outline-none focus:border-yellow-500"
              placeholder={t("pages.main_page.search_filters.location_placeholder")}
              value={tagSearch}
              onChange={(e) => {
                setTagSearch(e.target.value);
                setShowTagResults(true);
              }}
            />
          </div>

          {selectedTag && (
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-1 px-2 py-1 capitalize"
            >
              {selectedTag}
              <X size={14} className="ml-1 cursor-pointer" onClick={handleTagRemove} />
            </Badge>
          )}

          {showTagResults && (tagSearch || isTagsLoading) && (
            <div className="max-h-40 overflow-y-auto rounded-lg border bg-gray-50 p-2">
              {isTagsLoading ? (
                <div className="p-2 text-center text-sm">{t("common.loading")}</div>
              ) : fetchedTags.length > 0 ? (
                fetchedTags.map((tag: ITag) => (
                  <div
                    key={tag._id}
                    onClick={() => handleTagSelect(tag.value)}
                    className="cursor-pointer rounded p-2 hover:bg-white"
                  >
                    {tag.value}
                  </div>
                ))
              ) : (
                <div className="p-2 text-center text-sm text-gray-500">
                  {t("common.no_tags_found")}
                </div>
              )}
            </div>
          )}

          {/* Mobile filters inline */}
          {bedsBathsContent}
          {priceContent}
          {areaContent}
          {amenitiesContent}
        </div>

        <div className="border-t bg-gray-50 p-4">
          <Button
            className="h-12 w-full rounded-xl bg-yellow-400 text-lg font-bold text-black hover:bg-yellow-500"
            onClick={handleSearch}
          >
            <Search className="mr-2" size={20} />
            {t("pages.main_page.search_filters.find")}
          </Button>
        </div>
      </div>
    );
  }

  // ─── DESKTOP ───
  return (
    <div className="absolute bottom-6 left-1/2 z-40 w-full max-w-4xl -translate-x-1/2 px-4">
      {/* Tabs - pill style like PropertyFinder */}
      <div className="mb-3 flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1.5 shadow-lg backdrop-blur">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-yellow-400 text-black shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search box */}
      <div className="rounded-2xl bg-white p-4 shadow-2xl">
        {/* Main search row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            {selectedTag && (
              <Badge
                variant="secondary"
                className="absolute left-10 top-1/2 z-10 -translate-y-1/2 capitalize"
              >
                {selectedTag}
                <X
                  size={14}
                  className="ml-1 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagRemove();
                  }}
                />
              </Badge>
            )}

            <input
              className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-yellow-400 focus:bg-white"
              placeholder={t("pages.main_page.search_filters.location_placeholder")}
              value={tagSearch}
              onChange={(e) => {
                setTagSearch(e.target.value);
                setShowTagResults(true);
              }}
              onFocus={() => debouncedTagSearch.length > 0 && setShowTagResults(true)}
            />

            {/* Tag search results dropdown */}
            {showTagResults && (tagSearch || isTagsLoading) && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-white shadow-lg">
                {isTagsLoading ? (
                  <div className="p-3 text-center text-sm text-gray-500">
                    {t("common.loading")}
                  </div>
                ) : fetchedTags.length > 0 ? (
                  fetchedTags.map((tag: ITag) => (
                    <div
                      key={tag._id}
                      onClick={() => handleTagSelect(tag.value)}
                      className="cursor-pointer px-4 py-2.5 text-sm hover:bg-yellow-50"
                    >
                      {tag.value}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-sm text-gray-500">
                    {t("common.no_tags_found")}
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            onClick={handleSearch}
            className="h-12 rounded-xl bg-yellow-400 px-8 font-bold text-black hover:bg-yellow-500"
          >
            <Search size={18} className="mr-2" />
            {t("pages.main_page.search_filters.find")}
          </Button>
        </div>

        {/* Filter chips row */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <FilterDropdown
            label={t("pages.main_page.search_filters.property_type")}
            open={openPropertyType}
            onOpenChange={setOpenPropertyType}
          >
            <div className="space-y-2">
              {categories.map((cat: Category) => (
                <div
                  key={cat.category}
                  onClick={() => {
                    const mapped = Object.entries(DEAL_TAB_TO_CATEGORY).find(
                      ([, v]) => v === cat.category
                    );
                    if (mapped) setActiveTab(mapped[0] as DealTab);
                    setOpenPropertyType(false);
                  }}
                  className="flex cursor-pointer justify-between rounded-md px-3 py-2 text-sm hover:bg-yellow-50"
                >
                  <span>{t(`categories.${cat.category}`)}</span>
                  <span className="text-gray-400">({cat.count})</span>
                </div>
              ))}
            </div>
          </FilterDropdown>

          <FilterDropdown
            label={t("pages.main_page.search_filters.beds_baths")}
            open={openBedsBaths}
            onOpenChange={setOpenBedsBaths}
          >
            {bedsBathsContent}
          </FilterDropdown>

          <FilterDropdown
            label={t("pages.main_page.search_filters.price")}
            open={openPrice}
            onOpenChange={setOpenPrice}
          >
            {priceContent}
          </FilterDropdown>

          <FilterDropdown
            label={t("pages.main_page.search_filters.amenities")}
            open={openAmenities}
            onOpenChange={setOpenAmenities}
          >
            {amenitiesContent}
          </FilterDropdown>

          <FilterDropdown
            label={t("pages.main_page.search_filters.area_sqft")}
            open={openArea}
            onOpenChange={setOpenArea}
          >
            {areaContent}
          </FilterDropdown>

        </div>
      </div>
    </div>
  );
}
