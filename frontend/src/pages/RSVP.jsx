import { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    event_date: "",
    event_time: "",
    guest_count: "",
    table_count: "",
    table_shape: ""
  });

  const [success, setSuccess] = useState(false);

  // RSVP link state
  const [rsvpLink, setRsvpLink] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8000/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (response.ok) {
      const data = await response.json();

      // Build RSVP link using event_code returned from backend
      setRsvpLink(`http://localhost:5173/rsvp/${data.event_code}`);

      setSuccess(true);
    }
  };

  //  SUCCESS SCREEN
  if (success) {
    return (
      <div className="success-screen">
        <h2>🎉 Event Successfully Created!</h2>
        <p>Your event has been saved.</p>

        <p><strong>Tables Registered:</strong> {form.table_count}</p>
        <p><strong>Table Shape:</strong> {form.table_shape}</p>

        {/*  RSVP Link Section */}
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

        {/*  Start ArrangeMe Button */}
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

  //  EVENT CREATION FORM
  return (
    <div className="create-event-container">
      <h2>Create Event</h2>

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
