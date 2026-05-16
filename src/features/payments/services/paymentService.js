import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getAllPaymentsApi = async (params) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.GET_ALL, {
        params
    });
    return response.data;
};
