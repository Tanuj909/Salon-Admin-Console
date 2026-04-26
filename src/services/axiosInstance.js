import axios from "axios";
import { getToken, removeToken } from "../utils/token";
import storage from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

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

      // Don't do anything for auth requests to avoid loops
      const isAuthRequest = config.url?.includes('/auth/login') || config.url?.includes('/login');
      const isMeRequest = config.url?.includes('/auth/me');
      
      if (status === 401 && !isAuthRequest) {
        console.warn(`Unauthorized access on URL: ${config.url}`);
        
        // Only redirect of the profile check fails or if we already have no token
        if (isMeRequest || !getToken()) {
          console.warn("Session expired or token missing. Clearing session...");
          removeToken();
          storage.remove(STORAGE_KEYS.USER);
          
          if (window.location.pathname !== '/admin/login') {
            window.location.href = "/admin/login";
          }
        } else {
          console.warn("401 encountered but staying logged in for now...");
        }
      }

      // Forbidden
      if (status === 403) {
        console.error(`Access Forbidden for URL: ${config.url}`);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;