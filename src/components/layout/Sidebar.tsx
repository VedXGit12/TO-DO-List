import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, ChevronRight, LayoutList, Columns, Calendar, BarChart2, Plus, Search, Settings } from "lucide-react";
import { sidebarVariants, sidebarLabelVariants, chevronVariants, workspaceVariants, workspaceChildrenVariants } from "../../lib/animations";
import { useUIStore, type ViewMode } from "../../store/uiStore";
import { useTodoStore } from "../../store/todoStore";

const VIEW_ITEMS: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
  { mode: "list",     icon: <LayoutList size={16} />, label: "List" },
  { mode: "kanban",   icon: <Columns size={16} />,    label: "Kanban" },
  { mode: "calendar", icon: <Calendar size={16} />,   label: "Calendar" },
  { mode: "stats",    icon: <BarChart2 size={16} />,  label: "Stats" },
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
      className="relative flex flex-col h-screen glass-1 overflow-hidden shrink-0"
      style={{ borderTop: "none", borderLeft: "none", borderBottom: "none" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <motion.div variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="flex items-center gap-2.5 overflow-hidden">
          <span className="relative" style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.03em" }}>
            Kur
            <span className="relative inline-block">
              o
              <svg
                className="logo-ring absolute"
                style={{ top: -1, left: -2, width: 18, height: 18, pointerEvents: "none" }}
                viewBox="0 0 18 18"
              >
                <circle cx="9" cy="9" r="8" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
            </span>
          </span>
        </motion.div>
        <motion.button onClick={toggleSidebar} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          className="p-1.5 flex items-center justify-center shrink-0"
          style={{ color: "var(--text-tertiary)", borderRadius: 10 }}>
          <motion.div variants={chevronVariants} animate={sidebarOpen ? "open" : "closed"}>
            <ChevronLeft size={16} />
          </motion.div>
        </motion.button>
      </div>

      {/* Search */}
      <div className="px-3 pt-4 pb-1">
        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm glass-interactive"
          style={{ color: "var(--text-tertiary)", background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
          <Search size={14} className="shrink-0" />
          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-xs">
            Search… <span style={{ color: "var(--text-ghost)", fontFamily: "var(--font-mono)", fontSize: 10 }}>⌘K</span>
          </motion.span>
        </motion.button>
      </div>

      {/* View switcher */}
      <div className="px-3 py-3">
        <div className="mb-2.5 px-2">
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "var(--text-tertiary)" }}>
            Views
          </span>
        </div>
        {VIEW_ITEMS.map(({ mode, icon, label }) => {
          const active = viewMode === mode;
          return (
            <motion.button key={mode} onClick={() => setViewMode(mode)} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 px-3 py-2 mb-0.5 text-sm glass-interactive"
              style={{
                color: active ? "var(--accent)" : "var(--text-secondary)",
                background: active ? "var(--accent-10)" : "transparent",
                borderRadius: 12,
              }}>
              <span className="shrink-0">{icon}</span>
              <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-[13px] font-medium">{label}</motion.span>
              {active && <motion.div layoutId="active-view-indicator" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />}
            </motion.button>
          );
        })}
      </div>

      <div className="mx-4 my-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} />

      {/* Workspaces */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-hide">
        <div className="mb-2.5 px-2">
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, color: "var(--text-tertiary)" }}>
            Workspaces
          </span>
        </div>
        {workspaces.map((ws, i) => {
          const wsProjects = projects.filter((p) => ws.projectIds.includes(p.id));
          const isExpanded = expandedWorkspaces.has(ws.id);
          return (
            <motion.div key={ws.id} custom={i} variants={workspaceVariants} initial="hidden" animate="visible">
              <button onClick={() => toggleWorkspace(ws.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 glass-interactive"
                style={{ color: "var(--text-secondary)", borderRadius: 12 }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
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
                    className="ml-3 pl-3 space-y-0.5 mt-1" style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                    {wsProjects.map((proj) => {
                      const isActive = activeProjectId === proj.id;
                      return (
                        <motion.button key={proj.id} onClick={() => setActiveProject(proj.id)} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 glass-interactive"
                          style={{
                            fontSize: 13,
                            background: isActive ? "var(--accent-10)" : "transparent",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            borderLeft: isActive ? "2px solid var(--accent-70)" : "2px solid transparent",
                            borderRadius: 10,
                          }}>
                          <span className="text-sm shrink-0">{proj.icon}</span>
                          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-[13px] truncate text-left">
                            {proj.name}
                          </motion.span>
                        </motion.button>
                      );
                    })}
                    <motion.button whileHover={{ x: 3 }}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 opacity-0 hover:opacity-100 transition-opacity"
                      style={{ color: "var(--text-tertiary)", borderRadius: 10 }}>
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
      <div className="px-3 pb-5 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <motion.button whileHover={{ x: 2 }}
          onClick={() => useUIStore.getState().setSettingsPanelOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 glass-interactive"
          style={{ color: "var(--text-secondary)", borderRadius: 12 }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
          <Settings size={15} className="shrink-0" />
          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-[13px] font-medium">Settings</motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
