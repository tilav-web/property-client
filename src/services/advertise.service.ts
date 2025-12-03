import type { AdvertiseType } from "@/interfaces/advertise/advertise.interface";
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

  async findMy() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.ADVERTISE.base);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOneByType(type: AdvertiseType) {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.ADVERTISE.type(type));
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export const advertiseService = new AdvertiseService();
