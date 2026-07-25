import { useState, useEffect, type SyntheticEvent } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./chatRoom.module.css"; 
import { userAuth, getInbox } from "~/hooks";
import { API_URL } from "~/config";

interface Message {
  id: number;
  sender_id: number;
  message: string;
  time_sent: string;
}

export default function ChatRoom() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const { getToken, getUserId } = userAuth();
    const { conversations } = getInbox();

    useEffect(() => {
        setCurrentUserId(getUserId());
    }, []);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_URL}/inbox/chat/${conversationId}`, {
                    headers: { "Authorization": `Bearer ${getToken()}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, [conversationId]);

    const sendMessage = async (e: SyntheticEvent) => {
        e.preventDefault();
    
        if (!inputText.trim() || currentUserId === null) return;

        const optimisticMsg: Message = {
            id: -Date.now(),
            sender_id: currentUserId,
            message: inputText,
            time_sent: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setInputText("");

        try {
            await fetch(`${API_URL}/inbox/send_msg/${conversationId}`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`
                },
                body: JSON.stringify({ content: optimisticMsg.message })
            });
        } catch (err) {
            console.error(err);
        }
    };

    return (
    <div className={styles["chat-page"]}>
        <div className={styles["topbar"]}>
            <div className={styles["topbar-title"]}>SyllaBuddy</div>
            <button className={styles["home-btn"]} onClick={() => navigate("/timetable")}>
                Home
            </button>
        </div>

        <div className={styles["layout-container"]}>
            <div className={styles["sidebar"]}>
                <div className={styles["sidebar-header"]}>Inbox</div>
                <div className={styles["sidebar-content"]}>
                    {conversations.length > 0 ? (
                        conversations.map((convo: any) => (
                            <div
                                key={convo.conversation_id}
                                className={styles["inbox-item"]}
                                onClick={() => navigate(`/chat/${convo.conversation_id}`)}
                            >
                                <div className={styles["sidebar-avatar"]}>
                                    {convo.other_user_name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className={styles["inbox-info"]}>
                                    <div className={styles["inbox-name"]}>{convo.other_user_name}</div>
                                </div>
                                {convo.unread_count > 0 && (
                                    <div className={styles["unread-badge"]}>
                                        {convo.unread_count}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p style={{fontSize: "12px", color: "#94a3b8"}}>No conversations yet.</p>
                    )}
                </div>
            </div>

            <div className={styles["chat-container"]}>
                <div className={styles["chat-header"]}>
                    <h2>Chat Room</h2>
                </div>

                <div className={styles["chat-messages"]}>
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === currentUserId;
                        return (
                            <div key={msg.id} className={`${styles["message-row"]} ${isMe ? styles["me"] : styles["them"]}`}>
                                <div className={styles["message-bubble"]}>
                                    {msg.message}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles["chat-input-area"]}>
                    <form className={styles["chat-form"]} onSubmit={sendMessage}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className={styles["chat-input"]}
                        />
                        <button type="submit" className={styles["chat-send-btn"]} disabled={!inputText.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    );
}