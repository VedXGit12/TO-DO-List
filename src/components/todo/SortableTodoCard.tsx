import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TodoCard from "./TodoCard";
import type { Todo } from "../../types/todo";

interface SortableTodoCardProps {
  todo: Todo;
}

export default function SortableTodoCard({ todo }: SortableTodoCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    border: isDragging ? "1.5px dashed var(--border)" : undefined,
    borderRadius: isDragging ? 8 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TodoCard todo={todo} />
    </div>
  );
}
