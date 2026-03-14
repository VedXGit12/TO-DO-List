import { motion } from "framer-motion";
import { CheckCircle2, Folder, Zap } from "lucide-react";
import type { Command, TodoCommand, ProjectCommand, ActionCommand } from "../../types/command";

const PRIORITY_COLORS: Record<number, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#3b82f6",
  4: "#6b7280",
};

interface CommandRowProps {
  command: Command;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}

export default function CommandRow({ command, isSelected, onSelect, onHover }: CommandRowProps) {
  switch (command.type) {
    case "todo":
      return <TodoRow command={command} isSelected={isSelected} onSelect={onSelect} onHover={onHover} />;
    case "project":
      return <ProjectRow command={command} isSelected={isSelected} onSelect={onSelect} onHover={onHover} />;
    case "action":
      return <ActionRow command={command} isSelected={isSelected} onSelect={onSelect} onHover={onHover} />;
  }
}

function TodoRow({
  command,
  isSelected,
  onSelect,
  onHover,
}: { command: TodoCommand; isSelected: boolean; onSelect: () => void; onHover: () => void }) {
  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={onHover}
      whileHover={{ x: 4 }}
      className="relative flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md"
      style={{ height: 44 }}
    >
      {isSelected && (
        <motion.div
          layoutId="cmd-highlight"
          className="absolute inset-0 rounded-md"
          style={{ background: "var(--accent-dim)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <CheckCircle2
        size={16}
        className="relative z-10 shrink-0"
        style={{ color: command.status === "done" ? "#22c55e" : "var(--text-secondary)" }}
      />
      <span
        className="relative z-10 flex-1 text-sm truncate"
        style={{
          color: "var(--text-primary)",
          textDecoration: command.status === "done" ? "line-through" : "none",
        }}
      >
        {command.title}
      </span>
      {command.projectName && (
        <span
          className="relative z-10 text-xs px-1.5 py-0.5 rounded"
          style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
        >
          {command.projectName}
        </span>
      )}
      <span
        className="relative z-10 w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: PRIORITY_COLORS[command.priority] ?? "#6b7280" }}
      />
    </motion.div>
  );
}

function ProjectRow({
  command,
  isSelected,
  onSelect,
  onHover,
}: { command: ProjectCommand; isSelected: boolean; onSelect: () => void; onHover: () => void }) {
  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={onHover}
      whileHover={{ x: 4 }}
      className="relative flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md"
      style={{ height: 44 }}
    >
      {isSelected && (
        <motion.div
          layoutId="cmd-highlight"
          className="absolute inset-0 rounded-md"
          style={{ background: "var(--accent-dim)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10 text-base shrink-0">{command.icon || <Folder size={16} />}</span>
      <span className="relative z-10 flex-1 text-sm truncate" style={{ color: "var(--text-primary)" }}>
        {command.name}
      </span>
      {command.workspaceName && (
        <span
          className="relative z-10 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          {command.workspaceName}
        </span>
      )}
    </motion.div>
  );
}

function ActionRow({
  command,
  isSelected,
  onSelect,
  onHover,
}: { command: ActionCommand; isSelected: boolean; onSelect: () => void; onHover: () => void }) {
  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={onHover}
      whileHover={{ x: 4 }}
      className="relative flex items-center gap-3 px-4 py-3 cursor-pointer rounded-md"
      style={{ height: 44 }}
    >
      {isSelected && (
        <motion.div
          layoutId="cmd-highlight"
          className="absolute inset-0 rounded-md"
          style={{ background: "var(--accent-dim)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Zap
        size={16}
        className="relative z-10 shrink-0"
        style={{ color: "var(--accent)" }}
      />
      <span className="relative z-10 flex-1 text-sm" style={{ color: "var(--text-primary)" }}>
        {command.label}
      </span>
      {command.shortcut && (
        <span
          className="relative z-10 text-xs px-1.5 py-0.5 rounded font-mono"
          style={{ color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
        >
          {command.shortcut}
        </span>
      )}
    </motion.div>
  );
}
