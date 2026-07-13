import { useState, useEffect, useRef } from "react";
import { userAuth } from "~/hooks";
import styles from "./NotificationBell.module.css";

interface Notification {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const { getToken } = userAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/notifications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: Notification[] = await res.json();
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.is_read).length);
      }
    } catch {
      // silently fail — bell is non-critical
    }
  };

  const generateWeekly = async () => {
    const token = getToken();
    if (!token) return;
    try {
      await fetch("http://localhost:8000/notifications/generate_weekly", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch {}
  };

  const markAllRead = async () => {
    const token = getToken();
    if (!token) return;
    await fetch("http://localhost:8000/notifications/mark_read", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  // On mount: generate weekly notifications + fetch
  useEffect(() => {
    generateWeekly();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      markAllRead();
    }
  };

  return (
    <div className={styles.wrapper} ref={panelRef}>
      <button className={styles.bell} onClick={handleOpen} aria-label="Notifications">
        🔔
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.panel}>
          <div className={styles["panel-header"]}>
            <span className={styles["panel-title"]}>Notifications</span>
          </div>

          {notifications.length === 0 ? (
            <div className={styles["empty"]}>No notifications yet.</div>
          ) : (
            <div className={styles["notif-list"]}>
              {notifications.map((n) => (
                <div key={n.id} className={`${styles["notif-item"]} ${n.is_read ? styles.read : styles.unread}`}>
                  <div className={styles["notif-title"]}>{n.title}</div>
                  <div className={styles["notif-body"]}>{n.body}</div>
                  <div className={styles["notif-time"]}>{timeAgo(n.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
