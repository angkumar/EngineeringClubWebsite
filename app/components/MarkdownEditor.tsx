import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  initialContent?: string;
  onSave: (content: string) => void;
  isSaving?: boolean;
}

export default function MarkdownEditor({
  initialContent = "",
  onSave,
  isSaving = false,
}: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [showPreview, setShowPreview] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Update content when initialContent changes (when switching projects)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
  };

  const insertMarkdown = (before: string, after: string = "") => {
    if (!editorRef.current) return;

    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const newContent =
      content.substring(0, start) +
      before +
      selected +
      after +
      content.substring(end);

    setContent(newContent);
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selected.length;
      textarea.focus();
    }, 0);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap border-b pb-3">
        <button
          onClick={() => insertMarkdown("# ")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => insertMarkdown("## ")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => insertMarkdown("**", "**")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => insertMarkdown("_", "_")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => insertMarkdown("[", "](url)")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Link"
        >
          Link
        </button>
        <button
          onClick={() => insertMarkdown("![alt](", ")")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Image"
        >
          Image
        </button>
        <button
          onClick={() => insertMarkdown("- ")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="List"
        >
          List
        </button>
        <button
          onClick={() => insertMarkdown("```\n", "\n```")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Code Block"
        >
          Code
        </button>
        <button
          onClick={() => insertMarkdown("> ")}
          className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Quote"
        >
          Quote
        </button>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-semibold mb-2">Markdown Editor</label>
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none"
            placeholder="Enter your markdown content here..."
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <label className="text-sm font-semibold mb-2">Preview</label>
            <div className="flex-1 overflow-auto p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: (props: any) => (
                    <img {...props} className="max-w-full h-auto" alt={props.alt} />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
