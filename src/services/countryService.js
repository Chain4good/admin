import { AuthV1, CategoryV1, CountryV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const getCountries = async () => {
  const url = queryString.stringifyUrl({
    url: CountryV1.GET_COUNTRIES,
  });
  const { data } = await requestInstance.get(url);
  return data;
};

export const createCountry = async (data) => {
  const url = queryString.stringifyUrl({
    url: CountryV1.CREATE_COUNTRY,
  });
  const response = await requestInstance.post(url, data);
  return response;
};

export const updateCountry = async (id, data) => {
  const url = queryString.stringifyUrl({
    url: `${CountryV1.UPDATE_COUNTRY}/${id}`,
  });
  const response = await requestInstance.patch(url, data);
  return response;
};

export const deleteCountry = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${CountryV1.DELETE_COUNTRY}/${id}`,
  });
  const response = await requestInstance.delete(url);
  return response;
};
