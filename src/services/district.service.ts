import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class DistrictService {
  async findAll() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.DISTRICT.base);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAllByRegionCode(code: string) {
    try {
      const res = await apiInstance.get(
        `${API_ENDPOINTS.DISTRICT.base}/region/code/${code}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAllByRegionId(id: string) {
    try {
      const res = await apiInstance.get(
        `${API_ENDPOINTS.DISTRICT.base}/region/id/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const districtService = new DistrictService();
