import { create } from 'zustand'
import type { Project } from '../types/todo'

type ViewMode = 'list' | 'kanban' | 'calendar' | 'stats'

interface UIState {
  sidebarOpen: boolean
  viewMode: ViewMode
  activeWorkspaceId: string | null
  activeProjectId: string | null
  commandPaletteOpen: boolean
  taskModalId: string | null

  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setViewMode: (mode: ViewMode) => void
  setActiveWorkspace: (id: string | null) => void
  setActiveProject: (id: string | null) => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleCommandPalette: () => void
  openTaskModal: (id: string) => void
  closeTaskModal: () => void

  // Derived helper: get effective view mode, respecting project-level override
  getEffectiveViewMode: (project?: Pick<Project, 'viewMode'> | null) => ViewMode
}

export const useUIStore = create<UIState>((set, get) => ({
  sidebarOpen: true,
  viewMode: 'list',
  activeWorkspaceId: null,
  activeProjectId: null,
  commandPaletteOpen: false,
  taskModalId: null,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
  setActiveProject: (id) => set({ activeProjectId: id }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
  openTaskModal: (id) => set({ taskModalId: id }),
  closeTaskModal: () => set({ taskModalId: null }),

  getEffectiveViewMode: (project) => {
    if (project?.viewMode) return project.viewMode as ViewMode
    return get().viewMode
  },
}))
