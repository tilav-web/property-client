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

  async findAll(params: {
    page: number;
    limit: number;
    sort?: Record<string, 1 | -1>;
  }) {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.ADVERTISE.base, {
        params,
      });
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async incrementView(id: string) {
    try {
      await apiInstance.put(`${API_ENDPOINTS.ADVERTISE.base}/${id}/view`);
    } catch (error) {
      console.error('Failed to increment view count', error);
    }
  }

  async incrementClick(id: string) {
    try {
      await apiInstance.put(`${API_ENDPOINTS.ADVERTISE.base}/${id}/click`);
    } catch (error) {
      console.error('Failed to increment click count', error);
    }
  }
}
export const advertiseService = new AdvertiseService();
