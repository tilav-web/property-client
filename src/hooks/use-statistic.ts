
import { useQuery } from "@tanstack/react-query";
import { statisticService } from "@/services/statistic.service";

export const useDashboardStatistics = () => {
  return useQuery({
    queryKey: ["dashboard-statistics"],
    queryFn: () => statisticService.getDashboard(),
  });
};
