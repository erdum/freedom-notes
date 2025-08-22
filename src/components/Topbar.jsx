import { useMemo, useState, useRef } from 'react';
import { Menu, Eye, Edit3, Settings, FolderSync, Upload, ChevronDown } from 'lucide-react';
import { useStore } from '../store';

function Topbar() {
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
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
  // const setSelectedFolder = useStore((state) => state.setSelectedFolder);
  const createNewNote = useStore((state) => state.createNewNote);  
  const addFolder = useStore((state) => state.addFolder);
  const addNote = useStore((state) => state.addNote);
  
  const selectedNoteFolder = useMemo(() => {
    return folders.find(f => f.id === selectedNote.folderId)
  }, [selectedNote, folders]);

  const handleImportKeepData = () => {
    fileInputRef.current?.click();
    setShowSettingsDropdown(false);
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
        content: '',
      };

      // Process note content based on note type
      if (note.textContent) {
        noteData.content = note.textContent;
      }
      else if (note.listContent) {
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
      console.error('Error processing Google Keep data:', error);
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
          color: '#3b82f6'
        });
        
        notes.forEach(note => {
          addNote({
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.editedAt,
            folderId,
            tags: []
          });
        });
      });
      
      alert(`Successfully imported ${files.length} notes organized into ${labelMap.size} folders!`);
    })();

    event.target.value = '';
  };

  const handleTitle = () => {
    if (selectedNote?.id) saveTitleEdit();
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <Menu className="w-5 h-5" />
          </button>
          
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
            <span
              className="px-2 py-1 bg-gray-200 text-gray-900 rounded-full text-xs"
              // style={{ backgroundColor: `${selectedNoteFolder.color}6f` || '' }}
            >
              {selectedNoteFolder.name || ''}
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
        
        <div className="flex items-center gap-2">
          <button
            tabIndex={1}
            onClick={() => setIsPreview(!isPreview)}
            className={`p-2 rounded ${
              isPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
            }`}
          >
            {isPreview ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
          
          {/* Settings Dropdown */}
          <div className="relative">
            <button
              tabIndex={2}
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-2 hover:bg-gray-100 rounded flex items-center gap-1"
            >
              <Settings className="w-5 h-5" />
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showSettingsDropdown && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={handleImportKeepData}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    Import Google Keep Notes
                  </button>
                  
                  {/* Add more settings options here */}
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button
                    onClick={() => setShowSettingsDropdown(false)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                  >
                    <FolderSync className="w-4 h-4" />
                    Sync with Server
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Hidden file input for Google Keep import */}
          <input
            ref={fileInputRef}
            type="file"
            multiple={true}
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Click outside to close dropdown */}
        {showSettingsDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowSettingsDropdown(false)}
          />
        )}
      </div>

      {(editingTitle || !selectedNote?.title) ? (
        <input
          type="text"
          value={tempTitle}
          onChange={(e) => setTempTitle(e.target.value)}
          onBlur={handleTitle}
          onKeyPress={(e) => e.key === 'Enter' && handleTitle()}
          className="md:hidden p-4 text-lg font-medium bg-transparent border-b-2 border-blue-500 focus:outline-none"
          autoFocus
          placeholder='Untitled Note'
        />
      ) : (
        <h2 
          onClick={handleTitleEdit}
          className="md:hidden p-4 text-lg font-medium cursor-pointer hover:text-blue-600"
        >
          {selectedNote.title}
        </h2>
      )}
    </>
  );
}

export default Topbar;