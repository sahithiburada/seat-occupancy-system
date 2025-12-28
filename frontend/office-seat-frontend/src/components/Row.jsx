import Seat from "./Seat";
import { TOTAL_COLUMNS } from "../layouts/officeLayout";

export default function Row({ rowLabel, seats, occupiedSeats = [], lateSeats = [] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `24px repeat(${TOTAL_COLUMNS}, minmax(28px, 32px))`,
        gap: "6px",
        alignItems: "center",
        marginBottom: "14px"
      }}
    >
      {/* Row label */}
      <div style={{ fontWeight: 600 }}>{rowLabel}</div>

      {Array.from({ length: TOTAL_COLUMNS }).map((_, index) => {
        const col = index + 1;
        const seatLabel = seats[col];

        if (!seatLabel) {
          return <div key={`empty-${rowLabel}-${col}`} />;
        }

        const isOccupied = occupiedSeats.includes(seatLabel);
        const isLate = lateSeats.includes(seatLabel);

        return (
          <Seat
            key={seatLabel}
            label={seatLabel}
            occupied={isOccupied}
            late={isLate}          // 🔥 THIS LINE FIXES ORANGE COLOR
          />
        );
      })}
    </div>
  );
}
