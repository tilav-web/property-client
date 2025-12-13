import type { IProperty } from "@/interfaces/property/property.interface";
import type { CategoryType } from "@/interfaces/types/category.type";
import { Link } from "react-router-dom";
import {
  MapPin,
  Star,
  Heart,
  Building,
  BadgeCheck,
  Eye,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export default function HeaderSearchPropertyCard({
  property,
}: {
  property: IProperty;
}) {
  const { t } = useTranslation();

  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get category label
  const getCategoryLabel = (category: CategoryType) => {
    switch (category) {
      case "APARTMENT_SALE":
        return t("categories.APARTMENT_SALE");
      case "APARTMENT_RENT":
        return t("categories.APARTMENT_RENT");
      default:
        return category;
    }
  };

  // Get category badge variant
  const getCategoryBadgeVariant = (
    category: CategoryType
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (category) {
      case "APARTMENT_SALE":
        return "destructive";
      case "APARTMENT_RENT":
        return "default";
      default:
        return "outline";
    }
  };

  // Get first image from photos array
  const getFirstImage = () => {
    if (property.photos && property.photos.length > 0) {
      // Agar photo full URL bo'lsa to'gridan-to'g'ri ishlatamiz
      return property.photos[0];
    }
    return null;
  };

  return (
    <Link
      to={`/property/${property._id}`}
      className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group bg-white"
    >
      {/* Property Image */}
      <div className="flex-shrink-0 relative">
        <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100">
          {getFirstImage() ? (
            <img
              src={getFirstImage() ?? ""}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="h-10 w-10 text-gray-400" />
            </div>
          )}
        </div>

        {/* Premium badge */}
        {property.is_premium && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5">
              <Star className="h-2.5 w-2.5 mr-1" />
              {t("common.premium")}
            </Badge>
          </div>
        )}

        {/* Verified badge */}
        {property.is_verified && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-0.5">
              <BadgeCheck className="h-2.5 w-2.5 mr-1" />
              {t("common.verified")}
            </Badge>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
          {property.title}
        </h3>

        {/* Category Badge */}
        <div className="mb-2">
          <Badge
            variant={getCategoryBadgeVariant(property.category)}
            className="text-xs"
          >
            {getCategoryLabel(property.category)}
          </Badge>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 text-xs mb-2">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 mb-2">
          <span className="font-bold text-lg text-green-700">
            {property.price.toLocaleString("en-US")} so'm
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          {/* Likes and Saves */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  property.liked > 0
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400"
                )}
              />
              <span>{property.liked}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-blue-400" />
              <span>{property.saved || 0}</span>
            </div>
            {property.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                <span>{property.rating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(property.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
