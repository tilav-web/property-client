import React, { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, ChevronDown, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useDebounce } from "use-debounce";
import { tagService } from "@/services/tag.service";
import type { ITag } from "@/interfaces/tag/tag.interface";
import { CURRENCIES, SUPPORTED_CURRENCIES } from "@/constants/currencies";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NearMeToggle, {
  DEFAULT_NEAR_ME_RADIUS,
  type NearMeState,
} from "@/components/common/near-me-toggle";

const AMENITIES = [
  { value: "pool", labelKey: "amenities.pool", fallback: "Pool" },
  { value: "balcony", labelKey: "amenities.balcony", fallback: "Balcony" },
  { value: "security", labelKey: "amenities.security", fallback: "Security" },
  { value: "air_conditioning", labelKey: "amenities.air_conditioning", fallback: "A/C" },
  { value: "parking", labelKey: "amenities.parking", fallback: "Parking" },
  { value: "elevator", labelKey: "amenities.elevator", fallback: "Elevator" },
] as const;

const SORT_OPTIONS = [
  { value: "newest", labelKey: "sort.newest", fallback: "Newest" },
  { value: "oldest", labelKey: "sort.oldest", fallback: "Oldest" },
  { value: "price_asc", labelKey: "sort.price_asc", fallback: "Price ↑" },
  { value: "price_desc", labelKey: "sort.price_desc", fallback: "Price ↓" },
  { value: "rating", labelKey: "sort.rating", fallback: "Top rated" },
  { value: "popular", labelKey: "sort.popular", fallback: "Most popular" },
] as const;
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const BEDROOMS = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
const BATHROOMS = ["1", "2", "3", "4", "5", "6", "7"] as const;
const TAG_DEBOUNCE_MS = 300;

const CATEGORY_TABS = [
  { key: "all", label: "common.all" },
  { key: "APARTMENT_RENT", label: "common.rent_apartments" },
  { key: "APARTMENT_SALE", label: "common.buy" },
] as const;

function FilterChip({
  label,
  children,
  hasValue,
}: {
  label: string;
  children: React.ReactNode;
  hasValue?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors",
            hasValue
              ? "border-yellow-400 bg-yellow-50 font-medium text-yellow-800"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
          )}
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

