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
    UPDATE_MY_BUSINESS: "/businesses/my-business",
    UPLOAD_BANNER: "/businesses/banner",
    UPLOAD_IMAGES: "/businesses/images",
    DELETE_IMAGE: "/businesses/images",
    VERIFY: (id) => `/businesses/${id}/verify`,
  },

  CATEGORIES: {
    BASE: "/categories",
  },

  SERVICES: {
    BASE: "/services",
    GET_BY_BUSINESS: (businessId) => `/services/business/${businessId}`,
    UPDATE_BY_ID: (id) => `/services/${id}`,
    DELETE_BY_ID: (id) => `/services/${id}`,
  },

  STAFF: {
    BASE: "/staff",
    GET_BY_BUSINESS: (businessId) => `/staff/business/${businessId}`,
    GET_BY_SERVICE: (serviceId) => `/staff/service/${serviceId}`,
    GET_BY_ID: (id) => `/staff/${id}`,
    UPDATE_BY_ID: (id) => `/staff/${id}`,
    DELETE_BY_ID: (id) => `/staff/${id}`,
    ASSIGN_SERVICES: (id) => `/staff/${id}/services`,
    REMOVE_SERVICES: (id) => `/staff/${id}/services`,
    GENERATE_SLOTS: (id) => `/slots/staff/${id}/generate`,
  },
  REVIEWS: {
    GET_BY_BUSINESS: (businessId) => `/reviews/business/${businessId}`,
    UPDATE_BY_ID: (id) => `/reviews/${id}`,
    DELETE_BY_ID: (id) => `/reviews/${id}`,
  },
  HOLIDAYS: {
    GET_BY_BUSINESS: (businessId) => `/business-holidays/business/${businessId}`,
    ADD: (businessId) => `/business-holidays/business/${businessId}`,
    UPDATE_BY_ID: (id) => `/business-holidays/${id}`,
    DELETE_BY_ID: (id) => `/business-holidays/${id}`,
  },
  BOOKINGS: {
    GET_BY_BUSINESS: (businessId) => `/bookings/business/${businessId}`,
    ACCEPT: (bookingId, staffId) => `/bookings/${bookingId}/accept?staffId=${staffId}`,
    REJECT: (bookingId) => `/bookings/${bookingId}/reject`,
    RESCHEDULE: (bookingId) => `/bookings/${bookingId}/reschedule`,
  },
  TIMINGS: {
    GET_BY_BUSINESS: (businessId) => `/business-timings/business/${businessId}`,
    UPDATE_BY_BUSINESS: (businessId) => `/business-timings/business/${businessId}`,
  },
};