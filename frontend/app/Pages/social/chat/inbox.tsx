import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./inbox.module.css";
import { userAuth } from "~/hooks";
import { API_URL } from "~/config";

interface ChatPreview {
  conversation_id: number;
  status: string;
  other_user_id: number;
  other_user_name: string;
  is_initiator: boolean;
}

export default function Inbox() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = userAuth();

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await fetch(`${API_URL}/inbox/me`, {
          headers: { "Authorization": `Bearer ${getToken()}` }
        });
        if (res.ok) {
          const data = await res.json();
          setChats(data);
        }
      } catch (err) {
        console.error("Failed to load inbox", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading messages...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <h1 className={styles.title}>Messages</h1>
          <button onClick={() => navigate("/timetable")} className={styles["back-btn"]}>Home</button>
        </div>

        {chats.filter(c => c.status === "accepted").length === 0 ? (
          <div className={styles["empty-state"]}>You have no messages yet.</div>
        ) : (
          <div className={styles["chat-list"]}>
            {chats.filter(c => c.status === "accepted").map((chat) => {
              const initials = chat.other_user_name.slice(0, 2).toUpperCase();
              
              return (
                <div 
                  key={chat.conversation_id} 
                  className={styles["chat-card"]}
                  onClick={() => navigate(`/chat/${chat.conversation_id}`)}
                >
                  <div className={styles.avatar}>{initials}</div>
                  
                  <div className={styles["chat-info"]}>
                    <p className={styles.name}>{chat.other_user_name}</p>
                    <p className={styles["status-active"]}>Tap to open chat</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}