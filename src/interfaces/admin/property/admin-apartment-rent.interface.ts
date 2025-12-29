import type { AmenitiesType } from "@/interfaces/types/amenities.type";
import type { HeatingType } from "@/interfaces/types/heating.type";
import type { RepairType } from "@/interfaces/types/repair.type";
import type { IAdminProperty } from "./admin-property.interface";

export interface IAdminApartmentRent extends IAdminProperty {
  bedrooms?: number;
  bathrooms?: number;
  floor_level?: number;
  total_floors?: number;
  area?: number;
  balcony?: boolean;
  furnished?: boolean;
  repair_type?: RepairType;
  heating?: HeatingType;
  air_conditioning?: boolean;
  parking?: boolean;
  elevator?: boolean;
  amenities?: AmenitiesType[];
  contract_duration_months?: number;
  mortgage_available?: boolean;
}
