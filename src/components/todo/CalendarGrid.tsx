import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay, isSameMonth } from "date-fns";
import {
  DndContext,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";
import { getCalendarDays } from "../../lib/utils";
import { calendarGridVariants } from "../../lib/animations";
import DayCell from "./DayCell";
import TaskChip from "../ui/TaskChip";
import type { Todo } from "../../types/todo";
import type { CalViewMode } from "./CalendarNav";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  direction: number;
  calView: CalViewMode;
}

export default function CalendarGrid({
  currentDate,
  selectedDate,
  onSelectDate,
  direction,
  calView,
}: CalendarGridProps) {
  const { todos, updateTodo } = useTodoStore();
  const { activeProjectId, addToast } = useUIStore();
  const [activeDrag, setActiveDrag] = useState<Todo | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Filter todos for active project
  const projectTodos = useMemo(
    () => todos.filter((t) => t.projectId === activeProjectId),
    [todos, activeProjectId]
  );

  // Get calendar days
  const days = useMemo(() => {
    const allDays = getCalendarDays(currentDate.getMonth(), currentDate.getFullYear());
    if (calView === "week") {
      // Find the week that contains the currentDate
      const weekIdx = allDays.findIndex((d) => isSameDay(d, currentDate));
      const rowStart = weekIdx !== -1 ? Math.floor(weekIdx / 7) * 7 : 0;
      return allDays.slice(rowStart, rowStart + 7);
    }
    return allDays;
  }, [currentDate, calView]);

  // Group todos by date key
  const todosByDate = useMemo(() => {
    const map = new Map<string, Todo[]>();
    for (const todo of projectTodos) {
      if (!todo.dueAt) continue;
      const key = format(new Date(todo.dueAt), "yyyy-MM-dd");
      const arr = map.get(key) ?? [];
      arr.push(todo);
      map.set(key, arr);
    }
    return map;
  }, [projectTodos]);

  const handleDragStart = (e: DragStartEvent) => {
    const todo = projectTodos.find((t) => t.id === e.active.id);
    if (todo) setActiveDrag(todo);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDrag(null);
    if (!e.over) return;

    const todoId = String(e.active.id);
    const targetDate = new Date(String(e.over.id));
    if (isNaN(targetDate.getTime())) return;

    updateTodo(todoId, { dueAt: targetDate.getTime() });
    addToast({
      message: `Task moved to ${format(targetDate, "MMM d")}`,
      type: "success",
    });
  };

  const gridKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${calView}`;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Weekday headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            marginBottom: 4,
          }}
        >
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--text-secondary)",
                padding: "4px 0",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={gridKey}
            custom={direction}
            variants={calendarGridVariants}
            initial="enter"
            animate="center"
            exit="exit"
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {days.map((day) => {
              const key = format(day, "yyyy-MM-dd");
              const dayTodos = todosByDate.get(key) ?? [];
              const hasOverdue = dayTodos.some(
                (t) => t.dueAt && t.dueAt < Date.now() && t.status !== "done"
              );
              return (
                <DayCell
                  key={key}
                  date={day}
                  todos={dayTodos}
                  isCurrentMonth={isSameMonth(day, currentDate)}
                  isSelected={selectedDate ? isSameDay(day, selectedDate) : false}
                  hasOverdue={hasOverdue}
                  onClick={() => onSelectDate(day)}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeDrag ? <TaskChip todo={activeDrag} isDragOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
