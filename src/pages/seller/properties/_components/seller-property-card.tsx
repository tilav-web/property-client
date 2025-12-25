import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Star,
  Camera,
  Video,
  CheckCircle2,
  Share2,
  Bookmark,
  Edit2,
  Trash2,
} from "lucide-react";
import type { IProperty } from "@/interfaces/property/property.interface";
import { useNavigate } from "react-router-dom";

interface SellerPropertyCardProps {
  property: IProperty;
  handleSelectPropertyToDelete: (propertyId: string) => void;
}

export default function SellerPropertyCard({
  property,
  handleSelectPropertyToDelete,
}: SellerPropertyCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Card Header - Image Section */}
      <div className="relative">
        {/* Property Image */}
        <div className="h-56 w-full overflow-hidden bg-gray-100">
          <img
            src={
              property.photos
                ? property.photos[
                    Math.floor(Math.random() * property.photos.length)
                  ]
                : ""
            }
            alt={property.title}
            className="h-full w-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate(`/property/${property._id}`)}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {property.is_premium && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
              Premium
            </Badge>
          )}
          {property.status === "APPROVED" && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Tasdiqlangan
            </Badge>
          )}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Category Badge */}
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {property.category.replace("_", " ")}
          </Badge>

          {/* Media Count */}
          <div className="flex items-center gap-3">
            {property.photos && property.photos.length > 0 && (
              <Badge variant="secondary" className="select-none gap-1">
                <Camera className="w-3 h-3" />
                {property.photos.length}
              </Badge>
            )}
            {property.videos && property.videos.length > 0 && (
              <Badge variant="secondary" className="select-none gap-1">
                <Video className="w-3 h-3" />
                {property.videos.length}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-4">
        {/* Price and Rating */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900">
            {property.price.toLocaleString()} so'm
          </h3>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium text-amber-700">
              {property.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1 cursor-pointer hover:text-blue-600"
          onClick={() => navigate(`/property/${property._id}`)}
        >
          {property.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {property.description}
        </p>

        {/* Address */}
        <div className="flex items-start gap-2 text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm line-clamp-2">{property.address}</p>
        </div>
      </CardContent>

      {/* Card Footer - Action Buttons */}
      <CardFooter className="bg-gray-50/50 p-3 border-t">
        <div className="flex items-center justify-between w-full gap-2">
          <Button
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            onClick={() => navigate(`/property/${property._id}`)}
          >
            Batafsil ko'rish
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-red-500 cursor-pointer">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-medium">{property.liked}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-500 cursor-pointer">
              <Bookmark className="w-4 h-4" />
              <span className="text-xs font-medium">{property.saved}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              title="Ulashish"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              title="Qo'ng'iroq"
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8 text-white"
              title="Xabar yuborish"
              onClick={() => handleSelectPropertyToDelete(property._id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}