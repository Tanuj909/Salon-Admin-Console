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

export const getVerificationDocumentsApi = async (businessId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_VERIFICATION_DOCUMENTS(businessId));
  return response.data;
};

export const reviewDocumentApi = async (documentId, approve, rejectionReason = null) => {
  const params = { approve };
  if (rejectionReason) params.rejectionReason = rejectionReason;
  
  const response = await axiosInstance.put(API_ENDPOINTS.SALONS.REVIEW_DOCUMENT(documentId), null, {
    params
  });
  return response.data;
};

export const getVerificationMessagesApi = async (businessId, page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.SALONS.GET_VERIFICATION_MESSAGES(businessId), {
    params: { page, size, sort: 'sentAt,desc' }
  });
  return response.data;
};

export const sendVerificationMessageApi = async (businessId, message, attachment = null) => {
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify({ message })], { type: "application/json" }));
  if (attachment) {
    formData.append("attachment", attachment);
  }
  
  const response = await axiosInstance.post(API_ENDPOINTS.SALONS.SEND_VERIFICATION_MESSAGE(businessId), formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
};
