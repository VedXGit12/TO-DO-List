import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import TodoList from "./components/todo/TodoList";
import TodoKanban from "./components/todo/TodoKanban";
import TodoCalendar from "./components/todo/TodoCalendar";
import CommandPalette from "./components/CommandPalette";
import TaskModal from "./components/modals/TaskModal";
import MotionToast from "./components/ui/MotionToast";
import { useUIStore } from "./store/uiStore";

export default function App() {
  const { activeProjectId, viewMode } = useUIStore();
  const showList = activeProjectId && viewMode === "list";
  const showKanban = activeProjectId && viewMode === "kanban";
  const showCalendar = activeProjectId && viewMode === "calendar";

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {showList ? (
            <TodoList />
          ) : showKanban ? (
            <TodoKanban />
          ) : showCalendar ? (
            <TodoCalendar />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Select a project from the sidebar to get started.
              </p>
            </div>
          )}
        </main>
      </div>
      <CommandPalette />
      <TaskModal />
      <MotionToast />
    </div>
  );
}
