import { Link } from "react-router-dom";
import type { IProperty } from "@/interfaces/property/property.interface";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Star, 
  Heart, 
  Eye,
  Square,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface PropertyCardProps {
  property: IProperty;
  className?: string;
}

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
    liked,
    saved,
    description,
  } = property;

  const isNew =
    new Date(createdAt).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days

  const getImageUrl = (photo: string) => {
    if (photo.startsWith("http")) {
      return photo;
    }
    return `${import.meta.env.VITE_API_URL}/uploads/photos/${photo}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return price.toLocaleString();
  };

  const isRent = category.includes('RENT');
  const isSale = category.includes('SALE');

  const formatAddress = (address: string) => {
    const maxLength = 40;
    if (address.length > maxLength) {
      return address.substring(0, maxLength) + "...";
    }
    return address;
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    // Bu yerda API chaqiruvini qo'shishingiz mumkin
  };

  const propertyData = property as any;
  const hasBedBath = propertyData.bedrooms && propertyData.bathrooms;

  return (
    <Link
      to={`/property/${_id}`}
      className={cn("block group", className)}
    >
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 h-full flex flex-col">
        {/* Image Section - Fixed Height */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={photos?.[0] ? getImageUrl(photos[0]) : "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {is_premium && (
              <Badge className="bg-amber-500 text-white border-0 px-3 py-1 rounded-lg shadow-md">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {t('common.premium')}
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-red-500 text-white border-0 px-3 py-1 rounded-lg shadow-md">
                <Calendar className="w-3 h-3 mr-1" />
                {t('common.new')}
              </Badge>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-md"
            aria-label={t('common.save_property')}
          >
            <Heart 
              className={cn(
                "w-5 h-5 transition-colors duration-200",
                isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
              )} 
            />
          </button>
        </div>

        {/* Content Section - Flexible Height */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category and Price Section */}
          <div className="flex items-start justify-between mb-3">
            <Badge 
              variant={isRent ? "outline" : "default"} 
              className="capitalize font-medium px-3 py-1"
            >
              {t(`categories.${category}`)}
            </Badge>
            
            <div className="text-right">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(price)}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {currency.toUpperCase()}
                </span>
              </div>
              {isRent && (
                <span className="text-xs text-gray-400">
                  /{t('common.month')}
                </span>
              )}
            </div>
          </div>

          {/* Title - Fixed height with line-clamp */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors min-h-[1.75rem]">
            {title}
          </h3>

          {/* Address - Fixed height with line-clamp */}
          <div className="flex items-start gap-2 mb-3 min-h-[1.5rem]">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-1 flex-1">
              {formatAddress(address)}
            </p>
          </div>

          {/* Description - Fixed height with line-clamp */}
          <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1 min-h-[2.5rem]">
            {description}
          </p>

          {/* Property Features - Fixed height */}
          <div className="mb-4 min-h-[2rem]">
            {hasBedBath && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <Bed className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {propertyData.bedrooms} {t('common.bedrooms')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-gray-100">
                    <Bath className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {propertyData.bathrooms} {t('common.bathrooms')}
                  </span>
                </div>
                
                {propertyData.area && (
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-gray-100">
                      <Square className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {propertyData.area} {t('common.sqft')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Stats - Fixed height */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{liked || 0}</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Heart className="w-4 h-4" />
                <span>{saved || 0}</span>
              </div>
              
              {rating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-gray-800">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <Badge variant="secondary" className="text-xs font-normal">
              {new Date(createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-300 rounded-xl pointer-events-none transition-colors duration-300" />
      </div>
    </Link>
  );
}