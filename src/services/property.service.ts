import type { CategoryType } from "@/interfaces/types/category.type";
import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

export interface FindAllParams {
  page?: number;
  limit?: number;
  region?: string;
  district?: string;
  coordinates?: [number, number];
  category?: CategoryType;
  search?: string;
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

  async findMyProperties() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.PROPERTIES.my);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const res = await apiInstance.get(
        `${API_ENDPOINTS.PROPERTIES.base}/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async create(dto: FormData) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.PROPERTIES.base, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const propertyService = new PropertyService();
