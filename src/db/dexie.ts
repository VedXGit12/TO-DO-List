import Dexie, { type Table } from 'dexie'
import type { Workspace, Project, Todo, Tag } from '../types/todo'

export class TodoDatabase extends Dexie {
  workspaces!: Table<Workspace>
  projects!: Table<Project>
  todos!: Table<Todo>
  tags!: Table<Tag>

  constructor() {
    super('TodoAppDB')

    this.version(1).stores({
      workspaces: 'id, name, createdAt',
      projects:   'id, workspaceId, name, createdAt',
      todos:      'id, projectId, status, priority, dueAt, createdAt, updatedAt, order',
      tags:       'id, name',
    })
  }
}

export const db = new TodoDatabase()

/* ── Helper functions ── */

export async function getTodosByProject(projectId: string): Promise<Todo[]> {
  return db.todos.where('projectId').equals(projectId).sortBy('order')
}

export async function createTodo(data: Todo): Promise<void> {
  await db.todos.add(data)
}

export async function updateTodo(id: string, patch: Partial<Todo>): Promise<void> {
  await db.todos.update(id, { ...patch, updatedAt: Date.now() })
}

export async function deleteTodo(id: string): Promise<void> {
  await db.todos.delete(id)
}

export async function toggleDone(id: string): Promise<Todo | undefined> {
  const todo = await db.todos.get(id)
  if (!todo) return undefined
  const now = Date.now()
  const isDone = todo.status === 'done'
  const patch: Partial<Todo> = {
    status: isDone ? 'todo' : 'done',
    completedAt: isDone ? undefined : now,
    updatedAt: now,
  }
  await db.todos.update(id, patch)
  return { ...todo, ...patch }
}

export async function getAllTags(): Promise<Tag[]> {
  return db.tags.toArray()
}

export async function createTag(tag: Tag): Promise<void> {
  await db.tags.add(tag)
}
