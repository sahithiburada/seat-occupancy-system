import { useState } from "react";

export default function Seat({ label, occupied, late }) {
  const [hovered, setHovered] = useState(false);

  const borderColor = late
    ? "#f59e0b"        // ORANGE
    : occupied
    ? "#ef4444"        // RED
    : "#22c55e";       // GREEN

  const bgColor = late
    ? "rgba(245,158,11,0.25)"
    : occupied
    ? "#fee2e2"
    : "#dcfce7";

  const textColor = late
    ? "#f59e0b"
    : occupied
    ? "#b91c1c"
    : "#166534";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "clamp(22px, 4vw, 32px)",
        height: "clamp(22px, 4vw, 32px)",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "clamp(8px, 2.5vw, 11px)",
        fontWeight: 600,
        cursor: "pointer",
        userSelect: "none",
        boxSizing: "border-box",

        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        transform: hovered ? "scale(1.08)" : "scale(1)",

        boxShadow: hovered
          ? "0 0 12px rgba(245,158,11,0.4)"
          : "none",

        border: `2px solid ${borderColor}`,
        backgroundColor: bgColor,
        color: textColor
      }}
    >
      {label}
    </div>
  );
}
