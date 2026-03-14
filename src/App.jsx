import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import TodoItem from './components/TodoItem'
import FilterBar from './components/FilterBar'

const STORAGE_KEY = 'tasks'

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export default function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [editingId, setEditingId] = useState(null)

  const updateTasks = useCallback((updated) => {
    setTasks(updated)
    saveTasks(updated)
  }, [])

  const addTask = useCallback(() => {
    const text = input.trim()
    if (!text) return
    const newTasks = [
      ...tasks,
      { id: Date.now(), text, checked: false },
    ]
    updateTasks(newTasks)
    setInput('')
  }, [input, tasks, updateTasks])

  const deleteTask = useCallback((id) => {
    updateTasks(tasks.filter((t) => t.id !== id))
  }, [tasks, updateTasks])

  const toggleTask = useCallback((id) => {
    updateTasks(tasks.map((t) => t.id === id ? { ...t, checked: !t.checked } : t))
  }, [tasks, updateTasks])

  const editTask = useCallback((id, newText) => {
    const text = newText.trim()
    if (!text) {
      deleteTask(id)
      return
    }
    updateTasks(tasks.map((t) => t.id === id ? { ...t, text } : t))
    setEditingId(null)
  }, [tasks, updateTasks, deleteTask])

  const clearCompleted = useCallback(() => {
    updateTasks(tasks.filter((t) => !t.checked))
  }, [tasks, updateTasks])

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.checked
    if (filter === 'completed') return t.checked
    return true
  })

  const activeCount = tasks.filter((t) => !t.checked).length
  const completedCount = tasks.filter((t) => t.checked).length

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 flex flex-col items-center justify-start pt-12 pb-16 px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-full max-w-lg mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">My Tasks</h1>
            <p className="text-white/60 text-sm mt-1">
              {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
            </p>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white text-xl transition hover:scale-110 active:scale-95"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-lg glass-card rounded-2xl p-3 flex gap-2 mb-4 shadow-lg"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task…"
            className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm px-2 font-medium"
          />
          <button
            onClick={addTask}
            aria-label="Add task"
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold text-lg flex items-center justify-center transition"
          >
            +
          </button>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-lg mb-4"
        >
          <FilterBar filter={filter} setFilter={setFilter} />
        </motion.div>

        {/* Task List */}
        <div className="w-full max-w-lg">
          {filtered.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/50 mt-8 text-sm"
            >
              {filter === 'completed' ? '🎉 No completed tasks yet!' : '✨ Nothing here — add a task above!'}
            </motion.div>
          )}
          <AnimatePresence mode="popLayout">
            {filtered.map((task) => (
              <TodoItem
                key={task.id}
                task={task}
                isEditing={editingId === task.id}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onEdit={(text) => editTask(task.id, text)}
                onStartEdit={() => setEditingId(task.id)}
                onCancelEdit={() => setEditingId(null)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        {completedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg mt-4 flex justify-end"
          >
            <button
              onClick={clearCompleted}
              className="text-white/60 hover:text-white text-xs underline transition"
            >
              Clear completed ({completedCount})
            </button>
          </motion.div>
        )}

        <footer className="mt-auto pt-12 text-white/30 text-xs">©2026</footer>
      </div>
    </div>
  )
}
