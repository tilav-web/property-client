import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Ruler } from "lucide-react";

interface Property {
  _id: string;
  title: { uz: string; ru: string; en: string };
  description: { uz: string; ru: string; en: string };
  category: string;
  purpose: string;
  price: number;
  currency: string;
  price_type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: { type: string; coordinates: [number, number] };
  address: { uz: string; ru: string; en: string };
  region: string;
  district: string;
  is_premium: boolean;
  is_verified: boolean;
  rating: number;
  amenities: string[];
  banner?: { url: string };
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        {property.banner?.url ? (
          <img
            src={property.banner.url || "/placeholder.svg"}
            alt={property.title.en}
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
          {property.is_verified && (
            <Badge className="bg-green-500 hover:bg-green-600">Verified</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
          {property.title.en}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-bold text-primary">
            ${property.price.toLocaleString()} {property.currency}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {property.purpose.replace("_", " ")}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-foreground">{property.region}</p>
            <p className="text-xs">{property.district}</p>
          </div>
        </div>

        {/* Info Bar */}
        <div className="flex gap-4 pt-3 border-t border-border mt-auto">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Bed className="w-4 h-4" />
              <span>{property.bedrooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Bath className="w-4 h-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          {property.area > 0 && (
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
