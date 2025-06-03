import { useQuery } from "@tanstack/react-query";
import { getCampaigns } from "../services/campaignService";

export const useCampaign = (filters) => {
  return useQuery({
    queryKey: ["campaigns", filters],
    queryFn: () => getCampaigns(filters),
  });
};
