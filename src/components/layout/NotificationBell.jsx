import { useState, useRef, useEffect } from "react";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { formatDistanceToNow } from "@/features/notifications/lib/timeUtils";

// Notification type → color mapping (matches your backend NotificationType enums)
const TYPE_DOT = {
  BOOKING_CREATED:   "bg-blue-400",
  BOOKING_CONFIRMED: "bg-emerald-400",
  BOOKING_REMINDER:  "bg-amber-400",
  BOOKING_BROADCAST: "bg-purple-400",
  DEFAULT:           "bg-white/30",
};

const NotificationBell = () => {
  const { notifications, unreadCount, wsConnected, markAsRead, markAllAsRead } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef     = useRef(null);

  // Close on outside click — same pattern as Topbar dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleClick = async (n) => {
    if (!n.isRead) await markAsRead(n.id);
    if (n.actionUrl) window.location.href = n.actionUrl;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Bell Button — matches existing Topbar icon button style ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-12 rounded-full border border-gold/10 flex items-center justify-center text-secondary hover:bg-gold hover:text-black-deep transition-all relative group cursor-pointer bg-transparent"
        aria-label="Notifications"
      >
        {/* Bell icon */}
        <svg
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Unread count badge */}
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-cream leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : (
          // WS live dot — gold when connected, dim when not (matches Topbar dot style)
          <span
            className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full border-2 border-cream group-hover:border-gold transition-all ${
              wsConnected ? "bg-gold" : "bg-white/20"
            }`}
          />
        )}
      </button>

      {/* ── Dropdown — matches Topbar dropdown dark style ── */}
      {open && (
        <div className="absolute right-0 top-16 w-80 bg-black-deep/95 backdrop-blur-xl border border-gold/10 rounded-3xl shadow-luxe overflow-hidden z-[70]">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="font-display italic text-white text-base">
                Notifications
              </span>
              {/* Live indicator */}
              <span
                className={`w-1.5 h-1.5 rounded-full ${wsConnected ? "bg-emerald-400" : "bg-white/20"}`}
                title={wsConnected ? "Live" : "Reconnecting..."}
              />
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] uppercase tracking-widest font-bold text-gold/70 hover:text-gold transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/30">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p className="text-xs uppercase tracking-widest font-bold">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`flex gap-3 px-5 py-4 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${
                    !n.isRead ? "bg-gold/5" : ""
                  }`}
                >
                  {/* Type dot */}
                  <div className="mt-1.5 flex-shrink-0">
                    <span
                      className={`block w-2 h-2 rounded-full ${
                        TYPE_DOT[n.type] ?? TYPE_DOT.DEFAULT
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-snug ${
                        !n.isRead ? "text-white font-semibold" : "text-white/70 font-medium"
                      }`}>
                        {n.title}
                      </p>
                      {/* Mark read button */}
                      {!n.isRead && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                          className="flex-shrink-0 text-gold/40 hover:text-gold transition-colors mt-0.5"
                          title="Mark as read"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20,6 9,17 4,12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-white/25 mt-1 uppercase tracking-wider font-bold">
                      {formatDistanceToNow(n.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-5 py-3 border-t border-white/5 text-center">
              <button
                onClick={() => setOpen(false)}
                className="text-[10px] uppercase tracking-widest font-bold text-gold/50 hover:text-gold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;