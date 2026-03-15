import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { modalOverlayVariants, cmdVariants, listVariants } from "../lib/animations";
import { useCommandPalette } from "../hooks/useCommandPalette";
import CommandRow from "./ui/CommandRow";

const MODAL_MAX_HEIGHT = 480;
const SEARCH_HEIGHT = 56;
const FOOTER_HEIGHT = 40;

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
          {/* Backdrop — subtle blur over entire app */}
          <motion.div
            variants={modalOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Palette */}
          <motion.div
            variants={cmdVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onKeyDown={handleKeyDown}
            className="fixed z-50 left-1/2 top-[18%] w-full max-w-[640px] -translate-x-1/2 glass-3 overflow-hidden"
            style={{
              borderRadius: 22,
              maxHeight: MODAL_MAX_HEIGHT,
              boxShadow: "0 1px 2px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.3), 0 32px 64px rgba(0,0,0,0.5)",
            }}
          >
            {/* Search input row */}
            <div
              className="flex items-center gap-3.5 px-5"
              style={{
                height: SEARCH_HEIGHT,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Search size={18} style={{ color: "var(--accent)", flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks, projects, or actions…"
                className="flex-1 bg-transparent outline-none"
                style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 400, letterSpacing: "-0.01em" }}
              />
              <span
                className="px-2 py-0.5 shrink-0"
                style={{
                  color: "var(--text-tertiary)",
                  background: "rgba(255,255,255,0.06)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  borderRadius: 8,
                }}
              >
                Esc
              </span>
            </div>

            {/* Results */}
            <div className="overflow-y-auto scrollbar-hide py-2" style={{ maxHeight: MODAL_MAX_HEIGHT - SEARCH_HEIGHT - FOOTER_HEIGHT }}>
              {flatCommands.length === 0 && query.trim() ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-8 text-center"
                >
                  <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                    No results for &apos;{query}&apos;
                  </p>
                </motion.div>
              ) : (
                <motion.div variants={listVariants} initial="hidden" animate="visible">
                  {results.map((group) => (
                    <div key={group.label}>
                      {/* Section header */}
                      <div
                        className="px-5"
                        style={{
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.25)",
                          padding: "10px 20px 6px",
                        }}
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

            {/* Footer */}
            <div
              className="flex items-center gap-4 px-5"
              style={{
                height: FOOTER_HEIGHT,
                background: "rgba(255,255,255,0.03)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
              }}
            >
              <span>↑↓ Navigate</span>
              <span>·</span>
              <span>↵ Select</span>
              <span>·</span>
              <span>Esc Close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
