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
      animate={{
        backgroundColor: hovered ? `${tag.color}40` : `${tag.color}33`,
        scale: hovered ? 1.05 : 1,
      }}
      transition={{ duration: 0.15 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium select-none"
      style={{ color: tag.color }}
    >
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
