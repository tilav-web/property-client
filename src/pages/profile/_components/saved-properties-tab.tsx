import { useSaveStore } from "@/stores/save.store";
import PropertyCard from "@/components/common/cards/property/cards/property-card";
import { Loader, BookmarkX } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SavedPropertiesTab() {
  const { savedProperties, isLoading } = useSaveStore();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-600">
          {t("common.loading")}
        </p>
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div className="text-center h-64 flex flex-col justify-center items-center">
        <div className="mb-4 p-4 bg-blue-50 rounded-full inline-block">
          <BookmarkX className="h-8 w-8 text-blue-600" />
        </div>
        <p className="text-lg font-semibold text-gray-900 mb-2">
          {t("pages.profile_page.saved_properties_empty")}
        </p>
        <p className="text-gray-600 text-sm">
          {t("pages.profile_page.saved_properties_empty_description")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {savedProperties.map((item) => (
        <PropertyCard key={item._id} property={item.property} />
      ))}
    </div>
  );
}
