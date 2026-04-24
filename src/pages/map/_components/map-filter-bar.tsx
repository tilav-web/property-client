import { useCallback, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

const AMENITIES = [
  { value: "pool", labelKey: "amenities.pool", fallback: "Pool" },
  { value: "balcony", labelKey: "amenities.balcony", fallback: "Balcony" },
  { value: "security", labelKey: "amenities.security", fallback: "Security" },
  {
    value: "air_conditioning",
    labelKey: "amenities.air_conditioning",
    fallback: "A/C",
  },
  { value: "parking", labelKey: "amenities.parking", fallback: "Parking" },
  { value: "elevator", labelKey: "amenities.elevator", fallback: "Elevator" },
] as const;

const BEDROOMS = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;

const SORT_OPTIONS = [
  { value: "newest", labelKey: "sort.newest", fallback: "Newest" },
  { value: "price_asc", labelKey: "sort.price_asc", fallback: "Price ↑" },
  { value: "price_desc", labelKey: "sort.price_desc", fallback: "Price ↓" },
  { value: "rating", labelKey: "sort.rating", fallback: "Top rated" },
] as const;

const CATEGORIES = [
  { key: "all", labelKey: "common.all" },
  { key: "APARTMENT_SALE", labelKey: "common.buy" },
  { key: "APARTMENT_RENT", labelKey: "common.rent_apartments" },
] as const;

function Chip({
  label,
  hasValue,
  children,
}: {
  label: string;
  hasValue?: boolean;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm whitespace-nowrap transition-colors",
            hasValue
              ? "border-blue-500 bg-blue-50 font-medium text-blue-700"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
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

export default function MapFilterBar() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentBedrooms = searchParams.getAll("bedrooms");
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentAmenities = searchParams.getAll("amenities");
  const currentFurnished = searchParams.get("furnished") === "true";
  const currentSort = searchParams.get("sort") || "";

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        next.delete(key);
        if (value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => next.append(key, v));
        } else if (value) {
          next.set(key, value);
        }
      });
      setSearchParams(next);
    },
    [searchParams, setSearchParams],
  );

  const toggleBedroom = (room: string) => {
    const next = currentBedrooms.includes(room)
      ? currentBedrooms.filter((r) => r !== room)
      : [...currentBedrooms, room];
    updateParams({ bedrooms: next });
  };

  const toggleAmenity = (a: string) => {
    const next = currentAmenities.includes(a)
      ? currentAmenities.filter((x) => x !== a)
      : [...currentAmenities, a];
    updateParams({ amenities: next });
  };

  const activeCount =
    (currentCategory !== "all" ? 1 : 0) +
    (currentBedrooms.length > 0 ? 1 : 0) +
    (currentMinPrice || currentMaxPrice ? 1 : 0) +
    (currentAmenities.length > 0 ? 1 : 0) +
    (currentFurnished ? 1 : 0) +
    (currentSort && currentSort !== "newest" ? 1 : 0);

  const clearAll = () => {
    const keep = new URLSearchParams();
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat) keep.set("lat", lat);
    if (lng) keep.set("lng", lng);
    setSearchParams(keep);
  };

  const priceLabel =
    currentMinPrice || currentMaxPrice
      ? `${currentMinPrice || "0"} — ${currentMaxPrice || "∞"}`
      : t("pages.map_page.filters.price", "Price");

  const bedroomsLabel =
    currentBedrooms.length > 0
      ? `${t("pages.map_page.filters.beds", "Beds")}: ${currentBedrooms.join(",")}`
      : t("pages.map_page.filters.beds", "Beds");

  return (
    <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto rounded-full border border-gray-200 bg-white/95 p-1.5 shadow-lg backdrop-blur-sm">
      <SlidersHorizontal size={16} className="ml-2 text-gray-400 shrink-0" />

      {/* Category */}
      <div className="flex gap-1 rounded-full bg-gray-100 p-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() =>
              updateParams({ category: c.key === "all" ? null : c.key })
            }
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap",
              currentCategory === c.key
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      {/* Price */}
      <Chip label={priceLabel} hasValue={!!(currentMinPrice || currentMaxPrice)}>
        <div className="space-y-3">
          <p className="text-sm font-semibold">
            {t("pages.map_page.filters.price_range", "Price range")}
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              placeholder={t("common.min", "Min")}
              defaultValue={currentMinPrice}
              onBlur={(e) => updateParams({ minPrice: e.target.value || null })}
              className="h-9 w-full rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-500"
            />
            <span className="text-gray-400">—</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder={t("common.max", "Max")}
              defaultValue={currentMaxPrice}
              onBlur={(e) => updateParams({ maxPrice: e.target.value || null })}
              className="h-9 w-full rounded-md border border-gray-200 px-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
          {(currentMinPrice || currentMaxPrice) && (
            <button
              type="button"
              onClick={() => updateParams({ minPrice: null, maxPrice: null })}
              className="text-xs text-blue-600 hover:underline"
            >
              {t("common.clear", "Clear")}
            </button>
          )}
        </div>
      </Chip>

      {/* Bedrooms */}
      <Chip label={bedroomsLabel} hasValue={currentBedrooms.length > 0}>
        <div className="space-y-2">
          <p className="text-sm font-semibold">
            {t("pages.map_page.filters.bedrooms", "Bedrooms")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {BEDROOMS.map((room) => {
              const active = currentBedrooms.includes(room);
              return (
                <button
                  key={room}
                  type="button"
                  onClick={() => toggleBedroom(room)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    active
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  {room === "7" ? "7+" : room}
                </button>
              );
            })}
          </div>
        </div>
      </Chip>

      {/* Amenities */}
      <Chip
        label={t("pages.map_page.filters.amenities", "Amenities")}
        hasValue={currentAmenities.length > 0}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold">
            {t("pages.map_page.filters.amenities", "Amenities")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {AMENITIES.map((a) => {
              const active = currentAmenities.includes(a.value);
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAmenity(a.value)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    active
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  {t(a.labelKey, a.fallback)}
                </button>
              );
            })}
          </div>
        </div>
      </Chip>

      {/* More (furnished, sort) */}
      <Chip
        label={t("pages.map_page.filters.more", "More")}
        hasValue={currentFurnished || (!!currentSort && currentSort !== "newest")}
      >
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm">
              {t("pages.map_page.filters.furnished", "Furnished")}
            </span>
            <input
              type="checkbox"
              checked={currentFurnished}
              onChange={(e) =>
                updateParams({ furnished: e.target.checked ? "true" : null })
              }
              className="h-4 w-4 accent-blue-500"
            />
          </label>

          <div>
            <p className="mb-2 text-sm font-semibold">
              {t("pages.map_page.filters.sort", "Sort")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SORT_OPTIONS.map((s) => {
                const active = currentSort === s.value;
                return (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() =>
                      updateParams({
                        sort: active || s.value === "newest" ? null : s.value,
                      })
                    }
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-colors",
                      active
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    {t(s.labelKey, s.fallback)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Chip>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="ml-1 flex h-8 items-center gap-1 rounded-full bg-red-50 px-3 text-xs font-medium text-red-600 hover:bg-red-100 shrink-0"
        >
          <X size={14} />
          {t("common.clear_all", "Clear")}
          <span className="rounded-full bg-red-100 px-1.5">{activeCount}</span>
        </button>
      )}
    </div>
  );
}
