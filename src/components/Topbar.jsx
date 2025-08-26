import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, Eye, Edit3, Settings, FolderSync, Upload, ChevronDown 
} from "lucide-react"
import { useMemo, useRef } from "react"
import { useStore } from "../store"

function Topbar() {
  const fileInputRef = useRef(null);

  const folders = useStore((state) => state.folders);
  const editingTitle = useStore((state) => state.editingTitle);
  const selectedNote = useStore((state) => state.selectedNote);
  const isPreview = useStore((state) => state.isPreview);
  const tempTitle = useStore((state) => state.tempTitle);
  const sidebarOpen = useStore((state) => state.sidebarOpen);

  const handleTitleEdit = useStore((state) => state.handleTitleEdit);
  const setIsPreview = useStore((state) => state.setIsPreview);
  const setTempTitle = useStore((state) => state.setTempTitle);
  const saveTitleEdit = useStore((state) => state.saveTitleEdit);
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);
  const createNewNote = useStore((state) => state.createNewNote);  
  const addFolder = useStore((state) => state.addFolder);
  const addNote = useStore((state) => state.addNote);

  const selectedNoteFolder = useMemo(() => {
    return folders.find(f => f.id === selectedNote.folderId)
  }, [selectedNote, folders]);

  const handleImportKeepData = () => {
    fileInputRef.current?.click();
  };

  const handleTitle = () => {
    if (selectedNote?.id) saveTitleEdit();
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Note Title */}
        {(editingTitle || !selectedNote?.title) ? (
          <input
            type="text"
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitle}
            onKeyPress={(e) => e.key === 'Enter' && handleTitle()}
            className="hidden md:block text-lg font-medium bg-transparent border-b-2 border-blue-500 focus:outline-none"
            autoFocus
            placeholder='Untitled Note'
          />
        ) : (
          <h2 
            onClick={handleTitleEdit}
            className="hidden md:block pr-8 text-lg font-medium cursor-pointer hover:text-blue-600"
          >
            {selectedNote.title}
          </h2>
        )}

        {/* Folder Badge */}
        {selectedNoteFolder ? (
          <span className="px-2 py-1 bg-gray-200 text-gray-900 rounded-full text-xs">
            {selectedNoteFolder.name}
          </span>
        ) : (
          <select
            defaultValue='default'
            value={selectedNoteFolder}
            onChange={(e) => createNewNote(e.target.value)}
          >
            <option value='default' disabled>Select folder</option>
            {folders.map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Toggle Preview */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          className={`p-2 rounded ${
            isPreview ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
          }`}
        >
          {isPreview ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>

        {/* Settings Dropdown with shadcn */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded flex items-center gap-1">
              <Settings className="w-5 h-5" />
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem
              onClick={handleImportKeepData}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import Google Keep Notes
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Sync clicked")}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FolderSync className="w-4 h-4" />
              Sync with Server
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hidden file input for Google Keep import */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".json"
          onChange={(e) => {
          }}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default Topbar;
