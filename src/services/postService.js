import { PostV1 } from "@/constants/linkApis";
import queryString from "query-string";
import requestInstance from "@/services/axiosInstance";

export const createPost = async (data) => {
  const url = queryString.stringifyUrl({
    url: PostV1.CREATE_POST,
  });
  const response = await requestInstance.post(url, data);
  return response;
};

export const updatePost = async (id, data) => {
  const url = queryString.stringifyUrl({
    url: `${PostV1.UPDATE_POST}/${id}`,
  });
  const response = await requestInstance.patch(url, data);
  return response;
};

export const deletePost = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${PostV1.DELETE_POST}/${id}`,
  });
  const response = await requestInstance.delete(url);
  return response;
};

export const getPostById = async (id) => {
  const url = queryString.stringifyUrl({
    url: `${PostV1.GET_POST}/${id}`,
  });
  const response = await requestInstance.get(url);
  return response;
};

export const getPosts = async () => {
  const url = queryString.stringifyUrl({
    url: PostV1.GET_POSTS,
  });
  const response = await requestInstance.get(url);
  return response;
};