const SearchFilterHeader: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [openTag, setOpenTag] = useState(false);
  const [tagSearch, setTagSearch] = useState("");
  const [debouncedTagSearch] = useDebounce(tagSearch, TAG_DEBOUNCE_MS);

  // URL dan joriy filterlarni o'qish
  const currentTag = searchParams.get("tag") || "";
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || searchParams.get("filterCategory") || "all";
  const currentBedrooms = searchParams.getAll("bedrooms");
  const currentBathrooms = searchParams.getAll("bathrooms");
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentMinArea = searchParams.get("minArea") || "";
  const currentMaxArea = searchParams.get("maxArea") || "";
  const currentFurnished = searchParams.get("furnished") === "true";
  const currentParking = searchParams.get("parking") === "true";
  const currentIsNew = searchParams.get("is_new") === "1";
  const currentIsPremium = searchParams.get("is_premium") === "true";
  const currentCurrency = searchParams.get("currency") || "";
  const currentAmenities = searchParams.getAll("amenities");
  const currentSort = searchParams.get("sort") || "newest";
  const currentNearEnabled = searchParams.get("near") === "1";
  const currentNearRadius =
    Number(searchParams.get("radius")) || DEFAULT_NEAR_ME_RADIUS;

  const { data: fetchedTags = [], isFetching: isTagsLoading } = useQuery({
    queryKey: ["tags", debouncedTagSearch],
    queryFn: () => tagService.findTags(debouncedTagSearch),
    enabled: debouncedTagSearch.length > 0,
  });

  const updateSearchParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        newParams.delete(key);
        if (value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v));
        } else if (value) {
          newParams.set(key, value);
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handleTagSelect = useCallback(
    (tag: string) => {
      updateSearchParams({ tag });
      setTagSearch("");
      setOpenTag(false);
    },
    [updateSearchParams]
  );

  const removeTag = useCallback(() => {
    updateSearchParams({ tag: null });
  }, [updateSearchParams]);

  const clearAll = () => setSearchParams(new URLSearchParams());

  // Active filter count
  const activeFilterCount =
    (currentTag ? 1 : 0) +
    (currentSearch ? 1 : 0) +
    (currentCategory !== "all" ? 1 : 0) +
    (currentBedrooms.length > 0 ? 1 : 0) +
    (currentBathrooms.length > 0 ? 1 : 0) +
    (currentMinPrice || currentMaxPrice ? 1 : 0) +
    (currentMinArea || currentMaxArea ? 1 : 0) +
    (currentFurnished ? 1 : 0) +
    (currentParking ? 1 : 0) +
    (currentIsNew ? 1 : 0) +
    (currentIsPremium ? 1 : 0) +
    (currentCurrency ? 1 : 0) +
    (currentAmenities.length > 0 ? 1 : 0) +
    (currentSort && currentSort !== "newest" ? 1 : 0) +
    (currentNearEnabled ? 1 : 0);

  const handleNearMeChange = useCallback(
    (state: NearMeState) => {
      if (state.enabled) {
        updateSearchParams({
          near: "1",
          radius: String(state.radius),
          // Near me ishlaydi → sort=distance. Eski sort holatiga qaytish uchun
          // foydalanuvchi toggle ni o'chiradi.
          sort: "distance",
        });
      } else {
        updateSearchParams({
          near: null,
          radius: null,
          // Sort distance edi — uni default ga qaytaramiz.
          sort: currentSort === "distance" ? null : currentSort,
        });
      }
    },
    [updateSearchParams, currentSort],
  );

  const commitOnEnter =
    (key: string) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        updateSearchParams({ [key]: e.currentTarget.value || null });
      }
    };

  return (
    <div className="w-full rounded-xl border bg-white shadow-sm">
      {/* Category tabs */}
      <div className="flex items-center gap-1 border-b px-4 pt-3">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() =>
              updateSearchParams({
                category: tab.key === "all" ? null : tab.key,
                filterCategory: null,
              })
            }
            className={cn(
              "rounded-t-lg px-4 py-2.5 text-sm font-medium transition-colors",
              currentCategory === tab.key
                ? "border-b-2 border-yellow-400 bg-yellow-50 text-yellow-800"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            )}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>

      {/* Search + filters row */}
      <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        {/* Tag search */}
        <div className="relative min-w-0 flex-1">
          <Popover open={openTag} onOpenChange={setOpenTag}>
            <PopoverTrigger asChild>
              <div className="relative flex items-center">
                <Tag
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                {currentTag && (
                  <Badge
                    variant="secondary"
                    className="absolute left-10 top-1/2 z-10 -translate-y-1/2 capitalize"
                  >
                    {currentTag}
                    <X
                      size={14}
                      className="ml-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag();
                      }}
                    />
                  </Badge>
                )}
                <input
                  placeholder={
                    currentTag ? "" : t("pages.main_page.search_filters.location_placeholder")
                  }
                  className={cn(
                    "h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pr-4 text-sm outline-none transition-colors focus:border-yellow-500 focus:bg-white",
                    currentTag ? "pl-32" : "pl-10"
                  )}
                  value={tagSearch}
                  onChange={(e) => {
                    setTagSearch(e.target.value);
                    setOpenTag(true);
                  }}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 p-1"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <Command>
                <CommandList>
                  {isTagsLoading && (
                    <div className="p-4 text-center text-sm">
                      {t("common.loading")}
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
                        className="cursor-pointer capitalize"
                      >
                        {tag.value}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Beds & Baths */}
          <FilterChip
            label={t("pages.main_page.search_filters.beds_baths")}
            hasValue={currentBedrooms.length > 0 || currentBathrooms.length > 0}
          >
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-semibold">{t("pages.main_page.search_filters.beds")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {BEDROOMS.map((room) => (
                    <button
                      key={room}
                      type="button"
                      onClick={() => {
                        const newBeds = currentBedrooms.includes(room)
                          ? currentBedrooms.filter((b) => b !== room)
                          : [...currentBedrooms, room];
                        updateSearchParams({ bdr: newBeds });
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                        currentBedrooms.includes(room)
                          ? "border-yellow-500 bg-yellow-400 text-black"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {room === "0" ? t("pages.main_page.search_filters.studio") : room === "7" ? "7+" : room}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold">{t("pages.main_page.search_filters.baths")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {BATHROOMS.map((room) => (
                    <button
                      key={room}
                      type="button"
                      onClick={() => {
                        const newBaths = currentBathrooms.includes(room)
                          ? currentBathrooms.filter((b) => b !== room)
                          : [...currentBathrooms, room];
                        updateSearchParams({ bthr: newBaths });
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                        currentBathrooms.includes(room)
                          ? "border-yellow-500 bg-yellow-400 text-black"
                          : "border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {room === "7" ? "7+" : room}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </FilterChip>

          {/* Price */}
          <FilterChip
            label={t("pages.main_page.search_filters.price")}
            hasValue={!!(currentMinPrice || currentMaxPrice)}
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold">{t("pages.main_page.search_filters.price")}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={t("pages.main_page.search_filters.min")}
                  defaultValue={currentMinPrice}
                  onBlur={(e) => updateSearchParams({ minPrice: e.target.value || null })}
                  onKeyDown={commitOnEnter("minPrice")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder={t("pages.main_page.search_filters.max")}
                  defaultValue={currentMaxPrice}
                  onBlur={(e) => updateSearchParams({ maxPrice: e.target.value || null })}
                  onKeyDown={commitOnEnter("maxPrice")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          </FilterChip>

          {/* Currency */}
          <FilterChip
            label={
              currentCurrency
                ? `${CURRENCIES[currentCurrency as keyof typeof CURRENCIES]?.symbol ?? currentCurrency}`
                : t("pages.main_page.search_filters.currency", {
                    defaultValue: "Currency",
                  })
            }
            hasValue={!!currentCurrency}
          >
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                {t("pages.main_page.search_filters.currency", {
                  defaultValue: "Currency",
                })}
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateSearchParams({ currency: null })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                    !currentCurrency
                      ? "border-yellow-500 bg-yellow-50 text-yellow-800"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  )}
                >
                  {t("common.all")}
                </button>
                {SUPPORTED_CURRENCIES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => updateSearchParams({ currency: code })}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      currentCurrency === code
                        ? "border-yellow-500 bg-yellow-50 text-yellow-800"
                        : "border-gray-200 text-gray-700 hover:border-gray-300"
                    )}
                  >
                    {CURRENCIES[code].symbol} ({code})
                  </button>
                ))}
              </div>
            </div>
          </FilterChip>

          {/* Area */}
          <FilterChip
            label={t("pages.main_page.search_filters.area_sqft")}
            hasValue={!!(currentMinArea || currentMaxArea)}
          >
            <div className="space-y-3">
              <p className="text-sm font-semibold">{t("pages.main_page.search_filters.area_sqft")}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={t("pages.main_page.search_filters.min")}
                  defaultValue={currentMinArea}
                  onBlur={(e) => updateSearchParams({ minArea: e.target.value || null })}
                  onKeyDown={commitOnEnter("minArea")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  placeholder={t("pages.main_page.search_filters.max")}
                  defaultValue={currentMaxArea}
                  onBlur={(e) => updateSearchParams({ maxArea: e.target.value || null })}
                  onKeyDown={commitOnEnter("maxArea")}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          </FilterChip>

          {/* Amenities */}
          <FilterChip
            label={t("pages.main_page.search_filters.amenities")}
            hasValue={
              currentFurnished || currentParking || currentAmenities.length > 0
            }
          >
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={currentFurnished}
                  onChange={(e) =>
                    updateSearchParams({
                      furnished: e.target.checked ? "true" : null,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 accent-yellow-500"
                />
                <span className="text-sm">
                  {t("pages.main_page.search_filters.furnished")}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={currentParking}
                  onChange={(e) =>
                    updateSearchParams({
                      parking: e.target.checked ? "true" : null,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300 accent-yellow-500"
                />
                <span className="text-sm">
                  {t("pages.main_page.search_filters.with_parking")}
                </span>
              </label>
              <div className="pt-2 border-t">
                <p className="mb-2 text-xs font-semibold text-gray-500">
                  {t("pages.main_page.search_filters.amenities")}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {AMENITIES.map((a) => {
                    const checked = currentAmenities.includes(a.value);
                    return (
                      <label
                        key={a.value}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? currentAmenities.filter((v) => v !== a.value)
                              : [...currentAmenities, a.value];
                            updateSearchParams({
                              amenities: next.length ? next : null,
                            });
                          }}
                          className="h-4 w-4 rounded border-gray-300 accent-yellow-500"
                        />
                        <span className="text-sm">
                          {t(a.labelKey, { defaultValue: a.fallback })}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </FilterChip>

          {/* More toggles */}
          <button
            type="button"
            onClick={() =>
              updateSearchParams({
                is_new: currentIsNew ? null : "1",
              })
            }
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              currentIsNew
                ? "border-yellow-400 bg-yellow-50 text-yellow-800"
                : "border-gray-200 text-gray-700 hover:border-gray-300"
            )}
          >
            {t("common.new")}
          </button>

          <button
            type="button"
            onClick={() =>
              updateSearchParams({
                is_premium: currentIsPremium ? null : "true",
              })
            }
            className={cn(
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              currentIsPremium
                ? "border-yellow-400 bg-yellow-50 text-yellow-800"
                : "border-gray-200 text-gray-700 hover:border-gray-300"
            )}
          >
            {t("common.premium")}
          </button>

          {/* Near me */}
          <NearMeToggle
            enabled={currentNearEnabled}
            radius={currentNearRadius}
            onChange={handleNearMeChange}
          />

          {/* Sort */}
          <Select
            value={currentNearEnabled ? "distance" : currentSort}
            onValueChange={(v) =>
              updateSearchParams({ sort: v === "newest" ? null : v })
            }
            disabled={currentNearEnabled}
          >
            <SelectTrigger className="h-10 w-[150px] text-sm">
              <SelectValue>
                {currentNearEnabled
                  ? t("common.near_me.by_distance", {
                      defaultValue: "By distance",
                    })
                  : t(
                      SORT_OPTIONS.find((s) => s.value === currentSort)
                        ?.labelKey ?? "sort.newest",
                      {
                        defaultValue:
                          SORT_OPTIONS.find((s) => s.value === currentSort)
                            ?.fallback ?? "Newest",
                      },
                    )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {t(s.labelKey, { defaultValue: s.fallback })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="ml-auto gap-1 text-gray-500"
            >
              <X size={14} />
              {t("common.clear_all")} ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      {/* Active filter badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-t bg-gray-50/50 px-4 py-3">
          <span className="text-xs text-gray-400">{t("common.active_filters")}:</span>

          {currentTag && (
            <Badge variant="secondary" className="gap-1 capitalize">
              {currentTag}
              <X size={12} className="cursor-pointer" onClick={() => removeTag()} />
            </Badge>
          )}
          {currentSearch && (
            <Badge variant="secondary" className="gap-1">
              "{currentSearch}"
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ search: null })}
              />
            </Badge>
          )}
          {currentCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {t(`categories.${currentCategory}`)}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ category: null, filterCategory: null })}
              />
            </Badge>
          )}
          {currentBedrooms.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {t("pages.main_page.search_filters.beds")}: {currentBedrooms.join(", ")}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ bdr: [] })}
              />
            </Badge>
          )}
          {currentBathrooms.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {t("pages.main_page.search_filters.baths")}: {currentBathrooms.join(", ")}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ bthr: [] })}
              />
            </Badge>
          )}
          {(currentMinPrice || currentMaxPrice) && (
            <Badge variant="secondary" className="gap-1">
              {t("pages.main_page.search_filters.price")}: {currentMinPrice || "0"} — {currentMaxPrice || "∞"}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ minPrice: null, maxPrice: null })}
              />
            </Badge>
          )}
          {currentCurrency && (
            <Badge variant="secondary" className="gap-1">
              {CURRENCIES[currentCurrency as keyof typeof CURRENCIES]?.symbol ?? currentCurrency}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ currency: null })}
              />
            </Badge>
          )}
          {currentAmenities.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {currentAmenities
                .map(
                  (a) =>
                    AMENITIES.find((x) => x.value === a)?.fallback ?? a,
                )
                .join(", ")}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ amenities: null })}
              />
            </Badge>
          )}
          {currentSort && currentSort !== "newest" && !currentNearEnabled && (
            <Badge variant="secondary" className="gap-1">
              {SORT_OPTIONS.find((s) => s.value === currentSort)?.fallback ??
                currentSort}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ sort: null })}
              />
            </Badge>
          )}
          {currentNearEnabled && (
            <Badge variant="secondary" className="gap-1">
              📍 {currentNearRadius} km
              <X
                size={12}
                className="cursor-pointer"
                onClick={() =>
                  handleNearMeChange({
                    enabled: false,
                    radius: currentNearRadius,
                    lat: null,
                    lng: null,
                  })
                }
              />
            </Badge>
          )}
          {(currentMinArea || currentMaxArea) && (
            <Badge variant="secondary" className="gap-1">
              {t("pages.main_page.search_filters.area_sqft")}: {currentMinArea || "0"} — {currentMaxArea || "∞"}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ minArea: null, maxArea: null })}
              />
            </Badge>
          )}
          {currentFurnished && (
            <Badge variant="secondary" className="gap-1">
              {t("pages.main_page.search_filters.furnished")}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ furnished: null })}
              />
            </Badge>
          )}
          {currentParking && (
            <Badge variant="secondary" className="gap-1">
              {t("pages.main_page.search_filters.with_parking")}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ parking: null })}
              />
            </Badge>
          )}
          {currentIsNew && (
            <Badge variant="secondary" className="gap-1">
              {t("common.new")}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ is_new: null })}
              />
            </Badge>
          )}
          {currentIsPremium && (
            <Badge variant="secondary" className="gap-1">
              {t("common.premium")}
              <X
                size={12}
                className="cursor-pointer"
                onClick={() => updateSearchParams({ is_premium: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilterHeader;
