import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const loginApi = async (credentials) => {
  try {
    // DON'T clear tokens here - let the login happen naturally
    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMeApi = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  } catch (error) {
    throw error;
  }
};