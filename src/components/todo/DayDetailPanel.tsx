import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { dayDetailPanelVariants } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";

// Project bar colors — falls back to green for unknown projects
const PROJECT_BAR_COLORS: Record<string, string> = {
  "proj-1": "#48DA8A",   // Daily Tasks — green
  "proj-2": "#F5A623",   // Anime Tracker — orange
  "proj-3": "#9478FF",   // Dev Projects — purple
};

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

  const barColor = activeProjectId ? PROJECT_BAR_COLORS[activeProjectId] ?? "#48DA8A" : "#48DA8A";

  return (
    <AnimatePresence mode="wait">
      {selectedDate && (
        <motion.div
          key={selectedDate.toISOString()}
          variants={dayDetailPanelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="day-panel-container"
          style={{
            width: 200,
            flexShrink: 0,
            borderLeft: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.055)",
            borderRadius: 12,
            margin: "8px 8px 8px 0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <h3 style={{
              fontSize: 15,
              fontWeight: 600,
              color: "rgba(255,255,255,0.92)",
            }}>
              {format(selectedDate, "EEEE, MMM d")}
            </h3>
            <button
              onClick={onClose}
              className="p-1"
              style={{ color: "rgba(255,255,255,0.40)", borderRadius: 4 }}
            >
              <X size={12} />
            </button>
          </div>

          {/* Task list */}
          <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ padding: "8px 0" }}>
            {dayTodos.length > 0 ? (
              dayTodos.map((todo) => {
                const taskBarColor = PROJECT_BAR_COLORS[todo.projectId] ?? barColor;
                const timeStr = todo.dueAt
                  ? new Date(todo.dueAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
                  : null;
                return (
                  <div
                    key={todo.id}
                    style={{
                      display: "flex",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {/* Left colored bar */}
                    <div
                      style={{
                        width: 3,
                        background: taskBarColor,
                        flexShrink: 0,
                      }}
                    />
                    {/* Task content */}
                    <div style={{ padding: "8px 10px", flex: 1, minWidth: 0 }}>
                      {timeStr && (
                        <div style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.92)",
                          marginBottom: 2,
                        }}>
                          {timeStr}
                        </div>
                      )}
                      <div style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.70)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textDecoration: todo.status === "done" ? "line-through" : "none",
                      }}>
                        - {todo.title}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p
                className="text-center py-8"
                style={{ color: "rgba(255,255,255,0.40)", fontSize: 11 }}
              >
                No tasks for this day
              </p>
            )}
          </div>

          {/* Quick add */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", position: "relative", zIndex: 3 }}
          >
            <button
              onClick={submitQuickAdd}
              className="p-1 shrink-0"
              style={{ color: "#F5A623" }}
            >
              <Plus size={12} />
            </button>
            <input
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitQuickAdd();
              }}
              placeholder="Add a task..."
              className="flex-1 bg-transparent text-xs outline-none"
              style={{ color: "rgba(255,255,255,0.70)", fontSize: 11 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
