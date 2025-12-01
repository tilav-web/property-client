import type { AmenitiesType } from "@/interfaces/types/amenities.type";
import type { HeatingType } from "@/interfaces/types/heating.type";
import type { RepairType } from "@/interfaces/types/repair.type";
import type { IProperty } from "../property.interface";

export interface IApartmentRent extends IProperty {
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
