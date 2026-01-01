/* =========================================================
   ROW COMPONENT – EASY EXPLANATION FILE
   =========================================================

   PURPOSE OF THIS FILE:
   ---------------------
   👉 This file is responsible for ONE ROW of seats
   👉 Example: Row A, Row B, Row C, etc.
   👉 It arranges seats horizontally like a theatre row
   👉 It decides:
        - Which seats exist
        - Which seats are empty gaps
        - Which seats are occupied (RED)
        - Which seats are late entries (ORANGE)

   IMPORTANT FOR CLIENT:
   ---------------------
   ✔ You usually do NOT need to change this file
   ✔ Seating structure (rows & seat positions) is controlled
     from:
        👉 layouts/officeLayout.js
   ✔ This file only DRAWS the row on screen

========================================================= */

import Seat from "./Seat"; // Individual seat box (small square)
import { TOTAL_COLUMNS } from "../layouts/officeLayout"; 
// TOTAL_COLUMNS decides how wide the seating row is


export default function Row({
  rowLabel,          // Example: "A", "B", "C"
  seats,             // Seat positions for this row
  occupiedSeats = [],// List of seats already scanned
  lateSeats = []     // List of seats scanned late
}) {

  return (
    <div
      style={{
        /* --------------------------------------------------
           GRID LAYOUT FOR A SINGLE ROW
           --------------------------------------------------
           First column  : Row label (A / B / C)
           Remaining     : Seat boxes
           TOTAL_COLUMNS : Controls total width
        -------------------------------------------------- */

        display: "grid",

        // 24px → space for row label (A/B/C)
        // repeat(...) → creates seat columns
        gridTemplateColumns: 
          `24px repeat(${TOTAL_COLUMNS}, minmax(28px, 32px))`,

        gap: "6px",          // Space between seats
        alignItems: "center",
        marginBottom: "14px"
      }}
    >

      {/* ----------------------------------------------
          ROW LABEL (A, B, C...)
          ---------------------------------------------- */}
      <div style={{ fontWeight: 600 }}>
        {rowLabel}
      </div>

      {/* ----------------------------------------------
          LOOP THROUGH ALL COLUMNS
          ----------------------------------------------
          We go column by column (1 → TOTAL_COLUMNS)
          Some columns may NOT have seats (walkways)
      ---------------------------------------------- */}
      {Array.from({ length: TOTAL_COLUMNS }).map((_, index) => {

        const col = index + 1;       // Column number
        const seatLabel = seats[col]; 
        // Example: "A1", "A2", etc.

        /* ------------------------------------------
           IF NO SEAT EXISTS IN THIS COLUMN
           ------------------------------------------
           This creates an EMPTY SPACE (walkway)
        ------------------------------------------ */
        if (!seatLabel) {
          return (
            <div key={`empty-${rowLabel}-${col}`} />
          );
        }

        /* ------------------------------------------
           CHECK SEAT STATUS
        ------------------------------------------ */
        const isOccupied = occupiedSeats.includes(seatLabel);
        const isLate = lateSeats.includes(seatLabel);

        /* ------------------------------------------
           RENDER ACTUAL SEAT
           ------------------------------------------
           Color logic is handled inside Seat.jsx:
             - Green  → Available
             - Red    → Occupied
             - Orange → Late entry
        ------------------------------------------ */
        return (
          <Seat
            key={seatLabel}
            label={seatLabel}
            occupied={isOccupied}
            late={isLate}   // 🔥 This enables ORANGE color
          />
        );
      })}
    </div>
  );
}
