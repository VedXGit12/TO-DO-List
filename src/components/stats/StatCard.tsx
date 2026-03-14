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
      className="relative glass-2 overflow-hidden"
      style={{
        borderRadius: 22,
      }}
    >
      {/* Subtle colored radial gradient in top-left */}
      <div
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: 120,
          height: 120,
          background: `radial-gradient(circle at 0% 0%, ${accentColor}14, transparent 70%)`,
        }}
      />
      <div className="p-6 relative">
        <div className="flex items-center gap-2 mb-3">
          {icon && (
            <span style={{ color: accentColor }} className="shrink-0">
              {icon}
            </span>
          )}
          <span
            className="font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)", fontSize: 11, letterSpacing: "0.1em" }}
          >
            {title}
          </span>
        </div>
        {children}
        {subtitle && (
          <p className="mt-2" style={{ color: "var(--text-secondary)", fontSize: 12 }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
