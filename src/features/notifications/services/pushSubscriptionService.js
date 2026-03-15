import axiosInstance from "@/services/axiosInstance";
import { NOTIFICATION_ENDPOINTS } from "./notificationEndpoints";

// Your VAPID public key from application.properties → webpush.public-key
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

// Convert VAPID base64 key to Uint8Array (required by pushManager.subscribe)
const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

export const PushSubscriptionService = {
  // Call this once after user logs in successfully
  subscribe: async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("[Push] Browser does not support push notifications");
      return;
    }

    if (!VAPID_PUBLIC_KEY) {
      console.warn("[Push] VITE_VAPID_PUBLIC_KEY not set in .env");
      return;
    }

    try {
      // Register sw.js from public/
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      // If already subscribed — just sync with backend
      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        await PushSubscriptionService._saveToBackend(existing);
        return;
      }

      // Ask user for permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("[Push] Notification permission denied");
        return;
      }

      // Browser generates unique subscription (endpoint + keys)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      // Save to your PushSubscriptionController
      await PushSubscriptionService._saveToBackend(subscription);
      console.log("[Push] Subscribed successfully");
    } catch (err) {
      console.error("[Push] Subscription failed:", err.message);
    }
  },

  // Matches PushSubscriptionRequest DTO → { endpoint, p256dh, auth }
  _saveToBackend: async (subscription) => {
    const json = subscription.toJSON();
    await axiosInstance.post(NOTIFICATION_ENDPOINTS.PUSH_SUBSCRIBE, {
      endpoint: json.endpoint,
      p256dh:   json.keys.p256dh,
      auth:     json.keys.auth,
    });
  },

  unsubscribe: async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await subscription.unsubscribe();
    } catch (err) {
      console.error("[Push] Unsubscribe failed:", err.message);
    }
  },
};