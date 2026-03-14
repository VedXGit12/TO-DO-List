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
