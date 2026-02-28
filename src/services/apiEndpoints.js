export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  },

  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id) => `/users/${id}`,
  },

  SALONS: {
    GET_ALL: "/businesses",
    GET_PENDING: "/businesses/pending",
    GET_VERIFIED: "/businesses/verified",
    GET_BY_ID: (id) => `/businesses/${id}`,
    GET_MY_BUSINESS: "/businesses/my-business",
    VERIFY: (id) => `/businesses/${id}/verify`,
  },

  CATEGORIES: {
    BASE: "/categories",
  },

  SERVICES: {
    BASE: "/services",
    GET_BY_BUSINESS: (businessId) => `/services/business/${businessId}`,
    UPDATE_BY_ID: (id) => `/services/${id}`,
  },

  STAFF: {
    BASE: "/staff",
    GET_BY_BUSINESS: (businessId) => `/staff/business/${businessId}`,
  },
};