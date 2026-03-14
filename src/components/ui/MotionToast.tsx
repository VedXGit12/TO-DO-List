import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { toastVariants } from "../../lib/animations";

const ICONS = {
  success: <CheckCircle2 size={14} style={{ color: "var(--success)" }} />,
  error: <AlertCircle size={14} style={{ color: "var(--p1)" }} />,
  info: <Info size={14} style={{ color: "var(--accent)" }} />,
};

export default function MotionToast() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
              fontSize: 12,
              color: "var(--text-primary)",
              minWidth: 200,
              maxWidth: 340,
            }}
          >
            {ICONS[toast.type]}
            <span style={{ flex: 1 }}>{toast.message}</span>
            {toast.undoFn && (
              <button
                onClick={() => {
                  toast.undoFn?.();
                  removeToast(toast.id);
                }}
                style={{
                  color: "var(--accent)",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Undo
              </button>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                color: "var(--text-secondary)",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <X size={12} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
