import type {
  ConstructionStatus,
  PropertyCategory,
  PropertyPriceType,
} from "@/interfaces/property.interface";
import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

export interface FindAllParams {
  page?: number;
  limit?: number;
  region?: string;
  district?: string;
  coordinates?: [number, number];
  category?: PropertyCategory;
  search?: string;
  price_type?: PropertyPriceType;
  construction_status?: ConstructionStatus;
  is_premium?: boolean;
  is_verified?: boolean;
  is_new?: boolean;
  is_guest_choice?: boolean;
  rating?: number;
  radius?: number;
  sample?: boolean;
}

class PropertyService {
  async findAll(params: FindAllParams) {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.PROPERTIES.base, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const propertyService = new PropertyService();
