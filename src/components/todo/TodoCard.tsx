import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { formatDistanceToNowStrict, isPast, isToday } from "date-fns";
import { cardVariants } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";
import CheckCircle from "../ui/CheckCircle";
import PriorityBadge from "../ui/PriorityBadge";
import TagPill from "../ui/TagPill";
import type { Todo } from "../../types/todo";

interface TodoCardProps {
  todo: Todo;
}

export default function TodoCard({ todo }: TodoCardProps) {
  const { updateTodo, toggleTodoDone, tags } = useTodoStore();
  const { setActiveTodo } = useUIStore();
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const isDone = todo.status === "done";
  const todoTags = tags.filter((t) => todo.tags.includes(t.id));

  const isOverdue = todo.dueAt && !isDone && isPast(new Date(todo.dueAt)) && !isToday(new Date(todo.dueAt));

  const confirmTitle = () => {
    setEditing(false);
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      updateTodo(todo.id, { title: trimmed });
    } else {
      setEditTitle(todo.title);
    }
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Specular shimmer: track mouse position on card
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  // Relative due date display
  const dueDateLabel = todo.dueAt
    ? isToday(new Date(todo.dueAt))
      ? "Today"
      : formatDistanceToNowStrict(new Date(todo.dueAt), { addSuffix: true })
    : null;

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{
        y: -2,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.14), 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.3), 0 24px 56px rgba(0,0,0,0.3)",
        transition: { type: "spring", stiffness: 400, damping: 28 },
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isDone ? 0.6 : 1 }}
      transition={{ duration: 0.2 }}
      onClick={() => setActiveTodo(todo.id)}
      onMouseMove={handleMouseMove}
      className="specular-shimmer glass-2 flex items-start gap-3 cursor-pointer"
      style={{
        padding: "14px 16px",
        borderRadius: 14,
      }}
    >
      {/* Left: check circle */}
      <div className="pt-0.5">
        <CheckCircle checked={isDone} onToggle={() => toggleTodoDone(todo.id)} />
      </div>

      {/* Center */}
      <div className="flex-1 min-w-0">
        {/* Title row with priority dot */}
        <div className="flex items-center gap-2">
          <PriorityBadge priority={todo.priority} onChange={(p) => updateTodo(todo.id, { priority: p })} />
          {editing ? (
            <input
              ref={inputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={confirmTitle}
              onKeyDown={(e) => {
                if (e.key === "Enter") confirmTitle();
                if (e.key === "Escape") {
                  setEditTitle(todo.title);
                  setEditing(false);
                }
              }}
              className="w-full bg-transparent text-sm font-medium outline-none"
              style={{ color: "var(--text-primary)", fontSize: 14, lineHeight: 1.4 }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              onClick={startEditing}
              className="text-sm font-medium"
              style={{
                color: "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.4,
                textDecoration: isDone ? "line-through" : "none",
                textDecorationColor: "rgba(255,255,255,0.3)",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {todo.title}
            </p>
          )}
        </div>

        {/* Tags row */}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          {todoTags.map((tag) => (
            <TagPill key={tag.id} tag={tag} />
          ))}
          {todo.subtasks.length > 0 && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                color: "var(--text-secondary)",
                background: "rgba(255,255,255,0.08)",
                fontSize: 11,
              }}
            >
              {todo.subtasks.filter((s) => s.done).length}/{todo.subtasks.length}
            </span>
          )}
        </div>
      </div>

      {/* Right: due date + more */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        {dueDateLabel && (
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              fontSize: 11,
              color: isOverdue ? "var(--p1)" : "var(--text-secondary)",
              background: isOverdue ? "rgba(255,80,80,0.12)" : "rgba(255,255,255,0.08)",
              borderRadius: 6,
              border: isOverdue
                ? "1px solid rgba(255,80,80,0.4)"
                : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {dueDateLabel}
          </span>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="p-1 rounded"
          style={{ color: "var(--text-secondary)" }}
        >
          <MoreHorizontal size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}
