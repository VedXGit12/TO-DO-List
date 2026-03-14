import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, ChevronRight, LayoutList, Columns, Calendar, BarChart2, Plus, Search, Settings } from "lucide-react";
import { sidebarVariants, sidebarLabelVariants, chevronVariants, workspaceVariants, workspaceChildrenVariants } from "../../lib/animations";
import { useUIStore, type ViewMode } from "../../store/uiStore";
import { useTodoStore } from "../../store/todoStore";

const VIEW_ITEMS: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
  { mode: "list",     icon: <LayoutList size={15} />, label: "List" },
  { mode: "kanban",   icon: <Columns size={15} />,    label: "Kanban" },
  { mode: "calendar", icon: <Calendar size={15} />,   label: "Calendar" },
  { mode: "stats",    icon: <BarChart2 size={15} />,  label: "Stats" },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, activeProjectId, setActiveProject, viewMode, setViewMode } = useUIStore();
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
    <motion.aside
      variants={sidebarVariants}
      animate={sidebarOpen ? "open" : "closed"}
      initial={false}
      className="relative flex flex-col h-screen border-r overflow-hidden shrink-0"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <motion.div variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="flex items-center gap-2 overflow-hidden">
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}>Kuro</span>
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}>beta</span>
        </motion.div>
        <motion.button onClick={toggleSidebar} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="p-1.5 rounded-md flex items-center justify-center shrink-0"
          style={{ color: "var(--text-secondary)" }}>
          <motion.div variants={chevronVariants} animate={sidebarOpen ? "open" : "closed"}>
            <ChevronLeft size={16} />
          </motion.div>
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-2 pt-3 pb-1">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm"
          style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}>
          <Search size={14} className="shrink-0" />
          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-xs">
            Search... <span style={{ color: "var(--border)" }}>⌘K</span>
          </motion.span>
        </motion.button>
      </div>

      {/* View switcher */}
      <div className="px-2 py-2">
        {VIEW_ITEMS.map(({ mode, icon, label }) => {
          const active = viewMode === mode;
          return (
            <motion.button key={mode} onClick={() => setViewMode(mode)} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm mb-0.5"
              style={{ color: active ? "var(--accent)" : "var(--text-secondary)", background: active ? "rgba(232,160,69,0.1)" : "transparent" }}>
              <span className="shrink-0">{icon}</span>
              <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-xs font-medium">{label}</motion.span>
              {active && <motion.div layoutId="active-view-indicator" className="ml-auto w-1 h-1 rounded-full" style={{ background: "var(--accent)" }} />}
            </motion.button>
          );
        })}
      </div>

      <div className="mx-3 my-1 border-t" style={{ borderColor: "var(--border)" }} />

      {/* Workspaces */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 scrollbar-hide">
        {workspaces.map((ws, i) => {
          const wsProjects = projects.filter((p) => ws.projectIds.includes(p.id));
          const isExpanded = expandedWorkspaces.has(ws.id);
          return (
            <motion.div key={ws.id} custom={i} variants={workspaceVariants} initial="hidden" animate="visible">
              <button onClick={() => toggleWorkspace(ws.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span className="text-base shrink-0">{ws.icon}</span>
                <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"}
                  className="text-xs font-semibold uppercase tracking-wider flex-1 text-left truncate" style={{ color: ws.color }}>
                  {ws.name}
                </motion.span>
                <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="shrink-0">
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div variants={workspaceChildrenVariants} initial="hidden" animate="visible" exit="exit"
                    className="ml-2 pl-2 border-l space-y-0.5 mt-0.5" style={{ borderColor: "var(--border)" }}>
                    {wsProjects.map((proj) => {
                      const isActive = activeProjectId === proj.id;
                      return (
                        <motion.button key={proj.id} onClick={() => setActiveProject(proj.id)} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm"
                          style={{
                            background: isActive ? "rgba(232,160,69,0.08)" : "transparent",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                          }}>
                          <span className="text-sm shrink-0">{proj.icon}</span>
                          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-xs truncate text-left">
                            {proj.name}
                          </motion.span>
                        </motion.button>
                      );
                    })}
                    <motion.button whileHover={{ x: 3 }}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md opacity-0 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--text-secondary)" }}>
                      <Plus size={12} className="shrink-0" />
                      <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-xs">Add project</motion.span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-2 pb-4 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        <motion.button whileHover={{ x: 2 }}
          onClick={() => useUIStore.getState().setSettingsPanelOpen(true)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <Settings size={14} className="shrink-0" />
          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-xs">Settings</motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
