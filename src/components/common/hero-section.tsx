import { Search, X, ChevronsUpDown, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useLanguageStore } from "@/stores/language.store";
import { tagService } from "@/services/tag.service";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "use-debounce";
import type { ITag } from "@/interfaces/tag/tag.interface";
import { Input } from "../ui/input";

const BEDROOMS = ["1", "2", "3", "4", "5", "6", "7+"] as const;
const BATHROOMS = ["1", "2", "3", "4", "5", "6", "7+"] as const;
const MAX_TAGS = 4;
const TAG_DEBOUNCE_MS = 300;

interface HeroSectionProps {
  title: string;
  img: string;
  className?: string;
}

interface Category {
  category: string;
  count: number;
}

// Memoized Components
const RoomButton = memo(
  ({
    room,
    isSelected,
    onToggle,
  }: {
    room: string;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <Button
      size="icon"
      variant={isSelected ? "default" : "outline"}
      onClick={onToggle}
    >
      {room}
    </Button>
  )
);

const TagBadge = memo(
  ({ tag, onRemove }: { tag: string; onRemove: () => void }) => (
    <Badge variant="secondary" className="flex items-center gap-1">
      {tag}
      <X size={12} className="cursor-pointer" onClick={onRemove} />
    </Badge>
  )
);

// Custom Hook for Screen Size
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isMobile;
}

// Custom Hook for Search State
function useSearchState(searchParams: URLSearchParams) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    searchParams.getAll("tag")
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    () => searchParams.get("category") || "all"
  );
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>(
    searchParams.getAll("bdr")
  );
  const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>(
    searchParams.getAll("bthr")
  );

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedTags(searchParams.getAll("tag"));
    setSelectedBedrooms(searchParams.getAll("bdr"));
    setSelectedBathrooms(searchParams.getAll("bthr"));
  }, [searchParams]);

  return {
    selectedTags,
    setSelectedTags,
    selectedCategory,
    setSelectedCategory,
    selectedBedrooms,
    setSelectedBedrooms,
    selectedBathrooms,
    setSelectedBathrooms,
  };
}

