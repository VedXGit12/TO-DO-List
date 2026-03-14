import { useState, useEffect, useCallback, useMemo } from "react";
import Fuse from "fuse.js";
import { useTodoStore } from "../store/todoStore";
import { useUIStore } from "../store/uiStore";
import type { Command, CommandGroup, TodoCommand, ProjectCommand, ActionCommand } from "../types/command";

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { todos, projects, workspaces } = useTodoStore();
  const { setViewMode, toggleSidebar, setActiveProject } = useUIStore();

  const open = useCallback(() => { setIsOpen(true); setQuery(""); setSelectedIndex(0); }, []);
  const close = useCallback(() => { setIsOpen(false); setQuery(""); setSelectedIndex(0); }, []);

  // Global keyboard listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Build action commands
  const actionCommands: ActionCommand[] = useMemo(() => [
    { type: "action", id: "act-list", label: "Switch to List view", shortcut: undefined, action: () => { setViewMode("list"); close(); } },
    { type: "action", id: "act-kanban", label: "Switch to Kanban view", shortcut: undefined, action: () => { setViewMode("kanban"); close(); } },
    { type: "action", id: "act-calendar", label: "Switch to Calendar view", shortcut: undefined, action: () => { setViewMode("calendar"); close(); } },
    { type: "action", id: "act-stats", label: "View Stats", shortcut: undefined, action: () => { setViewMode("stats"); close(); } },
    { type: "action", id: "act-sidebar", label: "Toggle Sidebar", shortcut: undefined, action: () => { toggleSidebar(); close(); } },
  ], [setViewMode, toggleSidebar, close]);

  // Build search items
  const todoItems: TodoCommand[] = useMemo(
    () =>
      todos.map((t) => {
        const proj = projects.find((p) => p.id === t.projectId);
        return {
          type: "todo" as const,
          id: t.id,
          title: t.title,
          projectName: proj?.name ?? "",
          status: t.status,
          priority: t.priority,
        };
      }),
    [todos, projects]
  );

  const projectItems: ProjectCommand[] = useMemo(
    () =>
      projects.map((p) => {
        const ws = workspaces.find((w) => w.projectIds.includes(p.id));
        return {
          type: "project" as const,
          id: p.id,
          name: p.name,
          icon: p.icon,
          workspaceName: ws?.name ?? "",
        };
      }),
    [projects, workspaces]
  );

  // Fuse instances
  const fuseResults = useMemo(() => {
    if (!isOpen || !query.trim()) return null;
    const fuseTodos = new Fuse(todoItems, { keys: ["title", "projectName"], threshold: 0.3, includeScore: true, minMatchCharLength: 1 });
    const fuseProjects = new Fuse(projectItems, { keys: ["name", "workspaceName"], threshold: 0.3, includeScore: true, minMatchCharLength: 1 });
    const fuseActions = new Fuse(actionCommands, { keys: ["label"], threshold: 0.3, includeScore: true, minMatchCharLength: 1 });

    return {
      todos: fuseTodos.search(query).slice(0, 5).map((r) => r.item),
      projects: fuseProjects.search(query).slice(0, 5).map((r) => r.item),
      actions: fuseActions.search(query).slice(0, 5).map((r) => r.item),
    };
  }, [isOpen, query, todoItems, projectItems, actionCommands]);

  const results: CommandGroup[] = useMemo(() => {
    if (!isOpen) return [];
    if (!query.trim()) {
      // Show recent + all actions by default
      const groups: CommandGroup[] = [];
      const recentTodos = todoItems.slice(0, 5);
      if (recentTodos.length > 0) groups.push({ label: "Recent Tasks", commands: recentTodos });
      if (projectItems.length > 0) groups.push({ label: "Projects", commands: projectItems.slice(0, 5) });
      if (actionCommands.length > 0) groups.push({ label: "Actions", commands: actionCommands });
      return groups;
    }
    if (!fuseResults) return [];
    const groups: CommandGroup[] = [];
    if (fuseResults.todos.length > 0) groups.push({ label: "Tasks", commands: fuseResults.todos });
    if (fuseResults.projects.length > 0) groups.push({ label: "Projects", commands: fuseResults.projects });
    if (fuseResults.actions.length > 0) groups.push({ label: "Actions", commands: fuseResults.actions });
    return groups;
  }, [isOpen, query, fuseResults, todoItems, projectItems, actionCommands]);

  const flatCommands: Command[] = useMemo(
    () => results.flatMap((g) => g.commands),
    [results]
  );

  // Keyboard navigation within the palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(flatCommands.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + flatCommands.length) % Math.max(flatCommands.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = flatCommands[selectedIndex];
        if (cmd) executeCommand(cmd);
      }
    },
    [flatCommands, selectedIndex]
  );

  const executeCommand = useCallback(
    (cmd: Command) => {
      switch (cmd.type) {
        case "todo":
          // For now, just close the palette
          close();
          break;
        case "project":
          setActiveProject(cmd.id);
          close();
          break;
        case "action":
          cmd.action();
          break;
      }
    },
    [close, setActiveProject]
  );

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return {
    isOpen,
    open,
    close,
    query,
    setQuery,
    results,
    flatCommands,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    executeCommand,
  };
}
