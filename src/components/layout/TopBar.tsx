import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, Columns, Calendar, BarChart2, Plus, Search } from "lucide-react";
import { useUIStore, type ViewMode } from "../../store/uiStore";
import { useTodoStore } from "../../store/todoStore";
import { viewVariants } from "../../lib/animations";

const VIEW_BUTTONS: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
  { mode: "list",     icon: <LayoutList size={15} />, label: "List" },
  { mode: "kanban",   icon: <Columns size={15} />,    label: "Kanban" },
  { mode: "calendar", icon: <Calendar size={15} />,   label: "Calendar" },
  { mode: "stats",    icon: <BarChart2 size={15} />,  label: "Stats" },
];

export default function TopBar() {
  const { activeProjectId, viewMode, setViewMode } = useUIStore();
  const { projects, workspaces } = useTodoStore();

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const activeWorkspace = activeProject
    ? workspaces.find((w) => w.projectIds.includes(activeProject.id))
    : null;

  return (
    <div
      className="flex items-center justify-between px-5 shrink-0"
      style={{
        height: 52,
        background: "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0">
        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.div
              key={activeProject.id}
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-1.5 min-w-0"
            >
              {activeWorkspace && (
                <>
                  <span className="text-sm shrink-0">{activeWorkspace.icon}</span>
                  <motion.span
                    whileHover={{ textDecoration: "underline" }}
                    className="text-sm truncate cursor-pointer"
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 14 }}
                  >
                    {activeWorkspace.name}
                  </motion.span>
                  <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14, margin: "0 2px" }}>/</span>
                </>
              )}
              <span className="text-sm shrink-0">{activeProject.icon}</span>
              <span
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)", fontSize: 14 }}
              >
                {activeProject.name}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="no-project"
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h1
                style={{ color: "var(--accent)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 17 }}
              >
                Kuro
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: view mode pills in glass capsule */}
      <div
        className="glass-2 flex items-center gap-0.5 px-1 py-0.5"
        style={{ borderRadius: 12 }}
      >
        {VIEW_BUTTONS.map(({ mode, icon, label }) => {
          const active = viewMode === mode;
          return (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium"
              style={{
                borderRadius: 9,
                color: active ? "rgba(255,255,255,0.92)" : "var(--text-secondary)",
              }}
            >
              {active && (
                <motion.div
                  layoutId="topbar-view-indicator"
                  className="absolute inset-0 glass-3"
                  style={{ borderRadius: 9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 shrink-0">{icon}</span>
              <span className="relative z-10 hidden sm:inline">{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1.5 p-2 rounded-md"
          style={{ color: "var(--text-secondary)" }}
        >
          <Search size={15} />
          <span
            className="px-1 py-0.5 rounded"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              opacity: 0.7,
            }}
          >
            ⌘K
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(255,191,71,1) 0%, rgba(255,159,48,1) 100%)",
            color: "#0A0A0A",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
        >
          <Plus size={14} />
          <span>New Task</span>
        </motion.button>
      </div>
    </div>
  );
}
