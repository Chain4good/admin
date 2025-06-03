import { UserV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";
export const getUsers = async (filters) => {
  const url = queryString.stringifyUrl({
    url: UserV1.GET_USERS,
    query: {
      ...filters,
    },
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const getUserById = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${UserV1.GET_USER}/${id}`,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const updateUser = async (id, data) => {
  const url = queryString.stringifyUrl({
    url: `${UserV1.UPDATE_USER}/${id}`,
  });
  const response = await requestInstance.patch(url, data);
  return response;
};

export const updateUserStatus = async (userId, status) => {
  const url = queryString.stringifyUrl({
    url: `${UserV1.UPDATE_STATUS}/${userId}`,
  });
  const response = await requestInstance.patch(url, { isActive: status });
  return response;
};
