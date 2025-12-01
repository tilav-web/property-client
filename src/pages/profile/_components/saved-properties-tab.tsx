import { useSaveStore } from "@/stores/save.store";
import PropertyCard from "@/components/common/cards/property/cards/property-card";
import { Loader } from "lucide-react";

export default function SavedPropertiesTab() {
  const { savedProperties, isLoading } = useSaveStore();

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
    <div className="grid grid-cols-1 gap-4">
      {savedProperties.map((item) => (
        <PropertyCard key={item._id} property={item.property} />
      ))}
    </div>
  );
}
