import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class AdvertiseService {
  async create(dto: FormData) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.ADVERTISE.base, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async priceCalculus(days: string) {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.ADVERTISE.priceCalculus, {
        params: {
          days,
        },
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const advertiseService = new AdvertiseService();
