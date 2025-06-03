import { DashboardV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getDashboardStats = async () => {
  const url = queryString.stringifyUrl({
    url: DashboardV1.GET_DASHBOARD_STATS,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getDashboardCampaignsStats = async () => {
  const url = queryString.stringifyUrl({
    url: DashboardV1.GET_DASHBOARD_CAMPAIGNS_STATS,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getDashboardDonationsStats = async () => {
  const url = queryString.stringifyUrl({
    url: DashboardV1.GET_DASHBOARD_DONATIONS_STATS,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getDashboardRecentActivities = async () => {
  const url = queryString.stringifyUrl({
    url: DashboardV1.GET_DASHBOARD_RECENT_ACTIVITIES,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getDashboardTopCampaigns = async () => {
  const url = queryString.stringifyUrl({
    url: DashboardV1.GET_DASHBOARD_TOP_CAMPAIGNS,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getDashboardUserGrowth = async () => {
  const url = queryString.stringifyUrl({
    url: DashboardV1.GET_DASHBOARD_USER_GROWTH,
  });
  const { data } = await requestInstance.get(url);
  return data;
};
