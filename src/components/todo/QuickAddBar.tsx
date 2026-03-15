import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";

export default function QuickAddBar() {
  const [value, setValue] = useState("");
  const { addTodo } = useTodoStore();
  const { activeProjectId } = useUIStore();

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || !activeProjectId) return;
    addTodo({
      projectId: activeProjectId,
      title: trimmed,
      status: "todo",
      priority: 4,
      tags: [],
      subtasks: [],
    });
    setValue("");
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="flex items-center gap-3.5 px-5 py-3.5 mt-3 floating-add-bar-inner"
      style={{}}
    >
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={submit}
        className="shrink-0 p-1"
        style={{ color: "var(--accent)", borderRadius: 8 }}
      >
        <Plus size={18} strokeWidth={2.5} />
      </motion.button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Add a task… press Enter"
        className="flex-1 bg-transparent text-sm outline-none"
        style={{ color: "var(--text-primary)", fontSize: 14, letterSpacing: "-0.01em" }}
      />
      <style>{`
        input::placeholder { color: var(--text-tertiary); }
        input:focus { box-shadow: none; }
      `}</style>
    </motion.div>
  );
}
