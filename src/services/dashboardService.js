import axiosInstance from "./axiosInstance";
import { API_ENDPOINTS } from "./apiEndpoints";

const dashboardService = {
  getFullDashboard: async (range = "LAST_30_DAYS", businessId) => {
    const params = { range };
    if (businessId) params.businessId = businessId;
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.FULL, { params });
    return response.data;
  },

  getRevenueTrends: async (range = "LAST_7_DAYS", businessId) => {
    const params = { range };
    if (businessId) params.businessId = businessId;
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.REVENUE, { params });
    return response.data;
  },

  getBookingTrends: async (range = "LAST_7_DAYS", businessId) => {
    const params = { range };
    if (businessId) params.businessId = businessId;
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.BOOKINGS, { params });
    return response.data;
  },

  getTopServices: async (range = "LAST_30_DAYS", businessId, limit = 5) => {
    const params = { range, limit };
    if (businessId) params.businessId = businessId;
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.TOP_SERVICES, { params });
    return response.data;
  },

  getStaffPerformance: async (range = "LAST_30_DAYS", businessId, limit = 5) => {
    const params = { range, limit };
    if (businessId) params.businessId = businessId;
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.STAFF_PERFORMANCE, { params });
    return response.data;
  },

  getCustomerInsights: async (range = "LAST_30_DAYS", businessId) => {
    const params = { range };
    if (businessId) params.businessId = businessId;
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.CUSTOMER_INSIGHTS, { params });
    return response.data;
  },

  getBusinessHealth: async (range = "LAST_30_DAYS") => {
    const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.BUSINESS_HEALTH, { params: { range } });
    return response.data;
  },
};

export default dashboardService;
