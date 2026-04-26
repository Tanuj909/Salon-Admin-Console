import apiClient from "./apiClient";
import { API_ENDPOINTS } from "./apiEndpoints";

const superAdminDashboardService = {
  getStats: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.DASHBOARD_STATS);
    return response.data;
  },

  getDailyRevenue: async (startDate, endDate) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE_DAILY, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getWeeklyRevenue: async (year, week) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE_WEEKLY, {
      params: { year, week },
    });
    return response.data;
  },

  getMonthlyRevenue: async (year, month) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE_MONTHLY, {
      params: { year, month },
    });
    return response.data;
  },

  getYearlyRevenue: async (year) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE_YEARLY, {
      params: { year },
    });
    return response.data;
  },

  getVisitsBySalon: async (startDate, endDate) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.VISITS, {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getTopBusinesses: async (limit = 5) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.TOP_BUSINESSES, {
      params: { limit },
    });
    return response.data;
  },

  getRevenueByCity: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE_BY_CITY);
    return response.data;
  },

  getRevenueByState: async () => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE_BY_STATE);
    return response.data;
  },

  getTopSalons: async (period = "MONTH", date, limit = 10, sortBy = "revenue") => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.TOP_SALONS, {
      params: { period, date, limit, sortBy },
    });
    return response.data;
  },

  getRevenueSummary: async (startDate, endDate) => {
    const response = await apiClient.get(API_ENDPOINTS.SUPER_ADMIN.REVENUE_SUMMARY, {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default superAdminDashboardService;
