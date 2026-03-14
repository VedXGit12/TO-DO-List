import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, FileJson, FileSpreadsheet, Download } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useTodoStore } from "../../store/todoStore";
import { modalOverlayVariants, modalVariants } from "../../lib/animations";
import { buildMarkdown, buildJSON, buildCSV, downloadFile } from "../../lib/export";
import { getAllTodos, getAllTags } from "../../db/dexie";
import { format } from "date-fns";
import type { Todo, Tag } from "../../types/todo";

type ExportFormat = "markdown" | "json" | "csv";

const FORMAT_OPTIONS: { id: ExportFormat; label: string; icon: typeof FileText; mime: string; ext: string }[] = [
  { id: "markdown", label: "Markdown", icon: FileText, mime: "text/markdown", ext: "md" },
  { id: "json", label: "JSON", icon: FileJson, mime: "application/json", ext: "json" },
  { id: "csv", label: "CSV", icon: FileSpreadsheet, mime: "text/csv", ext: "csv" },
];

export default function ExportModal() {
  const { exportModalOpen, setExportModalOpen, addToast } = useUIStore();
  const { workspaces, projects } = useTodoStore();
  const [selected, setSelected] = useState<ExportFormat>("markdown");
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  // Load all todos and tags from Dexie when modal opens
  useEffect(() => {
    if (exportModalOpen) {
      Promise.all([getAllTodos(), getAllTags()]).then(([todos, tags]) => {
        setAllTodos(todos);
        setAllTags(tags);
      });
    }
  }, [exportModalOpen]);

  const preview = useMemo(() => {
    switch (selected) {
      case "markdown":
        return buildMarkdown(projects, allTodos).split("\n").slice(0, 10).join("\n");
      case "json":
        return buildJSON({ workspaces, projects, todos: allTodos, tags: allTags }).split("\n").slice(0, 10).join("\n");
      case "csv":
        return buildCSV(allTodos, projects).split("\n").slice(0, 10).join("\n");
    }
  }, [selected, workspaces, projects, allTodos, allTags]);

  const handleExport = () => {
    const dateStr = format(new Date(), "yyyy-MM-dd");
    const fmt = FORMAT_OPTIONS.find((f) => f.id === selected)!;

    let content: string;
    switch (selected) {
      case "markdown":
        content = buildMarkdown(projects, allTodos);
        break;
      case "json":
        content = buildJSON({ workspaces, projects, todos: allTodos, tags: allTags });
        break;
      case "csv":
        content = buildCSV(allTodos, projects);
        break;
    }

    downloadFile(content, `kuro-export-${dateStr}.${fmt.ext}`, fmt.mime);
    setExportModalOpen(false);
    addToast({ message: `Exported as ${fmt.label}`, type: "success" });
  };

  return (
    <AnimatePresence>
      {exportModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.6)" }}
            onClick={() => setExportModalOpen(false)}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg mx-4 rounded-xl border p-6"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2
                className="text-lg font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
              >
                Export Tasks
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setExportModalOpen(false)}
                className="p-1.5 rounded-md"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Close export modal"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Format cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {FORMAT_OPTIONS.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors"
                  style={{
                    background: selected === id ? "var(--accent-dim)" : "var(--bg-elevated)",
                    borderColor: selected === id ? "var(--accent)" : "var(--border)",
                    color: selected === id ? "var(--accent)" : "var(--text-secondary)",
                  }}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{label}</span>
                </motion.button>
              ))}
            </div>

            {/* Preview */}
            <div
              className="rounded-lg p-3 mb-5 overflow-x-auto max-h-40 overflow-y-auto"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <pre
                className="text-xs whitespace-pre-wrap"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
              >
                {preview || "No data to preview"}
              </pre>
            </div>

            {/* Export button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium"
              style={{ background: "var(--accent)", color: "var(--bg-base)" }}
            >
              <Download size={15} />
              Export
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
