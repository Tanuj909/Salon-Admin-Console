import apiClient from "./apiClient";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Authentication related API calls
 */
export const loginApi = async (credentials) => {
  const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

export const getMeApi = async () => {
  const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

const authService = {
  login: loginApi,
  getMe: getMeApi
};

export default authService;