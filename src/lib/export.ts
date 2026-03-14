import type { Todo } from "../types/todo";
import type { Project } from "../store/todoStore";
import { format } from "date-fns";

/* ── Markdown ── */

export function buildMarkdown(projects: Project[], todos: Todo[]): string {
  const lines: string[] = [];

  for (const project of projects) {
    const projectTodos = todos.filter((t) => t.projectId === project.id);
    if (projectTodos.length === 0) continue;

    lines.push(`## ${project.name}`);
    lines.push("");

    for (const todo of projectTodos) {
      const check = todo.status === "done" ? "x" : " ";
      const priority = todo.priority <= 2 ? `[P${todo.priority}] ` : "";
      const due = todo.dueAt ? ` (due: ${format(new Date(todo.dueAt), "MMM d")})` : "";
      lines.push(`- [${check}] ${priority}${todo.title}${due}`);

      for (const sub of todo.subtasks) {
        const subCheck = sub.done ? "x" : " ";
        lines.push(`  - [${subCheck}] ${sub.title}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

/* ── JSON ── */

export function buildJSON(data: {
  workspaces: unknown[];
  projects: unknown[];
  todos: unknown[];
  tags: unknown[];
}): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      ...data,
    },
    null,
    2
  );
}

/* ── CSV ── */

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function buildCSV(todos: Todo[], projects: Project[]): string {
  const header = "id,title,status,priority,tags,dueAt,completedAt,projectName";
  const rows = todos.map((t) => {
    const proj = projects.find((p) => p.id === t.projectId);
    return [
      escapeCSV(t.id),
      escapeCSV(t.title),
      escapeCSV(t.status),
      String(t.priority),
      escapeCSV(t.tags.join(";")),
      t.dueAt ? new Date(t.dueAt).toISOString() : "",
      t.completedAt ? new Date(t.completedAt).toISOString() : "",
      escapeCSV(proj?.name ?? ""),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

/* ── Download helper ── */

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
