import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const sendBroadcastApi = async (broadcastData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.SUPER_ADMIN.BROADCAST, broadcastData);
  return response.data;
};
