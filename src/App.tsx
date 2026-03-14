import { useEffect, useState, useRef } from "react";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import TodoList from "./components/todo/TodoList";
import TodoKanban from "./components/todo/TodoKanban";
import TodoCalendar from "./components/todo/TodoCalendar";
import StatsBoard from "./components/stats/StatsBoard";
import CommandPalette from "./components/CommandPalette";
import TaskModal from "./components/modals/TaskModal";
import MotionToast from "./components/ui/MotionToast";
import ShortcutOverlay from "./components/ShortcutOverlay";
import ExportModal from "./components/modals/ExportModal";
import SettingsPanel from "./components/modals/SettingsPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import { useUIStore, ACCENT_COLORS } from "./store/uiStore";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const { activeProjectId, viewMode, accentColor, addToast } = useUIStore();
  const showList = activeProjectId && viewMode === "list";
  const showKanban = activeProjectId && viewMode === "kanban";
  const showCalendar = activeProjectId && viewMode === "calendar";
  const showStats = viewMode === "stats";

  // Mount global keyboard shortcuts
  useKeyboardShortcuts();

  // Apply persisted accent color on mount
  useEffect(() => {
    const hex = ACCENT_COLORS[accentColor];
    document.documentElement.style.setProperty("--accent", hex);
    document.documentElement.style.setProperty("--accent-dim", hex + "1f");
    document.documentElement.style.setProperty("--accent-10", hex + "1a");
    document.documentElement.style.setProperty("--accent-20", hex + "33");
    document.documentElement.style.setProperty("--accent-40", hex + "66");
    document.documentElement.style.setProperty("--accent-45", hex + "73");
    document.documentElement.style.setProperty("--accent-70", hex + "b3");
  }, [accentColor]);

  // PWA install prompt
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;

      const seen = localStorage.getItem("hasSeenInstallPrompt");
      if (!seen) {
        timer = setTimeout(() => {
          localStorage.setItem("hasSeenInstallPrompt", "1");
          addToast({ message: "Install Kuro for offline access", type: "info" });
        }, 30000);
      }
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (timer) clearTimeout(timer);
    };
  }, [addToast]);

  // Offline indicator
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => {
      setIsOffline(false);
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Offline banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-0 left-0 right-0 z-50 py-1.5 text-center text-xs font-medium"
            style={{ background: "var(--accent)", color: "var(--bg-base)" }}
          >
            You're offline — changes saved locally
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {showStats ? (
            <ErrorBoundary fallbackMessage="Stats failed to load">
              <StatsBoard />
            </ErrorBoundary>
          ) : showList ? (
            <ErrorBoundary fallbackMessage="List view failed to load">
              <TodoList />
            </ErrorBoundary>
          ) : showKanban ? (
            <ErrorBoundary fallbackMessage="Kanban view failed to load">
              <TodoKanban />
            </ErrorBoundary>
          ) : showCalendar ? (
            <ErrorBoundary fallbackMessage="Calendar view failed to load">
              <TodoCalendar />
            </ErrorBoundary>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Select a project from the sidebar to get started.
              </p>
            </div>
          )}
        </main>
      </div>
      <CommandPalette />
      <TaskModal />
      <MotionToast />
      <ShortcutOverlay />
      <ExportModal />
      <SettingsPanel />
    </div>
  );
}

// Type declaration for PWA install prompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
}
