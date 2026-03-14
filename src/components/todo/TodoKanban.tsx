import { useState, useEffect, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { dragActiveStyle } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";
import TodoCard from "./TodoCard";
import KanbanColumn from "./KanbanColumn";
import type { Todo } from "../../types/todo";

const COLUMNS: Todo["status"][] = ["todo", "in_progress", "done", "archived"];

export default function TodoKanban() {
  const { activeProjectId } = useUIStore();
  const { todos, loadTodos, loadTags, reorderWithinColumn, moveToColumnAndReorder } = useTodoStore();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  useEffect(() => {
    if (activeProjectId) {
      loadTodos(activeProjectId);
      loadTags();
    }
  }, [activeProjectId, loadTodos, loadTags]);

  const columnTodos = useMemo(() => {
    const map: Record<Todo["status"], Todo[]> = {
      todo: [],
      in_progress: [],
      done: [],
      archived: [],
    };
    for (const t of todos) {
      if (map[t.status]) map[t.status].push(t);
    }
    for (const key of COLUMNS) {
      map[key].sort((a, b) => a.order - b.order);
    }
    return map;
  }, [todos]);

  const activeTodo = activeDragId ? todos.find((t) => t.id === activeDragId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findColumn = (id: string): Todo["status"] | null => {
    const todo = todos.find((t) => t.id === id);
    if (todo) return todo.status;
    if (COLUMNS.includes(id as Todo["status"])) return id as Todo["status"];
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const sourceCol = findColumn(activeId);
    // over could be a column id or a card id
    const targetCol = COLUMNS.includes(overId as Todo["status"])
      ? (overId as Todo["status"])
      : findColumn(overId);

    if (!sourceCol || !targetCol) return;

    if (sourceCol === targetCol) {
      if (activeId !== overId) {
        reorderWithinColumn(sourceCol, activeId, overId);
      }
    } else {
      const overTodoId = COLUMNS.includes(overId as Todo["status"]) ? undefined : overId;
      moveToColumnAndReorder(activeId, targetCol, overTodoId);
    }
  };

  if (!activeProjectId) return null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex gap-4 h-full overflow-x-auto p-5 scrollbar-hide"
        style={{ alignItems: "flex-start" }}
      >
        {COLUMNS.map((status, i) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 400, damping: 30 }}
          >
            <KanbanColumn status={status} todos={columnTodos[status]} />
          </motion.div>
        ))}
      </div>

      <DragOverlay>
        {activeTodo ? (
          <motion.div
            animate={dragActiveStyle}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(232,160,69,0.3)",
              borderRadius: 8,
            }}
          >
            <TodoCard todo={activeTodo} />
          </motion.div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
