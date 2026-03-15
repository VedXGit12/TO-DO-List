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
            className="relative w-full max-w-lg mx-4 p-7"
            style={{
              borderRadius: 20,
              background: "rgba(14,16,24,0.90)",
              backdropFilter: "blur(60px) saturate(180%)",
              WebkitBackdropFilter: "blur(60px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
              >
                Export Tasks
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setExportModalOpen(false)}
                className="p-1.5 rounded-md"
                style={{ color: "var(--text-tertiary)", borderRadius: 10 }}
                aria-label="Close export modal"
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Format cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {FORMAT_OPTIONS.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(id)}
                  className="flex flex-col items-center gap-2.5 p-5 transition-colors"
                  style={{
                    background: selected === id ? "var(--accent-dim)" : "rgba(255,255,255,0.04)",
                    borderColor: selected === id ? "var(--accent)" : "rgba(255,255,255,0.06)",
                    color: selected === id ? "var(--accent)" : "var(--text-secondary)",
                    borderRadius: 14,
                    border: `1px solid ${selected === id ? "var(--accent-40)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{label}</span>
                </motion.button>
              ))}
            </div>

            {/* Preview */}
            <div
              className="p-4 mb-6 overflow-x-auto max-h-40 overflow-y-auto"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12 }}
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
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, rgba(255,191,71,1) 0%, rgba(255,155,48,1) 100%)", color: "#0A0A0A", borderRadius: 12, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 2px 8px rgba(255,179,71,0.25)" }}
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
