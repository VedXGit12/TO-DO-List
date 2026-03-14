import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { listVariants, cardVariants } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore, ACCENT_COLORS } from "../../store/uiStore";
import AnimatedCounter from "../ui/AnimatedCounter";
import SortableTodoCard from "./SortableTodoCard";
import type { Todo } from "../../types/todo";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const COLUMN_CONFIG: Record<Todo["status"], { label: string; dotColor: string }> = {
  todo:        { label: "Todo",        dotColor: "#6b7280" },
  in_progress: { label: "In Progress", dotColor: "#3b82f6" },
  done:        { label: "Done",        dotColor: "#22c55e" },
  archived:    { label: "Archived",    dotColor: "#8a8480" },
};

interface KanbanColumnProps {
  status: Todo["status"];
  todos: Todo[];
}

export default function KanbanColumn({ status, todos }: KanbanColumnProps) {
  const { addTodo } = useTodoStore();
  const { activeProjectId, accentColor } = useUIStore();
  const accentHex = ACCENT_COLORS[accentColor];
  const { label, dotColor } = COLUMN_CONFIG[status];
  const [quickAdd, setQuickAdd] = useState("");
  const [showInput, setShowInput] = useState(false);

  const { setNodeRef, isOver } = useDroppable({ id: status });

  const submitQuickAdd = () => {
    const trimmed = quickAdd.trim();
    if (!trimmed || !activeProjectId) return;
    addTodo({
      projectId: activeProjectId,
      title: trimmed,
      status,
      priority: 4,
      tags: [],
      subtasks: [],
    });
    setQuickAdd("");
    setShowInput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundColor: isOver ? hexToRgba(accentHex, 0.06) : "rgba(0,0,0,0)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex flex-col min-w-[280px] w-[280px] rounded-xl p-3"
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </span>
        <AnimatedCounter count={todos.length} />
      </div>

      {/* Droppable + sortable card list */}
      <div ref={setNodeRef} className="flex-1 min-h-[60px]">
        <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <AnimatePresence mode="popLayout">
              {todos.map((todo) => (
                <motion.div key={todo.id} variants={cardVariants} exit="exit" layout>
                  <SortableTodoCard todo={todo} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </div>

      {/* Add card button */}
      <AnimatePresence>
        {showInput ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2"
          >
            <input
              autoFocus
              value={quickAdd}
              onChange={(e) => setQuickAdd(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitQuickAdd();
                if (e.key === "Escape") { setShowInput(false); setQuickAdd(""); }
              }}
              onBlur={() => { if (!quickAdd.trim()) setShowInput(false); }}
              placeholder="Task title…"
              className="w-full px-3 py-2 rounded-md text-xs outline-none"
              style={{
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            />
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setShowInput(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 w-full mt-2 px-3 py-2 rounded-md text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <Plus size={14} />
            Add card
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
