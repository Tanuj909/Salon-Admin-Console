// import axiosInstance from "@/services/axiosInstance";
// import { API_ENDPOINTS } from "@/services/apiEndpoints";

// export const loginApi = async (credentials) => {
//   const response = await axiosInstance.post(
//     API_ENDPOINTS.AUTH.LOGIN,
//     credentials
//   );

//   return response.data;
// };

import axiosInstance from "@/services/axiosInstance";
import { API_ENDPOINTS } from "@/services/apiEndpoints";
import { removeToken } from "@/utils/token";

export const loginApi = async (credentials) => {
  try {
    // Clear any existing token before login
    removeToken();
    localStorage.removeItem("admin_user");

    const response = await axiosInstance.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  } catch (error) {
    throw error;
  }
};