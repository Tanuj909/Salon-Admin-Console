import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getReviewsByBusinessApi = async (salonId, params = {}) => {
    const { page = 0, size = 10, sortBy = "rating", sortDir = "ASC" } = params;
    const response = await axiosInstance.get(API_ENDPOINTS.REVIEWS.GET_BY_BUSINESS(salonId), {
        params: { page, size, sortBy, sortDir },
    });
    return response.data;
};
export const deleteReviewApi = async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.REVIEWS.DELETE_BY_ID(id));
    return response.data;
};

export const updateReviewApi = async (id, data) => {
    const response = await axiosInstance.put(API_ENDPOINTS.REVIEWS.UPDATE_BY_ID(id), data);
    return response.data;
};
