import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function RSVPPage() {
  const { event_code } = useParams();
  const [event, setEvent] = useState(null);
  const [form, setForm] = useState({ guest_name: "", relationship: "", phone: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:8001/api/events/${event_code}`);
        const data = await res.json();
        if (res.ok) {
          setEvent(data.event);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
  }, [event_code]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8001/api/rsvp/${event_code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message || "RSVP submitted successfully");
    } catch (error) {
      setMessage("Unable to submit RSVP right now.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "480px", margin: "0 auto" }}>
      <h2>Guest RSVP</h2>
      {event ? (
        <>
          <p><strong>Event:</strong> {event.name}</p>
          <p><strong>Date:</strong> {event.event_date}</p>
          <p><strong>Time:</strong> {event.event_time}</p>
        </>
      ) : (
        <p>Loading event...</p>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
        <input name="guest_name" placeholder="Your name" value={form.guest_name} onChange={handleChange} style={styles.input} />
        <input name="relationship" placeholder="Relationship to host" value={form.relationship} onChange={handleChange} style={styles.input} />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} style={styles.input} />
        <button type="submit" style={styles.button}>Submit RSVP</button>
      </form>

      {message && <p style={{ marginTop: "12px" }}>{message}</p>}
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
