import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, TrendingUp, CheckCircle2, CalendarClock } from "lucide-react";
import { format, isToday, startOfDay } from "date-fns";

import { useTodoStore } from "../../store/todoStore";
import { getAllTodos } from "../../db/dexie";
import type { Todo } from "../../types/todo";

import {
  getCompletionHeatmap,
  getCurrentStreak,
  getWeeklyBarData,
  getPriorityDistribution,
  getProductivityScore,
  getTopProjects,
} from "../../lib/stats";
import { listVariants, cardVariants } from "../../lib/animations";

import StatCard from "./StatCard";
import AnimatedNumber from "../ui/AnimatedNumber";
import HeatmapGrid from "./HeatmapGrid";
import StreakCounter from "./StreakCounter";
import WeeklyBarChart from "./WeeklyBarChart";
import DonutChart from "./DonutChart";
import ProductivityScore from "./ProductivityScore";

type TimeRange = "30" | "90" | "year";

export default function StatsBoard() {
  const { projects } = useTodoStore();
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("90");
  const [selectedProject, setSelectedProject] = useState<string>("all");

  // Load all todos from Dexie on mount
  useEffect(() => {
    getAllTodos()
      .then(setAllTodos)
      .catch(() => setAllTodos([]));
  }, []);

  // Filter by project if selected
  const filteredTodos = useMemo(
    () =>
      selectedProject === "all"
        ? allTodos
        : allTodos.filter((t) => t.projectId === selectedProject),
    [allTodos, selectedProject]
  );

  const heatmapDays = timeRange === "year" ? 365 : timeRange === "90" ? 90 : 30;

  // Computed stats — memoized
  const heatmap = useMemo(() => getCompletionHeatmap(filteredTodos, heatmapDays), [filteredTodos, heatmapDays]);
  const streak = useMemo(() => getCurrentStreak(filteredTodos), [filteredTodos]);
  const weeklyData = useMemo(() => getWeeklyBarData(filteredTodos, 8), [filteredTodos]);
  const priorityDist = useMemo(() => getPriorityDistribution(filteredTodos), [filteredTodos]);
  const productivity = useMemo(() => getProductivityScore(filteredTodos), [filteredTodos]);
  const topProjects = useMemo(() => getTopProjects(allTodos, projects), [allTodos, projects]);

  const totalDone = useMemo(() => filteredTodos.filter((t) => t.status === "done").length, [filteredTodos]);
  const dueToday = useMemo(
    () =>
      filteredTodos.filter(
        (t) => t.dueAt && isToday(new Date(t.dueAt)) && t.status !== "done" && t.status !== "archived"
      ).length,
    [filteredTodos]
  );

  const hasCompletedToday = useMemo(
    () =>
      filteredTodos.some(
        (t) =>
          t.completedAt &&
          format(startOfDay(new Date(t.completedAt)), "yyyy-MM-dd") ===
            format(startOfDay(new Date()), "yyyy-MM-dd")
      ),
    [filteredTodos]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Filters bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="text-xs px-3 py-2 outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "var(--text-primary)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
          }}
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.icon} {p.name}
            </option>
          ))}
        </select>

        <div
          className="flex items-center gap-0.5 px-1.5 py-1"
          style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {(["30", "90", "year"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className="px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                color: timeRange === r ? "var(--accent)" : "var(--text-secondary)",
                background: timeRange === r ? "var(--accent-dim)" : "transparent",
                borderRadius: 10,
              }}
            >
              {r === "year" ? "This year" : `Last ${r} days`}
            </button>
          ))}
        </div>
      </div>

      {/* Row 1: Stat summary cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <StatCard title="Streak" icon={<Flame size={14} />} accentColor="rgba(255,100,100,0.9)" custom={0}>
          <StreakCounter streak={streak} hasCompletedToday={hasCompletedToday} />
        </StatCard>

        <StatCard title="Productivity" icon={<TrendingUp size={14} />} accentColor="rgba(80,220,140,0.9)" custom={1}>
          <ProductivityScore data={productivity} />
        </StatCard>

        <StatCard title="Total Done" icon={<CheckCircle2 size={14} />} accentColor="var(--accent)" custom={2}>
          <AnimatedNumber
            value={totalDone}
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-sans)", color: "var(--text-primary)" }}
          />
        </StatCard>

        <StatCard title="Due Today" icon={<CalendarClock size={14} />} accentColor="var(--p3)" custom={3}>
          <AnimatedNumber
            value={dueToday}
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-sans)", color: "var(--text-primary)" }}
          />
        </StatCard>
      </motion.div>

      {/* Row 2: Heatmap */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <StatCard title="Completion Activity" accentColor="var(--accent)">
          <HeatmapGrid data={heatmap} />
        </StatCard>
      </motion.div>

      {/* Row 3: Bar chart + Donut */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-5 gap-4"
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="lg:col-span-3">
          <StatCard title="Weekly Overview" accentColor="var(--accent)">
            <WeeklyBarChart data={weeklyData} />
          </StatCard>
        </div>
        <div className="lg:col-span-2">
          <StatCard title="Priority Distribution" accentColor="var(--p2)">
            <DonutChart data={priorityDist} />
          </StatCard>
        </div>
      </motion.div>

      {/* Row 4: Top Projects */}
      {topProjects.length > 0 && (
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <StatCard title="Top Projects This Month" accentColor="var(--accent)">
            <div className="space-y-3">
              {topProjects.map((proj) => {
                const pct =
                  proj.totalTodos > 0
                    ? Math.round((proj.completedThisMonth / proj.totalTodos) * 100)
                    : 0;
                return (
                  <div key={proj.projectId} className="flex items-center gap-3">
                    <span className="text-base shrink-0">{proj.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {proj.name}
                        </span>
                        <span className="text-xs shrink-0 ml-2" style={{ color: "var(--text-secondary)" }}>
                          <AnimatedNumber value={proj.completedThisMonth} /> / {proj.totalTodos}
                        </span>
                      </div>
                      <div
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--bg-elevated)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "var(--accent)" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </StatCard>
        </motion.div>
      )}
    </div>
  );
}
