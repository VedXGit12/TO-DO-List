import { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Bold, Italic, Code, Heading2, List, ListTodo } from "lucide-react";

interface BodyEditorProps {
  todoId: string;
  initialContent?: string;
  onSave: (body: string) => void;
}

export default function BodyEditor({ todoId, initialContent, onSave }: BodyEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Add notes, links, checklists…" }),
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: initialContent ? (() => { try { return JSON.parse(initialContent); } catch { return initialContent; } })() : "",
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm max-w-none min-h-[200px] px-0 py-4 outline-none focus:outline-none",
      },
    },
  });

  // Debounced autosave
  useEffect(() => {
    if (!editor) return;
    let timer: ReturnType<typeof setTimeout>;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        onSave(JSON.stringify(editor.getJSON()));
      }, 600);
    };
    editor.on("update", handler);
    return () => {
      clearTimeout(timer);
      editor.off("update", handler);
    };
  }, [editor, onSave]);

  // Re-hydrate on todo change
  useEffect(() => {
    if (!editor) return;
    const content = initialContent
      ? (() => { try { return JSON.parse(initialContent); } catch { return initialContent; } })()
      : "";
    const currentContent = JSON.stringify(editor.getJSON());
    if (currentContent !== initialContent) {
      editor.commands.setContent(content);
    }
  }, [todoId]); // eslint-disable-line react-hooks/exhaustive-deps

  const ToolbarButton = useCallback(
    ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
      <button
        onClick={onClick}
        className="p-1.5 rounded"
        style={{
          color: active ? "var(--accent)" : "var(--text-secondary)",
          background: active ? "var(--accent-dim)" : "transparent",
        }}
      >
        {children}
      </button>
    ),
    []
  );

  if (!editor) return null;

  return (
    <div>
      {/* Toolbar */}
      <div
        className="flex items-center gap-0.5 pb-2 border-b mb-2"
        style={{ borderColor: "var(--border)" }}
      >
        <ToolbarButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleList("taskList", "taskItem").run()}>
          <ListTodo size={14} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
