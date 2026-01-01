/* =========================================================
   SEATING LAYOUT – EASY EXPLANATION FILE
   =========================================================

   PURPOSE OF THIS FILE:
   ---------------------
   👉 This file controls the FULL SEATING AREA
   👉 It arranges rows (A, B, C...) one below another
   👉 It does NOT decide seat colors or seat size
      (those are handled in Row.jsx and Seat.jsx)

   IMPORTANT FOR CLIENT:
   ---------------------
   ✔ If you want to ADD / REMOVE rows → edit officeLayout.js
   ✔ If you want to CHANGE seat positions → edit officeLayout.js
   ✔ If you want to CHANGE seat color → edit Seat.jsx
   ✔ If you want to CHANGE row spacing → edit Row.jsx

   This file only:
   ----------------
   ✔ Loops through all rows
   ✔ Sends seat data to each row
   ✔ Makes the layout responsive (scroll + scale)

========================================================= */

import { seatingLayout } from "../layouts/officeLayout";
import Row from "./Row";

export default function SeatingLayout({
  occupiedSeats = [],   // List of seats already scanned
  lateSeats = []        // List of seats scanned late
}) {
  return (
    /* -----------------------------------------------------
       OUTER CONTAINER (SCROLL)
       -----------------------------------------------------
       - On mobile: allows horizontal scrolling
       - On desktop: looks normal (no scroll)
       - This gives BookMyShow-like behavior
    ----------------------------------------------------- */
    <div className="seating-scroll">

      {/* ---------------------------------------------------
         INNER CONTAINER (FIXED WIDTH)
         ---------------------------------------------------
         - Keeps desktop layout exactly the same
         - Scales down on tablet & mobile via CSS
      --------------------------------------------------- */}
      <div className="seating-container">

        {/* -----------------------------------------------
           LOOP THROUGH EACH ROW
           -----------------------------------------------
           seatingLayout comes from officeLayout.js
           Example rows: A, B, C, D...
        ----------------------------------------------- */}
        {seatingLayout.map((row) => (
          <Row
            key={row.row}          // Unique key (row letter)
            rowLabel={row.row}     // Row name shown on left (A, B, C)
            seats={row.seats}      // Seat positions for this row
            occupiedSeats={occupiedSeats} // Red seats
            lateSeats={lateSeats}         // Orange seats
          />
        ))}

      </div>
    </div>
  );
}
