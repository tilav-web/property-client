import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { PropertyType } from "@/interfaces/property/property.interface";

export default function PropertyCard({ property }: { property: PropertyType }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/property/${property._id}`)}
      className="cursor-pointer overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-muted overflow-hidden">
        {property.photos?.length ? (
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

        {/* Premium badge */}
        {property.is_premium && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-amber-500 hover:bg-amber-600">
              Premium
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
          {property.title}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <p className="text-lg font-bold text-primary">
            {property.price.toLocaleString()} {property.currency.toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">
            {property.category.replace("_", " ").toLowerCase()}
          </p>
        </div>

        {/* Address */}
        <div className="flex gap-2 text-sm text-muted-foreground mt-auto">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="line-clamp-2">
            {property.address || "Manzil ko‘rsatilmagan"}
          </p>
        </div>
      </div>
    </Card>
  );
}
