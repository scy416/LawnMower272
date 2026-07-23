import { useState } from "react";
import { Link,useNavigate } from "react-router";
import styles from "./signUp.module.css";
import { API_URL } from "~/config";

export default function Login() {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", emailOrUsername); 
      formData.append("password", password);

      const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      navigate("/todo");
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
              <label className={styles['field-label']}>Email/Username</label>
              <input
                className={styles['field-input']}
                type="text"
                placeholder="enter your email or username"
                value={emailOrUsername}
                onChange={e => setEmailOrUsername(e.target.value)}
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

            <Link to="/signup" className={`${styles.btn} ${styles['btn-secondary']}`}>Sign up</Link>
          </div>

        </div>
      </main>
    </div>
  );
}