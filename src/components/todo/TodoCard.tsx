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

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

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
        y: -1,
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.12)",
        transition: { type: "spring", stiffness: 400, damping: 28 },
      }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isDone ? 0.5 : 1 }}
      transition={{ duration: 0.25 }}
      onClick={() => setActiveTodo(todo.id)}
      onMouseMove={handleMouseMove}
      className="glass-shimmer flex items-start gap-3.5 cursor-pointer group"
      style={{
        padding: "14px 16px",
        borderRadius: "var(--r-card)",
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.15s, background 0.15s",
      }}
    >
      {/* Left: check circle */}
      <div className="pt-0.5">
        <CheckCircle checked={isDone} onToggle={() => toggleTodoDone(todo.id)} />
      </div>

      {/* Center */}
      <div className="flex-1 min-w-0">
        {/* Title row with priority dot */}
        <div className="flex items-center gap-2.5">
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
              style={{ color: "var(--text-primary)", fontSize: 14, lineHeight: 1.5, letterSpacing: "-0.01em" }}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              onClick={startEditing}
              className="text-sm font-medium"
              style={{
                color: "var(--text-primary)",
                fontSize: 14,
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
                textDecoration: isDone ? "line-through" : "none",
                textDecorationColor: "rgba(255,255,255,0.2)",
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
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {todoTags.map((tag) => (
            <TagPill key={tag.id} tag={tag} />
          ))}
          {todo.subtasks.length > 0 && (
            <span
              className="text-xs px-2 py-0.5"
              style={{
                color: "var(--text-secondary)",
                background: "rgba(255,255,255,0.06)",
                fontSize: 11,
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {todo.subtasks.filter((s) => s.done).length}/{todo.subtasks.length}
            </span>
          )}
        </div>
      </div>

      {/* Right: due date + more */}
      <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
        {dueDateLabel && (
          <span
            className="text-xs px-2 py-1"
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: isOverdue ? "var(--p1)" : "var(--text-secondary)",
              background: isOverdue ? "rgba(255,80,80,0.10)" : "rgba(255,255,255,0.05)",
              borderRadius: 10,
              border: isOverdue
                ? "1px solid rgba(255,80,80,0.3)"
                : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {dueDateLabel}
          </span>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5"
          style={{ color: "var(--text-tertiary)", borderRadius: 8 }}
        >
          <MoreHorizontal size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}
