import { useState } from "react";
import { Link, useNavigate } from "react-router";

import styles from "./signUp.module.css";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Signup failed");
        return;
      }

      navigate("/login");
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
            <div className={styles.badge}>get started</div>
            <h1 className={styles['auth-title']}>Create account</h1>
            <p className={styles['auth-sub']}>Plan smarter from day one.</p>
          </div>

          <div className={styles['auth-fields']}>
            <div className={styles.field}>
              <label className={styles['field-label']}>Username</label>
              <input
                className={styles['field-input']}
                type="text"
                placeholder="yourname"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

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
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Sign up free"}
            </button>
          </div>

          <p className={styles['auth-switch']}>
            Already have an account?{" "}
            <Link to="/login" className={styles['auth-link']}>Log in</Link>
          </p>

        </div>
      </main>
    </div>
  );
}