import { Link } from "react-router-dom";
import type { IProperty } from "@/interfaces/property/property.interface";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Star, Heart, Square, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Price from "@/components/common/price";
import DistanceBadge from "@/components/common/distance-badge";

interface PropertyCardProps {
  property: IProperty;
  className?: string;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function PropertyCard({
  property,
  className,
}: PropertyCardProps) {
  const { t } = useTranslation();
  const [isSaved, setIsSaved] = useState(false);
  const {
    _id,
    photos,
    title,
    address,
    price,
    currency,
    category,
    is_premium,
    createdAt,
    rating,
  } = property;

  const isNew =
    new Date(createdAt).getTime() > Date.now() - SEVEN_DAYS_MS;

  const getImageUrl = (photo: string) => {
    if (photo.startsWith("http")) return photo;
    return `${import.meta.env.VITE_API_URL}/uploads/photos/${photo}`;
  };

  const isRent = category.includes("RENT");

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const propertyData = property as unknown as {
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
  };
  const hasBedBath = propertyData.bedrooms && propertyData.bathrooms;

  return (
    <Link to={`/property/${_id}`} className={cn("block group", className)}>
      <article className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 border border-border/60 h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={photos?.[0] ? getImageUrl(photos[0]) : "/placeholder.svg"}
            alt={title}
            loading="lazy"
            decoding="async"
            width={800}
            height={600}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {is_premium && (
              <Badge variant="default" className="shadow-sm">
                <Star className="size-2.5 mr-1 fill-current" />
                {t("common.premium")}
              </Badge>
            )}
            {isNew && (
              <Badge variant="secondary" className="shadow-sm">
                <Sparkles className="size-2.5 mr-1" />
                {t("common.new")}
              </Badge>
            )}
            <DistanceBadge distanceMeters={property.distance_m} />
          </div>

          {/* Save heart */}
          <button
            onClick={handleSaveClick}
            className="absolute top-3 right-3 size-9 rounded-full bg-card/90 backdrop-blur hover:bg-card hover:scale-110 transition-all flex items-center justify-center shadow-card"
            aria-label={t("common.save_property")}
          >
            <Heart
              className={cn(
                "size-4 transition-all",
                isSaved
                  ? "fill-destructive text-destructive scale-110"
                  : "text-foreground/70",
              )}
            />
          </button>

          {/* Bottom rating overlay */}
          {rating > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-card/95 backdrop-blur px-2.5 py-1 text-xs font-semibold shadow-card">
              <Star className="size-3 fill-primary text-primary" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category pill */}
          <div className="mb-2">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {t(`categories.${category}`)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg leading-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Address */}
          <div className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 mt-0.5 flex-shrink-0" />
            <p className="line-clamp-1">{address}</p>
          </div>

          {/* Features */}
          {hasBedBath && (
            <div className="mt-3 flex items-center gap-3 text-xs text-foreground/70">
              <span className="flex items-center gap-1">
                <Bed className="size-3.5" />
                {propertyData.bedrooms}
              </span>
              <span className="flex items-center gap-1">
                <Bath className="size-3.5" />
                {propertyData.bathrooms}
              </span>
              {propertyData.area && (
                <span className="flex items-center gap-1">
                  <Square className="size-3.5" />
                  {propertyData.area} m²
                </span>
              )}
            </div>
          )}

          {/* Price footer */}
          <div className="mt-4 pt-3 border-t border-border/60 flex items-end justify-between gap-2">
            <Price
              amount={price}
              currency={currency}
              className="text-base"
              originalClassName="text-xs"
            />
            {isRent && (
              <span className="text-[11px] text-muted-foreground font-medium">
                / {t("common.month", "month")}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
