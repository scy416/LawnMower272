import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./social.module.css";

interface Senior {
  id: number;
  name: string;
  year: number;
  major: string;
  modules: string[];
  bio: string;
  connected: boolean;
}

export default function Social() {
  const navigate = useNavigate();
  const [seniors, setSeniors] = useState<Senior[]>([]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/seniors")
      .then((res) => res.json())
      .then((data: Senior[]) => setSeniors(data))
      .catch((err) => console.error("Error fetching seniors:", err));
  }, []);

  const handleConnect = async (id: number) => {
    await fetch(`http://localhost:8000/api/seniors/${id}/connect`, {
      method: "POST",
    });
    setSeniors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, connected: !s.connected } : s))
    );
  };

  return (
    <div className={styles["social-page"]}>
      <div className={styles["dashboard-container"]}>

        <div className={styles.topbar}>
          <div className={styles["topbar-title"]}>SyllaBuddy</div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className={styles["logout-btn"]} onClick={() => navigate("/timetable")}>
              Timetable
            </button>
            <button className={styles["logout-btn"]} onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>

        <h1 className={styles["page-title"]}>Find seniors</h1>

        <div className={styles["cards-grid"]}></div>

      </div>
    </div>
  );
}