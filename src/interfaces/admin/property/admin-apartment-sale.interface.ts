import type { AmenitiesType } from "@/interfaces/types/amenities.type";
import type { HeatingType } from "@/interfaces/types/heating.type";
import type { RepairType } from "@/interfaces/types/repair.type";
import type { IAdminProperty } from "./admin-property.interface";

export interface IAdminApartmentSale extends IAdminProperty {
  bedrooms?: number;
  bathrooms?: number;
  floor_level?: number;
  total_floors?: number;
  area?: number;
  furnished?: boolean;
  repair_type?: RepairType;
  heating?: HeatingType;
  amenities?: AmenitiesType[];
}
