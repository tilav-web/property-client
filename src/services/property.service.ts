import type { CategoryFilterType } from "@/interfaces/types/category-filter.type";
import type { CategoryType } from "@/interfaces/types/category.type";
import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

export interface FindAllParams {
  page?: number;
  limit?: number;
  lng?: number; // New parameter
  lat?: number; // New parameter
  category?: CategoryType;
  search?: string;
  is_premium?: boolean;
  is_new?: boolean;
  rating?: number;
  radius?: number;
  sample?: boolean;
  bedrooms?: number[];
  bathrooms?: number[];
  filterCategory?: CategoryFilterType;
  sw_lng?: number;
  sw_lat?: number;
  ne_lng?: number;
  ne_lat?: number;
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

  async findMyProperties({
    search,
    page,
    limit,
  }: {
    search?: string;
    page: number;
    limit: number;
  }) {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.PROPERTIES.my, {
        params: { search, page, limit },
      });
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

  async remove(id: string) {
    try {
      const res = await apiInstance.delete(
        `${API_ENDPOINTS.PROPERTIES.base}/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCategories() {
    try {
      const res = await apiInstance.get(
        `${API_ENDPOINTS.PROPERTIES.base}/categories/list`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const propertyService = new PropertyService();
