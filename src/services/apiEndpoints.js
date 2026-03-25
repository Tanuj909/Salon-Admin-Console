export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },

  USERS: {
    GET_ALL: "/users",
    GET_BY_ID: (id) => `/users/${id}`,
    GET_BY_EMAIL: "/users/by-email",
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
    GET_VERIFICATION_DOCUMENTS: (id) => `/businesses/verification/${id}/documents`,
    REVIEW_DOCUMENT: (documentId) => `/businesses/verification/documents/${documentId}/review`,
    GET_VERIFICATION_MESSAGES: (id) => `/businesses/verification/${id}/messages`,
    SEND_VERIFICATION_MESSAGE: (id) => `/businesses/verification/${id}/messages`,
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
    GET_SLOTS: (id) => `/slots/staff/${id}`,
  },
  REVIEWS: {
    GET_BY_BUSINESS: (businessId) => `/reviews/business/${businessId}`,
    GET_BY_STAFF: (staffId) => `/reviews/staff/${staffId}`,
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
    UPDATE_STATUS: (bookingId, status) => `/bookings/staff/${bookingId}/status?status=${status}`,
    MY: "/bookings/my",
  },
  TIMINGS: {
    GET_BY_BUSINESS: (businessId) => `/business-timings/business/${businessId}`,
    UPDATE_BY_BUSINESS: (businessId) => `/business-timings/business/${businessId}`,
  },
  PAYMENTS: {
    GET_BOOKING_DETAILS: (bookingNumber) => `/payments/booking/${bookingNumber}`,
    PROCESS: "/payments/process",
    GET_BILL: (bookingNumber) => `/payments/bill/${bookingNumber}`,
  },
};