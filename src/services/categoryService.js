import { AuthV1, CategoryV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getCategories = async () => {
  const url = queryString.stringifyUrl({
    url: CategoryV1.GET_CATEGORIES,
  });
  const { data } = await requestInstance.get(url);
  return { data };
};

export const getCategoryById = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${CategoryV1.GET_CATEGORY}/${id}`,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const createCategory = async (data) => {
  const url = queryString.stringifyUrl({
    url: CategoryV1.CREATE_CATEGORY,
  });
  const response = await requestInstance.post(url, data);
  return response;
};

export const updateCategory = async (id, data) => {
  const url = queryString.stringifyUrl({
    url: `${CategoryV1.UPDATE_CATEGORY}/${id}`,
  });
  const response = await requestInstance.patch(url, data);
  return response;
};

export const deleteCategory = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${CategoryV1.DELETE_CATEGORY}/${id}`,
  });
  const response = await requestInstance.delete(url);
  return response;
};
