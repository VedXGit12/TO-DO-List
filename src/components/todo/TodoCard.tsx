import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
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

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -1, borderColor: "var(--text-secondary)" }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: isDone ? 0.6 : 1 }}
      transition={{ duration: 0.2 }}
      onClick={() => setActiveTodo(todo.id)}
      className="flex items-start gap-3 px-4 py-3 rounded-lg border cursor-pointer"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Left: check circle */}
      <div className="pt-0.5">
        <CheckCircle checked={isDone} onToggle={() => toggleTodoDone(todo.id)} />
      </div>

      {/* Center */}
      <div className="flex-1 min-w-0">
        {/* Title */}
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
            style={{ color: "var(--text-primary)" }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p
            onClick={startEditing}
            className="text-sm font-medium truncate"
            style={{
              color: "var(--text-primary)",
              textDecoration: isDone ? "line-through" : "none",
            }}
          >
            {todo.title}
          </p>
        )}

        {/* Tags + priority row */}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <PriorityBadge
            priority={todo.priority}
            onChange={(p) => updateTodo(todo.id, { priority: p })}
          />
          {todoTags.map((tag) => (
            <TagPill key={tag.id} tag={tag} />
          ))}
          {todo.subtasks.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}>
              {todo.subtasks.filter((s) => s.done).length}/{todo.subtasks.length}
            </span>
          )}
        </div>
      </div>

      {/* Right: due date + more */}
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        {todo.dueAt && (
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              color: isOverdue ? "var(--p1)" : "var(--text-secondary)",
              background: isOverdue ? "rgba(239,68,68,0.12)" : "var(--bg-elevated)",
            }}
          >
            {isToday(new Date(todo.dueAt))
              ? "Today"
              : format(new Date(todo.dueAt), "MMM d")}
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
