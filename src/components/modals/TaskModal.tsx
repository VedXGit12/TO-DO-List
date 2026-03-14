import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Archive, Trash2 } from "lucide-react";
import { modalOverlayVariants } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";
import BodyEditor from "../todo/BodyEditor";
import TaskMetaSidebar from "../todo/TaskMetaSidebar";
import SubtaskTree from "../todo/SubtaskTree";

const modalSlide = {
  hidden: { x: "100%", opacity: 0.8 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 400, damping: 35 } },
  exit: { x: "100%", opacity: 0.8, transition: { duration: 0.2 } },
};

export default function TaskModal() {
  const { activeTodoId, setActiveTodo } = useUIStore();
  const { todos, updateTodo, deleteTodo } = useTodoStore();

  const todo = activeTodoId ? todos.find((t) => t.id === activeTodoId) : null;

  const [editTitle, setEditTitle] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (todo) {
      setEditTitle(todo.title);
      setConfirmDelete(false);
    }
  }, [todo?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => setActiveTodo(null), [setActiveTodo]);

  const confirmTitle = () => {
    if (!todo) return;
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      updateTodo(todo.id, { title: trimmed });
    } else {
      setEditTitle(todo.title);
    }
  };

  const handleBodySave = useCallback(
    (body: string) => {
      if (todo) updateTodo(todo.id, { body });
    },
    [todo?.id, updateTodo] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleDelete = () => {
    if (!todo) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteTodo(todo.id);
    close();
  };

  const handleArchive = () => {
    if (!todo) return;
    updateTodo(todo.id, { status: "archived" });
    close();
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!todo) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const newStatus = todo.status === "done" ? "todo" : "done";
        updateTodo(todo.id, {
          status: newStatus,
          completedAt: newStatus === "done" ? Date.now() : undefined,
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [todo, close, updateTodo]);

  return (
    <AnimatePresence>
      {todo && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.5)" }}
          />

          {/* Modal panel */}
          <motion.div
            variants={modalSlide}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-3xl border-l"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.4)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <motion.button
                onClick={close}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 rounded"
                style={{ color: "var(--text-secondary)" }}
              >
                <ArrowLeft size={18} />
              </motion.button>

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={confirmTitle}
                onKeyDown={(e) => { if (e.key === "Enter") confirmTitle(); }}
                className="flex-1 bg-transparent text-sm font-semibold outline-none"
                style={{ color: "var(--text-primary)" }}
              />

              <div className="flex items-center gap-1.5">
                <motion.button
                  onClick={handleArchive}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded"
                  style={{ color: "var(--text-secondary)" }}
                  title="Archive"
                >
                  <Archive size={15} />
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 rounded"
                  style={{ color: confirmDelete ? "var(--p1)" : "var(--text-secondary)" }}
                  title={confirmDelete ? "Click again to confirm delete" : "Delete"}
                >
                  <Trash2 size={15} />
                </motion.button>
              </div>
            </div>

            {/* Body: split layout */}
            <div className="flex flex-1 min-h-0">
              {/* Left: editor */}
              <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
                <BodyEditor
                  todoId={todo.id}
                  initialContent={todo.body}
                  onSave={handleBodySave}
                />
              </div>

              {/* Right: metadata + subtasks */}
              <div
                className="w-[280px] shrink-0 overflow-y-auto p-5 border-l scrollbar-hide"
                style={{ borderColor: "var(--border)" }}
              >
                <TaskMetaSidebar todo={todo} />

                <div className="mt-6">
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider mb-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Subtasks
                  </h3>
                  <SubtaskTree todoId={todo.id} subtasks={todo.subtasks} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
