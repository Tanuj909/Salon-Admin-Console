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
    // Skip adding token for login requests
    const isAuthRequest = config.url?.includes("/auth/login") || config.url?.includes("/login");
    
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
      const isAuthRequest = config.url?.includes("/auth/login") || config.url?.includes("/login");

      // Handle 401 Unauthorized errors
      if (status === 401 && !isAuthRequest) {
        console.warn("Unauthorized! Logging out...");
        removeToken();
        storage.remove(STORAGE_KEYS.USER);
        
        // Use window.location as a last resort if context is unavailable
        // But ideally, the context will listen to token changes
        window.location.href = "/login";
      }

      // Handle 403 Forbidden errors
      if (status === 403) {
        console.error("Access Forbidden!");
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
