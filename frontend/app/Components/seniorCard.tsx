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
  handleConnect: (targetUserId: number) => void;
}

export default function SeniorCard({ seniors, handleConnect }: SeniorCardProps) {
  return (
    <div className={styles.grid}>
      {seniors.map((senior) => {
        const initials = senior.name.split(" ").map(n => n[0]).join("");
        return (
          <div key={senior.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.avatar}>{initials}</div>
              <div>
                <p className={styles.name}>{senior.name}</p>
                <p className={styles.major}>Y{senior.year} · {senior.major}</p>
              </div>
            </div>
            <p className={styles.bio}>{senior.bio}</p>
            <div className={styles.modules}>
              {senior.modules.map(mod => <span key={mod} className={styles.pill}>{mod}</span>)}
            </div>
            <button className={styles.btn} onClick={() => handleConnect(senior.id)}>
              Connect
            </button>
          </div>
        );
      })}
    </div>
  );
}