import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Calendar,
  Zap,
  Building,
  Home,
  Heart,
  Bookmark,
} from "lucide-react";
import type { IProperty } from "@/interfaces/property/property.interface";
import HeartButton from "@/components/common/buttons/heart-button";
import EllipsisVerticalButton from "@/components/common/buttons/ellipsis-vertical-button";
import type { CategoryType } from "@/interfaces/types/category.type";

interface PropertyCardProps {
  property: IProperty;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  if (!property) return null;

  const formatPrice = () => {
    const formatted = new Intl.NumberFormat("uz-UZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price);

    return property.currency === 'rm'
      ? `RM ${formatted}`
      : `${formatted} so'm`;
  };

  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case "APARTMENT_RENT":
        return <Building className="h-4 w-4" />;
      case "APARTMENT_SALE":
        return <Home className="h-4 w-4" />;
      default:
        return <Building className="h-4 w-4" />;
    }
  };

  const getCategoryText = (category: CategoryType) => {
    switch (category) {
      case "APARTMENT_RENT":
        return "Ijaraga kvartira";
      case "APARTMENT_SALE":
        return "Sotiladigan kvartira";
      default:
        return "Mulk";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("uz-UZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-[450px] overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="relative">
        {/* Premium badge */}
        {property.is_premium && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
              <Zap className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}

        {/* Image section */}
        <div className="relative h-56 w-full bg-gradient-to-br from-gray-50 to-gray-100">
          {property.photos && property.photos.length > 0 ? (
            <img
              src={property.photos[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Building className="h-12 w-12 mb-2" />
              <span className="text-sm">Rasm mavjud emas</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="absolute z-50 bottom-3 right-3 flex gap-2">
            <HeartButton property={property} />
            <EllipsisVerticalButton property={property} />
          </div>

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Content section */}
        <CardContent className="p-5">
          {/* Price and Category */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice()}
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <Badge variant="outline" className="flex items-center gap-1.5">
                  {getCategoryIcon(property.category)}
                  <span className="text-xs font-medium">
                    {getCategoryText(property.category)}
                  </span>
                </Badge>
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-gray-900">
                  {property.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">reyting</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg mb-3 line-clamp-2 min-h-[56px] text-gray-900">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-start text-gray-600 mb-4">
            <MapPin className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="text-sm line-clamp-2">{property.address}</span>
          </div>

          {/* Description preview */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">
              {property.description}
            </p>
          </div>
        </CardContent>

        {/* Footer */}
        <CardFooter className="px-5 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(property.createdAt)}</span>
            </div>

            <div className="flex items-center gap-4">
              <button title={`Saved ${property.saved}`}>
                <Bookmark className="h-5 w-5 text-amber-400 cursor-pointer" />
              </button>
              <button title={`Liked ${property.liked}`}>
                <Heart className="h-5 w-5 text-red-400 cursor-pointer" />
              </button>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
