import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useUIStore } from "../store/uiStore";
import { modalOverlayVariants, modalVariants } from "../lib/animations";

const SHORTCUT_GROUPS = [
  {
    group: "Navigation",
    shortcuts: [
      { label: "Command palette", keys: ["⌘", "K"] },
      { label: "This overlay", keys: ["?"] },
      { label: "Toggle sidebar", keys: ["[", "]"] },
      { label: "List / Kanban / Calendar / Stats", keys: ["⌘1", "–", "4"] },
    ],
  },
  {
    group: "Tasks",
    shortcuts: [
      { label: "New task", keys: ["N"] },
      { label: "Edit task", keys: ["E"] },
      { label: "Toggle done", keys: ["D"] },
      { label: "Archive", keys: ["Del"] },
    ],
  },
  {
    group: "Priority",
    shortcuts: [
      { label: "Urgent", keys: ["1"] },
      { label: "High", keys: ["2"] },
      { label: "Medium", keys: ["3"] },
      { label: "Low", keys: ["4"] },
    ],
  },
  {
    group: "Modal",
    shortcuts: [
      { label: "Close", keys: ["Esc"] },
      { label: "Toggle done", keys: ["⌘", "↵"] },
      { label: "Next field", keys: ["Tab"] },
    ],
  },
  {
    group: "Calendar",
    shortcuts: [
      { label: "Previous month", keys: ["←"] },
      { label: "Next month", keys: ["→"] },
      { label: "Today", keys: ["T"] },
    ],
  },
  {
    group: "General",
    shortcuts: [
      { label: "Undo", keys: ["⌘", "Z"] },
      { label: "Force save", keys: ["⌘", "S"] },
      { label: "Toggle shortcut hints", keys: ["⌘", "/"] },
    ],
  },
];

export default function ShortcutOverlay() {
  const { shortcutOverlayOpen, setShortcutOverlayOpen } = useUIStore();

  return (
    <AnimatePresence>
      {shortcutOverlayOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setShortcutOverlayOpen(false)}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl mx-4 glass-3 p-7 overflow-y-auto max-h-[80vh]"
            style={{ borderRadius: 24 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-7">
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Keyboard Shortcuts
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShortcutOverlayOpen(false)}
                className="p-1.5 rounded-md"
                style={{ color: "var(--text-tertiary)", borderRadius: 10 }}
                aria-label="Close shortcuts overlay"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              {SHORTCUT_GROUPS.map((group) => (
                <div key={group.group}>
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider mb-3.5"
                    style={{ color: "var(--text-tertiary)", letterSpacing: "0.1em" }}
                  >
                    {group.group}
                  </h3>
                  <div className="space-y-2">
                    {group.shortcuts.map((shortcut, si) => (
                      <motion.div
                        key={shortcut.label}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: si * 0.03 }}
                        className="flex items-center justify-between py-1"
                      >
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {shortcut.label}
                        </span>
                        <div className="flex items-center gap-1">
                          {shortcut.keys.map((key, ki) => (
                            <kbd
                              key={ki}
                              className="inline-flex items-center justify-center px-2 py-0.5 text-xs"
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                fontFamily: "var(--font-mono)",
                                color: "var(--text-primary)",
                                boxShadow: "0 1px 0 rgba(255,255,255,0.04)",
                                minWidth: 24,
                                borderRadius: 8,
                              }}
                            >
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
