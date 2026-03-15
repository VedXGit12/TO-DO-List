import { isToday as checkIsToday } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import type { Todo } from "../../types/todo";

const PRIORITY_DOT_COLOR: Record<number, string> = {
  1: "#F5A623",
  2: "#F5A623",
  3: "#5B9CF6",
  4: "#48DA8A",
};

interface DayCellProps {
  date: Date;
  todos: Todo[];
  isCurrentMonth: boolean;
  isSelected: boolean;
  hasOverdue: boolean;
  onClick: () => void;
}

export default function DayCell({
  date,
  todos,
  isCurrentMonth,
  isSelected,
  hasOverdue,
  onClick,
}: DayCellProps) {
  const today = checkIsToday(date);
  const dayNum = date.getDate();

  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
    data: { date },
  });

  // Show max 3 dots
  const dotColors = todos.slice(0, 3).map((t) => PRIORITY_DOT_COLOR[t.priority] ?? "#48DA8A");

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      style={{
        minHeight: 90,
        padding: "8px 4px",
        background: isOver ? "rgba(255,255,255,0.04)" : "transparent",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "background 0.15s",
      }}
    >
      {/* Day number */}
      <div style={{ position: "relative", marginBottom: 6 }}>
        {today ? (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #F5A623 0%, #E8940A 100%)",
              boxShadow: "0 0 20px rgba(245,166,35,0.50), 0 4px 12px rgba(0,0,0,0.30)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {dayNum}
            </span>
          </div>
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: isSelected ? "rgba(255,255,255,0.10)" : "transparent",
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: isSelected ? 600 : 400,
                color: isCurrentMonth
                  ? "rgba(255,255,255,0.75)"
                  : "rgba(255,255,255,0.22)",
              }}
            >
              {dayNum}
            </span>
          </div>
        )}
      </div>

      {/* Task dots */}
      {dotColors.length > 0 && (
        <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
          {dotColors.map((color, i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
