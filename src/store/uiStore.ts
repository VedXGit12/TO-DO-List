import { create } from "zustand";
import { persist } from "zustand/middleware";
import { hexToRgba } from "../lib/colors";

export type ViewMode = "list" | "kanban" | "calendar" | "stats";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "error";
  undoFn?: () => void;
}

const toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

export type AccentColor = "amber" | "blue" | "green" | "purple" | "red" | "pink";

export const ACCENT_COLORS: Record<AccentColor, string> = {
  amber: "#ffb347",
  blue: "#3b82f6",
  green: "#50dc8c",
  purple: "#a855f7",
  red: "#ff6464",
  pink: "#ec4899",
};

interface UIState {
  sidebarOpen: boolean;
  activeProjectId: string | null;
  activeWorkspaceId: string | null;
  viewMode: ViewMode;
  activeTodoId: string | null;
  toasts: Toast[];
  accentColor: AccentColor;
  compactMode: boolean;
  sidebarDefaultOpen: boolean;
  shortcutOverlayOpen: boolean;
  settingsPanelOpen: boolean;
  exportModalOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveProject: (id: string | null) => void;
  setActiveWorkspace: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setActiveTodo: (id: string | null) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  setAccentColor: (color: AccentColor) => void;
  setCompactMode: (on: boolean) => void;
  setSidebarDefaultOpen: (open: boolean) => void;
  setShortcutOverlayOpen: (open: boolean) => void;
  setSettingsPanelOpen: (open: boolean) => void;
  setExportModalOpen: (open: boolean) => void;
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
      accentColor: "amber",
      compactMode: false,
      sidebarDefaultOpen: true,
      shortcutOverlayOpen: false,
      settingsPanelOpen: false,
      exportModalOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveProject: (activeProjectId) => set({ activeProjectId }),
      setActiveWorkspace: (activeWorkspaceId) => set({ activeWorkspaceId }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setActiveTodo: (id) => set({ activeTodoId: id }),
      addToast: (toast) => {
        const id = crypto.randomUUID();
        set((s) => ({ toasts: [{ ...toast, id }, ...s.toasts] }));
        const timer = setTimeout(() => {
          toastTimers.delete(id);
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 3000);
        toastTimers.set(id, timer);
      },
      removeToast: (id) => {
        const timer = toastTimers.get(id);
        if (timer) {
          clearTimeout(timer);
          toastTimers.delete(id);
        }
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      },
      setAccentColor: (color: AccentColor) => {
        const hex = ACCENT_COLORS[color];
        document.documentElement.style.setProperty("--accent", hex);
        document.documentElement.style.setProperty("--accent-dim", hexToRgba(hex, 0.12));
        document.documentElement.style.setProperty("--accent-10", hexToRgba(hex, 0.10));
        document.documentElement.style.setProperty("--accent-20", hexToRgba(hex, 0.20));
        document.documentElement.style.setProperty("--accent-40", hexToRgba(hex, 0.40));
        document.documentElement.style.setProperty("--accent-45", hexToRgba(hex, 0.45));
        document.documentElement.style.setProperty("--accent-70", hexToRgba(hex, 0.70));
        set({ accentColor: color });
      },
      setCompactMode: (on) => set({ compactMode: on }),
      setSidebarDefaultOpen: (open) => set({ sidebarDefaultOpen: open }),
      setShortcutOverlayOpen: (open) => set({ shortcutOverlayOpen: open }),
      setSettingsPanelOpen: (open) => set({ settingsPanelOpen: open }),
      setExportModalOpen: (open) => set({ exportModalOpen: open }),
    }),
    {
      name: "ui-store",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        activeProjectId: state.activeProjectId,
        activeWorkspaceId: state.activeWorkspaceId,
        viewMode: state.viewMode,
        accentColor: state.accentColor,
        compactMode: state.compactMode,
        sidebarDefaultOpen: state.sidebarDefaultOpen,
      }),
    }
  )
);
