import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isToday, isFuture } from "date-fns";
import { listVariants, cardVariants } from "../../lib/animations";
import { useTodoStore } from "../../store/todoStore";
import { useUIStore } from "../../store/uiStore";
import TodoCard from "./TodoCard";
import QuickAddBar from "./QuickAddBar";

export default function TodoList() {
  const { activeProjectId } = useUIStore();
  const { todos, loadTodos, loadTags } = useTodoStore();

  useEffect(() => {
    if (activeProjectId) {
      loadTodos(activeProjectId);
      loadTags();
    }
  }, [activeProjectId, loadTodos, loadTags]);

  const visible = useMemo(
    () => todos.filter((t) => t.status !== "archived"),
    [todos]
  );

  const groups = useMemo(() => {
    const today: typeof visible = [];
    const upcoming: typeof visible = [];
    const noDate: typeof visible = [];

    for (const todo of visible) {
      if (todo.dueAt && isToday(new Date(todo.dueAt))) {
        today.push(todo);
      } else if (todo.dueAt && isFuture(new Date(todo.dueAt))) {
        upcoming.push(todo);
      } else {
        noDate.push(todo);
      }
    }

    const sort = (a: (typeof visible)[0], b: (typeof visible)[0]) => {
      if (a.order !== b.order) return a.order - b.order;
      return (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity);
    };

    today.sort(sort);
    upcoming.sort(sort);
    noDate.sort(sort);

    return { today, upcoming, noDate };
  }, [visible]);

  if (!activeProjectId) return null;

  const hasNoTasks = visible.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {hasNoTasks ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <motion.div
              className="welcome-float"
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 28 }}>📝</span>
            </motion.div>
            <div className="text-center">
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)", marginBottom: 4 }}>
                No tasks yet
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Add your first task below to get started
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="content-container">
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5 pb-4"
            >
              <AnimatePresence mode="popLayout">
                {groups.today.length > 0 && (
                  <div key="group-today">
                    <GroupHeader title="Today" count={groups.today.length} accent />
                    <div className="space-y-2 mt-2">
                      {groups.today.map((todo) => (
                        <motion.div key={todo.id} variants={cardVariants} exit="exit" layout>
                          <TodoCard todo={todo} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {groups.upcoming.length > 0 && (
                  <div key="group-upcoming">
                    <GroupHeader title="Upcoming" count={groups.upcoming.length} />
                    <div className="space-y-2 mt-2">
                      {groups.upcoming.map((todo) => (
                        <motion.div key={todo.id} variants={cardVariants} exit="exit" layout>
                          <TodoCard todo={todo} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {groups.noDate.length > 0 && (
                  <div key="group-nodate">
                    <GroupHeader title="No date" count={groups.noDate.length} />
                    <div className="space-y-2 mt-2">
                      {groups.noDate.map((todo) => (
                        <motion.div key={todo.id} variants={cardVariants} exit="exit" layout>
                          <TodoCard todo={todo} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      <div className="floating-add-bar">
        <div className="content-container px-6">
          <QuickAddBar />
        </div>
      </div>
    </div>
  );
}

function GroupHeader({ title, count, accent }: { title: string; count: number; accent?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      {accent && (
        <div
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent-glow)",
          }}
        />
      )}
      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent ? "var(--accent)" : "var(--text-tertiary)", letterSpacing: "0.1em" }}>
        {title}
      </span>
      <span
        className="text-xs px-2 py-0.5 rounded-full font-medium"
        style={{ color: "var(--text-secondary)", background: "rgba(255,255,255,0.05)", fontSize: 11 }}
      >
        {count}
      </span>
    </div>
  );
}
