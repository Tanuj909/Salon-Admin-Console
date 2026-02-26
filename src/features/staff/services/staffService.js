import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getStaffByBusinessApi = async (businessId, page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_BUSINESS(businessId), {
    params: { page, size }
  });
  return response.data;
};

export const createStaffApi = async (staffData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.STAFF.BASE, staffData);
  return response.data;
};
