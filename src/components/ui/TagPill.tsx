import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Tag } from "../../types/todo";

interface TagPillProps {
  tag: Tag;
  onRemove?: () => void;
}

export default function TagPill({ tag, onRemove }: TagPillProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.05 : 1 }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 select-none"
      style={{
        borderRadius: 10,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        fontSize: 11,
        fontWeight: 500,
        color: "var(--text-secondary)",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: tag.color,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {tag.name}
      <AnimatePresence>
        {hovered && onRemove && (
          <motion.button
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.12 }}
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="flex items-center justify-center"
          >
            <X size={10} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
