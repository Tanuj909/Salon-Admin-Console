// Matches your API_ENDPOINTS pattern in apiEndpoints.js
// Backend: NotificationController → /api/notifications
//          PushSubscriptionController → /api/push

export const NOTIFICATION_ENDPOINTS = {
  UNREAD:           "/notifications/unread",
  MARK_READ: (id) => `/notifications/${id}/read`,
  PUSH_SUBSCRIBE:   "/push/subscribe",
};