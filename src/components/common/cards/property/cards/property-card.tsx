import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  Calendar,
  Shield,
  Zap,
  Car,
  Wind,
} from "lucide-react";
import type { PropertyType } from "@/interfaces/property/property.interface";
import HeartButton from "@/components/common/buttons/heart-button";
import EllipsisVerticalButton from "@/components/common/buttons/ellipsis-vertical-button";

interface PropertyCardProps {
  property: PropertyType;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  if (!property) return null;

  const isRent =
    "contract_duration_months" in property &&
    property.category === "APARTMENT_RENT";

  const formatPrice = () => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: property.currency,
      minimumFractionDigits: 0,
    }).format(property.price);
  };

  const getPropertyTypeText = () => {
    if (isRent) {
      return "Apartment for Rent";
    }
    return "Apartment for Sale";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {/* Premium badge */}
      {property.is_premium && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
            <Zap className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>
      )}

      {/* Verified badge */}
      {property.is_verified && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm">
            <Shield className="h-3 w-3 mr-1 text-green-600" />
            Verified
          </Badge>
        </div>
      )}

      {/* Image section */}
      <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-300">
        {property.photos && property.photos.length > 0 ? (
          <img
            src={property.photos[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}

        {/* Action buttons - top right */}
        <div className="absolute top-2 right-2 flex gap-2">
          <HeartButton property={property} />
          <EllipsisVerticalButton property={property} />
        </div>
      </div>

      {/* Content section */}
      <CardContent className="p-4">
        {/* Price and Rating */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice()}
              {isRent && (
                <span className="text-sm font-normal text-gray-600">
                  /month
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">{getPropertyTypeText()}</div>
          </div>

          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{property.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{property.address}</span>
        </div>

        {/* Property features */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {property.bedrooms !== undefined && (
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
              <Bed className="h-5 w-5 text-gray-600 mb-1" />
              <span className="text-sm font-medium">{property.bedrooms}</span>
              <span className="text-xs text-gray-500">Bed</span>
            </div>
          )}

          {property.bathrooms !== undefined && (
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
              <Bath className="h-5 w-5 text-gray-600 mb-1" />
              <span className="text-sm font-medium">{property.bathrooms}</span>
              <span className="text-xs text-gray-500">Bath</span>
            </div>
          )}

          {property.area !== undefined && (
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
              <Square className="h-5 w-5 text-gray-600 mb-1" />
              <span className="text-sm font-medium">{property.area}m²</span>
              <span className="text-xs text-gray-500">Area</span>
            </div>
          )}

          {property.floor_level !== undefined && (
            <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
              <div className="text-sm font-medium">
                {property.floor_level}
                {property.total_floors && `/${property.total_floors}`}
              </div>
              <span className="text-xs text-gray-500">Floor</span>
            </div>
          )}
        </div>

        {/* Amenities badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {property.balcony && (
            <Badge variant="secondary" className="text-xs">
              Balcony
            </Badge>
          )}
          {property.furnished && (
            <Badge variant="secondary" className="text-xs">
              Furnished
            </Badge>
          )}
          {property.parking && (
            <Badge variant="secondary" className="text-xs">
              <Car className="h-3 w-3 mr-1" />
              Parking
            </Badge>
          )}
          {property.elevator && (
            <Badge variant="secondary" className="text-xs">
              {/* <Elevator className="h-3 w-3 mr-1" /> */}
              Elevator
            </Badge>
          )}
          {property.air_conditioning && (
            <Badge variant="secondary" className="text-xs">
              <Wind className="h-3 w-3 mr-1" />
              AC
            </Badge>
          )}
          {isRent && property.contract_duration_months && (
            <Badge variant="secondary" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              {property.contract_duration_months} months
            </Badge>
          )}
        </div>

        {/* Additional info */}
        {property.repair_type && (
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Repair: </span>
            {property.repair_type}
          </div>
        )}

        {property.heating && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">Heating: </span>
            {property.heating}
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          Listed {formatDate(property.createdAt)}
        </div>

        {/* Display likes and saves count */}
        <div className="flex gap-3">
          {(property.liked > 0 || property.saved > 0) && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              {property.liked > 0 && (
                <span className="flex items-center">
                  <Star className="h-3 w-3 mr-1 text-amber-500" />
                  {property.liked} likes
                </span>
              )}
              {property.saved > 0 && (
                <span className="flex items-center">
                  <svg
                    className="h-3 w-3 mr-1 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  {property.saved} saves
                </span>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
