import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getCategoriesApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.BASE);
  return response.data;
};

export const createCategoryApi = async (categoryData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
  return response.data;
};
