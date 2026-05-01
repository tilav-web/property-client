import { useTranslation } from "react-i18next";
import PropertyCard from "@/components/common/cards/property/cards/property-card";
import { Heart } from "lucide-react";
import BoxLoading from "@/components/common/loadings/box-loading";
import { useLikeStore } from "@/stores/like.store";

export default function Favorites() {
  const { t } = useTranslation();
  const { likedProperties, isLoading } = useLikeStore();

  if (isLoading) {
    return <BoxLoading />;
  }

  if (!likedProperties || likedProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-muted-foreground" />
        </div>

        <h2 className="font-display text-3xl text-foreground mb-3">
          {t("pages.favorites_page.no_favorites")}
        </h2>

        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          {t("pages.favorites_page.no_favorites_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6 w-full">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-foreground mb-2">
          {t("pages.favorites_page.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("pages.favorites_page.item_count", {
            count: likedProperties?.length,
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {likedProperties?.map((item) => (
          <PropertyCard key={item?.property?._id} property={item?.property} />
        ))}
      </div>
    </div>
  );
}
