import { Badge } from "@/components/ui/badge";
import type { IProperty } from "@/interfaces/property.interface";
import type { IUser } from "@/interfaces/user.interface";
import { Heart, MapPin, Star } from "lucide-react";

export default function PropertyMiniCard({
  property,
}: {
  property: IProperty & { author: IUser };
}) {
  return (
    <div className="rounded-md shadow-xl h-full overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="w-full h-48 relative">
        <img
          className="w-full h-full object-cover"
          src={property?.images[0]}
          alt={property?.title}
        />
        <div className="absolute top-2 flex items-center justify-between w-full px-2">
          {property?.is_guest_choice ? (
            <Badge className="rounded border-white bg-black/50 text-white uppercase text-xs">
              Mehmon tanlovi
            </Badge>
          ) : (
            <span></span>
          )}
          <button className="p-1 rounded bg-white/40 border">
            <Heart size={18} />
          </button>
        </div>
        <button className="border-white border p-2 rounded bg-white/60 absolute right-2 bottom-2">
          <MapPin size={18} />
        </button>
      </div>
      
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <p className="font-semibold text-sm line-clamp-2 flex-1 mr-2">
            {property?.title}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.round(property?.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm">{property?.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <MapPin size={14} />
          <p className="text-xs line-clamp-1">{property?.address}</p>
        </div>
        
        <p className="font-bold text-lg">
          {property?.price.toLocaleString()} {property?.currency}
          {property?.price_type === "umumiy summa" ? "" : " / oy"}
        </p>
      </div>
    </div>
  );
}