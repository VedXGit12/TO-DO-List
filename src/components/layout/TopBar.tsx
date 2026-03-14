import { motion, AnimatePresence } from "framer-motion";
import { LayoutList, Columns, Calendar, BarChart2, Plus, MoreHorizontal, Search } from "lucide-react";
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
      className="flex items-center justify-between px-5 py-3 border-b shrink-0"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Left: project info */}
      <div className="flex items-center gap-3 min-w-0">
        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.div
              key={activeProject.id}
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2.5 min-w-0"
            >
              <span className="text-lg shrink-0">{activeProject.icon}</span>
              <div className="min-w-0">
                <h1
                  className="text-sm font-semibold truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {activeProject.name}
                </h1>
                {activeWorkspace && (
                  <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                    {activeWorkspace.icon} {activeWorkspace.name}
                  </p>
                )}
              </div>
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
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-display)" }}
              >
                Kuro
              </h1>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Select a project to get started
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: view mode switcher */}
      <div
        className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg"
        style={{ background: "var(--bg-elevated)" }}
      >
        {VIEW_BUTTONS.map(({ mode, icon, label }) => {
          const active = viewMode === mode;
          return (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                color: active ? "var(--accent)" : "var(--text-secondary)",
              }}
            >
              {active && (
                <motion.div
                  layoutId="topbar-view-indicator"
                  className="absolute inset-0 rounded-md"
                  style={{ background: "var(--accent-dim)" }}
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
            className="text-xs px-1 py-0.5 rounded font-mono"
            style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", fontSize: 10 }}
          >
            ⌘K
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium"
          style={{ background: "var(--accent)", color: "var(--bg-base)" }}
        >
          <Plus size={14} />
          <span>New Task</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-md"
          style={{ color: "var(--text-secondary)" }}
        >
          <MoreHorizontal size={15} />
        </motion.button>
      </div>
    </div>
  );
}
