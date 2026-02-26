import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getPendingSalonsApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_PENDING, {
    params: { page, size },
  });
  return response.data;
};
export const getAllSalonsApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_ALL, {
    params: { page, size },
  });
  return response.data;
};

export const getVerifiedSalonsApi = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_VERIFIED, {
    params: { page, size },
  });
  return response.data;
};

export const getSalonByIdApi = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_BY_ID(id));
  return response.data;
};

export const getMyBusinessApi = async () => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_MY_BUSINESS);
  return response.data;
};

export const verifySalonApi = async (id, status) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SALONS.VERIFY(id), null, {
    params: { status },
  });
  return response.data;
};
