import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ViewMode = "list" | "kanban" | "calendar" | "stats";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  undoFn?: () => void;
}

interface UIState {
  sidebarOpen: boolean;
  activeProjectId: string | null;
  activeWorkspaceId: string | null;
  viewMode: ViewMode;
  activeTodoId: string | null;
  toasts: Toast[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveProject: (id: string | null) => void;
  setActiveWorkspace: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveTodo: (id: string | null) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeProjectId: null,
      activeWorkspaceId: null,
      viewMode: "list",
      activeTodoId: null,
      toasts: [],
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveProject: (activeProjectId) => set({ activeProjectId }),
      setActiveWorkspace: (activeWorkspaceId) => set({ activeWorkspaceId }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveTodo: (id) => set({ activeTodoId: id }),
      addToast: (toast) => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [{ ...toast, id }, ...s.toasts] }));
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 3000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        activeProjectId: state.activeProjectId,
        activeWorkspaceId: state.activeWorkspaceId,
        viewMode: state.viewMode,
      }),
    }
  )
);
