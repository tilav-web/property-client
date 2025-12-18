import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";
import type { PropertyType } from "@/interfaces/property/property.interface"; // Import PropertyType

export default function PropertyCard({ property }: { property: PropertyType }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        {property.photos && property.photos.length > 0 ? (
          <img
            src={property.photos[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {property.is_premium && (
            <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
          {property.title}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-bold text-primary">
            ${property.price?.toLocaleString()} {property.currency}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {property.category}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">
              {property.address || property.address || "Unknown location"}
            </p>
            {/* region and district are not directly available, using address instead */}
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex gap-4 pt-3 border-t border-border mt-auto">
          {"bedrooms" in property &&
            property.bedrooms !== undefined &&
            property.bedrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
          {"bathrooms" in property &&
            property.bathrooms !== undefined &&
            property.bathrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
          {property.area !== undefined && property.area > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Ruler className="w-4 h-4" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
