import PropertyCard from "@/components/common/cards/property-card";
import { property, user } from "@/constants/mack-data";

export default function Favorites() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <PropertyCard property={{ ...property, author: user }} />
      <PropertyCard property={{ ...property, author: user }} />
      <PropertyCard property={{ ...property, author: user }} />
      <PropertyCard property={{ ...property, author: user }} />
    </div>
  );
}
