import { useEffect } from "react";
import { useUIStore } from "../store/uiStore";
import { useTodoStore } from "../store/todoStore";

export function useKeyboardShortcuts() {
  const {
    toggleSidebar,
    setViewMode,
    setShortcutOverlayOpen,
    shortcutOverlayOpen,
    activeTodoId,
    setExportModalOpen,
    setSettingsPanelOpen,
  } = useUIStore();
  const { toggleTodoDone } = useTodoStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      const isEditable =
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable;

      // Always allow Cmd/Ctrl+K (command palette) — handled in useCommandPalette
      // Always allow Escape
      if (e.key === "Escape") {
        if (shortcutOverlayOpen) {
          e.preventDefault();
          setShortcutOverlayOpen(false);
          return;
        }
        return;
      }

      // Skip if inside editable element or task modal is open
      if (isEditable || activeTodoId) return;

      const meta = e.metaKey || e.ctrlKey;

      // ? — toggle shortcut overlay
      if (e.key === "?" && !meta) {
        e.preventDefault();
        setShortcutOverlayOpen(!shortcutOverlayOpen);
        return;
      }

      // Cmd+1-4 views
      if (meta && e.key === "1") { e.preventDefault(); setViewMode("list"); return; }
      if (meta && e.key === "2") { e.preventDefault(); setViewMode("kanban"); return; }
      if (meta && e.key === "3") { e.preventDefault(); setViewMode("calendar"); return; }
      if (meta && e.key === "4") { e.preventDefault(); setViewMode("stats"); return; }

      // [ ] sidebar toggle
      if (e.key === "[" && !meta) { e.preventDefault(); toggleSidebar(); return; }
      if (e.key === "]" && !meta) { e.preventDefault(); toggleSidebar(); return; }

      // Cmd+/ toggle shortcut hints
      if (meta && e.key === "/") {
        e.preventDefault();
        setShortcutOverlayOpen(!shortcutOverlayOpen);
        return;
      }

      // d — toggle done on first selected todo (placeholder)
      if (e.key === "d" && !meta) {
        const currentTodos = useTodoStore.getState().todos;
        if (currentTodos.length > 0) {
          e.preventDefault();
          toggleTodoDone(currentTodos[0].id);
        }
        return;
      }

      // Export shortcut
      if (meta && e.key === "e") {
        e.preventDefault();
        setExportModalOpen(true);
        return;
      }

      // Settings
      if (e.key === "," && meta) {
        e.preventDefault();
        setSettingsPanelOpen(true);
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    shortcutOverlayOpen,
    activeTodoId,
    toggleSidebar,
    setViewMode,
    setShortcutOverlayOpen,
    toggleTodoDone,
    setExportModalOpen,
    setSettingsPanelOpen,
  ]);
}
