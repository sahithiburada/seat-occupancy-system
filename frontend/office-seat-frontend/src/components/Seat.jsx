/* =========================================================
   SEAT COMPONENT – EASY EXPLANATION FILE
   =========================================================

   PURPOSE OF THIS FILE:
   ---------------------
   👉 This file controls ONE SINGLE SEAT (small square box)
   👉 Example seats: A1, B12, F23, etc.
   👉 It decides:
        - Seat color (green / red / orange)
        - Seat size (responsive for mobile & desktop)
        - Hover animation
        - Seat label text

   IMPORTANT FOR CLIENT:
   ---------------------
   ✔ If you want to change seat COLORS → edit here
   ✔ If you want to change seat SIZE → edit here
   ✔ If you want to change hover effect → edit here
   ✔ You usually do NOT need to touch backend for this

========================================================= */

import { useState } from "react";

export default function Seat({ 
  label,      // Seat name like "A1", "B5"
  occupied,   // true if seat is already scanned
  late        // true if seat was scanned late
}) {

  /* -------------------------------------------------------
     HOVER STATE
     -------------------------------------------------------
     hovered = true when mouse is on the seat
     Used only for animation (zoom + glow)
  ------------------------------------------------------- */
  const [hovered, setHovered] = useState(false);

  /* -------------------------------------------------------
     BORDER COLOR LOGIC
     -------------------------------------------------------
     Priority order:
       1️⃣ Late seat    → ORANGE
       2️⃣ Occupied     → RED
       3️⃣ Available    → GREEN
  ------------------------------------------------------- */
  const borderColor = late
    ? "#f59e0b"        // ORANGE (Late entry)
    : occupied
    ? "#ef4444"        // RED (Already occupied)
    : "#22c55e";       // GREEN (Available)

  /* -------------------------------------------------------
     BACKGROUND COLOR LOGIC
     -------------------------------------------------------
     Light shades for better visibility
  ------------------------------------------------------- */
  const bgColor = late
    ? "rgba(245,158,11,0.25)"  // Light orange
    : occupied
    ? "#fee2e2"               // Light red
    : "#dcfce7";              // Light green

  /* -------------------------------------------------------
     TEXT COLOR LOGIC
     -------------------------------------------------------
     Seat label color matches seat status
  ------------------------------------------------------- */
  const textColor = late
    ? "#f59e0b"        // Orange text
    : occupied
    ? "#b91c1c"        // Dark red text
    : "#166534";       // Dark green text

  return (
    <div
      /* -----------------------------------------------
         MOUSE EVENTS
         -----------------------------------------------
         Used only for hover animation
      ----------------------------------------------- */
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}

      style={{
        /* ---------------------------------------------
           RESPONSIVE SEAT SIZE
           ---------------------------------------------
           clamp(min, responsive, max)
           Works for:
             - Mobile
             - Tablet
             - Desktop
        --------------------------------------------- */
        width: "clamp(22px, 4vw, 32px)",
        height: "clamp(22px, 4vw, 32px)",

        borderRadius: 6, // Rounded square shape

        /* ---------------------------------------------
           CENTER SEAT LABEL
        --------------------------------------------- */
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        fontSize: "clamp(8px, 2.5vw, 11px)",
        fontWeight: 600,

        cursor: "pointer",
        userSelect: "none",
        boxSizing: "border-box",

        /* ---------------------------------------------
           HOVER ANIMATION
        --------------------------------------------- */
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        transform: hovered ? "scale(1.08)" : "scale(1)",

        boxShadow: hovered
          ? "0 0 12px rgba(245,158,11,0.4)"
          : "none",

        /* ---------------------------------------------
           FINAL COLORS APPLIED
        --------------------------------------------- */
        border: `2px solid ${borderColor}`,
        backgroundColor: bgColor,
        color: textColor
      }}
    >
      {/* -----------------------------------------------
         SEAT LABEL (A1, B12, etc.)
      ----------------------------------------------- */}
      {label}
    </div>
  );
}
