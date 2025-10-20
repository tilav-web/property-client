import { useTranslation } from "react-i18next";
import PropertyCard from "@/components/common/cards/property-card";
import type { IProperty } from "@/interfaces/property.interface";
import { Heart } from "lucide-react";
import BoxLoading from "@/components/common/loadings/box-loading";
import { useLikeStore } from "@/stores/like.store";
import { useEffect } from "react";

export default function Favorites() {
  const { t } = useTranslation();
  const { likedProperties, isLoading, fetchLikedProperties } = useLikeStore();

  useEffect(() => {
    fetchLikedProperties();
  }, [fetchLikedProperties]);

  if (isLoading) {
    return <BoxLoading />;
  }

  if (!likedProperties || likedProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        {/* Icon */}
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {t("pages.favorites_page.no_favorites")}
        </h2>

        {/* Description */}
        <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
          {t("pages.favorites_page.no_favorites_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("pages.favorites_page.title")}
        </h1>
        <p className="text-gray-600">
          {t("pages.favorites_page.item_count", { count: likedProperties?.length })}
        </p>
      </div>

      {/* Properties Grid */}
      <div className="flex flex-col gap-4">
        {likedProperties.map((property: IProperty) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </div>
  );
}
