import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useParams } from "react-router-dom";

import ApartmentSale from "./_components/apartment-sale";
import ApartmentRent from "./_components/apartment-rent";

export default function Property() {
  const { id } = useParams();

  const {
    data: property,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!id) return null;
      return await propertyService.findById(id);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !property) return <div>Property not found</div>;

  if (property.category === "APARTMENT_SALE") {
    return <ApartmentSale apartment={property} />;
  }

  if (property.category === "APARTMENT_RENT") {
    return <ApartmentRent apartment={property} />;
  }

  return <div>Category not supported</div>;
}
