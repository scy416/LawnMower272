import { useState, useRef, useEffect } from 'react';
import styles from './ChatbotWidget.module.css';
import { API_URL } from '~/config';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hi! I am Syllabuddy. How can I help you with your NUS journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chatbot/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages([...newMessages, { role: 'bot', content: data.response }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'bot', content: 'Sorry, I am having trouble connecting to the server. Make sure the backend is running and the API key is set.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <span>Syllabuddy AI 🤖</span>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>&times;</button>
          </div>
          
          <div className={styles.chatMessages}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.messageRow} ${msg.role === 'user' ? styles.user : styles.bot}`}>
                <div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.user : styles.bot}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.bot}`}>
                <div className={`${styles.messageBubble} ${styles.bot}`}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInput}>
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="Ask about NUS..." 
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading || !input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}
      
      {!isOpen && (
        <button className={styles.toggleButton} onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
}
