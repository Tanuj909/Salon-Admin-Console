import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { toast } from "react-toastify";
import { getToken } from "@/utils/token";
import { useAuth } from "@/features/auth/hooks/useAuth";
import axiosInstance from "@/services/axiosInstance";
import { NOTIFICATION_ENDPOINTS } from "@/features/notifications/services/notificationEndpoints";

const LOG_PREFIX = "[Notifications]";

// Notification type → emoji mapping
const TYPE_ICON = {
  BOOKING_CREATED:   "📅",
  BOOKING_CONFIRMED: "✅",
  BOOKING_REMINDER:  "⏰",
  BOOKING_BROADCAST: "📢",
  DEFAULT:           "🔔",
};

// Custom toast content component
const NotificationToast = ({ notification }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "4px 0" }}>
    <span style={{ fontSize: "24px", lineHeight: 1 }}>
      {TYPE_ICON[notification.type] || TYPE_ICON.DEFAULT}
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontWeight: 700,
        fontSize: "14px",
        color: "#fff",
        marginBottom: "4px",
        lineHeight: 1.3,
      }}>
        {notification.title || "New Notification"}
      </div>
      {notification.message && (
        <div style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.4,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {notification.message}
        </div>
      )}
    </div>
  </div>
);

export const useNotifications = () => {
  const { user } = useAuth();
  // /auth/me may return `id` instead of `userId` — handle both
  const resolvedUserId = user?.userId || user?.id;
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [wsConnected, setWsConnected]     = useState(false);
  const clientRef    = useRef(null);
  const pollingRef   = useRef(null);
  const knownIdsRef  = useRef(new Set());   // tracks IDs we've already seen
  const initialLoad  = useRef(true);        // skip toasts on first load

  // ─── Play notification chime ────────────────────────────────────────────
  const playNotificationSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();

      // First tone — C6 (high, bright)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1047, ctx.currentTime);       // C6
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc1.connect(gain1).connect(ctx.destination);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.3);

      // Second tone — E6 (harmonic, pleasant)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(1319, ctx.currentTime + 0.15); // E6
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.setValueAtTime(0.12, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.5);

      // Cleanup
      setTimeout(() => ctx.close(), 600);
    } catch (e) {
      console.warn(LOG_PREFIX, "Could not play notification sound:", e.message);
    }
  }, []);

  // ─── Show toast for a notification ────────────────────────────────────────
  const showNotificationToast = useCallback((notification) => {
    // Play chime sound
    playNotificationSound();

    toast(<NotificationToast notification={notification} />, {
      type: "info",
      autoClose: 6000,
      style: {
        background: "#1A1A1A",
        borderRadius: "16px",
        border: "1px solid rgba(212, 175, 55, 0.25)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      },
      progressStyle: {
        background: "linear-gradient(90deg, #C8A951, #E8D48B)",
      },
    });
  }, [playNotificationSound]);

  // ─── Helper: handle incoming WS notification ──────────────────────────────
  const handleNewNotification = useCallback((notification) => {
    // Mark as known so polling doesn't re-toast it
    knownIdsRef.current.add(notification.id);

    setNotifications((prev) => {
      if (prev.some((n) => n.id === notification.id)) return prev;
      return [notification, ...prev];
    });
    setUnreadCount((c) => c + 1);

    showNotificationToast(notification);
  }, [showNotificationToast]);

  // ─── Fetch unread from REST (with new-notification detection) ─────────────
  const fetchUnread = useCallback(async () => {
    try {
      console.log(LOG_PREFIX, "Fetching unread via REST…");
      const res = await axiosInstance.get(NOTIFICATION_ENDPOINTS.UNREAD);
      const data = res.data || [];
      console.log(LOG_PREFIX, "REST returned", data.length, "notifications");

      // On first load, just seed the known IDs — don't toast
      if (initialLoad.current) {
        initialLoad.current = false;
        data.forEach((n) => knownIdsRef.current.add(n.id));
      } else {
        // Find notifications we haven't seen before → show toast
        const newOnes = data.filter((n) => !knownIdsRef.current.has(n.id));
        newOnes.forEach((n) => {
          knownIdsRef.current.add(n.id);
          if (!n.isRead) {
            console.log(LOG_PREFIX, "🆕 New notification via polling:", n.title);
            showNotificationToast(n);
          }
        });
      }

      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error(LOG_PREFIX, "REST fetch failed:", err.message);
    }
  }, [showNotificationToast]);

  // ─── Fetch on mount (always, regardless of WS) ───────────────────────────
  useEffect(() => {
    if (resolvedUserId) {
      fetchUnread();
    }
  }, [resolvedUserId, fetchUnread]);

  // ─── REST polling fallback (every 30 s) ───────────────────────────────────
  useEffect(() => {
    if (!resolvedUserId) return;

    pollingRef.current = setInterval(() => {
      console.log(LOG_PREFIX, "Polling fallback tick");
      fetchUnread();
    }, 15_000);

    return () => clearInterval(pollingRef.current);
  }, [resolvedUserId, fetchUnread]);

  // ─── WebSocket connect ────────────────────────────────────────────────────
  useEffect(() => {
    if (!resolvedUserId) {
      console.warn(LOG_PREFIX, "No user.userId/user.id — skipping WS connect. user:", JSON.stringify(user));
      return;
    }

    const token = getToken();
    if (!token) {
      console.warn(LOG_PREFIX, "No token — skipping WS connect");
      return;
    }

    const wsUrl = `${import.meta.env.VITE_WS_BASE_URL}/ws`;
    console.log(LOG_PREFIX, "Connecting WS →", wsUrl, "| userId:", resolvedUserId);

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),

      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      debug: (msg) => console.debug(LOG_PREFIX, "[STOMP]", msg),

      onConnect: () => {
        console.log(LOG_PREFIX, "✅ STOMP connected!");
        setWsConnected(true);

        // Subscribe to BOTH possible paths to cover all Spring configurations:
        // Path 1: Standard Spring user-destination (convertAndSendToUser)
        const path1 = `/user/queue/notifications`;
        // Path 2: Explicit user-prefixed destination
        const path2 = `/user/${resolvedUserId}/queue/notifications`;

        console.log(LOG_PREFIX, "Subscribing to:", path1);
        client.subscribe(path1, (message) => {
          console.log(LOG_PREFIX, "📩 Message on", path1, message.body);
          try {
            handleNewNotification(JSON.parse(message.body));
          } catch (e) {
            console.error(LOG_PREFIX, "Parse error:", e);
          }
        });

        console.log(LOG_PREFIX, "Subscribing to:", path2);
        client.subscribe(path2, (message) => {
          console.log(LOG_PREFIX, "📩 Message on", path2, message.body);
          try {
            handleNewNotification(JSON.parse(message.body));
          } catch (e) {
            console.error(LOG_PREFIX, "Parse error:", e);
          }
        });

        // Fetch any missed notifications after (re)connect
        fetchUnread();
      },

      onDisconnect: () => {
        console.warn(LOG_PREFIX, "⚠️ STOMP disconnected");
        setWsConnected(false);
      },

      onStompError: (frame) => {
        console.error(LOG_PREFIX, "❌ STOMP error:", frame.headers?.message);
      },

      onWebSocketError: (event) => {
        console.error(LOG_PREFIX, "❌ WebSocket error:", event);
      },

      onWebSocketClose: (event) => {
        console.warn(LOG_PREFIX, "WebSocket closed:", event?.code, event?.reason);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log(LOG_PREFIX, "Deactivating STOMP client");
      client.deactivate();
      clientRef.current = null;
      setWsConnected(false);
    };
  }, [resolvedUserId, fetchUnread, handleNewNotification]);

  // ─── Mark single notification as read ────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    try {
      await axiosInstance.put(NOTIFICATION_ENDPOINTS.MARK_READ(id));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(LOG_PREFIX, "markAsRead failed:", err.message);
    }
  }, []);

  // ─── Mark all as read ────────────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.allSettled(
      unread.map((n) =>
        axiosInstance.put(NOTIFICATION_ENDPOINTS.MARK_READ(n.id))
      )
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    wsConnected,
    markAsRead,
    markAllAsRead,
    refetch: fetchUnread,
  };
};