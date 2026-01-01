/* =========================================================
   PAST SESSIONS & REPORTS – EASY EXPLANATION FILE
   =========================================================

   PURPOSE OF THIS FILE:
   ---------------------
   👉 Shows OLD / COMPLETED sessions
   👉 Allows searching by Event Name or Date
   👉 Shows which seats were scanned
   👉 Shows whether entry was Late or On-Time
   👉 Allows Excel download
   👉 Allows deleting old sessions

   CLIENT NOTE:
   ------------
   ✔ If you want reports → this is the file
   ✔ Seating layout is NOT changed here
   ✔ This only shows history & reports

========================================================= */

import { useEffect, useMemo, useState } from "react";
import "./PastSessions.css";
import * as XLSX from "xlsx";

/* ---------------------------------------------------------
   BACKEND API URL
   ---------------------------------------------------------
   This tells frontend where backend is running.

   IMPORTANT:
   ----------
   ❗ Change this ONLY if backend URL changes.
--------------------------------------------------------- */
const API = "https://seat-occupancy-system.onrender.com/api";

export default function PastSessions() {

  /* -------------------------------------------------------
     STATES – THINK OF THESE AS STORAGE BOXES
     -------------------------------------------------------
     These store data temporarily for display.
  ------------------------------------------------------- */
  const [showDetails, setShowDetails] = useState(false); // Show / Hide tables
  const [searchEvent, setSearchEvent] = useState("");   // Event name filter
  const [searchDate, setSearchDate] = useState("");     // Date filter
  const [sessions, setSessions] = useState([]);         // All past sessions
  const [loading, setLoading] = useState(false);        // Loading indicator


  /* =======================================================
     FETCH PAST SESSIONS FROM BACKEND
     ======================================================= */
  const fetchSessions = async () => {
    setLoading(true);

    try {
      // Build search parameters (Event + Date)
      const params = new URLSearchParams();

      if (searchEvent.trim())
        params.append("eventName", searchEvent.trim());

      if (searchDate)
        params.append("date", searchDate);

      // Call backend API
      const res = await fetch(
        `${API}/session/search?${params.toString()}`
      );

      const data = await res.json();

      // Save results if successful
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

  /* -------------------------------------------------------
     AUTO LOAD DATA WHEN PAGE OPENS
  ------------------------------------------------------- */
  useEffect(() => {
    fetchSessions();
  }, []);


  /* =======================================================
     DELETE A SESSION (CLIENT CAN REMOVE OLD DATA)
     ======================================================= */
  const deleteSession = async (sessionId) => {

    // Confirmation popup
    if (!window.confirm("Are you sure you want to delete this session?"))
      return;

    try {
      const res = await fetch(`${API}/session/${sessionId}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Reload table after delete
      fetchSessions();

    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };


  /* =======================================================
     CONVERT NESTED DATA → SIMPLE TABLE ROWS
     =======================================================

     WHY THIS EXISTS:
     ----------------
     Backend stores data like:
       Session → Booking → Seats

     This block converts that into:
       Flat rows for tables & Excel

  ======================================================= */
  const scanRows = useMemo(() => {
    const rows = [];

    sessions.forEach(session => {
      session.bookings?.forEach(booking => {
        booking.seats?.forEach(seat => {

          // Only include seats that were scanned
          if (seat.occupied) {
            rows.push({
              eventName: session.eventName,
              date: session.sessionDate,
              bookingId: booking.bookingId,
              seat: seat.seatId,

              // Format scan time nicely
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


  /* =======================================================
     EXCEL DOWNLOAD
     ======================================================= */
  const downloadExcel = () => {
    if (!scanRows.length) return;

    // Convert rows to Excel sheet
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

    // Create Excel file
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, "Seat Scans");

    // Download file
    XLSX.writeFile(wb, "Seat_Occupancy_Report.xlsx");
  };


  /* =======================================================
     UI STARTS HERE
     ======================================================= */
  return (
    <div className="past-card">

      {/* HEADER */}
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


      {/* FILTER SECTION */}
      <div className="filters">

        {/* Event Name Filter */}
        <div className="filter-group">
          <label>Event Name</label>
          <input
            value={searchEvent}
            onChange={e => setSearchEvent(e.target.value)}
          />
        </div>

        {/* Date Filter */}
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

        {/* Excel button appears only if data exists */}
        {scanRows.length > 0 && (
          <button className="excel-btn" onClick={downloadExcel}>
            ⬇ Download Excel
          </button>
        )}
      </div>


      {/* DETAILS TABLE */}
      {showDetails && (
        <div className="table-wrapper">

          {loading ? (
            <p style={{ padding: 20 }}>Loading...</p>

          ) : sessions.length === 0 ? (
            <p style={{ padding: 20 }}>No sessions found</p>

          ) : (
            <>
              {/* SESSION SUMMARY TABLE */}
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Total Scans</th>
                    <th>Action</th>
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


              {/* SEAT SCAN DETAILS */}
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
                            <span
                              className={`badge ${
                                r.late ? "late" : "on-time"
                              }`}
                            >
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
