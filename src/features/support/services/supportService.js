import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getAllQueriesApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SUPPORT.GET_ALL(page, size));
  return response.data;
};

export const getQueryByIdApi = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SUPPORT.GET_BY_ID(id));
  return response.data;
};

export const replyToQueryApi = async (id, data) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SUPPORT.REPLY(id), data);
  return response.data;
};

export const createQueryApi = async (queryData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.SUPPORT.CREATE, queryData);
  return response.data;
};

export const getMyQueriesApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SUPPORT.GET_MY_QUERIES(page, size));
  return response.data;
};

export const deleteQueryApi = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.SUPPORT.DELETE(id));
  return response.data;
};

