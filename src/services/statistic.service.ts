
import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class StatisticService {
  async getSellerStatistics() {
    try {
      const res = await apiInstance.get(API_ENDPOINTS.STATISTICS.seller);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const statisticService = new StatisticService();
