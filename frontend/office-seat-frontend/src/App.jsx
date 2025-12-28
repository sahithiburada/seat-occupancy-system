import { useEffect, useRef, useState } from "react";
import "./App.css";
import SeatingLayout from "./components/SeatingLayout";
import PastSessions from "./components/PastSessions";

const API = "http://localhost:5000/api";
const TOTAL_SEATS = 248;

export default function App() {
  const qrInputRef = useRef(null);
  const errorAudioRef = useRef(null);

  /* ================= SESSION ================= */
  const [sessionId, setSessionId] = useState(
    localStorage.getItem("sessionId")
  );

  const [eventName, setEventName] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [graceMinutes, setGraceMinutes] = useState(15);

  const [status, setStatus] = useState("idle");
  const [editing, setEditing] = useState(localStorage.getItem("editing") === "true");

  /* ================= SCAN ================= */
  const [qrValue, setQrValue] = useState("");
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [lateSeats, setLateSeats] = useState([]);

  

  /* ================= UI ================= */
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    errorAudioRef.current = new Audio("/error.mp3");
  }, []);

  const showPopup = (type, message) => {
    setPopup({ type, message });
    if (type === "error" && errorAudioRef.current) {
      errorAudioRef.current.currentTime = 0;
      errorAudioRef.current.play();
    }
    setTimeout(() => setPopup(null), 2500);
  };

  /* ================= RESTORE SESSION ================= */
  useEffect(() => {
    if (!sessionId) return;

    fetch(`${API}/session/${sessionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          localStorage.removeItem("sessionId");
          setSessionId(null);
          setStatus("idle");
          return;
        }

        setEventName(data.eventName);
        setSessionDate(data.sessionDate);
        setStartTime(data.sessionStart);
        setEndTime(data.sessionEnd);
        setGraceMinutes(data.graceMinutes);
        setOccupiedSeats(data.occupiedSeats || []);
        setLateSeats(data.lateSeats || []);
        setStatus(data.status);
      })
      .catch(() => {
        localStorage.removeItem("sessionId");
        setSessionId(null);
        setStatus("idle");
      });
  }, [sessionId]);

  /* ================= CREATE ================= */
  const createSession = async () => {
    if (!eventName || !sessionDate || !startTime || !endTime) {
      showPopup("error", "Fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${API}/session/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventName,
          sessionDate,
          sessionStart: startTime,
          sessionEnd: endTime,
          graceMinutes
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("sessionId", data.sessionId);
      setSessionId(data.sessionId);
      setStatus("active");
      showPopup("success", "Session created");
      setTimeout(() => qrInputRef.current?.focus(), 200);
    } catch (err) {
      showPopup("error", err.message);
    }
  };
  /* ================= UPDATE (EDIT SAVE) ================= */
const updateSession = async () => {
  if (!sessionId) return;

  try {
    const res = await fetch(`${API}/session/${sessionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionStart: startTime,
        sessionEnd: endTime,
        graceMinutes
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setEditing(false);
    localStorage.removeItem("editing");
    showPopup("success", "Session updated");
  } catch (err) {
    showPopup("error", err.message || "Update failed");
  }
};

  /* ================= END ================= */
  const endSession = async () => {
    if (!sessionId) return;

    try {
      await fetch(`${API}/session/end/${sessionId}`, { method: "POST" });

      localStorage.removeItem("sessionId");
      localStorage.removeItem("editing");
      setSessionId(null);
      setStatus("idle");
      setOccupiedSeats([]);
      setEventName("");
      setSessionDate("");
      setStartTime("");
      setEndTime("");
      setGraceMinutes(15);
      showPopup("success", "Session ended");
    } catch {
      showPopup("error", "End session failed");
    }
  };

  /* ================= AUTO SCAN ================= */
  useEffect(() => {
    if (!qrValue || status !== "active" || editing) return;
    const t = setTimeout(() => scanQR(qrValue), 120);
    return () => clearTimeout(t);
  }, [qrValue]);

  const scanQR = async (qrData) => {
    try {
      const res = await fetch(`${API}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, qrData })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setOccupiedSeats(data.occupiedSeats);
      setLateSeats(data.lateSeats || []);
      setQrValue("");
    } catch (err) {
      showPopup("error", err.message);
      setQrValue("");
    }
  };

  const occupiedCount = occupiedSeats.length;
  const availableCount = TOTAL_SEATS - occupiedCount;

  /* ================= UI ================= */
  return (
    <div className="app">
      {popup && (
  <div className={`popup-overlay`}>
    <div className={`popup-card ${popup.type}`}>
      <div className="popup-icon">
        {popup.type === "error" && "❌"}
        {popup.type === "success" && "✅"}
        {popup.type === "warning" && "⚠️"}
      </div>

      <div className="popup-content">
        <h4>
          {popup.type === "error" && "Action Required"}
          {popup.type === "success" && "Success"}
          {popup.type === "warning" && "Attention"}
        </h4>
        <p>{popup.message}</p>
      </div>
    </div>
  </div>
)}
      {/* HEADER */}
      <div className="header">
        <div>
          <h1>Seating Dashboard</h1>
          <p className="sub-title">Live seat occupancy</p>
        </div>

        <div className="event-name-box">
          <label>Event Name</label>
          <input
            value={eventName}
            disabled={status === "active"}
            onChange={e => setEventName(e.target.value)}
          />
        </div>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <div className="field">
          <label>Date</label>
          <input type="date" value={sessionDate} disabled={status === "active"} onChange={e => setSessionDate(e.target.value)} />
        </div>

        <div className="field">
          <label>Start</label>
          <input
  type="time"
  value={startTime}
  disabled={status === "active" && !editing}
  onChange={e => setStartTime(e.target.value)}
/>

        </div>

        <div className="field">
          <label>End</label>
          <input
  type="time"
  value={endTime}
  disabled={status === "active" && !editing}
  onChange={e => setEndTime(e.target.value)}
/>

        </div>

        <div className="field">
          <label>Grace</label>
          <input
  type="number"
  value={graceMinutes}
  disabled={status === "active" && !editing}
  onChange={e => setGraceMinutes(+e.target.value)}
/>

        </div>

        {status === "idle" && <button className="primary-btn" onClick={createSession}>▶ Create</button>}
        {status === "active" && !editing && (
  <>
    <button
  className="primary-btn"
  onClick={() => {
    setEditing(true);
    localStorage.setItem("editing", "true");
  }}
>
  ✏ Edit
</button>

    <button className="danger-btn" onClick={endSession}>
      ⛔ End
    </button>
  </>
)}
{editing && (
  <>
    <button className="primary-btn" onClick={updateSession}>
      💾 Save
    </button>
    <button
      className="danger-btn"
      onClick={() => setEditing(false)}
    >
      ✖ Cancel
    </button>
  </>
)}
      </div>

      {/* QR */}
      <div className="qr-wrapper">
        <div className="qr-card">
          <h3>Scan Ticket QR {status === "active" && <span className="active-dot">•</span>}</h3>
          <input
            ref={qrInputRef}
            value={qrValue}
            disabled={status !== "active"}
            onChange={e => setQrValue(e.target.value)}
            placeholder="Scan ticket..."
          />
        </div>
      </div>

      {/* SCREEN */}
      <div className="stage-wrapper">
        <div className="stage-curve"><span>SCREEN</span></div>
      </div>

      {/* SEATS */}
      <SeatingLayout 
        occupiedSeats={occupiedSeats}
        lateSeats={lateSeats}
       />

      {/* STATS BELOW SEATS */}
      <div className="stats-inline">
        <span className="stat total">Total {TOTAL_SEATS}</span>
        <span className="stat occupied">Occupied {occupiedCount}</span>
        <span className="stat available">Available {availableCount}</span>
      </div>

      <PastSessions />
      <footer>© 2025 Seat Occupancy System</footer>
    </div>
  );
}
