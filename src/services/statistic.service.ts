import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";

class StatisticService {
  async getDashboard() {
    const res = await apiInstance.get(API_ENDPOINTS.STATISTICS.dashboard);
    return res.data;
  }
}

export const statisticService = new StatisticService();
