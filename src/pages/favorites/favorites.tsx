import PropertyCard from "@/components/common/cards/property-card";
import { property } from "@/constants/mack-data";
import { useUserStore } from "@/stores/user.store";

export default function Favorites() {
  const { user } = useUserStore();
  return (
    <div className="flex flex-col gap-4 py-4">
      <PropertyCard property={{ ...property, author: user }} />
      <PropertyCard property={{ ...property, author: user }} />
      <PropertyCard property={{ ...property, author: user }} />
      <PropertyCard property={{ ...property, author: user }} />
    </div>
  );
}
