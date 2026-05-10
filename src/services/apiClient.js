import axios from "axios";
import { getToken } from "@/utils/token";
import { clearAuthStorage } from "@/utils/auth";
import { toast } from "react-toastify";

// Prevent multiple redirects from concurrent failed API calls
let isLoggingOut = false;

/**
 * Detect if a server error (500) is caused by a bad/tampered JWT.
 * Backend throws 500 with specific messages for malformed tokens.
 */
const isJwtServerError = (error) => {
  if (error.response?.status !== 500) return false;
  const message = error.response?.data?.message || "";
  const jwtPatterns = [
    "Malformed", "JWT", "token", "Signature",
    "deserialize", "protected header", "Base64"
  ];
  return jwtPatterns.some((p) => message.toLowerCase().includes(p.toLowerCase()));
};

const handleForceLogout = (url) => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  console.warn(`[Auth] Invalid session detected on ${url}. Ending session.`);
  clearAuthStorage();
  toast.info("Session expired. Please login again.");
  if (window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
  }
  setTimeout(() => { isLoggingOut = false; }, 2000);
};

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
        handleForceLogout(config.url);
      }

      // Handle 500 errors caused by malformed/tampered JWT
      if (!isAuthRequest && isJwtServerError(error)) {
        handleForceLogout(config.url);
      }


    }
    return Promise.reject(error);
  }
);

export default apiClient;
