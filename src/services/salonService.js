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

export const updateMyBusinessApi = async (data) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SALONS.UPDATE_MY_BUSINESS, data);
  return response.data;
};

export const uploadBannerApi = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axiosInstance.post(API_ENDPOINTS.SALONS.UPLOAD_BANNER, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const uploadSalonImagesApi = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  const response = await axiosInstance.post(API_ENDPOINTS.SALONS.UPLOAD_IMAGES, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteSalonImageApi = async (imageUrl) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.SALONS.DELETE_IMAGE, {
    params: { imageUrl },
  });
  return response.data;
};

export const verifySalonApi = async (id, status) => {
  const response = await axiosInstance.put(API_ENDPOINTS.SALONS.VERIFY(id), null, {
    params: { status },
  });
  return response.data;
};

export const getSalonQrCodeApi = async (id) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_QR_CODE(id), {
    responseType: "blob",
    headers: {
      Accept: "image/png",
    },
  });
  return response.data;
};

