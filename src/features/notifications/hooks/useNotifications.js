import { useEffect, useRef, useState, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "@/utils/token";
import { useAuth } from "@/features/auth/hooks/useAuth";
import axiosInstance from "@/services/axiosInstance";
import { NOTIFICATION_ENDPOINTS } from "@/features/notifications/services/notificationEndpoints";

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [wsConnected, setWsConnected]     = useState(false);
  const clientRef = useRef(null);

  // ─── Fetch unread from REST ───────────────────────────────────────────────
  const fetchUnread = useCallback(async () => {
    try {
      const res = await axiosInstance.get(NOTIFICATION_ENDPOINTS.UNREAD);
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("[Notifications] REST fetch failed:", err.message);
    }
  }, []);

  // ─── WebSocket connect ────────────────────────────────────────────────────
  useEffect(() => {
    // user.userId — from your AuthContext (not user.id)
    if (!user?.userId) return;

    const token = getToken(); // localStorage.getItem("admin_token")
    if (!token) return;

    const client = new Client({
      // Matches your WebSocketConfig → /ws with SockJS
      webSocketFactory: () =>
  new SockJS(`${import.meta.env.VITE_WS_BASE_URL}/ws`),

      // AuthChannelInterceptor reads this header for JWT validation
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      reconnectDelay: 5000,

      onConnect: () => {
        setWsConnected(true);

        // Matches: convertAndSendToUser(userId, "/queue/notifications", ...)
        // Spring's userDestinationPrefix "/user" is prepended automatically
        client.subscribe(
          `/user/${user.userId}/queue/notifications`,
          (message) => {
            try {
              const notification = JSON.parse(message.body);
              setNotifications((prev) => [notification, ...prev]);
              setUnreadCount((c) => c + 1);
            } catch (e) {
              console.error("[Notifications] Parse error:", e);
            }
          }
        );

        // Fetch any missed notifications after (re)connect
        fetchUnread();
      },

      onDisconnect: () => setWsConnected(false),

      onStompError: (frame) => {
        console.error("[Notifications] STOMP error:", frame.headers?.message);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      setWsConnected(false);
    };
  }, [user?.userId, fetchUnread]);

  // ─── Mark single notification as read ────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    try {
      await axiosInstance.put(NOTIFICATION_ENDPOINTS.MARK_READ(id));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("[Notifications] markAsRead failed:", err.message);
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