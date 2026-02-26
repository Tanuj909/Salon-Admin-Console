export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    SEND_OTP: "/auth/send-otp",
  },

  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id) => `/users/${id}`,
  },

  SALONS: {
    GET_ALL: "/salons",
  },
};