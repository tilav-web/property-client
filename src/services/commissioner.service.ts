import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class CommissionerService {
  async create(dto: FormData) {
    try {
      const res = await apiInstance.post(API_ENDPOINTS.COMMISSIONERS.base, dto);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const commissionerService = new CommissionerService();
