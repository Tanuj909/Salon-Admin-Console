// import axios from "axios";
// import { getToken, removeToken } from "../utils/token";

// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// /* ================================
//    REQUEST INTERCEPTOR
// ================================ */
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// /* ================================
//    RESPONSE INTERCEPTOR
// ================================ */
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const { status } = error.response;

//       // Unauthorized → Token expired / invalid
//       if (status === 401) {
//         removeToken();

//         // Redirect to login page
//         window.location.href = "/login";
//       }

//       // Forbidden
//       if (status === 403) {
//         console.error("Access Denied");
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

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
    if (config.url?.includes('/auth/login')) {
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

      // Don't redirect for login requests even if 401/403
      if (config.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      // Unauthorized → Token expired / invalid
      if (status === 401) {
        removeToken();
        localStorage.removeItem("admin_user");

        // Redirect to login page if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = "/login";
        }
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