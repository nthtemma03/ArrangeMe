import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    event_date: "",
    event_time: "",
    guest_count: "",
    table_count: "",
    table_shape: "",
  });

  const [success, setSuccess] = useState(false);
  const [rsvpLink, setRsvpLink] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("arrangemeUser");
    if (!stored) {
      navigate("/");
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("arrangemeUser");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        const link = data.rsvpLink || (data.event && `http://localhost:5173/rsvp/${data.event.event_code}`) || (data.event_code && `http://localhost:5173/rsvp/${data.event_code}`) || "";
        setRsvpLink(link);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (success) {
    return (
      <div className="success-screen">
        <h2>🎉 Event Successfully Created!</h2>
        <p>Your event has been saved.</p>

        <p><strong>Tables Registered:</strong> {form.table_count}</p>
        <p><strong>Table Shape:</strong> {form.table_shape}</p>

        <div className="rsvp-section" style={{ marginTop: "20px" }}>
          <p><strong>RSVP Link:</strong></p>

          <input
            value={rsvpLink}
            readOnly
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginBottom: "10px"
            }}
          />

          <button
            onClick={() => navigator.clipboard.writeText(rsvpLink)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              backgroundColor: "#6a5acd",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}
          >
            Copy RSVP Link
          </button>
        </div>

        <button
          onClick={() => window.location.href = "/"}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#6a5acd",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Start ArrangeMe
        </button>
      </div>
    );
  }

  return (
    <div className="create-event-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <h2 style={{ margin: 0 }}>Create Event</h2>
          {user && <p style={{ margin: "6px 0 0", color: "#666" }}>Signed in as {user.name || user.email}</p>}
        </div>
        <button type="button" onClick={handleLogout} style={{ padding: "10px 16px", borderRadius: "8px", background: "#e76f51", color: "white", border: "none", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Event Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          type="date"
          name="event_date"
          value={form.event_date}
          onChange={handleChange}
        />

        <input
          type="time"
          name="event_time"
          value={form.event_time}
          onChange={handleChange}
        />

        <input
          type="number"
          name="guest_count"
          placeholder="Number of Guests"
          value={form.guest_count}
          onChange={handleChange}
        />

        <input
          type="number"
          name="table_count"
          placeholder="Number of Tables"
          value={form.table_count}
          onChange={handleChange}
        />

        <select
          name="table_shape"
          value={form.table_shape}
          onChange={handleChange}
        >
          <option value="">Select Table Shape</option>
          <option value="round">Round</option>
          <option value="square">Square</option>
          <option value="rectangle">Rectangle</option>
        </select>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
