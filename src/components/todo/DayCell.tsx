import { motion } from "framer-motion";
import { isToday as checkIsToday } from "date-fns";
import { useDroppable } from "@dnd-kit/core";
import { useUIStore, ACCENT_COLORS } from "../../store/uiStore";
import { hexToRgba } from "../../lib/colors";
import TaskChip from "../ui/TaskChip";
import type { Todo } from "../../types/todo";

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
      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      animate={{
        backgroundColor: isSelected
          ? hexToRgba(accentHex, 0.10)
          : isOver
            ? hexToRgba(accentHex, 0.08)
            : "rgba(255,255,255,0.03)",
      }}
      transition={{ duration: 0.15 }}
      className="day-cell"
      style={{
        minHeight: 90,
        padding: 8,
        borderRadius: 10,
        border: today ? "1px solid rgba(255,179,71,0.40)" : "1px solid rgba(255,255,255,0.06)",
        borderTopColor: today ? "rgba(255,179,71,0.55)" : "rgba(255,255,255,0.08)",
        background: today ? "rgba(255,179,71,0.06)" : "rgba(255,255,255,0.03)",
        boxShadow: today
          ? "inset 0 1px 0 rgba(255,179,71,0.20)"
          : hasOverdue && isCurrentMonth
            ? "0 0 0 1px rgba(255,80,80,0.4)"
            : "none",
        opacity: isCurrentMonth ? 1 : 0.35,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.15s, border-color 0.15s",
      }}
    >
      {/* Day number */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        <span
          style={{
            width: 26,
            height: 26,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontSize: 11,
            fontWeight: 600,
            background: today ? "var(--accent)" : "transparent",
            color: today ? "#0A0A0A" : "var(--text-primary)",
            boxShadow: today ? "0 0 12px var(--accent-glow)" : "none",
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
