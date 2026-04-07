import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "use-debounce";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
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
  ChevronsUpDown,
  Filter,
  Search,
  Tag,
  X,
} from "lucide-react";

const BEDROOMS = ["1", "2", "3", "4", "5", "6", "7"] as const;
const BATHROOMS = ["1", "2", "3", "4", "5", "6", "7"] as const;
const TAG_DEBOUNCE_MS = 300;

interface Category {
  category: string;
  count: number;
}

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
      className="min-w-[45px] flex-1"
    >
      {room === "7" ? "7+" : room}
    </Button>
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

export default function HeroSearchControls() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [openRooms, setOpenRooms] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [debouncedTagSearch] = useDebounce(tagSearch, TAG_DEBOUNCE_MS);
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<string>("all");
  const [selectedBedrooms, setSelectedBedrooms] = useState<string[]>([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([]);

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
    setOpenTag(false);
  }, []);

  const handleTagRemove = useCallback(() => {
    setSelectedTag("");
    setTagSearch("");
  }, []);

  const handleSearch = useCallback(() => {
    const hasTag = !!selectedTag;
    const hasCategory =
      selectedFilterCategory && selectedFilterCategory !== "all";
    const hasBedrooms = selectedBedrooms.length > 0;
    const hasBathrooms = selectedBathrooms.length > 0;

    if (!hasTag && !hasCategory && !hasBedrooms && !hasBathrooms) {
      return;
    }

    const queryParams = new URLSearchParams();

    if (hasTag) queryParams.set("tag", selectedTag);
    if (hasCategory) queryParams.set("filterCategory", selectedFilterCategory);
    selectedBedrooms.forEach((bedroom) => queryParams.append("bdr", bedroom));
    selectedBathrooms.forEach((bathroom) =>
      queryParams.append("bthr", bathroom)
    );

    navigate(`/search?${queryParams.toString()}`);
    setMobileSearchActive(false);
  }, [
    navigate,
    selectedBathrooms,
    selectedBedrooms,
    selectedFilterCategory,
    selectedTag,
  ]);

  const renderRoomFilter = (
    <div className="flex w-full flex-col gap-4">
      <div>
        <p className="mb-2 text-sm font-semibold">{t("common.bedrooms")}</p>
        <div className="flex flex-wrap gap-2">
          {BEDROOMS.map((room) => (
            <RoomButton
              key={room}
              room={room}
              isSelected={selectedBedrooms.includes(room)}
              onToggle={() =>
                setSelectedBedrooms((prev) =>
                  prev.includes(room)
                    ? prev.filter((value) => value !== room)
                    : [...prev, room]
                )
              }
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">{t("common.bathrooms")}</p>
        <div className="flex flex-wrap gap-2">
          {BATHROOMS.map((room) => (
            <RoomButton
              key={room}
              room={room}
              isSelected={selectedBathrooms.includes(room)}
              onToggle={() =>
                setSelectedBathrooms((prev) =>
                  prev.includes(room)
                    ? prev.filter((value) => value !== room)
                    : [...prev, room]
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && !mobileSearchActive ? (
        <button
          type="button"
          onClick={() => setMobileSearchActive(true)}
          aria-label={t("common.search")}
          className="mt-6 flex w-full max-w-sm items-center rounded-full border border-white/20 bg-white/95 p-2 shadow-xl backdrop-blur"
        >
          <div className="mr-3 rounded-full bg-yellow-400 p-2 text-black">
            <Search size={18} aria-hidden="true" />
          </div>
          <span className="flex-1 text-left text-sm text-gray-500">
            {t("pages.hero.search.search_placeholder")}
          </span>
          <div className="ml-2 border-l p-2">
            <Filter size={18} className="text-gray-400" aria-hidden="true" />
          </div>
        </button>
      ) : null}

      {isMobile && mobileSearchActive ? (
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

          <div className="flex-1 space-y-6 overflow-y-auto p-4">
            <div className="space-y-3">
              <div className="relative">
                <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  placeholder={t("pages.hero.search.search_placeholder")}
                  className="h-12 pl-10 text-base"
                  value={tagSearch}
                  onChange={(event) => {
                    setTagSearch(event.target.value);
                    setOpenTag(true);
                  }}
                />
              </div>

              {selectedTag ? (
                <Badge
                  variant="secondary"
                  className="flex w-fit items-center gap-1 px-2 py-1 capitalize"
                >
                  {selectedTag}
                  <X
                    size={14}
                    className="ml-1 cursor-pointer"
                    onClick={handleTagRemove}
                  />
                </Badge>
              ) : null}

              {openTag && (tagSearch || isTagsLoading) ? (
                <div className="max-h-40 overflow-y-auto rounded-lg border bg-gray-50 p-2 shadow-inner">
                  {isTagsLoading ? (
                    <div className="p-2 text-center text-sm">
                      {t("common.loading")}...
                    </div>
                  ) : fetchedTags.length > 0 ? (
                    fetchedTags.map((tag: ITag) => (
                      <div
                        key={tag._id}
                        onClick={() => handleTagSelect(tag.value)}
                        className="cursor-pointer rounded border-b p-2 last:border-0 hover:bg-white"
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
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold">{t("common.category")}</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={
                    selectedFilterCategory === "all" ? "default" : "outline"
                  }
                  onClick={() => setSelectedFilterCategory("all")}
                  className="justify-start"
                >
                  {t("common.all")}
                </Button>
                {categories.map((category: Category) => (
                  <Button
                    key={category.category}
                    variant={
                      selectedFilterCategory === category.category
                        ? "default"
                        : "outline"
                    }
                    onClick={() => setSelectedFilterCategory(category.category)}
                    className="justify-start overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {t(`categories.${category.category}`)}
                  </Button>
                ))}
              </div>
            </div>

            {renderRoomFilter}
          </div>

          <div className="border-t bg-gray-50 p-4">
            <Button
              className="h-12 w-full bg-yellow-400 text-lg font-bold text-black hover:bg-yellow-500"
              onClick={handleSearch}
            >
              <Search className="mr-2" size={20} />
              {t("common.search")}
            </Button>
          </div>
        </div>
      ) : null}

      {!isMobile ? (
        <div className="absolute bottom-4 left-1/2 z-40 w-full max-w-5xl -translate-x-1/2 px-4">
          <div className="flex h-16 items-center gap-2 rounded-2xl border bg-white p-2 shadow-2xl">
            <Popover open={openTag} onOpenChange={setOpenTag}>
              <PopoverTrigger asChild>
                <div className="flex h-full flex-1 cursor-text items-center gap-2 px-2">
                  <Tag size={18} className="shrink-0 text-gray-400" />

                  {selectedTag ? (
                    <Badge
                      variant="secondary"
                      className="flex shrink-0 items-center gap-1 px-2 py-1 capitalize"
                    >
                      {selectedTag}
                      <X
                        size={14}
                        className="ml-1 cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTagRemove();
                        }}
                      />
                    </Badge>
                  ) : null}

                  <input
                    className="h-full flex-1 bg-transparent text-sm outline-none"
                    placeholder={
                      selectedTag
                        ? t("pages.hero.search.change_tag")
                        : t("pages.hero.search.search_placeholder")
                    }
                    value={tagSearch}
                    onChange={(event) => setTagSearch(event.target.value)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-64 p-4"
                align="start"
                onOpenAutoFocus={(event) => event.preventDefault()}
              >
                <Command>
                  <CommandList>
                    {isTagsLoading ? (
                      <div className="p-4 text-center">
                        {t("common.loading")}...
                      </div>
                    ) : null}

                    {!isTagsLoading &&
                    fetchedTags.length === 0 &&
                    debouncedTagSearch.length > 0 ? (
                      <div className="py-6 text-center text-sm">
                        {t("common.no_tags_found")}
                      </div>
                    ) : null}

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

            <div className="h-8 w-px bg-gray-200" />

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
                  className="cursor-pointer rounded-md p-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setSelectedFilterCategory("all");
                    setOpenCategory(false);
                  }}
                >
                  {t("common.all")}
                </div>
                {categories.map((category: Category) => (
                  <div
                    key={category.category}
                    className="flex cursor-pointer justify-between rounded-md p-2 text-sm hover:bg-accent"
                    onClick={() => {
                      setSelectedFilterCategory(category.category);
                      setOpenCategory(false);
                    }}
                  >
                    <span>{t(`categories.${category.category}`)}</span>
                    <span className="text-gray-400">({category.count})</span>
                  </div>
                ))}
              </PopoverContent>
            </Popover>

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
              className="h-12 rounded-xl bg-yellow-400 px-8 font-bold text-black hover:bg-yellow-500"
            >
              <Search size={20} className="mr-2" />
              {t("common.search")}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
