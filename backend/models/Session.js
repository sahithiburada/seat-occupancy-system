const mongoose = require("mongoose");

/* ================= SEAT ================= */
const seatSchema = new mongoose.Schema({
  seatId: String,
  occupied: { type: Boolean, default: false },
  scannedAt: Date,
  late: { type: Boolean, default: false }
});

/* ================= BOOKING ================= */
const bookingSchema = new mongoose.Schema({
  bookingId: String,
  seats: [seatSchema]
});

/* ================= SESSION ================= */
const sessionSchema = new mongoose.Schema({
  eventName: { type: String, required: true },

  sessionDate: { type: String, required: true }, // YYYY-MM-DD
  sessionStart: { type: String, required: true }, // HH:mm
  sessionEnd: { type: String, required: true },

  graceMinutes: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["active", "ended"],
    default: "active"
  },

  bookings: { type: [bookingSchema], default: [] },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Session", sessionSchema);
