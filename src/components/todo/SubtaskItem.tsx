import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GripVertical, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Subtask } from "../../types/todo";

interface SubtaskItemProps {
  subtask: Subtask;
  todoId: string;
  onToggle: (subtaskId: string) => void;
  onUpdateTitle: (subtaskId: string, title: string) => void;
  onDelete: (subtaskId: string) => void;
}

export default function SubtaskItem({ subtask, onToggle, onUpdateTitle, onDelete }: SubtaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtask.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const confirmTitle = () => {
    setEditing(false);
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== subtask.title) {
      onUpdateTitle(subtask.id, trimmed);
    } else {
      setEditTitle(subtask.title);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 py-1.5 px-1 rounded group"
    >
      {/* Drag handle */}
      <motion.div
        {...attributes}
        {...listeners}
        animate={{ opacity: hovered ? 0.6 : 0 }}
        className="cursor-grab shrink-0"
        style={{ color: "var(--text-secondary)" }}
      >
        <GripVertical size={14} />
      </motion.div>

      {/* Checkbox */}
      <button
        onClick={() => onToggle(subtask.id)}
        className="shrink-0 flex items-center justify-center"
        style={{ width: 18, height: 18 }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle
            cx="8"
            cy="8"
            r="7"
            strokeWidth="1.5"
            stroke={subtask.done ? "#22c55e" : "var(--border)"}
            fill={subtask.done ? "#22c55e" : "none"}
          />
          {subtask.done && (
            <path
              d="M5 8.5L7 10.5L11 6.5"
              stroke="#0d0d0d"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      </button>

      {/* Title */}
      {editing ? (
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={confirmTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") confirmTitle();
            if (e.key === "Escape") { setEditTitle(subtask.title); setEditing(false); }
          }}
          className="flex-1 bg-transparent text-xs outline-none"
          style={{ color: "var(--text-primary)" }}
          autoFocus
        />
      ) : (
        <span
          onClick={() => { setEditing(true); setTimeout(() => inputRef.current?.focus(), 0); }}
          className="flex-1 text-xs cursor-text truncate"
          style={{
            color: "var(--text-primary)",
            textDecoration: subtask.done ? "line-through" : "none",
            opacity: subtask.done ? 0.5 : 1,
          }}
        >
          {subtask.title}
        </span>
      )}

      {/* Delete */}
      <motion.button
        animate={{ opacity: hovered ? 0.6 : 0 }}
        onClick={() => onDelete(subtask.id)}
        className="shrink-0 p-0.5 rounded"
        style={{ color: "var(--text-secondary)" }}
      >
        <X size={12} />
      </motion.button>
    </motion.div>
  );
}
