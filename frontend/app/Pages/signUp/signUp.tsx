// useState lets us track form field values and UI state (error, loading)
import { useState } from "react";

// Link renders as an <a> tag but navigates without a full page reload
// useNavigate gives us a function to programmatically redirect the user
import { Link, useNavigate } from "react-router";

import styles from "./signUp.module.css";

export default function Signup() {
  // useNavigate hook — call navigate("/path") to redirect the user
  const navigate = useNavigate();

  // controlled inputs — each field's value lives in React state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // error holds the message to display if signup fails
  const [error, setError] = useState("");

  // loading tracks whether the fetch is in progress
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");       // clear any previous error before trying again
    setLoading(true);   // disable button and show "Creating account…"

    try {
      // send a POST request to the FastAPI signup endpoint
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

      {/* auth-center constrains the card to a max width and centers it */}
      <main className={styles['auth-center']}>
        <div className={styles['auth-card']}>

          {/* header section — badge, title, subtitle */}
          <div className={styles['auth-header']}>
            <div className={styles.badge}>get started</div>
            <h1 className={styles['auth-title']}>Create account</h1>
            <p className={styles['auth-sub']}>Plan smarter from day one.</p>
          </div>

          {/* form fields */}
          <div className={styles['auth-fields']}>

            {/* username field */}
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

            {/* email field */}
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

            {/* password field */}
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

            {/* only renders if error is a non-empty string */}
            {error && <p className={styles['auth-error']}>{error}</p>}

            {/* disabled while loading */}
            <button
              className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-full']}`}
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account…" : "Sign up free"}
            </button>
          </div>

          {/* switch link */}
          <p className={styles['auth-switch']}>
            Already have an account?{" "}
            <Link to="/login" className={styles['auth-link']}>Log in</Link>
          </p>

        </div>
      </main>
    </div>
  );
}