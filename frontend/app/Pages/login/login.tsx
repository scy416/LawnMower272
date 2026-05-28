import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../signUp/signUp.css";

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
        // FastAPI returns { detail: "..." } on errors
        setError(data.detail || "Login failed");
        return;
      }

      // store the JWT so future requests can use it
      localStorage.setItem("access_token", data.access_token);

      // redirect to dashboard (create this route later)
      navigate("/timetable");
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="noise" />
      <div className="grid-bg" />

      <Link to="/" className="back-link">← Back</Link>

      <main className="auth-center">
        <div className="auth-card">

          <div className="auth-header">
            <div className="badge">welcome back</div>
            <h1 className="auth-title">Log in</h1>
            <p className="auth-sub">Good to see you again.</p>
          </div>

          <div className="auth-fields">
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

            {error && <p className="auth-error">{error}</p>}

            <button
              className="btn btn-primary btn-full"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </div>

          <p className="auth-switch">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">Sign up free</Link>
          </p>

        </div>
      </main>
    </div>
  );
}