import { Bold, Italic, List, Image as ImageIcon } from "lucide-react";

function MarkdownToolbar({ textareaRef, onImageUpload }) {
  const insertAtCursor = (syntaxBefore, syntaxAfter = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selected = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      syntaxBefore +
      selected +
      syntaxAfter +
      text.substring(end);

    textarea.value = newText;
    textarea.focus();

    // trigger input event to propagate value change
    const event = new Event("input", { bubbles: true });
    textarea.dispatchEvent(event);
  };

  return (
    <div className="flex gap-2 p-0.5 mx-4 md:mx-6 my-4 md:my-8 border rounded-md bg-gray-50">
      <button
        type="button"
        onClick={() => insertAtCursor("**", "**")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => insertAtCursor("_", "_")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => insertAtCursor("- ")}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onImageUpload}
        className="p-2 hover:bg-gray-200 rounded"
      >
        <ImageIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default MarkdownToolbar;
