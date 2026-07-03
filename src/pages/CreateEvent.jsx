import { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    event_date: "",
    event_time: "",
    guest_count: "",
    table_count: "",
  });
  const [message, setMessage] = useState("");
  const [rsvpLink, setRsvpLink] = useState("");

  const handleChange = (e) => {
    if (!e || !e.target) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setRsvpLink("");

    try {
      const response = await fetch("http://localhost:8001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Event created successfully!");
        setRsvpLink(data.rsvpLink || "");
      } else {
        setMessage(data.message || "Unable to create event.");
      }
    } catch (error) {
      setMessage("Unable to create event right now.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "480px", margin: "0 auto" }}>
      <h2>Create Event</h2>
      <p>Add your event details and ArrangeMe will generate a guest RSVP link.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input name="name" placeholder="Event Name" value={form.name} onChange={handleChange} style={styles.input} />
        <input type="date" name="event_date" value={form.event_date} onChange={handleChange} style={styles.input} />
        <input type="time" name="event_time" value={form.event_time} onChange={handleChange} style={styles.input} />
        <input type="number" name="guest_count" placeholder="Number of Guests" value={form.guest_count} onChange={handleChange} style={styles.input} />
        <input type="number" name="table_count" placeholder="Number of Tables" value={form.table_count} onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>Create Event</button>
      </form>

      {message && <p style={{ marginTop: "16px" }}>{message}</p>}
      {rsvpLink && (
        <div style={{ marginTop: "12px", padding: "12px", background: "#f5f5f5", borderRadius: "8px" }}>
          <strong>Your event link:</strong>
          <p style={{ wordBreak: "break-all" }}>{rsvpLink}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
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
};
