import { useState, useCallback } from "react";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useTodoStore } from "../../store/todoStore";
import ProgressRing from "../ui/ProgressRing";
import SubtaskItem from "./SubtaskItem";
import type { Subtask } from "../../types/todo";

interface SubtaskTreeProps {
  todoId: string;
  subtasks: Subtask[];
}

export default function SubtaskTree({ todoId, subtasks }: SubtaskTreeProps) {
  const { updateTodo } = useTodoStore();
  const [newTitle, setNewTitle] = useState("");

  const sorted = [...subtasks].sort((a, b) => a.order - b.order);
  const doneCount = sorted.filter((s) => s.done).length;
  const progress = sorted.length > 0 ? doneCount / sorted.length : 0;

  const saveSubtasks = useCallback(
    (next: Subtask[]) => updateTodo(todoId, { subtasks: next }),
    [todoId, updateTodo]
  );

  const toggleSubtask = (subtaskId: string) => {
    const next = subtasks.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s));
    saveSubtasks(next);
  };

  const updateSubtaskTitle = (subtaskId: string, title: string) => {
    const next = subtasks.map((s) => (s.id === subtaskId ? { ...s, title } : s));
    saveSubtasks(next);
  };

  const deleteSubtask = (subtaskId: string) => {
    const next = subtasks.filter((s) => s.id !== subtaskId);
    saveSubtasks(next);
  };

  const addSubtask = () => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const newSub: Subtask = {
      id: crypto.randomUUID(),
      title: trimmed,
      done: false,
      order: subtasks.length,
    };
    saveSubtasks([...subtasks, newSub]);
    setNewTitle("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = sorted.findIndex((s) => s.id === active.id);
    const newIdx = sorted.findIndex((s) => s.id === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const reordered = [...sorted];
    const [moved] = reordered.splice(oldIdx, 1);
    reordered.splice(newIdx, 0, moved);
    const updated = reordered.map((s, i) => ({ ...s, order: i }));
    saveSubtasks(updated);
  };

  return (
    <div>
      {/* Progress */}
      {sorted.length > 0 && (
        <div className="flex items-center gap-3 mb-3">
          <ProgressRing progress={progress} size={40} />
          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {doneCount} of {sorted.length} done
          </span>
        </div>
      )}

      {/* Subtask list */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {sorted.map((subtask) => (
              <SubtaskItem
                key={subtask.id}
                subtask={subtask}
                todoId={todoId}
                onToggle={toggleSubtask}
                onUpdateTitle={updateSubtaskTitle}
                onDelete={deleteSubtask}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>

      {/* Add subtask input */}
      <div className="flex items-center gap-2.5 mt-3 px-2 py-2" style={{ borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
        <Plus size={14} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addSubtask(); }}
          placeholder="Add subtask…"
          className="flex-1 bg-transparent text-xs outline-none"
          style={{ color: "var(--text-primary)" }}
        />
      </div>
    </div>
  );
}
