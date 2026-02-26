import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const loginApi = async (credentials) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.AUTH.LOGIN,
    credentials
  );

  return response.data;
};