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
    <div className="p-2 max-w-[302px] rounded-md shadow-xl">
      <div className="w-[285px] h-[240px] relative">
        <img
          className="w-full h-full object-cover"
          src={property?.images[0]}
          alt={property?.title}
        />
        <div className="absolute top-1 flex items-center justify-between w-full px-2">
          {property?.is_guest_choice && (
            <Badge className="rounded border-white bg-black/50 text-white uppercase">
              Выбор гостей
            </Badge>
          )}
          <button className="p-1 rounded bg-white/40 border">
            <Heart size={18} />
          </button>
        </div>
        <button className="border-white border p-2 rounded bg-white/60 absolute right-2 bottom-1">
          <MapPin size={18} />
        </button>
      </div>
      <div>
        <div className="flex items-start justify-between">
          <p>{property?.title}</p>
          <div className="flex items-center pr-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={
                    i < Math.round(property?.rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span>{property?.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-60 mb-4">
          <MapPin />
          <p>{property?.address}</p>
        </div>
        <p className="font-bold">
          {property?.price.toLocaleString()} {property?.currency}{" "}
          {property?.price_type === "umumiy summa" ? "" : "за месяц"}
        </p>
      </div>
    </div>
  );
}
