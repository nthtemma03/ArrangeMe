import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

const memoryEvents = [];

// create event
export const createEvent = async (req, res) => {
  try {
    const {
      name,
      event_date,
      event_time,
      guest_count,
      table_count,
      table_shape
    } = req.body;

    const event_code = uuidv4();

    const result = await pool.query(
      `INSERT INTO events 
      (name, event_date, event_time, guest_count, table_count, table_shape, event_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        name,
        event_date,
        event_time,
        guest_count,
        table_count,
        table_shape,
        event_code
      ]
    );

    const event = result.rows[0];
    const rsvpLink = `http://localhost:5173/rsvp/${event_code}`;

    res.status(201).json({
      message: "Event created successfully",
      event,
      event_code,
      rsvpLink
    });

  } catch (error) {
    console.warn("Database unavailable, using fallback:", error.message);

    const fallbackEvent = {
      id: Date.now(),
      name: req.body.name,
      event_date: req.body.event_date,
      event_time: req.body.event_time,
      guest_count: Number(req.body.guest_count || 0),
      table_count: Number(req.body.table_count || 0),
      table_shape: req.body.table_shape || null,
      event_code: uuidv4()
    };

    memoryEvents.unshift(fallbackEvent);

    const rsvpLink = `http://localhost:5173/rsvp/${fallbackEvent.event_code}`;

    res.status(201).json({
      message: "Event created successfully (fallback)",
      event: fallbackEvent,
      event_code: fallbackEvent.event_code,
      rsvpLink
    });
  }
};

// get all events
export const getEvents = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events");

    res.status(200).json({
      message: "Events retrieved successfully",
      events: result.rows
    });

  } catch (error) {
    console.warn("Database unavailable, using fallback:", error.message);

    res.status(200).json({
      message: "Events retrieved successfully (fallback)",
      events: memoryEvents
    });
  }
};

// update event
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { name, date, location } = req.body;

    const result = await pool.query(
      "UPDATE events SET name = $1, date = $2, location = $3 WHERE id = $4 RETURNING *",
      [name, date, location, eventId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      event: result.rows[0]
    });

  } catch (error) {
    console.error("Error updating event", error);
    res.status(500).json({ message: "Failed to update event" });
  }
};

// delete event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    await pool.query("DELETE FROM events WHERE id = $1", [eventId]);

    res.json({ message: "Event deleted successfully" });

  } catch (error) {
    console.error("Error deleting event", error);
    res.status(500).json({ message: "Failed to delete event" });
  }
};

// get event by event_code (used by RSVP page)
export const getEventByCode = async (req, res) => {
  const { event_code } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM events WHERE event_code = $1",
      [event_code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event retrieved successfully",
      event: result.rows[0]
    });

  } catch (error) {
    console.warn("Database unavailable, using fallback:", error.message);

    const event = memoryEvents.find(e => e.event_code === event_code);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event retrieved successfully (fallback)",
      event
    });
  }
};

// submit RSVP
export const submitRSVP = async (req, res) => {
  const { event_code } = req.params;
  const { guest_name, relationship, phone } = req.body;

  try {
    const eventResult = await pool.query(
      "SELECT id FROM events WHERE event_code = $1",
      [event_code]
    );

    if (eventResult.rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const eventId = eventResult.rows[0].id;

    await pool.query(
      "INSERT INTO rsvps (event_id, guest_name, relationship, phone) VALUES ($1, $2, $3, $4)",
      [eventId, guest_name, relationship, phone]
    );

    res.status(201).json({ message: "RSVP submitted successfully" });

  } catch (error) {
    console.error("Error saving RSVP:", error);
    res.status(500).json({ message: "Failed to submit RSVP" });
  }
};
