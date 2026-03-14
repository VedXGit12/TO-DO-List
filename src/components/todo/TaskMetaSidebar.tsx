import { useTodoStore } from "../../store/todoStore";
import type { Todo } from "../../types/todo";

const STATUS_OPTIONS: { value: Todo["status"]; label: string; dotColor: string }[] = [
  { value: "todo", label: "Todo", dotColor: "rgba(255,255,255,0.3)" },
  { value: "in_progress", label: "In Progress", dotColor: "rgba(140,120,255,0.9)" },
  { value: "done", label: "Done", dotColor: "rgba(80,220,140,0.9)" },
  { value: "archived", label: "Archived", dotColor: "rgba(160,160,180,0.5)" },
];

const PRIORITY_OPTIONS: { value: Todo["priority"]; label: string; color: string }[] = [
  { value: 1, label: "Urgent", color: "rgba(255,100,100,0.9)" },
  { value: 2, label: "High", color: "rgba(255,160,80,0.9)" },
  { value: 3, label: "Medium", color: "rgba(100,160,255,0.9)" },
  { value: 4, label: "Low", color: "rgba(160,160,180,0.7)" },
];

interface TaskMetaSidebarProps {
  todo: Todo;
}

export default function TaskMetaSidebar({ todo }: TaskMetaSidebarProps) {
  const { updateTodo, tags: allTags } = useTodoStore();

  return (
    <div className="space-y-4">
      {/* Status */}
      <MetaRow label="Status">
        <select
          value={todo.status}
          onChange={(e) => updateTodo(todo.id, { status: e.target.value as Todo["status"] })}
          className="bg-transparent text-xs outline-none cursor-pointer rounded px-2 py-1"
          style={{
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "var(--bg-surface)" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </MetaRow>

      {/* Priority */}
      <MetaRow label="Priority">
        <select
          value={todo.priority}
          onChange={(e) => updateTodo(todo.id, { priority: Number(e.target.value) as Todo["priority"] })}
          className="bg-transparent text-xs outline-none cursor-pointer rounded px-2 py-1"
          style={{
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          {PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "var(--bg-surface)" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </MetaRow>

      {/* Due date */}
      <MetaRow label="Due date">
        <input
          type="date"
          value={todo.dueAt ? new Date(todo.dueAt).toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const val = e.target.value;
            updateTodo(todo.id, { dueAt: val ? new Date(val).getTime() : undefined });
          }}
          className="bg-transparent text-xs outline-none cursor-pointer rounded px-2 py-1"
          style={{
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
            colorScheme: "dark",
          }}
        />
      </MetaRow>

      {/* Tags */}
      <MetaRow label="Tags">
        <div className="flex flex-wrap gap-1">
          {todo.tags.length === 0 && (
            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
              No tags
            </span>
          )}
          {todo.tags.map((tagId) => {
            const tag = allTags.find((t) => t.id === tagId);
            return (
              <span
                key={tagId}
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: tag ? `${tag.color}33` : "var(--bg-elevated)",
                  color: tag?.color ?? "var(--text-secondary)",
                }}
              >
                {tag?.name ?? tagId}
              </span>
            );
          })}
        </div>
      </MetaRow>
    </div>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="text-xs font-medium shrink-0 pt-1"
        style={{ color: "var(--text-secondary)", width: 70 }}
      >
        {label}
      </span>
      <div className="flex-1">{children}</div>
    </div>
  );
}
