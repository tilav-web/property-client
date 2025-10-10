import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class RegionService {
  async findAll() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.REGION.base);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const regionService = new RegionService();
