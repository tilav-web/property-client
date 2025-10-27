
import { useQuery } from "@tanstack/react-query";
import { statisticService } from "@/services/statistic.service";

export const useSellerStatistics = () => {
  return useQuery({
    queryKey: ["seller-statistics"],
    queryFn: () => statisticService.getSellerStatistics(),
  });
};
