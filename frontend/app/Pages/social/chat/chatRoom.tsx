import { useState, useEffect, type SyntheticEvent } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "./chatRoom.module.css"; 
import { userAuth } from "~/hooks";

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
    const { getToken } = userAuth()

    useEffect(() => {
        const token = getToken();
        if (token) {
            try {
                const payload = JSON.parse(window.atob(token.split('.')[1]));
                setCurrentUserId(parseInt(payload.sub, 10)); 
            } catch (e) {
                console.error("Failed to decode token", e);
            }
        }
    }, [getToken]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:8000/inbox/chat/${conversationId}`, {
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
            id: Math.random(),
            sender_id: currentUserId, 
            message: inputText,
            time_sent: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setInputText("");

        try {
            await fetch(`http://localhost:8000/inbox/send_msg/${conversationId}`, {
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
        <div className={styles["chat-container"]}>
        <div className={styles["chat-header"]}>
            <button onClick={() => navigate(-1)} className={styles["back-btn"]}>← Back</button>
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
                }
            )}
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
    );
}