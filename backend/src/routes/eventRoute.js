import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
  getEventByCode,
  submitRSVP
} from "../controllers/eventControl.js";

const router = express.Router();

router.post("/events", createEvent);
router.get("/events", getEvents);
router.get("/events/:event_code", getEventByCode);
router.put("/events/:eventId", updateEvent);
router.delete("/events/:eventId", deleteEvent);

router.post("/rsvp/:event_code", submitRSVP);

export default router;
