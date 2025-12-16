import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useParams } from "react-router-dom";

import ApartmentSale from "./_components/apartment-sale";
import ApartmentRent from "./_components/apartment-rent";
import Messages from "@/components/common/messages";
import MortgageCalculator from "@/components/common/mortgage-calculator";

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
    return (
      <>
        <ApartmentSale apartment={property} />
        <MortgageCalculator price={property.price} />
        <Messages propertyId={id} />
      </>
    );
  }

  if (property.category === "APARTMENT_RENT") {
    return (
      <>
        <ApartmentRent apartment={property} />
        <Messages propertyId={id} />
      </>
    );
  }

  return <div>Category not supported</div>;
}
