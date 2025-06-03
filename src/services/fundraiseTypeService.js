import { FundraiseTypeV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getFundraiseTypes = async () => {
  const url = queryString.stringifyUrl({
    url: FundraiseTypeV1.GET_FUNDRAISE_TYPES,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const createFundraiseType = async (data) => {
  const url = queryString.stringifyUrl({
    url: FundraiseTypeV1.CREATE_FUNDRAISE_TYPE,
  });
  const response = await requestInstance.post(url, data);
  return response;
};

export const updateFundraiseType = async (id, data) => {
  const url = queryString.stringifyUrl({
    url: `${FundraiseTypeV1.UPDATE_FUNDRAISE_TYPE}/${id}`,
  });
  const response = await requestInstance.patch(url, data);
  return response;
};

export const deleteFundraiseType = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${FundraiseTypeV1.DELETE_FUNDRAISE_TYPE}/${id}`,
  });
  const response = await requestInstance.delete(url);
  return response;
};
