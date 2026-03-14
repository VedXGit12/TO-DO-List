import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { useUIStore } from "../../store/uiStore";
import type { Todo } from "../../types/todo";

const PRIORITY_HEX: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#3b82f6",
  4: "#6b7280",
};

interface TaskChipProps {
  todo: Todo;
  isDragOverlay?: boolean;
}

export default function TaskChip({ todo, isDragOverlay }: TaskChipProps) {
  const { setActiveTodo } = useUIStore();
  const isDone = todo.status === "done";
  const isOverdue =
    todo.dueAt && !isDone && todo.dueAt < Date.now();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: todo.id,
    data: { todo },
  });

  return (
    <motion.div
      ref={!isDragOverlay ? setNodeRef : undefined}
      {...(!isDragOverlay ? { ...attributes, ...listeners } : {})}
      onClick={(e) => {
        e.stopPropagation();
        setActiveTodo(todo.id);
      }}
      whileHover={!isDragOverlay ? { scale: 1.02 } : undefined}
      style={{
        height: 22,
        fontSize: 11,
        lineHeight: "22px",
        cursor: isDragOverlay ? "grabbing" : "grab",
        opacity: isDragging && !isDragOverlay ? 0.35 : 1,
        borderLeft: isOverdue ? "2px solid var(--p1)" : "none",
        paddingLeft: isOverdue ? 4 : 6,
        paddingRight: 6,
        background: "var(--bg-elevated)",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        gap: 4,
        overflow: "hidden",
        ...(isDragOverlay
          ? { boxShadow: "0 8px 32px rgba(0,0,0,0.5)", scale: 1.06 }
          : {}),
      }}
    >
      {/* Priority dot */}
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: PRIORITY_HEX[todo.priority] ?? "#6b7280",
          flexShrink: 0,
        }}
      />
      {/* Title */}
      <span
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: isDone ? "var(--text-secondary)" : "var(--text-primary)",
          textDecoration: isDone ? "line-through" : "none",
        }}
      >
        {todo.title}
      </span>
    </motion.div>
  );
}
