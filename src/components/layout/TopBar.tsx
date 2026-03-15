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
      className="flex items-center justify-between px-6 shrink-0"
      style={{
        height: 56,
        background: "transparent",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.div
              key={activeProject.id}
              variants={viewVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2 min-w-0"
            >
              {activeWorkspace && (
                <>
                  <span className="text-sm shrink-0">{activeWorkspace.icon}</span>
                  <motion.span
                    whileHover={{ textDecoration: "underline" }}
                    className="text-sm truncate cursor-pointer"
                    style={{ color: "var(--text-secondary)", fontWeight: 500, fontSize: 14, letterSpacing: "-0.01em" }}
                  >
                    {activeWorkspace.name}
                  </motion.span>
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 14, margin: "0 1px" }}>/</span>
                </>
              )}
              <span className="text-sm shrink-0">{activeProject.icon}</span>
              <span
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)", fontSize: 15, letterSpacing: "-0.02em" }}
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
                style={{ color: "var(--accent)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.03em" }}
              >
                Kuro
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center: view mode pills in glass capsule */}
      <div
        className="flex items-center gap-1 px-1.5 py-1"
        style={{
          borderRadius: 12,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: 3,
        }}
      >
        {VIEW_BUTTONS.map(({ mode, icon, label }) => {
          const active = viewMode === mode;
          return (
            <motion.button
              key={mode}
              onClick={() => setViewMode(mode)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium"
              style={{
                borderRadius: 12,
                color: active ? "rgba(255,255,255,0.95)" : "var(--text-secondary)",
              }}
            >
              {active && (
                <motion.div
                  layoutId="topbar-view-indicator"
                  className="absolute inset-0"
                  style={{
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderTopColor: "rgba(255,255,255,0.22)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
                  }}
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
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="flex items-center gap-1.5 p-2.5 glass-interactive"
          style={{ color: "var(--text-secondary)", borderRadius: 12 }}
        >
          <Search size={15} />
          <span
            className="px-1.5 py-0.5"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "var(--text-tertiary)",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              borderRadius: 6,
            }}
          >
            ⌘K
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02, filter: "brightness(1.05)" }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold"
          style={{
            background: "linear-gradient(145deg, #FFB347 0%, #FF9F30 100%)",
            color: "#0A0A0A",
            borderRadius: 10,
            border: "none",
            boxShadow: "0 0 20px rgba(255,179,71,0.35), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>New Task</span>
        </motion.button>
      </div>
    </div>
  );
}
