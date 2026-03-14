import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Workspace {
  id: string; name: string; icon: string;
  color: string; projectIds: string[]; createdAt: number;
}
export interface Project {
  id: string; workspaceId: string; name: string;
  icon: string; description?: string;
  viewMode: "list" | "kanban" | "calendar"; createdAt: number;
}

interface TodoStore {
  workspaces: Workspace[];
  projects: Project[];
  addWorkspace: (ws: Omit<Workspace, "id" | "createdAt">) => void;
  addProject: (proj: Omit<Project, "id" | "createdAt">) => void;
}

const SEED_WORKSPACES: Workspace[] = [
  { id: "ws-1", name: "Personal", icon: "🏠", color: "#e8a045", projectIds: ["proj-1", "proj-2"], createdAt: Date.now() },
  { id: "ws-2", name: "Work",     icon: "💼", color: "#3b82f6", projectIds: ["proj-3"],            createdAt: Date.now() },
];
const SEED_PROJECTS: Project[] = [
  { id: "proj-1", workspaceId: "ws-1", name: "Daily Tasks",   icon: "✅", viewMode: "list",   createdAt: Date.now() },
  { id: "proj-2", workspaceId: "ws-1", name: "Anime Tracker", icon: "🎌", viewMode: "kanban", createdAt: Date.now() },
  { id: "proj-3", workspaceId: "ws-2", name: "Dev Projects",  icon: "⚡", viewMode: "list",   createdAt: Date.now() },
];

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      workspaces: SEED_WORKSPACES,
      projects: SEED_PROJECTS,
      addWorkspace: (ws) =>
        set((s) => ({ workspaces: [...s.workspaces, { ...ws, id: crypto.randomUUID(), createdAt: Date.now() }] })),
      addProject: (proj) =>
        set((s) => ({ projects: [...s.projects, { ...proj, id: crypto.randomUUID(), createdAt: Date.now() }] })),
    }),
    { name: "todo-store" }
  )
);
