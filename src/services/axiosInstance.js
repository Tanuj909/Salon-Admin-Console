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
      const { status } = error.response;

      // Unauthorized → Token expired / invalid
      if (status === 401) {
        removeToken();

        // Redirect to login page
        window.location.href = "/login";
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