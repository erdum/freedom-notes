function Tagsbar() {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-gray-500" />
        {editingTags ? (
          <input
            type="text"
            value={tempTags}
            onChange={(e) => setTempTags(e.target.value)}
            onBlur={saveTagEdit}
            onKeyPress={(e) => e.key === 'Enter' && saveTagEdit()}
            placeholder="Add tags separated by commas"
            className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2 flex-1">
            {selectedNote.tags && selectedNote.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedNote.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 text-sm">No tags</span>
            )}
            <button
              onClick={handleTagEdit}
              className="ml-2 text-blue-600 hover:text-blue-700 text-sm"
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tagsbar;