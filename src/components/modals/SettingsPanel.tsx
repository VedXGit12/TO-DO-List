import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Upload, Trash2 } from "lucide-react";
import { useUIStore, ACCENT_COLORS, type AccentColor } from "../../store/uiStore";
import { useTodoStore } from "../../store/todoStore";
import { db, getAllTodos, getAllTags } from "../../db/dexie";
import { buildJSON, downloadFile } from "../../lib/export";
import { format } from "date-fns";

const ACCENT_SWATCHES: AccentColor[] = ["amber", "blue", "green", "purple", "red", "pink"];

export default function SettingsPanel() {
  const {
    settingsPanelOpen,
    setSettingsPanelOpen,
    accentColor,
    setAccentColor,
    compactMode,
    setCompactMode,
    sidebarDefaultOpen,
    setSidebarDefaultOpen,
    addToast,
  } = useUIStore();
  const { workspaces, projects, todos } = useTodoStore();

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [importing, setImporting] = useState(false);

  const handleExportAll = async () => {
    const dateStr = format(new Date(), "yyyy-MM-dd");
    const [allTodos, allTags] = await Promise.all([getAllTodos(), getAllTags()]);
    const content = buildJSON({ workspaces, projects, todos: allTodos, tags: allTags });
    downloadFile(content, `kuro-export-${dateStr}.json`, "application/json");
    addToast({ message: "Data exported", type: "success" });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.todos && Array.isArray(data.todos)) {
        const existingIds = new Set((await db.todos.toArray()).map((t) => t.id));
        const newTodos = data.todos.filter((t: { id: string }) => !existingIds.has(t.id));
        if (newTodos.length > 0) {
          await db.todos.bulkAdd(newTodos);
        }
        addToast({ message: `Imported ${newTodos.length} tasks`, type: "success" });
      }
    } catch {
      addToast({ message: "Import failed — invalid file", type: "error" });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleClearAll = async () => {
    if (deleteConfirm !== "DELETE") return;
    await db.todos.clear();
    await db.projects.clear();
    await db.workspaces.clear();
    await db.tags.clear();
    setDeleteConfirm("");
    addToast({ message: "All data cleared", type: "info" });
    window.location.reload();
  };

  const taskCount = todos.length;
  const estSize = Math.round((JSON.stringify(todos).length / 1024) * 10) / 10;

  return (
    <AnimatePresence>
      {settingsPanelOpen && (
        <motion.div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSettingsPanelOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative w-full max-w-sm overflow-y-auto glass-2"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.05)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Settings
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSettingsPanelOpen(false)}
                className="p-2"
                style={{ color: "var(--text-tertiary)", borderRadius: 10 }}
                aria-label="Close settings"
              >
                <X size={16} />
              </motion.button>
            </div>

            <div className="p-6 space-y-7">
              {/* Appearance */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)", letterSpacing: "0.1em" }}>
                  Appearance
                </h3>

                {/* Accent color */}
                <div className="mb-5">
                  <label className="text-sm mb-2.5 block font-medium" style={{ color: "var(--text-primary)" }}>
                    Accent Color
                  </label>
                  <div className="flex gap-2.5">
                    {ACCENT_SWATCHES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                        style={{
                          background: ACCENT_COLORS[c],
                          borderColor: accentColor === c ? "var(--text-primary)" : "transparent",
                          boxShadow: accentColor === c ? `0 0 12px ${ACCENT_COLORS[c]}40` : "none",
                        }}
                        aria-label={`Set accent color to ${c}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Sidebar default */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Sidebar open on launch</span>
                  <button
                    onClick={() => setSidebarDefaultOpen(!sidebarDefaultOpen)}
                    className="w-10 h-[22px] rounded-full relative transition-colors"
                    style={{ background: sidebarDefaultOpen ? "var(--accent)" : "rgba(255,255,255,0.08)" }}
                    aria-label="Toggle sidebar default state"
                  >
                    <motion.div
                      className="absolute top-[3px] w-4 h-4 rounded-full"
                      style={{ background: "var(--text-primary)" }}
                      animate={{ left: sidebarDefaultOpen ? 20 : 3 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>

                {/* Compact mode */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Compact mode</span>
                  <button
                    onClick={() => setCompactMode(!compactMode)}
                    className="w-10 h-[22px] rounded-full relative transition-colors"
                    style={{ background: compactMode ? "var(--accent)" : "rgba(255,255,255,0.08)" }}
                    aria-label="Toggle compact mode"
                  >
                    <motion.div
                      className="absolute top-[3px] w-4 h-4 rounded-full"
                      style={{ background: "var(--text-primary)" }}
                      animate={{ left: compactMode ? 20 : 3 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              </section>

              {/* Data */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)", letterSpacing: "0.1em" }}>
                  Data
                </h3>

                <div className="space-y-2.5">
                  <button
                    onClick={handleExportAll}
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ borderRadius: 14, color: "var(--text-primary)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <Download size={14} /> Export all data
                  </button>

                  <label
                    className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium cursor-pointer transition-colors hover:opacity-80"
                    style={{ borderRadius: 14, color: "var(--text-primary)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <Upload size={14} /> {importing ? "Importing…" : "Import data"}
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>

                  <div className="pt-3">
                    <div className="flex items-center gap-2 mb-2.5">
                      <Trash2 size={14} style={{ color: "var(--p1)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--p1)" }}>Clear all data</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder='Type "DELETE" to confirm'
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm outline-none"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 12,
                          color: "var(--text-primary)",
                        }}
                      />
                      <button
                        onClick={handleClearAll}
                        disabled={deleteConfirm !== "DELETE"}
                        className="px-4 py-2 text-sm font-medium transition-opacity"
                        style={{
                          background: deleteConfirm === "DELETE" ? "var(--p1)" : "rgba(255,255,255,0.04)",
                          color: deleteConfirm === "DELETE" ? "#fff" : "var(--text-tertiary)",
                          opacity: deleteConfirm === "DELETE" ? 1 : 0.5,
                          borderRadius: 12,
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <p className="text-xs pt-2" style={{ color: "var(--text-tertiary)" }}>
                    ~{taskCount} tasks · ~{estSize} KB
                  </p>
                </div>
              </section>

              {/* About */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-tertiary)", letterSpacing: "0.1em" }}>
                  About
                </h3>
                <div className="space-y-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <p>Kuro v1.0.0</p>
                  <p>Built with Framer Motion, Zustand, Dexie</p>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
