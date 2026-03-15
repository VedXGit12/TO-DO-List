import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { dayDetailPanelVariants } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";
import TodoCard from "./TodoCard";
interface DayDetailPanelProps {
  selectedDate: Date | null;
  onClose: () => void;
}

export default function DayDetailPanel({ selectedDate, onClose }: DayDetailPanelProps) {
  const { todos, addTodo } = useTodoStore();
  const { activeProjectId } = useUIStore();
  const [quickTitle, setQuickTitle] = useState("");

  const dayTodos = useMemo(() => {
    if (!selectedDate || !activeProjectId) return [];
    return todos
      .filter(
        (t) =>
          t.projectId === activeProjectId &&
          t.dueAt &&
          isSameDay(new Date(t.dueAt), selectedDate)
      )
      .sort((a, b) => a.order - b.order);
  }, [todos, selectedDate, activeProjectId]);

  const overdueTodos = useMemo(
    () => dayTodos.filter((t) => t.dueAt && t.dueAt < Date.now() && t.status !== "done"),
    [dayTodos]
  );

  const otherTodos = useMemo(
    () => dayTodos.filter((t) => !overdueTodos.includes(t)),
    [dayTodos, overdueTodos]
  );

  const submitQuickAdd = () => {
    const trimmed = quickTitle.trim();
    if (!trimmed || !activeProjectId || !selectedDate) return;
    addTodo({
      projectId: activeProjectId,
      title: trimmed,
      status: "todo",
      priority: 4,
      tags: [],
      subtasks: [],
      dueAt: selectedDate.getTime(),
    });
    setQuickTitle("");
  };

  return (
    <AnimatePresence mode="wait">
      {selectedDate && (
        <motion.div
          key={selectedDate.toISOString()}
          variants={dayDetailPanelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            width: 320,
            flexShrink: 0,
            borderLeft: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(12, 14, 20, 0.90)",
            backdropFilter: "blur(48px) saturate(180%)",
            WebkitBackdropFilter: "blur(48px) saturate(180%)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}
            >
              {format(selectedDate, "EEEE, MMM d")}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1 rounded"
              style={{ color: "var(--text-secondary)" }}
            >
              <X size={14} />
            </motion.button>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-hide" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Overdue section */}
            {overdueTodos.length > 0 && (
              <div>
                <p
                  className="text-xs font-semibold mb-2 px-1"
                  style={{ color: "var(--p1)" }}
                >
                  Overdue
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {overdueTodos.map((todo) => (
                    <TodoCard key={todo.id} todo={todo} />
                  ))}
                </div>
              </div>
            )}

            {/* Other tasks */}
            {otherTodos.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {otherTodos.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} />
                ))}
              </div>
            )}

            {dayTodos.length === 0 && (
              <p
                className="text-xs text-center py-8"
                style={{ color: "var(--text-secondary)" }}
              >
                No tasks for this day
              </p>
            )}
          </div>

          {/* Quick add */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={submitQuickAdd}
              className="p-1 rounded shrink-0"
              style={{ color: "var(--accent)" }}
            >
              <Plus size={14} />
            </motion.button>
            <input
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitQuickAdd();
              }}
              placeholder="Add a task..."
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
