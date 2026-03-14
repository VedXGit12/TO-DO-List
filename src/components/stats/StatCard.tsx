import { motion } from "framer-motion";
import { cardVariants } from "../../lib/animations";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  children: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
  accentColor?: string;
  custom?: number;
}

export default function StatCard({
  title,
  children,
  subtitle,
  icon,
  accentColor = "var(--accent)",
  custom = 0,
}: StatCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      custom={custom}
      className="relative rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {icon && (
            <span style={{ color: accentColor }} className="shrink-0">
              {icon}
            </span>
          )}
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </span>
        </div>
        {children}
        {subtitle && (
          <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
