import { ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';
import { useStore } from '../../store';

function Folders() {
  const folders = useStore((state) => state.folders);
  const notes = useStore((state) => state.notes);
  const selectedFolder = useStore((state) => state.selectedFolder);
  const selectedNote = useStore((state) => state.selectedNote);
  const searchTerm = useStore((state) => state.searchTerm);
  const selectedTag = useStore((state) => state.selectedTag);

  const setSelectedFolder = useStore((state) => state.setSelectedFolder);
  // const setSelectedTag = useStore((state) => state.setSelectedTag);
  const setSelectedNote = useStore((state) => state.setSelectedNote);
  const createNewNote = useStore((state) => state.createNewNote);
  const toggleFolder = useStore((state) => state.toggleFolder);
  const updateNote = useStore((state) => state.updateNote);
  const moveNoteToFolder = useStore((state) => state.moveNoteToFolder);
  const deleteNote = useStore((state) => state.deleteNote);
  const formatDate = useStore((state) => state.formatDate);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
      || note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFolder = selectedFolder ? note.folderId === selectedFolder : true;
    const matchesTag = selectedTag ? (note.tags || []).includes(selectedTag) : true;
    
    return matchesSearch && matchesFolder && matchesTag;
  });

  const notesByFolder = filteredNotes.reduce((acc, note) => {
    if (!acc[note.folderId]) {
      acc[note.folderId] = [];
    }
    acc[note.folderId].push(note);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto pt-2">
      {folders.map(folder => (
        <div key={folder.id} className="mb-1 overflow-hidden">
          {/* Folder Header */}
          <div 
            className={`group flex items-center justify-between p-2 mx-2 mb-1 rounded cursor-pointer ${
              selectedFolder !== folder.id ? 'hover:bg-gray-100' : ''
            }`}
            style={{ backgroundColor: selectedFolder === folder.id ? `${folder.color}2f` : '' }}
            onClick={() => {
              setSelectedFolder(selectedFolder === folder.id ? null : folder.id);
              // setSelectedTag(null);
            }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {folder.expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="text-sm font-medium text-gray-700">{folder.name}</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">
              {(notesByFolder[folder.id] || []).length}
            </span>
          </div>

          {/* Notes in Folder */}
          {folder.expanded && (
            <div className="ml-4">
              {(notesByFolder[folder.id] || []).map(note => (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3 mx-2 rounded cursor-pointer hover:bg-gray-50 ${
                    selectedNote.id === note.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">{note.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {note.content.substring(0, 80)}...
                      </p>
                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="text-xs text-gray-400">+{note.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(note.updatedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <select
                        value={note.folderId}
                        onChange={(e) => moveNoteToFolder(note.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs bg-transparent border-none focus:outline-none"
                      >
                        {folders.map(f => (
                          <option disabled={f.id === note.folderId} key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-1 hover:bg-red-100 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add note to folder */}
              <button
                onClick={() => createNewNote(folder.id)}
                className="w-full mx-2 mt-2 p-2 text-sm text-gray-500 hover:bg-gray-50 rounded flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add note to {folder.name}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Folders;