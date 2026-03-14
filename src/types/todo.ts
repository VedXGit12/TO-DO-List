export interface Workspace {
  id: string
  name: string
  icon: string        // emoji or lucide icon name
  color: string       // hex accent
  projectIds: string[]
  createdAt: number
}

export interface Project {
  id: string
  workspaceId: string
  name: string
  icon: string
  description?: string
  todoIds: string[]
  viewMode: 'list' | 'kanban' | 'calendar'
  createdAt: number
}

export interface Todo {
  id: string
  projectId: string
  title: string
  body?: string        // rich text JSON (Tiptap)
  status: 'todo' | 'in_progress' | 'done' | 'archived'
  priority: 1 | 2 | 3 | 4    // P1 = urgent, P4 = someday
  tags: string[]
  dueAt?: number
  completedAt?: number
  subtasks: Subtask[]
  order: number        // for manual reordering
  createdAt: number
  updatedAt: number
}

export interface Subtask {
  id: string
  title: string
  done: boolean
  order: number
}

export interface Tag {
  id: string
  name: string
  color: string
}
