import { Menu, Eye, Edit3, Settings, Tag } from 'lucide-react';
function Topbar() {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        {editingTitle ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={saveTitleEdit}
            onKeyPress={(e) => e.key === 'Enter' && saveTitleEdit()}
            className="text-lg font-medium bg-transparent border-b-2 border-blue-500 focus:outline-none"
            autoFocus
          />
        ) : (
          <h2 
            onClick={handleTitleEdit}
            className="text-lg font-medium cursor-pointer hover:text-blue-600"
          >
            {selectedNote.title}
          </h2>
        )}

        {/* Folder Badge */}
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
          {folders.find(f => f.id === selectedNote.folderId)?.name || 'Inbox'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`p-2 rounded ${
            isPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
        >
          {isPreview ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Topbar;