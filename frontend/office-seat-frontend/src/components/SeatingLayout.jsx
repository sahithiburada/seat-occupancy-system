import { seatingLayout } from "../layouts/officeLayout";
import Row from "./Row";

export default function SeatingLayout({ occupiedSeats = [], lateSeats = [] }) {
  return (
    <div className="seating-scroll">
      <div className="seating-container">
        {seatingLayout.map((row) => (
          <Row
            key={row.row}
            rowLabel={row.row}
            seats={row.seats}
            occupiedSeats={occupiedSeats}
            lateSeats={lateSeats}
          />
        ))}
      </div>
    </div>
  );
}
