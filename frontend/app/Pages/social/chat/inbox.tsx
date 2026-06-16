import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./inbox.module.css";
import { userAuth } from "~/hooks";

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
        const res = await fetch("http://localhost:8000/inbox/me", {
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
  }, [getToken]);

  if (loading) {
    return <div className={styles.container}>Loading messages...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        
        <div className={styles.header}>
          <button onClick={() => navigate("/social")} className={styles["back-btn"]}>← Back</button>
          <h1 className={styles.title}>Messages</h1>
        </div>

        {chats.length === 0 ? (
          <div className={styles["empty-state"]}>You have no messages yet.</div>
        ) : (
          <div className={styles["chat-list"]}>
            {chats.map((chat) => {
              const initials = chat.other_user_name.slice(0, 2).toUpperCase();
              
              // Figure out if this is a pending request waiting for YOU
              const isActionRequired = chat.status === "pending" && !chat.is_initiator;
              
              // Figure out if you are waiting on THEM
              const isWaiting = chat.status === "pending" && chat.is_initiator;

              return (
                <div 
                  key={chat.conversation_id} 
                  className={styles["chat-card"]}
                  onClick={() => navigate(`/chat/${chat.conversation_id}`)}
                >
                  <div className={styles.avatar}>{initials}</div>
                  
                  <div className={styles["chat-info"]}>
                    <p className={styles.name}>{chat.other_user_name}</p>
                    
                    {isActionRequired && (
                      <p className={styles["status-action"]}>New request! Tap to respond.</p>
                    )}
                    {isWaiting && (
                      <p className={styles["status-waiting"]}>Request sent. Waiting for reply.</p>
                    )}
                    {chat.status === "accepted" && (
                      <p className={styles["status-active"]}>Tap to open chat</p>
                    )}
                  </div>

                  {isActionRequired && <div className={styles["notification-dot"]}></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}