import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { modalOverlayVariants, cmdVariants, listVariants } from "../lib/animations";
import { useCommandPalette } from "../hooks/useCommandPalette";
import CommandRow from "./ui/CommandRow";

export default function CommandPalette() {
  const {
    isOpen,
    close,
    query,
    setQuery,
    results,
    flatCommands,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
    executeCommand,
  } = useCommandPalette();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-50"
            style={{ background: "rgba(0,0,0,0.6)" }}
          />

          {/* Palette */}
          <motion.div
            variants={cmdVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={handleKeyDown}
            className="fixed z-50 left-1/2 top-[15%] w-full max-w-[560px] -translate-x-1/2 rounded-xl border overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Search input */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <Search size={16} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, projects, or actions…"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: "var(--text-primary)" }}
              />
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono shrink-0"
                style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
              >
                Esc
              </span>
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto scrollbar-hide py-2">
              {flatCommands.length === 0 && query.trim() ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-8 text-center"
                >
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    No results for &apos;{query}&apos;
                  </p>
                </motion.div>
              ) : (
                <motion.div variants={listVariants} initial="hidden" animate="visible">
                  {results.map((group) => (
                    <div key={group.label}>
                      <div
                        className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {group.label}
                      </div>
                      {group.commands.map((cmd) => {
                        const globalIdx = flatCommands.indexOf(cmd);
                        return (
                          <CommandRow
                            key={cmd.id}
                            command={cmd}
                            isSelected={globalIdx === selectedIndex}
                            onSelect={() => executeCommand(cmd)}
                            onHover={() => setSelectedIndex(globalIdx)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Footer hints */}
            <div
              className="flex items-center gap-4 px-4 py-2 border-t text-xs"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>Esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
