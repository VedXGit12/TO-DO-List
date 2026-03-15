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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning ☀️";
  if (h < 17) return "Good afternoon 🌤";
  return "Good evening 🌙";
}

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
      className="relative flex flex-col h-screen overflow-hidden shrink-0 z-10"
      style={{
        background: "rgba(255,255,255,0.025)",
        backdropFilter: "blur(48px) saturate(180%)",
        WebkitBackdropFilter: "blur(48px) saturate(180%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Header with greeting */}
      <div className="px-4 pt-5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <motion.div variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="flex items-center gap-2.5 overflow-hidden">
            <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.04em" }}>
              <span className="greeting-gradient">Kur</span>
              <span className="relative inline-block greeting-gradient">
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
          <motion.button onClick={toggleSidebar} whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.06)" }} whileTap={{ scale: 0.9 }}
            className="p-1.5 flex items-center justify-center shrink-0"
            style={{ color: "var(--text-tertiary)", borderRadius: 8, transition: "background 0.2s" }}>
            <motion.div variants={chevronVariants} animate={sidebarOpen ? "open" : "closed"}>
              <ChevronLeft size={16} />
            </motion.div>
          </motion.button>
        </div>
        {/* Greeting area */}
        <motion.div variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"}>
          <p className="greeting-gradient" style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
            {getGreeting()}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 3, fontWeight: 500 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          </p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3.5 pb-1">
        <motion.button whileHover={{ scale: 1.01, background: "rgba(255,255,255,0.06)" }} whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm"
          style={{ color: "var(--text-tertiary)", background: "rgba(255,255,255,0.035)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s" }}>
          <Search size={14} className="shrink-0" style={{ opacity: 0.7 }} />
          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-xs font-medium">
            Search… <span style={{ color: "var(--text-ghost)", fontFamily: "var(--font-mono)", fontSize: 10 }}>⌘K</span>
          </motion.span>
        </motion.button>
      </div>

      {/* View switcher */}
      <div className="px-3 py-3">
        <div className="mb-2 px-2">
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, color: "var(--text-tertiary)" }}>
            Views
          </span>
        </div>
        {VIEW_ITEMS.map(({ mode, icon, label }) => {
          const active = viewMode === mode;
          return (
            <motion.button key={mode} onClick={() => setViewMode(mode)} whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
              className="w-full flex items-center gap-3 px-3 py-2 mb-0.5 text-sm"
              style={{
                color: active ? "var(--accent)" : "var(--text-secondary)",
                background: active ? "var(--accent-surface)" : "transparent",
                borderRadius: 10,
                fontWeight: active ? 600 : 500,
                transition: "all 0.15s",
              }}>
              <span className="shrink-0" style={{ opacity: active ? 1 : 0.7 }}>{icon}</span>
              <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-[13px]">{label}</motion.span>
              {active && <motion.div layoutId="active-view-indicator" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent-glow)" }} />}
            </motion.button>
          );
        })}
      </div>

      <div className="mx-4 my-1" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }} />

      {/* Workspaces */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-hide">
        <div className="mb-2 px-2">
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, color: "var(--text-tertiary)" }}>
            Workspaces
          </span>
        </div>
        {workspaces.map((ws, i) => {
          const wsProjects = projects.filter((p) => ws.projectIds.includes(p.id));
          const isExpanded = expandedWorkspaces.has(ws.id);
          return (
            <motion.div key={ws.id} custom={i} variants={workspaceVariants} initial="hidden" animate="visible">
              <button onClick={() => toggleWorkspace(ws.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2"
                style={{ color: "var(--text-secondary)", borderRadius: 10, transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <span className="text-base shrink-0">{ws.icon}</span>
                <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"}
                  className="text-[12px] font-semibold uppercase tracking-wider flex-1 text-left truncate" style={{ color: ws.color }}>
                  {ws.name}
                </motion.span>
                <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="shrink-0" style={{ opacity: 0.5 }}>
                  {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div variants={workspaceChildrenVariants} initial="hidden" animate="visible" exit="exit"
                    className="ml-3 pl-3 space-y-0.5 mt-0.5" style={{ borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
                    {wsProjects.map((proj) => {
                      const isActive = activeProjectId === proj.id;
                      return (
                        <motion.button key={proj.id} onClick={() => setActiveProject(proj.id)} whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center gap-2.5 px-3 py-2"
                          style={{
                            fontSize: 13,
                            background: isActive ? "var(--accent-surface)" : "transparent",
                            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                            borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                            borderRadius: 10,
                            fontWeight: isActive ? 600 : 400,
                            boxShadow: isActive ? "inset 0 0 16px rgba(255,179,71,0.04)" : "none",
                            transition: "all 0.15s",
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
        <motion.button whileHover={{ x: 2, background: "rgba(255,255,255,0.04)" }}
          onClick={() => useUIStore.getState().setSettingsPanelOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5"
          style={{ color: "var(--text-secondary)", borderRadius: 10, transition: "all 0.15s" }}>
          <Settings size={15} className="shrink-0" style={{ opacity: 0.7 }} />
          <motion.span variants={sidebarLabelVariants} animate={sidebarOpen ? "open" : "closed"} className="text-[13px] font-medium">Settings</motion.span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
