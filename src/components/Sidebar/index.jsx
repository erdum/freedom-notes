import Header from './Header';
import Folders from './Folders';
import { Plus, Folder, X } from 'lucide-react';
import { useStore } from '../../store';

function Sidebar() {
  const sidebarOpen = useStore((state) => state.sidebarOpen);
  const showNewFolderForm = useStore((state) => state.showNewFolderForm);
  const newFolderName = useStore((state) => state.newFolderName);
  const newFolderColor = useStore((state) => state.newFolderColor);

  const setNewFolderName = useStore((state) => state.setNewFolderName);
  const setNewFolderColor = useStore((state) => state.setNewFolderColor);
  const addFolder = useStore((state) => state.addFolder);
  const setShowNewFolderForm = useStore((state) => state.setShowNewFolderForm);
  const setSelectedNote = useStore((state) => state.setSelectedNote);
  const setIsPreview = useStore((state) => state.setIsPreview);
  const createNewFolder = useStore((state) => state.createNewFolder);
  const createNewNote = useStore((state) => state.createNewNote);

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden shrink-0 ${sidebarOpen ? 'w-screen md:w-80' : 'w-0'} overflow-hidden`}>
        
      {/* Header */}
      <Header />

      {/*Folders*/}
      <Folders />

      {/* New Folder Form */}
      {showNewFolderForm && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between gap-2 mb-4">
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createNewFolder()}
              className="w-11/12 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="w-1/12 aspect-square flex">
              <input
                value={newFolderColor}
                onChange={((e) => setNewFolderColor(e.target.value))}
                type="color"
                className="w-full h-full border border-gray-300 rounded focus:outline-none"
              />
            </div>
          </div>
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