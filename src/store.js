import { create } from 'zustand'

export const useStore = create((set) => ({
  searchTerm: '',
  showTagFilter: false,
  selectedFolder: null,
  selectedTag: null,
  marked: null,
  folders: [{ id: 'inbox', name: 'Inbox', expanded: true, color: '#3b82f6' }],
  notes: [{
    id: 1,
    title: 'Welcome to Freedom Notes',
    content: `# Welcome to Freedom Notes`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folderId: 'inbox',
    tags: ['welcome', 'tutorial', 'markdown', 'features']
  }],
  selectedNote: notes[0],
  isPreview: false,
  sidebarOpen: true,
  editingTitle: false,
  tempTitle: '',
  showNewFolderForm: false,
  newFolderName: '',
  editingTags: false,
  tempTags: '',

  setSearchTerm: (searchTerm) => set(() => ({ searchTerm })),
  setShowTagFilter: (showTagFilter) => set(
    () => ({ showTagFilter })
  ),
  setSelectedFolder: (selectedFolder) => set(
    () => ({ selectedFolder })
  ),
  setSelectedTag: (selectedTag) => set(
    () => ({ selectedTag })
  ),
  setMarked: (marked) => set(() => ({ marked })),
  addFolder: (folder) => set(
    (state) => ({ folders: [...state.folders, folder] })
  ),
  setFolders: (folders) => set(
    () => ({ folders })
  ),
  addNote: (note) => set(
    (state) => ({ notes: [...state.notes, note] })
  ),
  setNotes: (notes) => set(
    () => ({ notes })
  ),
  setSelectedNote: (selectedNote) => set(
    () => ({ selectedNote })
  ),
  setIsPreview: (isPreview) => set(
    () => ({ isPreview })
  ),
  setSidebarOpen: (sidebarOpen) => set(
    () => ({ sidebarOpen })
  ),
  setEditingTitle: (editingTitle) => set(
    () => ({ editingTitle })
  ),
  setTempTitle: (tempTitle) => set(
    () => ({ tempTitle })
  ),
  setShowNewFolderForm: (showNewFolderForm) => set(
    () => ({ showNewFolderForm })
  ),
  setNewFolderName: (newFolderName) => set(
    () => ({ newFolderName })
  ),
  setEditingTags: (editingTags) => set(
    () => ({ editingTags })
  ),
  setTempTags: (tempTags) => set(
    () => ({ tempTags })
  ),

}));
