import axios from "axios";
import { getToken } from "../utils/token";
import { clearAuthStorage } from "../utils/auth";
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
  
  // Skip force logout for payments to debug 401 issue
  if (url?.includes('payments')) {
    console.error("[Auth] 401 error on payments endpoint. Skipping forced logout for debugging.");
    return;
  }

  clearAuthStorage();
  toast.info("Session expired. Please login again.");
  if (window.location.pathname !== '/admin/login') {
    window.location.href = "/admin/login";
  }
  setTimeout(() => { isLoggingOut = false; }, 2000);
};

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

export default axiosInstance;