function Sidebar() {
  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}>
        
        {/* Header */}

        {/* New Folder Form */}
        {showNewFolderForm && (
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createNewFolder()}
              className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={createNewFolder}
                className="flex-1 bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewFolderForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => createNewNote()}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Note
            </button>
            <button
              onClick={() => setShowNewFolderForm(true)}
              className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Folder className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  );
}

export default Sidebar;
