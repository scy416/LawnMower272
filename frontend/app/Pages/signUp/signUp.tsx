// useState lets us track form field values and UI state (error, loading)
import { useState } from "react";

// Link renders as an <a> tag but navigates without a full page reload
// useNavigate gives us a function to programmatically redirect the user
import { Link, useNavigate } from "react-router";

import "./signUp.css";

export default function Signup() {
  // useNavigate hook — call navigate("/path") to redirect the user
  const navigate = useNavigate();

  // controlled inputs — each field's value lives in React state
  // so we always know exactly what the user has typed
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // error holds the message to display if signup fails
  // e.g. "Email is already registered", "Username is already taken"
  const [error, setError] = useState("");

  // loading tracks whether the fetch is in progress
  // used to disable the button so the user can't submit twice
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setError("");       // clear any previous error before trying again
    setLoading(true);   // disable button and show "Creating account…"

    try {
      // send a POST request to the FastAPI signup endpoint
      // the body matches the UserCreate schema: { username, email, password }
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }), // matches UserCreate schema in schemas.py
      });

      // parse the JSON response body
      // on success: { id, username, email } — the UserResponse schema
      // on failure: { detail: "Email is already registered" }
      const data = await res.json();

      if (!res.ok) {
        // res.ok is true for 2xx status codes, false for 4xx/5xx
        // data.detail comes from FastAPI's HTTPException detail field in router.py
        setError(data.detail || "Signup failed");
        return; // stop here — don't proceed to navigate
      }

      // signup succeeded — no token is issued at signup
      // redirect to login so the user can authenticate and get their JWT
      navigate("/login");
    } catch {
      // fetch itself throws if the server is unreachable (no internet, server not running)
      setError("Could not connect to server");
    } finally {
      // always runs — re-enables the button whether signup succeeded or failed
      setLoading(false);
    }
  }

  return (
    // auth-page is the full-screen dark wrapper (same as .home in home.tsx)
    <div className="auth-page">

      {/* decorative background layers — same as home page */}
      <div className="noise" />
      <div className="grid-bg" />

      {/* back arrow link — takes user back to the home page */}
      <Link to="/" className="back-link">← Back</Link>

      {/* auth-center constrains the card to a max width and centers it */}
      <main className="auth-center">
        <div className="auth-card">

          {/* header section — badge, title, subtitle */}
          <div className="auth-header">
            <div className="badge">get started</div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Plan smarter from day one.</p>
          </div>

          {/* form fields — not a <form> tag, just divs with controlled inputs */}
          <div className="auth-fields">

            {/* username field */}
            <div className="field">
              <label className="field-label">Username</label>
              <input
                className="field-input"
                type="text"
                placeholder="yourname"
                value={username}
                onChange={e => setUsername(e.target.value)} // update state on every keystroke
              />
            </div>

            {/* email field — browser validates basic email format via type="email" */}
            <div className="field">
              <label className="field-label">Email</label>
              <input
                className="field-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* password field — type="password" masks the characters */}
            <div className="field">
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            {/* only renders if error is a non-empty string */}
            {error && <p className="auth-error">{error}</p>}

            {/* disabled while loading to prevent duplicate requests */}
            <button
              className="btn btn-primary btn-full"
              onClick={handleSignup}
              disabled={loading}
            >
              {/* ternary swaps the label while the request is in flight */}
              {loading ? "Creating account…" : "Sign up free"}
            </button>
          </div>

          {/* switch link — takes user to login if they already have an account */}
          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Log in</Link>
          </p>

        </div>
      </main>
    </div>
  );
}