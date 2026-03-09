import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getUserByEmailApi = async (email) => {
    const response = await axiosInstance.get(API_ENDPOINTS.USERS.GET_BY_EMAIL, {
        params: { email },
    });
    return response.data;
};
