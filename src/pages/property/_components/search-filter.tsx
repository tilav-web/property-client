import React, { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, ChevronsUpDown, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { tagService } from "@/services/tag.service";
import type { ITag } from "@/interfaces/tag/tag.interface";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

const BEDROOMS = ["1", "2", "3", "4", "5", "6", "7+"] as const;
const BATHROOMS = ["1", "2", "3", "4", "5", "6", "7+"] as const;
const MAX_TAGS = 4;
const TAG_DEBOUNCE_MS = 300;

const SearchFilterHeader: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // States for Tag Search
  const [openTag, setOpenTag] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [debouncedTagSearch] = useDebounce(tagSearch, TAG_DEBOUNCE_MS);

  // URL'dan joriy filterlarni o'qish
  const currentTags = searchParams.getAll("tag");
  const currentCategory = searchParams.get("category") || "all";
  const currentBedrooms = searchParams.getAll("bdr");
  const currentBathrooms = searchParams.getAll("bthr");

  // Kategoriyalarni olish
  const { data: categories = [] } = useQuery({
    queryKey: ["category-counts"],
    queryFn: propertyService.getCategories,
    staleTime: 5 * 60 * 1000,
  });

  // Tag'larni qidirish
  const { data: fetchedTags = [], isFetching: isTagsLoading } = useQuery({
    queryKey: ["tags", debouncedTagSearch],
    queryFn: () => tagService.findTags(debouncedTagSearch),
    enabled: debouncedTagSearch.length > 0,
  });

  // Filterlarni o'zgartirish funksiyasi
  const updateSearchParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        newParams.delete(key); // avval o'chirib
        if (value === null) {
          // hech nima qo'shmaslik
        } else if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v));
        } else if (value) {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Tag tanlash funksiyasi
  const handleTagSelect = useCallback(
    (tag: string) => {
      if (currentTags.length < MAX_TAGS && !currentTags.includes(tag)) {
        updateSearchParams({ tag: [...currentTags, tag] });
      }
      setTagSearch("");
      setOpenTag(false);
    },
    [currentTags, updateSearchParams]
  );

  // Bitta filter o'chirish (badge X tugmasi uchun)
  const removeFilter = (key: string, value?: string) => {
    if (key === "category") {
      updateSearchParams({ category: "all" });
    } else if (key === "tag" && value) {
      updateSearchParams({ tag: currentTags.filter((t) => t !== value) });
    } else if (key === "bdr" && value) {
      updateSearchParams({ bdr: currentBedrooms.filter((b) => b !== value) });
    } else if (key === "bthr" && value) {
      updateSearchParams({ bthr: currentBathrooms.filter((b) => b !== value) });
    }
  };

  // Hammasini tozalash
  const clearAll = () => {
    setSearchParams(new URLSearchParams());
  };

  // Faol filterlar soni
  const activeFilterCount =
    (currentTags.length > 0 ? 1 : 0) +
    (currentCategory !== "all" ? 1 : 0) +
    (currentBedrooms.length > 0 ? 1 : 0) +
    (currentBathrooms.length > 0 ? 1 : 0);

  return (
    <div className="w-full border-b bg-white sticky top-0 z-40">
      {/* Asosiy filter qatori */}
      <div className="flex items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          {/* Tag qidirish inputi */}
          <Popover open={openTag} onOpenChange={setOpenTag}>
            <PopoverTrigger asChild>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  placeholder={t("pages.hero.search.search_placeholder")}
                  className="pl-10 h-10 w-64"
                  value={tagSearch}
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                    setOpenTag(true);
                  }}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="p-1 w-64"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList>
                  {isTagsLoading && (
                    <div className="p-4 text-center text-sm">
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
                        key={tag._id}
                        onSelect={() => handleTagSelect(tag.value)}
                        value={tag.value}
                        disabled={currentTags.includes(tag.value)}
                        className={cn(
                          "cursor-pointer",
                          currentTags.includes(tag.value) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {tag.value}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Kategoriya */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {currentCategory === "all"
                  ? t("common.category")
                  : t(`categories.${currentCategory}`)}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="start">
              <div
                onClick={() => updateSearchParams({ category: "all" })}
                className={cn(
                  "px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent",
                  currentCategory === "all" && "bg-accent"
                )}
              >
                {t("common.all")}
              </div>
              {categories.map((cat: { category: string; count: number }) => (
                <div
                  key={cat.category}
                  onClick={() => updateSearchParams({ category: cat.category })}
                  className={cn(
                    "px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent flex justify-between",
                    currentCategory === cat.category && "bg-accent"
                  )}
                >
                  <span>{t(`categories.${cat.category}`)}</span>
                  <span className="text-muted-foreground">({cat.count})</span>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          {/* Xonalar (Bedrooms) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {t("common.bedrooms")}
                {currentBedrooms.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {currentBedrooms.length}
                  </Badge>
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <div className="flex flex-wrap gap-2">
                {BEDROOMS.map((room) => (
                  <Button
                    key={room}
                    size="sm"
                    variant={
                      currentBedrooms.includes(room) ? "default" : "outline"
                    }
                    onClick={() => {
                      const newBedrooms = currentBedrooms.includes(room)
                        ? currentBedrooms.filter((b) => b !== room)
                        : [...currentBedrooms, room];
                      updateSearchParams({ bdr: newBedrooms });
                    }}
                  >
                    {room}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Hammomlar (Bathrooms) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {t("common.bathrooms")}
                {currentBathrooms.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5">
                    {currentBathrooms.length}
                  </Badge>
                )}
                <ChevronsUpDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <div className="flex flex-wrap gap-2">
                {BATHROOMS.map((room) => (
                  <Button
                    key={room}
                    size="sm"
                    variant={
                      currentBathrooms.includes(room) ? "default" : "outline"
                    }
                    onClick={() => {
                      const newBathrooms = currentBathrooms.includes(room)
                        ? currentBathrooms.filter((b) => b !== room)
                        : [...currentBathrooms, room];
                      updateSearchParams({ bthr: newBathrooms });
                    }}
                  >
                    {room}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* O'ng taraf - Clear All */}
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <>
              <Badge variant="secondary">
                {activeFilterCount} {t("common.filters")}
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <X className="h-4 w-4 mr-1" />
                {t("common.clear_all")}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Faol filterlar (badges) */}
      {(currentTags.length > 0 ||
        currentCategory !== "all" ||
        currentBedrooms.length > 0 ||
        currentBathrooms.length > 0) && (
        <div className="px-4 pb-3 pt-3 border-t bg-gray-50">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">
              {t("common.active_filters")}:
            </span>

            {/* Tags */}
            {currentTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1 py-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter("tag", tag)}
                />
              </Badge>
            ))}

            {/* Category */}
            {currentCategory !== "all" && (
              <Badge variant="secondary" className="gap-1 py-1">
                {t(`categories.${currentCategory}`)}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeFilter("category")}
                />
              </Badge>
            )}

            {/* Bedrooms */}
            {currentBedrooms.length > 0 && (
              <Badge variant="secondary" className="gap-1 py-1">
                {t("common.bedrooms")}: {currentBedrooms.join(", ")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateSearchParams({ bdr: [] })}
                />
              </Badge>
            )}

            {/* Bathrooms */}
            {currentBathrooms.length > 0 && (
              <Badge variant="secondary" className="gap-1 py-1">
                {t("common.bathrooms")}: {currentBathrooms.join(", ")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateSearchParams({ bthr: [] })}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilterHeader;
