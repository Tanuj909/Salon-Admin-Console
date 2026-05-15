import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";

export const reportService = {
  generateReport: async (businessId, data) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.REPORTS.GENERATE(businessId),
        data,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error generating report:", error);
      throw error;
    }
  },
};
