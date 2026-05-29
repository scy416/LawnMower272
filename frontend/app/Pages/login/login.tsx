import { useState } from "react";
import { Link, useNavigate } from "react-router";
import styles from "../signUp/signUp.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      navigate("/timetable");
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles['auth-page']}>

      <main className={styles['auth-center']}>
        <div className={styles['auth-card']}>

          <div className={styles['auth-header']}>
            <div className={styles.badge}>welcome back</div>
            <h1 className={styles['auth-title']}>Log in</h1>
          </div>

          <div className={styles['auth-fields']}>
            <div className={styles.field}>
              <label className={styles['field-label']}>Email</label>
              <input
                className={styles['field-input']}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles['field-label']}>Password</label>
              <input
                className={styles['field-input']}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {error && <p className={styles['auth-error']}>{error}</p>}

            <button
              className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-full']}`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}