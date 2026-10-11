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
    <div className="admin-editor flex flex-col gap-4 h-full">
      {/* Toolbar */}
      <div className="admin-editor-toolbar flex gap-2 flex-wrap">
        <button
          onClick={() => insertMarkdown("# ")}
          className="admin-tool-button"
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => insertMarkdown("## ")}
          className="admin-tool-button"
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => insertMarkdown("**", "**")}
          className="admin-tool-button"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => insertMarkdown("_", "_")}
          className="admin-tool-button"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => insertMarkdown("[", "](url)")}
          className="admin-tool-button"
          title="Link"
        >
          Link
        </button>
        <button
          onClick={() => insertMarkdown("![alt](", ")")}
          className="admin-tool-button"
          title="Image"
        >
          Image
        </button>
        <button
          onClick={() => insertMarkdown("- ")}
          className="admin-tool-button"
          title="List"
        >
          List
        </button>
        <button
          onClick={() => insertMarkdown("```\n", "\n```")}
          className="admin-tool-button"
          title="Code Block"
        >
          Code
        </button>
        <button
          onClick={() => insertMarkdown("> ")}
          className="admin-tool-button"
          title="Quote"
        >
          Quote
        </button>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="admin-tool-button"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="admin-tool-button admin-button-primary"
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
            className="admin-textarea"
            placeholder="Enter your markdown content here..."
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <label className="text-sm font-semibold mb-2">Preview</label>
            <div className="admin-preview flex-1 overflow-auto p-3 markdown">
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
