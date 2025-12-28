import { useEffect, useMemo, useState } from "react";
import "./PastSessions.css";
import * as XLSX from "xlsx";

const API = "http://localhost:5000/api";

export default function PastSessions() {
  const [showDetails, setShowDetails] = useState(false);
  const [searchEvent, setSearchEvent] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchEvent.trim()) params.append("eventName", searchEvent.trim());
      if (searchDate) params.append("date", searchDate);

      const res = await fetch(`${API}/session/search?${params.toString()}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      } else {
        setSessions([]);
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  /* ================= DELETE ================= */
const deleteSession = async (sessionId) => {
  if (!window.confirm("Are you sure you want to delete this session?")) return;

  try {
    const res = await fetch(`${API}/session/${sessionId}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    fetchSessions(); // 🔄 refresh table
  } catch (err) {
    alert(err.message || "Delete failed");
  }
};


  /* ================= FLATTEN SCANS ================= */
  const scanRows = useMemo(() => {
    const rows = [];

    sessions.forEach(session => {
      session.bookings?.forEach(booking => {
        booking.seats?.forEach(seat => {
          if (seat.occupied) {
            rows.push({
              eventName: session.eventName,
              date: session.sessionDate,
              bookingId: booking.bookingId,
              seat: seat.seatId,
              scanTime: seat.scannedAt
                ? new Date(seat.scannedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })
                : "",
              late: seat.late
            });
          }
        });
      });
    });

    return rows;
  }, [sessions]);

  /* ================= EXCEL ================= */
  const downloadExcel = () => {
    if (!scanRows.length) return;

    const sheet = XLSX.utils.json_to_sheet(
      scanRows.map(r => ({
        "Event Name": r.eventName,
        Date: r.date,
        "Booking ID": r.bookingId,
        Seat: r.seat,
        "Scan Time": r.scanTime,
        Late: r.late ? "Yes" : "No"
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Seat Scans");
    XLSX.writeFile(wb, "Seat_Occupancy_Report.xlsx");
  };

  return (
    <div className="past-card">
      <div className="past-header">
        <div className="past-title">
          <span className="icon">🕘</span>
          <h2>Past Sessions & Reports</h2>
        </div>

        <button
          className="toggle-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide Details ▲" : "Show Details ▼"}
        </button>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label>Event Name</label>
          <input
            value={searchEvent}
            onChange={e => setSearchEvent(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Date</label>
          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
          />
        </div>

        <button className="apply-btn" onClick={fetchSessions}>
          Apply
        </button>
        {scanRows.length > 0 && (
    <button className="excel-btn" onClick={downloadExcel}>
      ⬇ Download Excel
    </button>
  )}
      </div>

      {showDetails && (
        <div className="table-wrapper">
          {loading ? (
            <p style={{ padding: 20 }}>Loading...</p>
          ) : sessions.length === 0 ? (
            <p style={{ padding: 20 }}>No sessions found</p>
          ) : (
            <>
              {/* SESSION SUMMARY */}
              <table>
                <thead>
  <tr>
    <th>Event</th>
    <th>Date</th>
    <th>Time</th>
    <th>Status</th>
    <th>Total Scans</th>
    <th>Action</th> {/* ✅ NEW */}
  </tr>
</thead>

                <tbody>
                  {sessions.map((s, i) => (
  <tr key={i}>
    <td>{s.eventName}</td>
    <td>{s.sessionDate}</td>
    <td>{s.sessionStart} – {s.sessionEnd}</td>
    <td>
      <span className="badge late">Ended</span>
    </td>
    <td>
      {s.bookings?.reduce(
        (acc, b) =>
          acc +
          (b.seats?.filter(seat => seat.occupied).length || 0),
        0
      )}
    </td>

    {/* ✅ NEW DELETE BUTTON */}
    <td>
      <button
        className="delete-btn"
        onClick={() => deleteSession(s._id)}
      >
        🗑 Delete
      </button>
    </td>
  </tr>
))}

                </tbody>
              </table>

              {/* SCAN DETAILS */}
              {scanRows.length > 0 && (
                <>
                  <h3 style={{ marginTop: 24 }}>Seat Scan Details</h3>

                  <table>
                    <thead>
                      <tr>
                        <th>Event</th>
                        <th>Date</th>
                        <th>Booking</th>
                        <th>Seat</th>
                        <th>Time</th>
                        <th>Late</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scanRows.map((r, i) => (
                        <tr key={i}>
                          <td>{r.eventName}</td>
                          <td>{r.date}</td>
                          <td>{r.bookingId}</td>
                          <td>{r.seat}</td>
                          <td>{r.scanTime}</td>
                          <td>
                            <span className={`badge ${r.late ? "late" : "on-time"}`}>
                              {r.late ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
