import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("arrangemeUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data = {};
      try { data = await res.json(); } catch (err) { }

      if (!res.ok) {
        setMessage(data.message || `Signup failed (${res.status})`);
        return;
      }

      setMessage(data.message || "Account created");
      setMode("login");
    } catch (err) {
      setMessage("Signup failed — backend unreachable");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try { data = await res.json(); } catch (err) { }

      if (!res.ok) {
        setMessage(data.message || `Login failed (${res.status})`);
        return;
      }

      setMessage(data.message || "");
      if (data.message === "Login successful") {
        const loggedUser = data.user || { email };
        localStorage.setItem("arrangemeUser", JSON.stringify(loggedUser));
        setUser(loggedUser);
        navigate("/create-event");
      }
    } catch (err) {
      setMessage("Login failed — backend unreachable");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("arrangemeUser");
    setUser(null);
    setMessage("Logged out successfully.");
  };

  return (
    <div className="create-event-container">
      <h2>ArrangeMe</h2>
      <p style={{ marginTop: 0, color: "#666" }}>Create an account or login to start.</p>

      {user && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "12px", alignItems: "center" }}>
          <span style={{ color: "#666" }}>Logged in as {user.name || user.email}</span>
          <button type="button" onClick={handleLogout} style={{ padding: "10px", borderRadius: "8px", border: "none", background: "#e76f51", color: "#fff", cursor: "pointer" }}>
            Logout
          </button>
        </div>
      )}
      <div style={{ display: "flex", gap: "12px", marginBottom: "6px" }}>
        <button type="button" onClick={() => setMode("signup")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: mode === "signup" ? "var(--accent)" : "#f3f0f7", color: mode === "signup" ? "#fff" : "var(--text)" }}>{"Create account"}</button>
        <button type="button" onClick={() => setMode("login")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: mode === "login" ? "var(--accent)" : "#f3f0f7", color: mode === "login" ? "#fff" : "var(--text)" }}>{"Login"}</button>
      </div>

      {mode === "signup" ? (
        <form onSubmit={handleSignup}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button>Create account</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button>Login</button>
        </form>
      )}

      {message && <p style={{ marginTop: "12px", color: "#b04545" }}>{message}</p>}
    </div>
  );
}
