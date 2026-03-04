import axios from "axios";
import { getToken, removeToken } from "../utils/token";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================================
   REQUEST INTERCEPTOR
================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip adding token for login requests
    if (config.url?.includes('/auth/login') || config.url?.includes('/login')) {
      return config;
    }
    
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* ================================
   RESPONSE INTERCEPTOR
================================ */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;

      // Don't do anything for login requests
      if (config.url?.includes('/auth/login') || config.url?.includes('/login')) {
        return Promise.reject(error);
      }

      // For other requests with 401, just remove token but DON'T redirect automatically
      if (status === 401) {
        removeToken();
        localStorage.removeItem("admin_user");
        // Don't redirect here - let the component decide
      }

      // Forbidden
      if (status === 403) {
        console.error("Access Denied");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;