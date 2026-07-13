import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./seniorCard.module.css";

interface Senior {
  id: number;
  name: string;
  year: number;
  major: string;
  modules: string[];
  bio: string;
}

interface SeniorCardProps {
  seniors: Senior[];
  handleAddFriend: (targetUserId: number) => void;
}

export default function SeniorCard({ seniors, handleAddFriend }: SeniorCardProps) {
  const navigate = useNavigate();
  const [sentIds, setSentIds] = useState<Set<number>>(new Set());

  const handleClick = (id: number) => {
    if (sentIds.has(id)) return;
    handleAddFriend(id);
    setSentIds((prev) => new Set(prev).add(id));
  };

  return (
    <div className={styles.grid}>
      {seniors.map((senior) => {
        const initials = senior.name.split(" ").map(n => n[0]).join("");
        return (
          <div key={senior.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.avatar}>{initials}</div>
              <div>
                <p
                  className={styles.name}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/Profile/${senior.id}`)}
                >
                  {senior.name}
                </p>
                <p className={styles.major}>Y{senior.year} · {senior.major}</p>
              </div>
            </div>
            <p className={styles.bio}>{senior.bio}</p>
            <div className={styles.modules}>
              {senior.modules.map(mod => <span key={mod} className={styles.pill}>{mod}</span>)}
            </div>
            <button
              className={styles.btn}
              onClick={() => handleClick(senior.id)}
              disabled={sentIds.has(senior.id)}
              style={sentIds.has(senior.id) ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
            >
              {sentIds.has(senior.id) ? "Sent!" : "Add Friend"}
            </button>
          </div>
        );
      })}
    </div>
  );
}