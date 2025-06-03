import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getDashboardCampaignsStats,
  getDashboardDonationsStats,
  getDashboardRecentActivities,
  getDashboardTopCampaigns,
  getDashboardUserGrowth,
} from "@/services/dashboardService";

const queryFns = {
  stats: getDashboardStats,
  "campaigns-stats": getDashboardCampaignsStats,
  "donations-stats": getDashboardDonationsStats,
  "recent-activities": getDashboardRecentActivities,
  "top-campaigns": getDashboardTopCampaigns,
  "user-growth": getDashboardUserGrowth,
};

export const useDashboard = (type) => {
  return useQuery({
    queryKey: [`dashboard-${type}`],
    queryFn: () => queryFns[type](),
  });
};
