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
        if (res.ok) setEvent(data.event);
      } catch (err) {
        console.error(err);
      }
    };

    if (event_code) fetchEvent();
  }, [event_code]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`http://localhost:8001/api/rsvp/${event_code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "RSVP submitted — thank you!");
        setForm({ guest_name: "", relationship: "", phone: "" });
      } else {
        setMessage(data.message || "Failed to submit RSVP.");
      }
    } catch (err) {
      setMessage("Unable to submit RSVP right now.");
    }
  };

  return (
    <div className="create-event-container">
      <h2>Guest RSVP</h2>

      {event ? (
        <div style={{ marginBottom: "8px", color: "#666" }}>
          <p style={{ margin: 0 }}><strong>{event.name}</strong></p>
          <p style={{ margin: 0 }}>{event.event_date} {event.event_time}</p>
        </div>
      ) : (
        <p style={{ color: "#666" }}>Loading event...</p>
      )}

      <form onSubmit={handleSubmit}>
        <input name="guest_name" placeholder="Your name" value={form.guest_name} onChange={handleChange} />
        <input name="relationship" placeholder="Relationship to host" value={form.relationship} onChange={handleChange} />
        <input name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
        <button type="submit">Submit RSVP</button>
      </form>

      {message && <p style={{ marginTop: "12px" }}>{message}</p>}
    </div>
  );
}
