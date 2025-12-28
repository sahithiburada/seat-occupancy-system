export const TOTAL_COLUMNS = 34;

export const seatingLayout = [
  {
    row: "A",
    seats: Object.fromEntries(
      Array.from({ length: 28 }, (_, i) => [i + 4, `A${i + 1}`])
    )
  },

  {
    row: "B",
    seats: {
      ...mapRange(3, 8, "B", 1),
      ...mapRange(11, 24, "B", 7),
      ...mapRange(27, 32, "B", 21)
    }
  },

  {
    row: "C",
    seats: {
      ...mapRange(3, 8, "C", 1),
      ...mapRange(11, 24, "C", 7),
      ...mapRange(27, 32, "C", 21)
    }
  },

  {
    row: "D",
    seats: {
      ...mapRange(2, 8, "D", 1),
      ...mapRange(11, 24, "D", 8),
      ...mapRange(27, 33, "D", 22)
    }
  },

  {
    row: "E",
    seats: {
      ...mapRange(2, 8, "E", 1),
      ...mapRange(11, 24, "E", 8),
      ...mapRange(27, 33, "E", 22)
    }
  },

  {
    row: "F",
    seats: {
      ...mapRange(1, 8, "F", 1),
      ...mapRange(11, 24, "F", 9),
      ...mapRange(27, 34, "F", 23)
    }
  },

  {
    row: "G",
    seats: {
      ...mapRange(2, 8, "G", 1),
      ...mapRange(11, 24, "G", 8),
      ...mapRange(27, 33, "G", 22)
    }
  },

  {
    row: "H",
    seats: {
      ...mapRange(2, 7, "H", 1),
      ...mapRange(11, 24, "H", 7),
      ...mapRange(28, 33, "H", 21)
    }
  },

  {
    row: "I",
    seats: mapRange(11, 24, "I", 1)
  },

  {
    row: "J",
    seats: mapRange(11, 24, "J", 1)
  }
];

/* ---------------- HELPERS ---------------- */

function mapRange(startCol, endCol, row, startSeat) {
  const map = {};
  let seat = startSeat;

  for (let col = startCol; col <= endCol; col++) {
    map[col] = `${row}${seat++}`;
  }
  return map;
}
