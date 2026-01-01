/* =========================================================
   SEATING LAYOUT FILE – EASY EDIT GUIDE (NON-IT FRIENDLY)
   =========================================================

   IMPORTANT:
   ----------
   👉 This file controls ALL the seating shown on the screen.
   👉 You do NOT need coding knowledge to edit seats.
   👉 Only seat positions and names are defined here.

   WHAT YOU CAN DO SAFELY:
   -----------------------
   ✔ Add or remove rows
   ✔ Increase or decrease seats
   ✔ Change seat numbering (A1, A2 → A01, A02)
   ✔ Adjust gaps between seats (aisles)

   WHAT YOU SHOULD NOT CHANGE:
   ---------------------------
   ❌ Do NOT delete helper functions at the bottom
   ❌ Do NOT change other files for seating changes

   AFTER ANY CHANGE:
   -----------------
   ✔ Save the file
   ✔ Refresh the website
   ✔ Seating updates automatically

========================================================= */


/* ---------------------------------------------------------
   TOTAL_COLUMNS
   ---------------------------------------------------------
   This decides how wide the seating grid is.
   Think of this as the TOTAL possible seat positions
   including empty walking spaces.

   You normally DO NOT need to change this.
--------------------------------------------------------- */
export const TOTAL_COLUMNS = 34;


/* ---------------------------------------------------------
   SEATING LAYOUT STARTS HERE
   ---------------------------------------------------------
   Each block below represents ONE ROW (A, B, C, etc.)
   Seat gaps automatically create walking aisles.
--------------------------------------------------------- */
export const seatingLayout = [

  /* ================= ROW A =================
     Seats start from column 4
     Total seats in this row: 28
     Seat labels will be A1 → A28
  ------------------------------------------ */
  {
    row: "A", // Row name shown on screen

    seats: Object.fromEntries(
      // Automatically creates 28 seats
      // You usually DO NOT need to touch this
      Array.from({ length: 28 }, (_, i) => [i + 4, `A${i + 1}`])
    )
  },


  /* ================= ROW B =================
     This row has 3 seat blocks
     Empty spaces between blocks act as aisles
  ------------------------------------------ */
  {
    row: "B",
    seats: {
      // First block: B1 → B6
      ...mapRange(3, 8, "B", 1),

      // Middle block: B7 → B20
      ...mapRange(11, 24, "B", 7),

      // Last block: B21 → B26
      ...mapRange(27, 32, "B", 21)
    }
  },


  /* ================= ROW C ================= */
  {
    row: "C",
    seats: {
      ...mapRange(3, 8, "C", 1),
      ...mapRange(11, 24, "C", 7),
      ...mapRange(27, 32, "C", 21)
    }
  },


  /* ================= ROW D ================= */
  {
    row: "D",
    seats: {
      ...mapRange(2, 8, "D", 1),
      ...mapRange(11, 24, "D", 8),
      ...mapRange(27, 33, "D", 22)
    }
  },


  /* ================= ROW E ================= */
  {
    row: "E",
    seats: {
      ...mapRange(2, 8, "E", 1),
      ...mapRange(11, 24, "E", 8),
      ...mapRange(27, 33, "E", 22)
    }
  },


  /* ================= ROW F ================= */
  {
    row: "F",
    seats: {
      ...mapRange(1, 8, "F", 1),
      ...mapRange(11, 24, "F", 9),
      ...mapRange(27, 34, "F", 23)
    }
  },


  /* ================= ROW G ================= */
  {
    row: "G",
    seats: {
      ...mapRange(2, 8, "G", 1),
      ...mapRange(11, 24, "G", 8),
      ...mapRange(27, 33, "G", 22)
    }
  },


  /* ================= ROW H ================= */
  {
    row: "H",
    seats: {
      ...mapRange(2, 7, "H", 1),
      ...mapRange(11, 24, "H", 7),
      ...mapRange(28, 33, "H", 21)
    }
  },


  /* ================= ROW I =================
     Single block seating (no aisles)
  ------------------------------------------ */
  {
    row: "I",
    seats: mapRange(11, 24, "I", 1)
  },


  /* ================= ROW J ================= */
  {
    row: "J",
    seats: mapRange(11, 24, "J", 1)
  },
];


/* =========================================================
   HELPER FUNCTION – DO NOT DELETE
   =========================================================

   This function automatically creates seat numbers.
   It avoids manually writing A1, A2, A3, etc.

   Example:
   --------
   mapRange(3, 8, "B", 1)

   Means:
   - Seats start at column 3
   - End at column 8
   - Seat names start from B1

   RESULT:
   --------
   B1, B2, B3, B4, B5, B6

   ⚠️ CLIENT NOTE:
   ----------------
   You normally do NOT need to edit this function.
========================================================= */
function mapRange(startCol, endCol, row, startSeat) {
  const map = {};
  let seat = startSeat;

  for (let col = startCol; col <= endCol; col++) {
    map[col] = `${row}${seat++}`;
  }

  return map;
}
