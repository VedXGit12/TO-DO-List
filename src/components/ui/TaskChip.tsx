import { motion } from "framer-motion";
import { useDraggable } from "@dnd-kit/core";
import { useUIStore } from "../../store/uiStore";
import type { Todo } from "../../types/todo";

const PRIORITY_HEX: Record<number, string> = {
  1: "rgba(255,100,100,0.9)",
  2: "rgba(255,160,80,0.9)",
  3: "rgba(100,160,255,0.9)",
  4: "rgba(160,160,180,0.7)",
};

interface TaskChipProps {
  todo: Todo;
  isDragOverlay?: boolean;
}

export default function TaskChip({ todo, isDragOverlay }: TaskChipProps) {
  const { setActiveTodo } = useUIStore();
  const isDone = todo.status === "done";

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: todo.id,
    data: { todo },
    disabled: isDragOverlay,
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
        height: 20,
        fontSize: 11,
        lineHeight: "20px",
        cursor: isDragOverlay ? "grabbing" : "grab",
        opacity: isDragging && !isDragOverlay ? 0.35 : 1,
        borderLeft: `2px solid ${PRIORITY_HEX[todo.priority] ?? "rgba(160,160,180,0.7)"}`,
        paddingLeft: 6,
        paddingRight: 6,
        background: "rgba(255,255,255,0.07)",
        borderRadius: 5,
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
          background: PRIORITY_HEX[todo.priority] ?? "rgba(160,160,180,0.7)",
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
