import apiClient from "./apiClient";
import { API_ENDPOINTS } from "@/utils/constants";

/**
 * Notification related API calls
 */
export const subscribePushApi = async (subscription) => {
  const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.SUBSCRIBE, subscription);
  return response.data;
};

export const unsubscribePushApi = async () => {
  const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.UNSUBSCRIBE);
  return response.data;
};

export const getPushStatusApi = async () => {
  const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.STATUS);
  return response.data;
};

const notificationService = {
  subscribePush: subscribePushApi,
  unsubscribePush: unsubscribePushApi,
  getPushStatus: getPushStatusApi
};

export default notificationService;
