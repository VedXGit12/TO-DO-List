import { motion } from "framer-motion";
import { isToday as checkIsToday } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import { useUIStore, ACCENT_COLORS } from "../../store/uiStore";
import TaskChip from "../ui/TaskChip";
import type { Todo } from "../../types/todo";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

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
  const maxVisible = 3;
  const overflow = todos.length - maxVisible;
  const { accentColor } = useUIStore();
  const accentHex = ACCENT_COLORS[accentColor];

  const { setNodeRef, isOver } = useDroppable({
    id: date.toISOString(),
    data: { date },
  });

  return (
    <motion.div
      ref={setNodeRef}
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      animate={{
        backgroundColor: isSelected
          ? hexToRgba(accentHex, 0.10)
          : isOver
            ? hexToRgba(accentHex, 0.08)
            : "transparent",
      }}
      transition={{ duration: 0.15 }}
      className="day-cell"
      style={{
        minHeight: 90,
        padding: 4,
        borderRadius: 6,
        border: today ? "1px solid var(--accent)" : "1px solid transparent",
        opacity: isCurrentMonth ? 1 : 0.35,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        boxShadow: hasOverdue && isCurrentMonth
          ? "0 0 0 1px rgba(239,68,68,0.4)"
          : "none",
      }}
    >
      {/* Day number */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        <span
          style={{
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontSize: 11,
            fontWeight: 600,
            background: today ? "var(--accent)" : "transparent",
            color: today ? "var(--bg-base)" : "var(--text-primary)",
          }}
        >
          {dayNum}
        </span>
      </div>

      {/* Task chips */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {todos.slice(0, maxVisible).map((todo) => (
          <TaskChip key={todo.id} todo={todo} />
        ))}
        {overflow > 0 && (
          <span
            style={{
              fontSize: 10,
              color: "var(--text-secondary)",
              paddingLeft: 6,
              lineHeight: "16px",
            }}
          >
            +{overflow} more
          </span>
        )}
      </div>

      {/* Overdue pulse overlay */}
      {hasOverdue && isCurrentMonth && (
        <div className="overdue-pulse" />
      )}
    </motion.div>
  );
}
