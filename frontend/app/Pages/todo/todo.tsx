import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userAuth } from "~/hooks";
import { getCurrentSemesterWeek } from "~/utils";
import styles from "./todo.module.css";
import { API_URL } from "~/config";

interface Assignment {
  id: number;
  module: string;
  assignment_name: string;
  deadline: string;
}

export default function TodoPage() {
  const navigate = useNavigate();
  const { getToken, handleUnauthorized } = userAuth();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const currentWeek = getCurrentSemesterWeek();
  const nextWeekLabel = `W${currentWeek + 1}`;

  useEffect(() => {
    const load = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/timetable`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { handleUnauthorized(); return; }
        if (res.ok) {
          const data: Assignment[] = await res.json();
          const nextWeek = data.filter(a => a.deadline.toUpperCase() === nextWeekLabel.toUpperCase());
          setAssignments(nextWeek);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleCheck = (id: number) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles["week-badge"]}>Next Week · {nextWeekLabel}</div>
          <h1 className={styles.title}>Your Upcoming Assignments</h1>
          <p className={styles.subtitle}>
            Tick off what you've completed. Hit Done when you're ready.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading...</p>
        ) : assignments.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles["empty-icon"]}>🎉</div>
            <div className={styles["empty-text"]}>Nothing due next week!</div>
            <div className={styles["empty-sub"]}>Enjoy your free time.</div>
          </div>
        ) : (
          <div className={styles["task-list"]}>
            {assignments.map(a => {
              const done = checked.has(a.id);
              return (
                <div key={a.id} className={`${styles["task-item"]} ${done ? styles.done : ""}`}>
                  <button
                    className={`${styles["tick-btn"]} ${done ? styles.checked : ""}`}
                    onClick={() => toggleCheck(a.id)}
                  >
                    {done ? "✓" : ""}
                  </button>
                  <div className={styles["task-info"]}>
                    <div className={`${styles["task-name"]} ${done ? styles.struck : ""}`}>
                      {a.assignment_name}
                    </div>
                    <div className={styles["task-module"]}>{a.module}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button className={styles["done-btn"]} onClick={() => navigate("/timetable")}>
          Done →
        </button>
      </div>
    </div>
  );
}
