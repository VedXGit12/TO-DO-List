import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, LayoutList, Columns, Calendar, BarChart2, Plus, Settings } from "lucide-react";
import { sidebarLabelVariants, workspaceVariants, workspaceChildrenVariants } from "../../lib/animations";
import { useUIStore, type ViewMode } from "../../store/uiStore";
import { useTodoStore } from "../../store/todoStore";

const VIEW_ITEMS: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
  { mode: "list",     icon: <LayoutList size={16} />, label: "List" },
  { mode: "kanban",   icon: <Columns size={16} />,    label: "Kanban" },
  { mode: "calendar", icon: <Calendar size={16} />,   label: "Calendar" },
  { mode: "stats",    icon: <BarChart2 size={16} />,  label: "Stats" },
];

export default function Sidebar() {
  const { activeProjectId, setActiveProject, viewMode, setViewMode } = useUIStore();
  const { workspaces, projects } = useTodoStore();
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<Set<string>>(new Set(workspaces.map((w) => w.id)));

  const toggleWorkspace = (id: string) => {
    setExpandedWorkspaces((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <aside
      className="relative flex flex-col h-full overflow-hidden shrink-0 z-10"
      style={{
        width: 160,
        background: "#0C0E13",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo "Kuro" */}
      <div className="px-4 pt-8 pb-5">
        <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>
          Kuro
        </span>
      </div>

      {/* Navigation items */}
      <div className="px-2 pb-3">
        {VIEW_ITEMS.map(({ mode, icon, label }) => {
          const active = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="w-full flex items-center gap-2.5 px-3 py-2 mb-0.5"
              style={{
                color: active ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.55)",
                background: active ? "rgba(255,255,255,0.10)" : "transparent",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                transition: "all 0.15s",
              }}
            >
              <span className="shrink-0" style={{ opacity: active ? 0.92 : 0.55 }}>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Workspaces section */}
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-hide">
        {workspaces.map((ws, i) => {
          const wsProjects = projects.filter((p) => ws.projectIds.includes(p.id));
          const isExpanded = expandedWorkspaces.has(ws.id);
          return (
            <div key={ws.id}>
              {/* Workspace label */}
              <div className="flex items-center justify-between px-3 mt-4 mb-1.5">
                <span style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.30)",
                }}>
                  {ws.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="p-0.5"
                    style={{ color: "rgba(255,255,255,0.30)" }}
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => toggleWorkspace(ws.id)}
                    className="p-0.5"
                    style={{ color: "rgba(255,255,255,0.30)" }}
                  >
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                </div>
              </div>

              {/* Project rows */}
              {isExpanded && wsProjects.map((proj) => {
                const isActive = activeProjectId === proj.id;
                // Determine dot color by project ID, fallback to workspace color
                const PROJECT_DOT_COLORS: Record<string, string> = {
                  "proj-1": "#F5A623",  // Daily Tasks — amber
                  "proj-2": "#9478FF",  // Anime Tracker — purple
                  "proj-3": "#5B9CF6",  // Dev Projects — blue
                };
                const dotColor = PROJECT_DOT_COLORS[proj.id] ?? ws.color ?? "#F5A623";
                return (
                  <button
                    key={proj.id}
                    onClick={() => setActiveProject(proj.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 ml-1"
                    style={{
                      fontSize: 13,
                      color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)",
                      background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                      borderRadius: 6,
                      fontWeight: isActive ? 500 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: dotColor,
                        flexShrink: 0,
                      }}
                    />
                    <span className="truncate">{proj.name}</span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-2 pb-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <button
          onClick={() => useUIStore.getState().setSettingsPanelOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2"
          style={{ color: "rgba(255,255,255,0.55)", borderRadius: 8, fontSize: 13, transition: "all 0.15s" }}
        >
          <Settings size={15} style={{ opacity: 0.55 }} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
