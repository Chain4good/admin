import { ReportV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";
export const getReports = async (filters) => {
  const url = queryString.stringifyUrl({
    url: ReportV1.GET_REPORTS,
    query: {
      ...filters,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getReport = async (id) => {
  const url = queryString.stringifyUrl({
    url: ReportV1.GET_REPORT,
    query: { id },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const createReport = async (reportData) => {
  const { data } = await requestInstance.post(
    ReportV1.CREATE_REPORT,
    reportData
  );
  return data;
};
export const updateReport = async (id, reportData) => {
  const url = queryString.stringifyUrl({
    url: ReportV1.UPDATE_REPORT,
    query: { id },
  });
  const { data } = await requestInstance.put(url, reportData);
  return data;
};
export const deleteReport = async (id) => {
  const url = queryString.stringifyUrl({
    url: ReportV1.DELETE_REPORT,
    query: { id },
  });
  const { data } = await requestInstance.delete(url);
  return data;
};
