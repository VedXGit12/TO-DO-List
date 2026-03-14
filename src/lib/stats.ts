import {
  format,
  subDays,
  startOfDay,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { Todo } from "../types/todo";
import type { Project } from "../store/todoStore";

/* ── Heatmap ── */

export interface HeatmapDay {
  date: string; // "yyyy-MM-dd"
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

function countLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function getCompletionHeatmap(todos: Todo[], days = 90): HeatmapDay[] {
  const today = startOfDay(new Date());
  const start = subDays(today, days - 1);
  const interval = eachDayOfInterval({ start, end: today });

  // Build a map: "yyyy-MM-dd" → count
  const map = new Map<string, number>();
  for (const d of interval) map.set(format(d, "yyyy-MM-dd"), 0);

  for (const t of todos) {
    if (t.completedAt) {
      const key = format(startOfDay(new Date(t.completedAt)), "yyyy-MM-dd");
      if (map.has(key)) map.set(key, map.get(key)! + 1);
    }
  }

  return interval.map((d) => {
    const key = format(d, "yyyy-MM-dd");
    const count = map.get(key) ?? 0;
    return { date: key, count, level: countLevel(count) };
  });
}

/* ── Streak ── */

export interface StreakData {
  current: number;
  longest: number;
}

export function getCurrentStreak(todos: Todo[]): StreakData {
  const today = startOfDay(new Date());
  // Build set of dates with completions
  const completedDates = new Set<string>();
  for (const t of todos) {
    if (t.completedAt) {
      completedDates.add(format(startOfDay(new Date(t.completedAt)), "yyyy-MM-dd"));
    }
  }

  // Walk backwards from today
  let current = 0;
  let day = today;
  while (completedDates.has(format(day, "yyyy-MM-dd"))) {
    current++;
    day = subDays(day, 1);
  }

  // Longest streak: walk all dates
  let longest = current;
  let streak = 0;
  // Check last 365 days
  for (let i = 0; i < 365; i++) {
    const d = format(subDays(today, i), "yyyy-MM-dd");
    if (completedDates.has(d)) {
      streak++;
      if (streak > longest) longest = streak;
    } else {
      streak = 0;
    }
  }

  return { current, longest };
}

/* ── Weekly bar data ── */

export interface WeeklyBar {
  weekLabel: string;
  completed: number;
  created: number;
}

export function getWeeklyBarData(todos: Todo[], weeks = 8): WeeklyBar[] {
  const today = new Date();
  const result: WeeklyBar[] = [];

  for (let w = weeks - 1; w >= 0; w--) {
    const weekStart = startOfWeek(subDays(today, w * 7), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const label = format(weekStart, "MMM d");

    let completed = 0;
    let created = 0;
    for (const t of todos) {
      if (
        t.completedAt &&
        isWithinInterval(new Date(t.completedAt), { start: weekStart, end: weekEnd })
      ) {
        completed++;
      }
      if (isWithinInterval(new Date(t.createdAt), { start: weekStart, end: weekEnd })) {
        created++;
      }
    }
    result.push({ weekLabel: label, completed, created });
  }
  return result;
}

/* ── Priority distribution ── */

export interface PriorityDistribution {
  p1: number;
  p2: number;
  p3: number;
  p4: number;
}

export function getPriorityDistribution(todos: Todo[]): PriorityDistribution {
  const active = todos.filter((t) => t.status !== "archived");
  return {
    p1: active.filter((t) => t.priority === 1).length,
    p2: active.filter((t) => t.priority === 2).length,
    p3: active.filter((t) => t.priority === 3).length,
    p4: active.filter((t) => t.priority === 4).length,
  };
}

/* ── Productivity score ── */

export interface ProductivityScoreData {
  score: number; // 0-100
  trend: "up" | "down" | "flat";
  delta: number; // percentage diff
}

export function getProductivityScore(todos: Todo[]): ProductivityScoreData {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lastWeekStart = startOfWeek(subDays(thisWeekStart, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 1 });

  let completedThisWeek = 0;
  let createdThisWeek = 0;
  let completedLastWeek = 0;
  let createdLastWeek = 0;

  for (const t of todos) {
    const created = new Date(t.createdAt);
    const completed = t.completedAt ? new Date(t.completedAt) : null;

    if (isWithinInterval(created, { start: thisWeekStart, end: thisWeekEnd })) createdThisWeek++;
    if (isWithinInterval(created, { start: lastWeekStart, end: lastWeekEnd })) createdLastWeek++;
    if (completed && isWithinInterval(completed, { start: thisWeekStart, end: thisWeekEnd }))
      completedThisWeek++;
    if (completed && isWithinInterval(completed, { start: lastWeekStart, end: lastWeekEnd }))
      completedLastWeek++;
  }

  const thisScore = createdThisWeek > 0 ? Math.min(100, Math.round((completedThisWeek / createdThisWeek) * 100)) : 0;
  const lastScore = createdLastWeek > 0 ? Math.min(100, Math.round((completedLastWeek / createdLastWeek) * 100)) : 0;

  const delta = thisScore - lastScore;
  const trend: "up" | "down" | "flat" = delta > 0 ? "up" : delta < 0 ? "down" : "flat";

  return { score: thisScore, trend, delta };
}

/* ── Top projects ── */

export interface TopProject {
  projectId: string;
  name: string;
  icon: string;
  completedThisMonth: number;
  totalTodos: number;
}

export function getTopProjects(todos: Todo[], projects: Project[]): TopProject[] {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const projectMap = new Map<string, { completed: number; total: number }>();

  for (const t of todos) {
    if (!projectMap.has(t.projectId)) {
      projectMap.set(t.projectId, { completed: 0, total: 0 });
    }
    const entry = projectMap.get(t.projectId)!;
    entry.total++;
    if (
      t.completedAt &&
      isWithinInterval(new Date(t.completedAt), { start: monthStart, end: monthEnd })
    ) {
      entry.completed++;
    }
  }

  return projects
    .map((p) => {
      const stats = projectMap.get(p.id) ?? { completed: 0, total: 0 };
      return {
        projectId: p.id,
        name: p.name,
        icon: p.icon,
        completedThisMonth: stats.completed,
        totalTodos: stats.total,
      };
    })
    .filter((p) => p.totalTodos > 0)
    .sort((a, b) => b.completedThisMonth - a.completedThisMonth)
    .slice(0, 5);
}
