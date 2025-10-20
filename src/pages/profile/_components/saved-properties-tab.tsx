import { useEffect } from "react";
import { useSaveStore } from "@/stores/save.store";
import PropertyCard from "@/components/common/cards/property-card";
import { Loader } from "lucide-react";

export default function SavedPropertiesTab() {
  const { savedProperties, isLoading, fetchSavedProperties } = useSaveStore();

  useEffect(() => {
    fetchSavedProperties();
  }, [fetchSavedProperties]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div className="text-center h-48 flex justify-center items-center">
        <p>Sizda saqlangan mulklar mavjud emas.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {savedProperties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
}
