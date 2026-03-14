import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Todo, Tag } from "../types/todo";
import {
  db,
  getTodosByProject,
  createTodo as dbCreateTodo,
  updateTodo as dbUpdateTodo,
  deleteTodo as dbDeleteTodo,
  toggleDone as dbToggleDone,
  getAllTags,
  createTag as dbCreateTag,
} from "../db/dexie";

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
  todos: Todo[];
  tags: Tag[];
  addWorkspace: (ws: Omit<Workspace, "id" | "createdAt">) => void;
  addProject: (proj: Omit<Project, "id" | "createdAt">) => void;
  loadTodos: (projectId: string) => Promise<void>;
  loadTags: () => Promise<void>;
  addTodo: (todo: Omit<Todo, "id" | "createdAt" | "updatedAt" | "order">) => Promise<void>;
  updateTodo: (id: string, patch: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodoDone: (id: string) => Promise<void>;
  reorderTodos: (reordered: Todo[]) => Promise<void>;
  addTag: (tag: Omit<Tag, "id">) => Promise<void>;
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
      todos: [],
      tags: [],
      addWorkspace: (ws) =>
        set((s) => ({ workspaces: [...s.workspaces, { ...ws, id: crypto.randomUUID(), createdAt: Date.now() }] })),
      addProject: (proj) =>
        set((s) => ({ projects: [...s.projects, { ...proj, id: crypto.randomUUID(), createdAt: Date.now() }] })),

      loadTodos: async (projectId: string) => {
        const todos = await getTodosByProject(projectId);
        set({ todos });
      },

      loadTags: async () => {
        const tags = await getAllTags();
        set({ tags });
      },

      addTodo: async (data) => {
        const now = Date.now();
        const todo: Todo = {
          ...data,
          id: crypto.randomUUID(),
          order: now,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ todos: [todo, ...s.todos] }));
        await dbCreateTodo(todo);
      },

      updateTodo: async (id, patch) => {
        const updatedAt = Date.now();
        set((s) => ({
          todos: s.todos.map((t) => (t.id === id ? { ...t, ...patch, updatedAt } : t)),
        }));
        await dbUpdateTodo(id, patch);
      },

      deleteTodo: async (id) => {
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
        await dbDeleteTodo(id);
      },

      toggleTodoDone: async (id) => {
        set((s) => ({
          todos: s.todos.map((t) => {
            if (t.id !== id) return t;
            const isDone = t.status === "done";
            return {
              ...t,
              status: isDone ? "todo" : "done",
              completedAt: isDone ? undefined : Date.now(),
              updatedAt: Date.now(),
            };
          }),
        }));
        await dbToggleDone(id);
      },

      reorderTodos: async (reordered) => {
        set({ todos: reordered });
        await db.transaction("rw", db.todos, async () => {
          for (let i = 0; i < reordered.length; i++) {
            await db.todos.update(reordered[i].id, { order: i, updatedAt: Date.now() });
          }
        });
      },

      addTag: async (data) => {
        const tag: Tag = { ...data, id: crypto.randomUUID() };
        set((s) => ({ tags: [...s.tags, tag] }));
        await dbCreateTag(tag);
      },
    }),
    {
      name: "todo-store",
      partialize: (state) => ({
        workspaces: state.workspaces,
        projects: state.projects,
      }),
    }
  )
);
