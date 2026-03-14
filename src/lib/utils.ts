import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format a timestamp for display */
export function formatDueDate(timestamp: number): string {
  const date = new Date(timestamp)
  if (isToday(date)) return 'Today'
  if (isTomorrow(date)) return 'Tomorrow'
  return format(date, 'MMM d, yyyy')
}

/** Check whether a due date is overdue */
export function isOverdue(dueAt: number): boolean {
  return isPast(new Date(dueAt)) && !isToday(new Date(dueAt))
}

/** Generate a random nanoid-style ID (no external dep needed) */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

/** Map priority number to human-readable label */
export function priorityLabel(priority: 1 | 2 | 3 | 4): string {
  return { 1: 'Urgent', 2: 'High', 3: 'Medium', 4: 'Someday' }[priority]
}

/** Map priority number to CSS variable color */
export function priorityColor(priority: 1 | 2 | 3 | 4): string {
  return { 1: 'var(--p1)', 2: 'var(--p2)', 3: 'var(--p3)', 4: 'var(--p4)' }[priority]
}
