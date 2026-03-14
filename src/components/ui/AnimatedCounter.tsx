import { motion, AnimatePresence } from "framer-motion";

interface AnimatedCounterProps {
  count: number;
}

export default function AnimatedCounter({ count }: AnimatedCounterProps) {
  return (
    <span
      className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-medium"
      style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={count}
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
