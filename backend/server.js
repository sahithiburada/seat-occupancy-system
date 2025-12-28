const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */
const scanRoute = require("./routes/scanRoute");
const sessionRoute = require("./routes/sessionRoute");

// ✅ API ROUTE PREFIX (IMPORTANT)
app.use("/api/scan", scanRoute);
app.use("/api/session", sessionRoute);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("✅ Office Seat Occupancy Backend Running");
});

/* ================= DATABASE ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

