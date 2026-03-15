import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { listVariants, cardVariants } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore, ACCENT_COLORS } from "../../store/uiStore";
import { hexToRgba } from "../../lib/colors";
import AnimatedCounter from "../ui/AnimatedCounter";
import SortableTodoCard from "./SortableTodoCard";
import type { Todo } from "../../types/todo";

const COLUMN_CONFIG: Record<Todo["status"], { label: string; dotColor: string; borderTop: string; gradient: string }> = {
  todo:        { label: "Todo",        dotColor: "rgba(200,200,220,0.3)", borderTop: "2px solid rgba(200,200,220,0.25)", gradient: "linear-gradient(to bottom, rgba(180,180,220,0.04), transparent 60px)" },
  in_progress: { label: "In Progress", dotColor: "rgba(148,120,255,0.9)", borderTop: "2px solid rgba(148,120,255,0.35)", gradient: "linear-gradient(to bottom, rgba(148,120,255,0.05), transparent 60px)" },
  done:        { label: "Done",        dotColor: "rgba(72,218,138,0.9)",  borderTop: "2px solid rgba(72,218,138,0.35)", gradient: "linear-gradient(to bottom, rgba(72,218,138,0.05), transparent 60px)" },
  archived:    { label: "Archived",    dotColor: "rgba(155,155,175,0.5)", borderTop: "2px solid rgba(155,155,175,0.20)", gradient: "linear-gradient(to bottom, rgba(155,155,175,0.03), transparent 60px)" },
};

interface KanbanColumnProps {
  status: Todo["status"];
  todos: Todo[];
}

export default function KanbanColumn({ status, todos }: KanbanColumnProps) {
  const { addTodo } = useTodoStore();
  const { activeProjectId, accentColor } = useUIStore();
  const accentHex = ACCENT_COLORS[accentColor];
  const { label, dotColor, borderTop, gradient } = COLUMN_CONFIG[status];
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
      className="flex flex-col min-w-[280px] w-[280px] p-4 relative overflow-hidden"
      style={{
        borderRadius: 14,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
        borderTop: borderTop,
        backgroundImage: gradient,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
        <span
          className="font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)", fontSize: 11, letterSpacing: "0.1em" }}
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
              className="w-full px-3 py-2.5 text-xs outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "var(--text-primary)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
              }}
            />
          </motion.div>
        ) : (
          <motion.button
            onClick={() => setShowInput(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 w-full mt-2 px-3 py-2.5 text-xs glass-interactive"
            style={{ color: "var(--text-tertiary)", borderRadius: 14 }}
          >
            <Plus size={14} />
            Add card
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
