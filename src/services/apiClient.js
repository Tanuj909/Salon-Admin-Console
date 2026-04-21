import axios from "axios";
import { getToken, removeToken } from "@/utils/token";
import storage from "@/utils/storage";
import { STORAGE_KEYS } from "@/utils/constants";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Skip adding token for login and password reset requests
    const isAuthRequest = config.url?.includes("/auth/login") || 
                         config.url?.includes("/login") ||
                         config.url?.includes("/auth/forgot-password") ||
                         config.url?.includes("/auth/reset-password");
    
    if (!isAuthRequest) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      const isAuthRequest = config.url?.includes("/auth/login") || 
                           config.url?.includes("/login") ||
                           config.url?.includes("/auth/forgot-password") ||
                           config.url?.includes("/auth/reset-password");
      const isMeRequest = config.url?.includes("/auth/me");

      // Handle 401 Unauthorized errors
      if (status === 401 && !isAuthRequest) {
        console.warn(`Unauthorized! URL: ${config.url}`);
        
        // Only redirect of the profile check fails or if we already have no token
        if (isMeRequest || !getToken()) {
          console.warn("Session expired or token missing. Clearing session...");
          removeToken();
          storage.remove(STORAGE_KEYS.USER);
          
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      // Handle 403 Forbidden errors
      if (status === 403) {
        console.error(`Access Forbidden for URL: ${config.url}`);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
