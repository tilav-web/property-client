import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useParams } from "react-router-dom";

import ApartmentSale from "./_components/apartment-sale";
import ApartmentRent from "./_components/apartment-rent";
import GenericProperty from "./_components/generic-property";
import Messages from "@/components/common/messages";
import MortgageCalculator from "@/components/common/mortgage-calculator";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";
import type { IApartmentRent } from "@/interfaces/property/categories/apartment-rent.interface";

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

  const isSale = property.category?.endsWith("_SALE");

  if (property.category === "APARTMENT_SALE") {
    return (
      <>
        <ApartmentSale apartment={property as IApartmentSale} />
        <MortgageCalculator price={property.price} currency={property.currency} />
        <Messages propertyId={id} />
      </>
    );
  }

  if (property.category === "APARTMENT_RENT") {
    return (
      <>
        <ApartmentRent apartment={property as IApartmentRent} />
        <Messages propertyId={id} />
      </>
    );
  }

  // COMMERCIAL, HOVLI, LAND, GARAGE — barcha qolgan kategoriyalar
  return (
    <>
      <GenericProperty property={property} />
      {isSale && (
        <MortgageCalculator price={property.price} currency={property.currency} />
      )}
      <Messages propertyId={id} />
    </>
  );
}
