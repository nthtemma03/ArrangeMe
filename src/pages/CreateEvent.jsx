import { useState } from "react";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    event_date: "",
    event_time: "",
    guest_count: "",
    table_count: ""
  });

  const handleChange = (e) => {
    if (!e || !e.target) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:8001/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await response.json();
    alert("Event created successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Event Name"
          value={form.name}
          onChange={handleChange}
        /><br/>

        <input
          type="date"
          name="event_date"
          value={form.event_date}
          onChange={handleChange}
        /><br/>

        <input
          type="time"
          name="event_time"
          value={form.event_time}
          onChange={handleChange}
        /><br/>

        <input
          type="number"
          name="guest_count"
          placeholder="Number of Guests"
          value={form.guest_count}
          onChange={handleChange}
        /><br/>

        <input
          type="number"
          name="table_count"
          placeholder="Number of Tables"
          value={form.table_count}
          onChange={handleChange}
        /><br/>

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
