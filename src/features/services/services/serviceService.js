import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getServicesByBusinessApi = async (businessId, page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SERVICES.GET_BY_BUSINESS(businessId), {
    params: { page, size }
  });
  return response.data;
};

export const createServiceApi = async (serviceData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.SERVICES.BASE, serviceData);
  return response.data;
};

export const updateServiceApi = async (serviceId, serviceData) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SERVICES.UPDATE_BY_ID(serviceId), serviceData);
  return response.data;
};

export const deleteServiceApi = async (serviceId) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.SERVICES.DELETE_BY_ID(serviceId));
  return response.data;
};
