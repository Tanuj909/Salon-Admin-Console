export const STORAGE_KEYS = {
  TOKEN: "admin_access_token",
  USER: "admin_user",
  THEME: "admin_theme",
};

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  RECEPTIONIST: "RECEPTIONIST"
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  NOTIFICATIONS: {
    SUBSCRIBE: "/notifications/subscribe",
    UNSUBSCRIBE: "/notifications/unsubscribe",
    STATUS: "/notifications/status",
  }
};

export const UI_CONFIG = {
  SIDEBAR_WIDTH: "240px",
  HEADER_HEIGHT: "64px",
  CONTENT_PADDING: "24px",
};
