import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class StatisticService {
  async getSellerDashboard() {
    const res = await apiInstance.get(
      API_ENDPOINTS.STATISTICS.sellerDashboard
    );
    return res.data;
  }
}

export const statisticService = new StatisticService();