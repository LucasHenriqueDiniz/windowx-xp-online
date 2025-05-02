"use client";
import { useCursor, CursorData } from "@/context/CursorContext";
import { memo } from "react";

export default function CursorOverlay() {
  const { cursors } = useCursor();

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {cursors.map((cursor) => (
        <MemoizedRemoteCursor
          key={cursor.id}
          cursor={cursor}
        />
      ))}
    </div>
  );
}

interface RemoteCursorProps {
  cursor: CursorData;
}

// Base RemoteCursor component
function RemoteCursor({ cursor }: RemoteCursorProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${cursor.position.x}px`,
        top: `${cursor.position.y}px`,
        transform: "translate(0, 0)",
        transition: "left 0.1s linear, top 0.1s linear",
        zIndex: 9999,
        willChange: "left, top", // Optimize for animations
      }}
    >
      {/* Windows XP style cursor */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1L11 11L7 17L9 19L13 13L21 21V1H1Z"
          fill="white"
          stroke={cursor.color}
          strokeWidth="1.5"
        />
      </svg>

      {/* Username tooltip */}
      <div
        className="absolute whitespace-nowrap px-2 py-1 rounded text-xs font-bold shadow-md select-none"
        style={{
          backgroundColor: cursor.color,
          color: "#FFFFFF",
          left: "15px",
          top: "5px",
        }}
      >
        {cursor.displayName}
      </div>
    </div>
  );
}

// Memoize the RemoteCursor component to prevent unnecessary re-renders
// Only re-render when the cursor's position, color, or displayName changes
const MemoizedRemoteCursor = memo(RemoteCursor, (prevProps, nextProps) => {
  return (
    prevProps.cursor.position.x === nextProps.cursor.position.x &&
    prevProps.cursor.position.y === nextProps.cursor.position.y &&
    prevProps.cursor.color === nextProps.cursor.color &&
    prevProps.cursor.displayName === nextProps.cursor.displayName
  );
});
