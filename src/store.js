import { create } from 'zustand';
import { db } from './db';

export const useStore = create((set, get) => ({
  // State
  searchTerm: '',
  showTagFilter: false,
  selectedFolder: null,
  selectedTag: null,
  marked: null,
  folders: [{ id: 'personal', name: 'Personal', expanded: true, color: '#3b82f6' }],
  notes: [{
    id: 1,
    title: 'Welcome to Freedom Notes',
    content: `# Welcome to Freedom Notes`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folderId: 'personal',
    // tags: ['welcome', 'tutorial', 'markdown', 'features']
    tags: []
  }],
  selectedNote: [],
  isPreview: false,
  sidebarOpen: true,
  editingTitle: false,
  tempTitle: '',
  showNewFolderForm: false,
  newFolderName: '',
  editingTags: false,
  tempTags: '',

  // Setters
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setShowTagFilter: (showTagFilter) => set({ showTagFilter }),
  setSelectedFolder: (selectedFolder) => {
    const updatedFolders = get().folders.map((folder) => ({
      ...folder,
      expanded: folder.id === selectedFolder,
    }));

    set({
      selectedFolder: selectedFolder,
      folders: updatedFolders,
    });
  },
  setSelectedTag: (selectedTag) => set({ selectedTag }),
  setMarked: (marked) => set({ marked }),
  setFolders: (folders) => {
    (async () => {
      await db.folders.bulkPut(folders);
    })();
    set({ folders });
  },
  setNotes: (notes) => {
    (async () => {
      await db.notes.bulkPut(notes);
    })();
    set({ notes });
  },
  setSelectedNote: (selectedNote) => set({ selectedNote }),
  setIsPreview: (isPreview) => set({ isPreview }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setEditingTitle: (editingTitle) => set({ editingTitle }),
  setTempTitle: (tempTitle) => set({ tempTitle }),
  setShowNewFolderForm: (showNewFolderForm) => set({ showNewFolderForm }),
  setNewFolderName: (newFolderName) => set({ newFolderName }),
  setEditingTags: (editingTags) => set({ editingTags }),
  setTempTags: (tempTags) => set({ tempTags }),

  // Actions
  addFolder: (folder) => {
    (async () => {
      await db.folders.add(folder);
    })();
    set({ folders: [...get().folders, folder] })
  },
  addNote: (note) => {
    (async () => {
      await db.notes.add(note);
    })();
    set({ notes: [...get().notes, note] })
  },

  // Centralized Logic
  createNewFolder: () => {
    const newFolderName = get().newFolderName.trim();
    if (!newFolderName) return;

    const newFolder = {
      id: newFolderName.toLowerCase(),
      name: newFolderName,
      expanded: true,
      color: '#6b7280'
    };

    get().addFolder(newFolder);
    set({ newFolderName: '', showNewFolderForm: false });
  },

  toggleFolder: (folderId) => {
    const updatedFolders = get().folders.map(folder =>
      folder.id === folderId
        ? { ...folder, expanded: !folder.expanded }
        : folder
    );

    set({ folders: updatedFolders });
  },

  createNewNote: (folderId = 'inbox') => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId,
      tags: []
    };

    get().addNote(newNote);
    set({ selectedNote: newNote, isPreview: false });
  },

  updateNote: (noteId, updates) => {
    (async () => {
      await db.notes.update(
        noteId,
        { ...updates, updatedAt: new Date().toISOString() }
      );
    })();
    const updatedNotes = get().notes.map(
      note => note.id === noteId ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    );
    get().setNotes(updatedNotes);

    if (get().selectedNote.id === noteId) {
      get().setSelectedNote({ ...get().selectedNote, ...updates });
    }
  },

  moveNoteToFolder: (noteId, folderId) => {
    get().updateNote(noteId, { folderId });
  },

  deleteNote: (noteId) => {
    if (get().notes.length === 1) return;
    
    const newNotes = get().notes.filter(note => note.id !== noteId);
    get().setNotes(newNotes);
    
    if (get().selectedNote.id === noteId) {
      get().setSelectedNote(newNotes[0]);
    }
  },

  handleTitleEdit: () => {
    get().setEditingTitle(true);
    get().setTempTitle(get().selectedNote.title);
  },

  saveTitleEdit: () => {
    if (get().tempTitle.trim()) {
      get().updateNote(
        get().selectedNote.id, { title: get().tempTitle.trim() }
      );
    }
    get().setEditingTitle(false);
  },

  saveTagEdit: () => {
    const tags = get().tempTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    get().updateNote(get().selectedNote.id, { tags });
    get().setEditingTags(false);
  },

  handleTagEdit: () => {
    get().setEditingTags(true);
    get().setTempTags((get().selectedNote.tags || []).join(', '));
  },

  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  },

}));
