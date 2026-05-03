import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getCategoriesApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.BASE);
  return response.data;
};

export const createCategoryApi = async (categoryData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.BASE, categoryData);
  return response.data;
};

export const updateCategoryApi = async (id, categoryData) => {
  const response = await axiosInstance.put(API_ENDPOINTS.CATEGORIES.UPDATE_BY_ID(id), categoryData);
  return response.data;
};

export const deleteCategoryApi = async (id) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.CATEGORIES.DELETE_BY_ID(id));
  return response.data;
};
