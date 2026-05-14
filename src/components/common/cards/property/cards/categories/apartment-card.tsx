import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { isNewProperty } from "@/utils/is-new-property";
import { MapPin, Star, Bed, Bath, Square, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeartButton from "@/components/common/buttons/heart-button";
import type { PropertyType } from "@/interfaces/property/property.interface";
import Price from "@/components/common/price";
import DistanceBadge from "@/components/common/distance-badge";

export default function ApartmentCard({
  property,
}: {
  readonly property: PropertyType;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <article className="group rounded-2xl bg-card overflow-hidden border border-border/60 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {property.photos && property.photos.length > 0 && (
          <img
            className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-105"
            src={property.photos[0]}
            alt={property.title}
            loading="lazy"
            onClick={() => navigate(`/property/${property._id}`)}
          />
        )}

        {/* Save heart */}
        <div className="absolute top-3 right-3">
          <HeartButton property={property} />
        </div>

        {/* Map quick link */}
        {property.location?.coordinates && (
          <button
            onClick={() =>
              navigate(
                `/map?lng=${property.location.coordinates[0]}&lat=${property.location.coordinates[1]}`,
              )
            }
            className="absolute right-3 bottom-3 size-9 rounded-full bg-card/90 backdrop-blur hover:bg-card hover:scale-110 transition-all flex items-center justify-center shadow-card"
            aria-label="Show on map"
          >
            <MapPin size={14} className="text-foreground/70" />
          </button>
        )}

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isNewProperty(property?.createdAt) && (
            <Badge variant="secondary" className="shadow-sm">
              <Sparkles className="size-2.5 mr-1" />
              {t("pages.property_card.new")}
            </Badge>
          )}
          {property.is_premium && (
            <Badge variant="default" className="shadow-sm">
              <Star className="size-2.5 mr-1 fill-current" />
              {t("pages.property_card.premium")}
            </Badge>
          )}
          <DistanceBadge distanceMeters={property.distance_m} />
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display text-base leading-tight line-clamp-1 flex-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          {property.rating > 0 && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="text-xs font-semibold">
                {property.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin size={12} className="flex-shrink-0" />
          <p className="text-xs line-clamp-1">{property.address}</p>
        </div>

        {/* Property attributes */}
        <div className="flex items-center gap-3 text-xs text-foreground/70 mb-3">
          {property.bedrooms && property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="size-3.5" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms && property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath className="size-3.5" />
              {property.bathrooms}
            </span>
          )}
          {property.area && property.area > 0 && (
            <span className="flex items-center gap-1">
              <Square className="size-3.5" />
              {property.area} m²
            </span>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-border/60">
          <Price
            amount={property.price}
            currency={property.currency}
            className="text-base"
            originalClassName="text-xs"
            layout="stacked"
          />
        </div>
      </div>
    </article>
  );
}
