import { Link } from "react-router-dom";
import type { IProperty } from "@/interfaces/property/property.interface";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface PropertyCardProps {
  property: IProperty;
  className?: string;
}

export default function PropertyCard({
  property,
  className,
}: PropertyCardProps) {
  const { t } = useTranslation();
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
  } = property;

  const isNew =
    new Date(createdAt).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000; // 3 days

  const renderCategorySpecifics = () => {
    if (
      "bedrooms" in property &&
      "bathrooms" in property &&
      property.bedrooms &&
      property.bathrooms
    ) {
      return (
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <div className="flex items-center mr-4">
            <Bed className="w-4 h-4 mr-1 text-gray-400" />
            <span>{String(property.bedrooms)}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1 text-gray-400" />
            <span>{String(property.bathrooms)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getImageUrl = (photo: string) => {
    if (photo.startsWith("http")) {
      return photo;
    }
    return `${import.meta.env.VITE_API_URL}/uploads/photos/${photo}`;
  };

  return (
    <Link
      to={`/property/${_id}`}
      className={cn("block group", className)}
    >
      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
        <div className="aspect-[4/3] relative">
          <img
            src={photos?.[0] ? getImageUrl(photos[0]) : "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex gap-2">
            {is_premium && (
              <Badge className="bg-yellow-400 text-black hover:bg-yellow-500">
                Premium
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-blue-500 text-white hover:bg-blue-600">
                New
              </Badge>
            )}
          </div>
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-bold text-lg truncate">{title}</h3>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xl font-bold text-gray-800">
              {new Intl.NumberFormat("en-US").format(price)}{" "}
              <span className="text-sm font-normal text-gray-500">
                {currency}
              </span>
            </p>
            <Badge variant="outline" className="capitalize">
              {t(`categories.${category}`)}
            </Badge>
          </div>
          <div className="flex items-start text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1 mt-0.5 text-gray-400 shrink-0" />
            <p className="truncate">{address}</p>
          </div>
          {renderCategorySpecifics()}
        </div>
      </div>
    </Link>
  );
}