export default function HeroSection({
  img,
  title,
  className,
}: HeroSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const isMobile = useIsMobile();
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [debouncedTagSearch] = useDebounce(tagSearch, TAG_DEBOUNCE_MS);
  const [isTyping, setIsTyping] = useState(false);

  const searchState = useSearchState(searchParams);
  const {
    selectedTags,
    setSelectedTags,
    selectedCategory,
    setSelectedCategory,
    selectedBedrooms,
    setSelectedBedrooms,
    selectedBathrooms,
    setSelectedBathrooms,
  } = searchState;

  // Queries
  const { data: categories = [] } = useQuery({
    queryKey: ["category-counts", language],
    queryFn: propertyService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: fetchedTags = [],
    isLoading: isTagsLoading,
    isFetching: isTagsFetching,
  } = useQuery({
    queryKey: ["tags", debouncedTagSearch],
    queryFn: () => tagService.findTags(debouncedTagSearch),
    enabled: debouncedTagSearch.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Typing effect
  useEffect(() => {
    if (tagSearch !== debouncedTagSearch) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [tagSearch, debouncedTagSearch]);

  // Show loading when typing or fetching
  const isSearchLoading = isTyping || isTagsLoading || isTagsFetching;

  // Handlers
  const handleTagSelect = useCallback(
    (tag: string) => {
      if (selectedTags.length < MAX_TAGS && !selectedTags.includes(tag)) {
        setSelectedTags((prev) => [...prev, tag]);
      }
      setTagSearch("");
      setOpenTag(false);
      inputRef.current?.focus();
    },
    [selectedTags, setSelectedTags]
  );

  const handleTagRemove = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => prev.filter((t) => t !== tag));
    },
    [setSelectedTags]
  );

  const handleBedroomToggle = useCallback(
    (bedroom: string) => {
      setSelectedBedrooms((prev) =>
        prev.includes(bedroom)
          ? prev.filter((b) => b !== bedroom)
          : [...prev, bedroom]
      );
    },
    [setSelectedBedrooms]
  );

  const handleBathroomToggle = useCallback(
    (bathroom: string) => {
      setSelectedBathrooms((prev) =>
        prev.includes(bathroom)
          ? prev.filter((b) => b !== bathroom)
          : [...prev, bathroom]
      );
    },
    [setSelectedBathrooms]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      setOpenCategory(false);
    },
    [setSelectedCategory]
  );

  const handleSearch = useCallback(() => {
    const queryParams = new URLSearchParams();

    selectedTags.forEach((tag) => queryParams.append("tag", tag));
    selectedBedrooms.forEach((bdr) => queryParams.append("bdr", bdr));
    selectedBathrooms.forEach((bthr) => queryParams.append("bthr", bthr));

    if (selectedCategory && selectedCategory !== "all") {
      queryParams.set("category", selectedCategory);
    }

    if (queryParams.toString()) {
      navigate(`/search?${queryParams.toString()}`);
    } else if (tagSearch.trim()) {
      queryParams.set("q", tagSearch.trim());
      navigate(`/search?${queryParams.toString()}`);
    }

    if (isMobile && mobileSearchActive) {
      setMobileSearchActive(false);
    }
  }, [
    selectedTags,
    selectedBedrooms,
    selectedBathrooms,
    selectedCategory,
    tagSearch,
    navigate,
    isMobile,
    mobileSearchActive,
  ]);

  // Memoized translations
  const translations = useMemo(
    () => ({
      searchPlaceholder: t("pages.hero.search.search_placeholder"),
      searchButton: t("common.search"),
      category: t("common.category"),
      bedrooms: t("common.bedrooms"),
      bathrooms: t("common.bathrooms"),
      all: t("common.all"),
      noTagsFound: t("common.no_tags_found"),
    }),
    [t]
  );

  // Memoized render functions
  const renderRoomButtons = useCallback(
    (
      rooms: readonly string[],
      selected: string[],
      handler: (room: string) => void
    ) =>
      rooms.map((room) => (
        <RoomButton
          key={room}
          room={room}
          isSelected={selected.includes(room)}
          onToggle={() => handler(room)}
        />
      )),
    []
  );

  // Search Panel Component
  const searchPanel = useMemo(
    () => (
      <div className="flex-1 flex items-center bg-white h-full relative">
        {/* Tag Icon - faqat ko'rsatish uchun */}
        <div className="absolute left-2 top-0 bottom-0 my-auto flex items-center pointer-events-none">
          <Tag className="text-gray-500" />
        </div>

        {/* Selected Tags */}
        <div className="flex items-center flex-wrap gap-1 p-2 pl-9 min-h-[40px]">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              onRemove={() => handleTagRemove(tag)}
            />
          ))}
        </div>

        {/* Search Input with Popover */}
        <div className="flex-1 h-full">
          <Popover open={openTag} onOpenChange={setOpenTag}>
            <PopoverTrigger asChild>
              <Input
                ref={inputRef}
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                    setOpenTag(false);
                  }
                  if (e.key === "Escape") {
                    setOpenTag(false);
                    inputRef.current?.blur();
                  }
                }}
                placeholder={translations.searchPlaceholder}
                className="w-full h-full shadow-none border-none focus-visible:ring-0"
              />
            </PopoverTrigger>
            <PopoverContent
              className="w-[--radix-popover-trigger-width] p-0"
              onOpenAutoFocus={(e) => e.preventDefault()}
              align="start"
            >
              <Command>
                <CommandList>
                  {isSearchLoading && (
                    <div className="p-4 text-sm text-center text-gray-500 flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                      {t("common.loading")}...
                    </div>
                  )}
                  {!isSearchLoading &&
                    fetchedTags.length === 0 &&
                    debouncedTagSearch.length > 0 && (
                      <CommandEmpty className="py-6 text-center text-sm">
                        {translations.noTagsFound}
                      </CommandEmpty>
                    )}
                  {!isSearchLoading && fetchedTags.length > 0 && (
                    <CommandGroup>
                      {fetchedTags.map((tag: ITag) => (
                        <CommandItem
                          key={tag._id}
                          onSelect={() => handleTagSelect(tag.value)}
                          className="cursor-pointer"
                        >
                          {tag.value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {!isSearchLoading && debouncedTagSearch.length === 0 && (
                    <div className="p-4 text-sm text-center text-gray-400">
                      {t("common.start_typing_to_search")}
                    </div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    ),
    [
      selectedTags,
      openTag,
      tagSearch,
      isSearchLoading,
      fetchedTags,
      debouncedTagSearch,
      translations,
      handleTagRemove,
      handleTagSelect,
      handleSearch,
      t,
    ]
  );

  const desktopSearchPanel = useMemo(
    () => (
      <div className="absolute border z-50 bg-white flex items-center h-14 rounded-xl overflow-hidden left-0 right-0 bottom-4 mx-auto max-w-[950px] shadow-lg">
        {searchPanel}

        {/* Category Popover */}
        <Popover open={openCategory} onOpenChange={setOpenCategory}>
          <PopoverTrigger asChild className="border-l">
            <Button
              variant="outline"
              role="combobox"
              className="w-[200px] justify-between rounded-none h-full focus:ring-0"
            >
              {selectedCategory && selectedCategory !== "all"
                ? t(`categories.${selectedCategory}`)
                : translations.category}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <div
              onClick={() => handleCategoryChange("all")}
              className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              {translations.all}
            </div>
            {categories.map((item: Category) => (
              <div
                key={item.category}
                onClick={() => handleCategoryChange(item.category)}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                {t(`categories.${item.category}`)} ({item.count})
              </div>
            ))}
          </PopoverContent>
        </Popover>

        {/* Rooms Popover */}
        <Popover open={openRooms} onOpenChange={setOpenRooms}>
          <PopoverTrigger asChild className="border-l">
            <Button
              variant="outline"
              role="combobox"
              className="w-[220px] justify-between rounded-none h-full focus:ring-0"
            >
              {`${translations.bedrooms} & ${translations.bathrooms}`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4 flex flex-col gap-4">
            <div>
              <p className="mb-2 font-medium">{translations.bedrooms}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {renderRoomButtons(
                  BEDROOMS,
                  selectedBedrooms,
                  handleBedroomToggle
                )}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium">{translations.bathrooms}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {renderRoomButtons(
                  BATHROOMS,
                  selectedBathrooms,
                  handleBathroomToggle
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="h-full flex items-center gap-2 px-6 bg-yellow-300 capitalize hover:bg-yellow-400 transition-colors font-medium"
        >
          <Search size={18} />
          {translations.searchButton}
        </button>
      </div>
    ),
    [
      searchPanel,
      openCategory,
      openRooms,
      selectedCategory,
      selectedBedrooms,
      selectedBathrooms,
      categories,
      translations,
      t,
      handleCategoryChange,
      handleBedroomToggle,
      handleBathroomToggle,
      renderRoomButtons,
      handleSearch,
    ]
  );

  // Mobile view
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
            onClick={() => setMobileSearchActive((p) => !p)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={mobileSearchActive ? "Close search" : "Open search"}
          >
            {mobileSearchActive ? <X size={20} /> : <Search size={20} />}
          </button>
        </div>
        <div className="relative h-64">
          <img
            className="w-full h-full object-cover"
            src={img}
            alt={t(title)}
            loading="lazy"
          />
        </div>
        {mobileSearchActive && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-lg p-4 z-10 animate-in slide-in-from-top duration-200">
            <p className="text-center text-gray-500">
              {t("common.mobile_search_coming_soon")}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="w-full hidden lg:block relative mb-3 h-[410px]">
      <div className="absolute w-full h-full flex items-center justify-between z-10">
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
        alt={t(title)}
        loading="lazy"
      />
      {desktopSearchPanel}
    </div>
  );
}
