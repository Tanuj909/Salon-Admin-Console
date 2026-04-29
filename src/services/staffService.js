import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const getStaffByBusinessApi = async (businessId, page = 0, size = 10) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_BUSINESS(businessId), {
    params: { page, size }
  });
  return response.data;
};

export const getStaffByServiceApi = async (serviceId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_SERVICE(serviceId));
  return response.data;
};

export const getStaffByIdApi = async (staffId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_ID(staffId));
  return response.data;
};

export const getStaffByUserIdApi = async (userId) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_BY_USER_ID(userId));
  return response.data;
};

export const createStaffApi = async (staffData) => {
  const response = await axiosInstance.post(API_ENDPOINTS.STAFF.BASE, staffData);
  return response.data;
};

export const updateStaffApi = async (staffId, staffData) => {
  const response = await axiosInstance.put(API_ENDPOINTS.STAFF.UPDATE_BY_ID(staffId), staffData);
  return response.data;
};

export const deleteStaffApi = async (staffId) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.STAFF.DELETE_BY_ID(staffId));
  return response.data;
};

export const assignServicesToStaffApi = async (staffId, serviceIds) => {
  const response = await axiosInstance.post(API_ENDPOINTS.STAFF.ASSIGN_SERVICES(staffId), serviceIds);
  return response.data;
};

export const removeServicesFromStaffApi = async (staffId, serviceIds) => {
  const response = await axiosInstance.delete(API_ENDPOINTS.STAFF.REMOVE_SERVICES(staffId), {
    data: serviceIds
  });
  return response.data;
};

export const generateStaffSlotsApi = async (staffId, fromDate, toDate) => {
  const response = await axiosInstance.post(API_ENDPOINTS.STAFF.GENERATE_SLOTS(staffId), null, {
    params: { fromDate, toDate }
  });
  return response.data;
};

export const getStaffSlotsApi = async (staffId, startDate, endDate) => {
  const response = await axiosInstance.get(API_ENDPOINTS.STAFF.GET_SLOTS(staffId), {
    params: { startDate, endDate }
  });
  return response.data;
};
