import { useStore } from '../store';
import { parseMarkdown } from '../markdown';

function Editor() {
  const isPreview = useStore((state) => state.isPreview);
  const selectedNote = useStore((state) => state.selectedNote);
  const tempContent = useStore((state) => state.tempContent);
  const marked = useStore((state) => state.marked);
  const updateNote = useStore((state) => state.updateNote);
  const setTempContent = useStore((state) => state.setTempContent);

  return (
    <div className="flex-1 flex">
      {/* Editor */}
      <div className={`${isPreview ? 'w-0 md:w-1/2' : 'w-full'} transition-all flex flex-col`}>
        <textarea
          tabIndex={0}
          value={selectedNote.content ?? tempContent}
          onChange={(e) => {
            if (selectedNote?.id) {
              updateNote(selectedNote.id, { content: e.target.value });
            } else {
              setTempContent(e.target.value);
            }
          }}
          placeholder="Start writing your note..."
          className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Live Preview */}
      {isPreview && (
        <div className="w-full md:w-1/2 border-l border-gray-200 bg-white">
          <div className="p-6 overflow-y-auto h-full">
            {marked ? (
              <div 
                className="prose prose-sm max-w-none leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: parseMarkdown(selectedNote.content)
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2 mx-auto"></div>
                  <p>Loading markdown parser...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;