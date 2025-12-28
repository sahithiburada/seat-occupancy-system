const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Session = require("../models/Session");

/* ================= SEARCH ENDED SESSIONS ================= */
router.get("/search", async (req, res) => {
  try {
    const query = { status: "ended" };

    if (req.query.eventName && req.query.eventName.trim()) {
      query.eventName = {
        $regex: req.query.eventName.trim(),
        $options: "i"
      };
    }

    if (req.query.date) {
      // 🔥 NORMALIZE DATE TO YYYY-MM-DD
      const parts = req.query.date.split("-");
      if (parts[0].length === 2) {
        // DD-MM-YYYY → YYYY-MM-DD
        query.sessionDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        // already YYYY-MM-DD
        query.sessionDate = req.query.date;
      }
    }

    const sessions = await Session.find(query).sort({ createdAt: -1 });

    res.json({ success: true, sessions });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({ success: false });
  }
});


/* ================= GET SESSION BY ID ================= */
router.get("/:sessionId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const occupiedSeats = [];

session.bookings?.forEach(b => {
  b.seats?.forEach(s => {
    if (s.occupied) occupiedSeats.push(s.seatId);
  });
});

res.json({
  ...session.toObject(),
  occupiedSeats
});

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch session" });
  }
});

/* ================= CREATE SESSION ================= */
router.post("/create", async (req, res) => {
  try {
    let {
      eventName,
      sessionDate,
      sessionStart,
      sessionEnd,
      graceMinutes
    } = req.body;

    if (!eventName || !sessionDate || !sessionStart || !sessionEnd) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    eventName = eventName.trim();

    const overlapping = await Session.findOne({
      sessionDate,
      status: "active",
      $expr: {
        $and: [
          { $lt: ["$sessionStart", sessionEnd] },
          { $gt: ["$sessionEnd", sessionStart] }
        ]
      }
    });

    if (overlapping) {
      return res.status(409).json({
        message: "Another active session overlaps this time slot"
      });
    }

    const session = await Session.create({
      eventName,
      sessionDate,
      sessionStart,
      sessionEnd,
      graceMinutes,
      status: "active"
    });

    res.json({
      message: "Session created successfully",
      sessionId: session._id
    });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Create session failed" });
  }
});

/* ================= UPDATE SESSION ================= */
router.put("/:sessionId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "ended") {
      return res.status(403).json({ message: "Session already ended" });
    }

    if (req.body.eventName && req.body.eventName.trim()) {
      session.eventName = req.body.eventName.trim();
    }
    if (req.body.sessionStart) {
      session.sessionStart = req.body.sessionStart;
    }
    if (req.body.sessionEnd) {
      session.sessionEnd = req.body.sessionEnd;
    }
    if (req.body.graceMinutes !== undefined) {
      session.graceMinutes = req.body.graceMinutes;
    }

    await session.save();

    res.json({ message: "Session updated successfully" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ================= END SESSION ================= */
router.post("/end/:sessionId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "ended";
    await session.save();

    res.json({ message: "Session ended successfully" });
  } catch (err) {
    console.error("END ERROR:", err);
    res.status(500).json({ message: "End session failed" });
  }
});

module.exports = router;

/* ================= DELETE SESSION ================= */
router.delete("/:sessionId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.sessionId)) {
      return res.status(400).json({ message: "Invalid session id" });
    }

    const deleted = await Session.findByIdAndDelete(req.params.sessionId);
    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ success: true, message: "Session deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

