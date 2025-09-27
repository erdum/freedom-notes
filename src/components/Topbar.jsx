import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, Eye, Edit3, Settings, FolderSync, Upload, ChevronDown 
} from "lucide-react";
import { useMemo, useRef } from "react";
import { v4 as uuid } from 'uuid';
import { useStore } from "../store";

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
  const notesIndex = useStore((state) => state.notesIndex);

  const selectedNoteFolder = useMemo(() => {
    return folders.find(f => f.id === selectedNote.folderId)
  }, [selectedNote, folders]);

  const handleImportKeepData = () => {
    fileInputRef.current?.click();
  };

  const handleTitle = () => {
    if (selectedNote?.id) saveTitleEdit();
  };

  const processKeepTakeout = async (file, labelMap) => {
    try {
      const jsonString = await file.text();
      const note = JSON.parse(jsonString);
      const labels = note.labels ?? [];
      const attachments = note.attachments ?? [];
      const isArchived = note.isArchived ?? false;
      const isPinned = note.isArchived ?? false;
      const isTrashed = note.isTrashed ?? false;
      const color = note.color ?? '#3b82f6';
      const title = note.title ?? 'Untitled Note';
      const createdAt = note.createdTimestampUsec / 1000;
      const editedAt = note.userEditedTimestampUsec / 1000;
      const noteData = {
        labels,
        attachments,
        isArchived,
        isPinned,
        isTrashed,
        color,
        title,
        createdAt,
        editedAt,
        content: ''
      };
      
      // Process note content based on note type
      if (note.textContent) {
        noteData.content = note.textContent;
      } else if (note.listContent) {
        let content = '';
        note.listContent.forEach((item) => {
          content += `\n- ${item.isChecked ? '[x]' : '[ ]'} ${item.text}`;
        });

        noteData.content = content;
      }

      if (labels.length === 0) {
        // Notes without labels go to "Important" folder
        if (!labelMap.has('Important')) {
          labelMap.set('Important', []);
        }

        labelMap.get('Important').push(noteData);
      } else {
        // Create folders for each label
        labels.forEach(label => {
          const labelName = label.name;

          if (!labelMap.has(labelName)) {
            labelMap.set(labelName, []);
          } 
          labelMap.get(labelName).push(noteData);
        }); 
      } 
    } catch (error) {
      alert('Error importing Google Keep data. Please make sure you selected the correct JSON file.');
    } 
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    const labelMap = new Map();

    (async () => {
      for (var i = files.length - 1; i >= 0; i--) {
        const file = files[i];

        if (file && file.type === 'application/json') {
          await processKeepTakeout(file, labelMap);
        } 
      }

      labelMap.forEach((notes, labelName) => {
        const folderId = labelName.toLowerCase();
        addFolder({
          id: folderId,
          name: labelName,
          expanded: false,
          // color: '#3b82f6'
        });
        notes.forEach(note => {
          addNote({
            id: uuid(),
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.editedAt,
            folderId,
            tags: [],
            images: []
          });
        });
      });

      alert(`Successfully imported ${files.length} notes organized into ${labelMap.size} folders!`);
    })();

    event.target.value = '';
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
              onClick={() => console.log("Sync clicked", notesIndex)}
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
          onChange={(event) => {
            handleFileSelect(event);
          }}
          className="hidden"
        />
      </div>
    </div>
  );
}

export default Topbar;
