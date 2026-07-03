import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setMode("login");
        setPassword("");
      }
    } catch (error) {
      setMessage("Signup failed. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok && data.message === "Login successful") {
        navigate("/create-event");
      }
    } catch (error) {
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>ArrangeMe</h2>
        <p style={styles.subtitle}>Plan your event, share a RSVP link, and let guests respond online.</p>

        <div style={styles.toggleRow}>
          <button
            type="button"
            onClick={() => setMode("signup")}
            style={{ ...styles.toggleButton, ...(mode === "signup" ? styles.activeToggle : {}) }}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{ ...styles.toggleButton, ...(mode === "login" ? styles.activeToggle : {}) }}
          >
            Login
          </button>
        </div>

        {mode === "signup" ? (
          <form onSubmit={handleSignup} style={styles.form}>
            <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            <button style={styles.button}>Create account</button>
          </form>
        ) : (
          <form onSubmit={handleLogin} style={styles.form}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
            <button style={styles.button}>Login</button>
          </form>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5",
    padding: "24px",
  },
  card: {
    width: "360px",
    padding: "24px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  subtitle: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  toggleRow: {
    display: "flex",
    gap: "8px",
  },
  toggleButton: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f9f9f9",
    cursor: "pointer",
  },
  activeToggle: {
    background: "#4CAF50",
    color: "#fff",
    borderColor: "#4CAF50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
  },
  message: {
    margin: 0,
    fontSize: "14px",
    color: "#333",
  },
};
