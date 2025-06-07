import { getReports } from "@/services/reportService";
import { useQuery } from "@tanstack/react-query";

export const useReport = (filters) => {
  return useQuery({
    queryKey: ["reports", filters],
    queryFn: () => getReports(filters),
  });
};
