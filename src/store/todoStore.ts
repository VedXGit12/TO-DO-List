import { create } from 'zustand'
import type { Todo, Project, Workspace, Tag } from '../types/todo'
import { db } from '../db/dexie'

interface TodoState {
  workspaces: Workspace[]
  projects: Project[]
  todos: Todo[]
  tags: Tag[]

  // Workspace actions
  addWorkspace: (workspace: Workspace) => Promise<void>
  updateWorkspace: (id: string, patch: Partial<Workspace>) => Promise<void>
  deleteWorkspace: (id: string) => Promise<void>

  // Project actions
  addProject: (project: Project) => Promise<void>
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>

  // Todo actions
  addTodo: (todo: Todo) => Promise<void>
  updateTodo: (id: string, patch: Partial<Todo>) => Promise<void>
  deleteTodo: (id: string) => Promise<void>

  // Tag actions
  addTag: (tag: Tag) => Promise<void>
  deleteTag: (id: string) => Promise<void>

  // Load all data from IndexedDB
  loadAll: () => Promise<void>
}

export const useTodoStore = create<TodoState>((set) => ({
  workspaces: [],
  projects: [],
  todos: [],
  tags: [],

  loadAll: async () => {
    const [workspaces, projects, todos, tags] = await Promise.all([
      db.workspaces.toArray(),
      db.projects.toArray(),
      db.todos.toArray(),
      db.tags.toArray(),
    ])
    set({ workspaces, projects, todos, tags })
  },

  addWorkspace: async (workspace) => {
    await db.workspaces.add(workspace)
    set((s) => ({ workspaces: [...s.workspaces, workspace] }))
  },

  updateWorkspace: async (id, patch) => {
    await db.workspaces.update(id, patch)
    set((s) => ({
      workspaces: s.workspaces.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    }))
  },

  deleteWorkspace: async (id) => {
    await db.workspaces.delete(id)
    set((s) => ({ workspaces: s.workspaces.filter((w) => w.id !== id) }))
  },

  addProject: async (project) => {
    await db.projects.add(project)
    set((s) => ({ projects: [...s.projects, project] }))
  },

  updateProject: async (id, patch) => {
    await db.projects.update(id, patch)
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
  },

  deleteProject: async (id) => {
    await db.projects.delete(id)
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }))
  },

  addTodo: async (todo) => {
    await db.todos.add(todo)
    set((s) => ({ todos: [...s.todos, todo] }))
  },

  updateTodo: async (id, patch) => {
    const updatedAt = Date.now()
    await db.todos.update(id, { ...patch, updatedAt })
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, ...patch, updatedAt } : t)),
    }))
  },

  deleteTodo: async (id) => {
    await db.todos.delete(id)
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }))
  },

  addTag: async (tag) => {
    await db.tags.add(tag)
    set((s) => ({ tags: [...s.tags, tag] }))
  },

  deleteTag: async (id) => {
    await db.tags.delete(id)
    set((s) => ({ tags: s.tags.filter((t) => t.id !== id) }))
  },
}))
