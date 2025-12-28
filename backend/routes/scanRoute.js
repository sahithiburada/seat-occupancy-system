const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

/* ================= SCAN QR ================= */
router.post("/", async (req, res) => {
  try {
    const { sessionId, qrData } = req.body;

    if (!sessionId || !qrData)
      return res.status(400).json({ message: "Missing data" });

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.status === "ended")
      return res.status(403).json({ message: "Session ended" });

    // QR format: D1,D2,D3|BK-002
    const [seatPart, bookingId] = qrData.split("|");
    if (!seatPart || !bookingId)
      return res.status(400).json({ message: "Invalid QR format" });

    const seatIds = seatPart.split(",");

    let booking = session.bookings.find(b => b.bookingId === bookingId);
    if (!booking) {
      booking = { bookingId, seats: seatIds.map(id => ({ seatId: id })) };
      session.bookings.push(booking);
    }

    const seat = booking.seats.find(s => !s.occupied);
    if (!seat)
      return res.status(409).json({ message: "All seats occupied" });

    /* ===== LATE ENTRY CALCULATION (FIXED) ===== */
    const now = new Date();

    const [endHour, endMin] = session.sessionEnd.split(":").map(Number);
    const sessionEndTime = new Date(session.sessionDate);
    sessionEndTime.setHours(endHour, endMin, 0, 0);

    // 🔥 LATE = scanned AFTER session end time
    const isLate = now > sessionEndTime;

    /* ===== SAVE SEAT ===== */
    seat.occupied = true;
    seat.scannedAt = now;
    seat.late = isLate;

    await session.save();

    /* ===== BUILD RESPONSE ARRAYS ===== */
    const occupiedSeats = [];
    const lateSeats = [];

    session.bookings.forEach(b =>
      b.seats.forEach(s => {
        if (s.occupied) {
          occupiedSeats.push(s.seatId);
          if (s.late) lateSeats.push(s.seatId);
        }
      })
    );

    res.json({
      message: `Seat ${seat.seatId} occupied`,
      occupiedSeats,
      lateSeats
    });
  } catch (err) {
    console.error("SCAN ERROR:", err);
    res.status(500).json({ message: "Scan failed" });
  }
});

module.exports = router;
