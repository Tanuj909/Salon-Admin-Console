import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "../../../services/apiEndpoints";

export const getHolidaysByBusinessApi = async (businessId) => {
    const response = await axiosInstance.get(API_ENDPOINTS.HOLIDAYS.GET_BY_BUSINESS(businessId));
    return response.data;
};

export const addHolidayApi = async (businessId, holidayData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.HOLIDAYS.ADD(businessId), holidayData);
    return response.data;
};

export const updateHolidayApi = async (id, holidayData) => {
    const response = await axiosInstance.put(API_ENDPOINTS.HOLIDAYS.UPDATE_BY_ID(id), holidayData);
    return response.data;
};

export const deleteHolidayApi = async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.HOLIDAYS.DELETE_BY_ID(id));
    return response.data;
};
