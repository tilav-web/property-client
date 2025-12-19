import { Search, X, ChevronsUpDown, Tag, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
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
import { cn } from "@/lib/utils";

const BEDROOMS = ["1", "2", "3", "4", "5", "6", "7"] as const;
const BATHROOMS = ["1", "2", "3", "4", "5", "6", "7"] as const;
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
      size="sm"
      variant={isSelected ? "default" : "outline"}
      onClick={onToggle}
      className="flex-1 min-w-[45px]"
    >
      {room == "7" ? "7+" : room}
    </Button>
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

export default function HeroSection({ img, title }: HeroSectionProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // States
  const isMobile = useIsMobile();
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [debouncedTagSearch] = useDebounce(tagSearch, TAG_DEBOUNCE_MS);

  // Filter States - BITTA TAG UCHUN
  const [selectedTag, setSelectedTag] = useState<string>(
    searchParams.get("tag") || ""
  );
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>(
    searchParams.get("filterCategory") || "all"
  );
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>(
    searchParams.getAll("bdr")
  );
  const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>(
    searchParams.getAll("bthr")
  );

  // Sync with URL params
  useEffect(() => {
    setSelectedFilterCategory(searchParams.get("category") || "all");
    setSelectedTag(searchParams.get("tag") || "");
    setSelectedBedrooms(searchParams.getAll("bdr"));
    setSelectedBathrooms(searchParams.getAll("bthr"));
  }, [searchParams]);

  // Queries
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

  // Handlers
  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTag(tag);
    setTagSearch("");
    setOpenTag(false);
  }, []);

  const handleTagRemove = useCallback(() => {
    setSelectedTag("");
    setTagSearch("");
  }, []);

  const handleSearch = useCallback(() => {
    const queryParams = new URLSearchParams();
    if (selectedTag) queryParams.set("tag", selectedTag);
    selectedBedrooms.forEach((bdr) => queryParams.append("bdr", bdr));
    selectedBathrooms.forEach((bthr) => queryParams.append("bthr", bthr));
    if (selectedFilterCategory && selectedFilterCategory !== "all")
      queryParams.set("filterCategory", selectedFilterCategory);

    navigate(`/search?${queryParams.toString()}`);
    setMobileSearchActive(false);
  }, [
    selectedTag,
    selectedBedrooms,
    selectedBathrooms,
    selectedFilterCategory,
    navigate,
  ]);

  // UI Parts
  const renderRoomFilter = (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <p className="mb-2 text-sm font-semibold">{t("common.bedrooms")}</p>
        <div className="flex flex-wrap gap-2">
          {BEDROOMS.map((r) => (
            <RoomButton
              key={r}
              room={r}
              isSelected={selectedBedrooms.includes(r)}
              onToggle={() =>
                setSelectedBedrooms((prev) =>
                  prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
                )
              }
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">{t("common.bathrooms")}</p>
        <div className="flex flex-wrap gap-2">
          {BATHROOMS.map((r) => (
            <RoomButton
              key={r}
              room={r}
              isSelected={selectedBathrooms.includes(r)}
              onToggle={() =>
                setSelectedBathrooms((prev) =>
                  prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full relative overflow-hidden mb-4">
      {/* Background Image Section */}
      <div
        className={cn(
          "relative w-full transition-all duration-300",
          isMobile ? "h-[300px]" : "h-[450px]"
        )}
      >
        <img src={img} className="w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-6">
          <h1
            className={cn(
              "text-white text-center leading-tight drop-shadow-lg",
              isMobile ? "text-3xl" : "text-6xl max-w-4xl"
            )}
            style={{ fontFamily: "Edu NSW ACT Foundation" }}
          >
            {t(title)}
          </h1>

          {/* Mobile Quick Search Bar */}
          {isMobile && !mobileSearchActive && (
            <div
              onClick={() => setMobileSearchActive(true)}
              className="mt-6 w-full max-w-sm bg-white/95 backdrop-blur rounded-full p-2 flex items-center shadow-xl border border-white/20"
            >
              <div className="bg-yellow-400 p-2 rounded-full mr-3 text-black">
                <Search size={18} />
              </div>
              <span className="text-gray-500 text-sm flex-1">
                {t("pages.hero.search.search_placeholder")}
              </span>
              <div className="p-2 border-l ml-2">
                <Filter size={18} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH PANEL */}
      {isMobile && mobileSearchActive && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-bold text-lg">{t("common.search")}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearchActive(false)}
            >
              <X size={24} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Tag Search */}
            <div className="space-y-3">
              <div className="relative">
                <Tag
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder={t("pages.hero.search.search_placeholder")}
                  className="pl-10 h-12 text-base"
                  value={tagSearch}
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                    setOpenTag(true);
                  }}
                />
              </div>

              {/* Tanlangan tag ko'rinishi */}
              {selectedTag && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 py-1 px-2 capitalize w-fit"
                >
                  {selectedTag}
                  <X
                    size={14}
                    className="cursor-pointer ml-1"
                    onClick={handleTagRemove}
                  />
                </Badge>
              )}

              {/* Tag Search Suggestions */}
              {openTag && (tagSearch || isTagsLoading) && (
                <div className="border rounded-lg bg-gray-50 p-2 max-h-40 overflow-y-auto shadow-inner">
                  {isTagsLoading ? (
                    <div className="p-2 text-center text-sm">
                      {t("common.loading")}...
                    </div>
                  ) : fetchedTags.length > 0 ? (
                    fetchedTags.map((tag: ITag) => (
                      <div
                        key={tag._id}
                        onClick={() => handleTagSelect(tag.value)}
                        className="p-2 hover:bg-white rounded cursor-pointer border-b last:border-0"
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
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">{t("common.category")}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={selectedFilterCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedFilterCategory("all")}
                  className="justify-start"
                >
                  {t("common.all")}
                </Button>
                {categories.map((cat: Category) => (
                  <Button
                    key={cat.category}
                    variant={
                      selectedFilterCategory === cat.category ? "default" : "outline"
                    }
                    onClick={() => setSelectedFilterCategory(cat.category)}
                    className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {t(`categories.${cat.category}`)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rooms */}
            {renderRoomFilter}
          </div>

          <div className="p-4 border-t bg-gray-50">
            <Button
              className="w-full h-12 text-lg bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
              onClick={handleSearch}
            >
              <Search className="mr-2" size={20} />
              {t("common.search")}
            </Button>
          </div>
        </div>
      )}

      {/* DESKTOP SEARCH BAR */}
      {!isMobile && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-40">
          <div className="bg-white rounded-2xl shadow-2xl border flex items-center h-16 p-2 gap-2">
            <Popover open={openTag} onOpenChange={setOpenTag}>
              <PopoverTrigger asChild>
                <div className="flex-1 flex items-center gap-2 px-2 cursor-text h-full">
                  <Tag size={18} className="text-gray-400 shrink-0" />

                  {/* Tanlangan tag chap tomonda */}
                  {selectedTag && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-2 capitalize shrink-0"
                    >
                      {selectedTag}
                      <X
                        size={14}
                        className="cursor-pointer ml-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagRemove();
                        }}
                      />
                    </Badge>
                  )}

                  <input
                    className="outline-none text-sm flex-1 h-full bg-transparent"
                    placeholder={
                      selectedTag
                        ? t("pages.hero.search.change_tag")
                        : t("pages.hero.search.search_placeholder")
                    }
                    value={tagSearch}
                    onChange={(e) => setTagSearch(e.target.value)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="p-4 w-64"
                align="start"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <Command>
                  <CommandList>
                    {isTagsLoading && (
                      <div className="p-4 text-center">
                        {t("common.loading")}...
                      </div>
                    )}
                    {!isTagsLoading &&
                      fetchedTags.length === 0 &&
                      debouncedTagSearch.length > 0 && (
                        <div className="py-6 text-center text-sm">
                          {t("common.no_tags_found")}
                        </div>
                      )}
                    <CommandGroup>
                      {fetchedTags.map((tag: ITag) => (
                        <CommandItem
                          className="capitalize"
                          key={tag._id}
                          onSelect={() => handleTagSelect(tag.value)}
                          value={tag.value}
                        >
                          {tag.value}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="h-8 w-[1px] bg-gray-200" />

            {/* Category Dropdown */}
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-xl">
                  {selectedFilterCategory === "all"
                    ? t("common.category")
                    : t(`categories.${selectedFilterCategory}`)}
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-1">
                <div
                  className="p-2 hover:bg-accent cursor-pointer rounded-md text-sm"
                  onClick={() => {
                    setSelectedFilterCategory("all");
                    setOpenCategory(false);
                  }}
                >
                  {t("common.all")}
                </div>
                {categories.map((cat: Category) => (
                  <div
                    key={cat.category}
                    className="p-2 hover:bg-accent cursor-pointer rounded-md text-sm flex justify-between"
                    onClick={() => {
                      setSelectedFilterCategory(cat.category);
                      setOpenCategory(false);
                    }}
                  >
                    <span>{t(`categories.${cat.category}`)}</span>
                    <span className="text-gray-400">({cat.count})</span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>

            {/* Rooms Dropdown */}
            <Popover open={openRooms} onOpenChange={setOpenRooms}>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="rounded-xl">
                  {t("common.bedrooms")} & {t("common.bathrooms")}
                  <ChevronsUpDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 shadow-xl">
                {renderRoomFilter}
              </PopoverContent>
            </Popover>

            <Button
              onClick={handleSearch}
              className="bg-yellow-400 hover:bg-yellow-500 text-black h-12 px-8 rounded-xl font-bold"
            >
              <Search size={20} className="mr-2" />
              {t("common.search")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
