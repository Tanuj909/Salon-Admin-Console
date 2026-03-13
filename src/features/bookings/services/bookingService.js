import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getBookingsByBusinessApi = async (businessId, page = 0, size = 10, sort = 'bookingDate,desc') => {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.GET_BY_BUSINESS(businessId), {
        params: {
            page,
            size,
            sort
        }
    });
    return response.data;
};

export const acceptBookingApi = async (bookingId, staffId) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.ACCEPT(bookingId, staffId));
    return response.data;
};

export const rejectBookingApi = async (bookingId, reason) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.REJECT(bookingId), null, {
        params: { reason }
    });
    return response.data;
};

export const rescheduleBookingApi = async (bookingId, payload) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.RESCHEDULE(bookingId), payload);
    return response.data;
};

export const getBookingDetailsByNumberApi = async (bookingNumber) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.GET_BOOKING_DETAILS(bookingNumber));
    return response.data;
};

export const processPaymentApi = async (payload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PAYMENTS.PROCESS, payload);
    return response.data;
};

export const getBillDetailsApi = async (bookingNumber) => {
    const response = await axiosInstance.get(API_ENDPOINTS.PAYMENTS.GET_BILL(bookingNumber));
    return response.data;
};

export const updateBookingStatusApi = async (bookingId, status) => {
    const response = await axiosInstance.put(API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(bookingId, status));
    return response.data;
};

export const getMyBookingsApi = async (page = 0, size = 20, sort = 'bookingDate,desc') => {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS.MY, {
        params: {
            page,
            size,
            sort
        }
    });
    return response.data;
};
