function Editor() {
  return (
    <div className="flex-1 flex">
      {/* Editor */}
      <div className={`${isPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
        <textarea
          value={selectedNote.content}
          onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
          placeholder="Start writing your note..."
          className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
        />
      </div>

      {/* Live Preview */}
      {isPreview && (
        <div className="w-1/2 border-l border-gray-200 bg-white">
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