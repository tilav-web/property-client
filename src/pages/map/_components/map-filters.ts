import type { FindAllParams, SortOption } from "@/services/property.service";
import type { CategoryType } from "@/interfaces/types/category.type";
import type { CurrencyCode } from "@/constants/currencies";

export function escapeHtml(value: string | number | undefined | null): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const parseNumberArray = (values: string[]): number[] =>
  values
    .map((v) => Number(v))
    .filter((n): n is number => Number.isFinite(n));

export function buildMapFilters(
  params: URLSearchParams,
): Partial<FindAllParams> {
  const out: Partial<FindAllParams> = {};

  const category = params.get("category");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const furnished = params.get("furnished");
  const currency = params.get("currency");
  const sort = params.get("sort");
  const amenities = params.getAll("amenities");
  const bedrooms = parseNumberArray(params.getAll("bedrooms"));
  const bathrooms = parseNumberArray(params.getAll("bathrooms"));
  const search = params.get("search")?.trim();
  const is_premium = params.get("is_premium");

  if (category && category !== "all") out.category = category as CategoryType;
  if (minPrice) out.minPrice = Number(minPrice);
  if (maxPrice) out.maxPrice = Number(maxPrice);
  if (furnished === "true") out.furnished = true;
  if (currency) out.currency = currency as CurrencyCode;
  if (sort) out.sort = sort as SortOption;
  if (amenities.length) out.amenities = amenities;
  if (bedrooms.length) out.bedrooms = bedrooms;
  if (bathrooms.length) out.bathrooms = bathrooms;
  if (search) out.search = search;
  if (is_premium === "true") out.is_premium = true;

  return out;
}

export function filterSignature(filters: Partial<FindAllParams>): string {
  const keys = Object.keys(filters).sort();
  const parts: string[] = [];
  keys.forEach((key) => {
    const v = (filters as Record<string, unknown>)[key];
    if (v === undefined) return;
    if (Array.isArray(v)) parts.push(`${key}=${[...v].sort().join(",")}`);
    else parts.push(`${key}=${String(v)}`);
  });
  return parts.join("&");
}
