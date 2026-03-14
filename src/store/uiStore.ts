import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "list" | "kanban" | "calendar" | "stats";

interface UIState {
  sidebarOpen: boolean;
  activeProjectId: string | null;
  activeWorkspaceId: string | null;
  viewMode: ViewMode;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveProject: (id: string | null) => void;
  setActiveWorkspace: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeProjectId: null,
      activeWorkspaceId: null,
      viewMode: "list",
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveProject: (activeProjectId) => set({ activeProjectId }),
      setActiveWorkspace: (activeWorkspaceId) => set({ activeWorkspaceId }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: "ui-store" }
  )
);
