import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getBusinessTimingsApi = async (businessId) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.TIMINGS.GET_BY_BUSINESS(businessId));
        return response.data;
    } catch (error) {
        console.error("Error fetching business timings:", error);
        throw error;
    }
};

export const updateBusinessTimingsApi = async (businessId, timingsData) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.TIMINGS.UPDATE_BY_BUSINESS(businessId), timingsData);
        return response.data;
    } catch (error) {
        console.error("Error updating business timings:", error);
        throw error;
    }
};
