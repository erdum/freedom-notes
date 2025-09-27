import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { db } from './db';
import { hash } from './lib/utils';

export const useStore = create((set, get) => ({
  // State
  searchTerm: '',
  showTagFilter: false,
  selectedFolder: null,
  selectedTag: null,
  marked: null,
  folders: [{ id: 'misc', name: 'Misc', expanded: true, color: '#3b82f6' }],
  notes: [{
    id: uuid(),
    title: 'Welcome to Freedom Notes',
    content: `# Welcome to Freedom Notes`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    folderId: 'misc',
    // tags: ['welcome', 'tutorial', 'markdown', 'features']
    tags: [],
    version: ''
  }],
  notesIndex: new Map(),
  selectedNote: {},
  isPreview: false,
  sidebarOpen: true,
  editingTitle: false,
  tempTitle: '',
  showNewFolderForm: false,
  newFolderName: '',
  newFolderColor: '',
  editingTags: false,
  tempTags: '',
  tempContent: '',
  tempImages: [],
  openMoveNoteModal: false,
  openRenameFolderModal: false,
  targetFolderId: 'def',
  newFolderName: '',
  serverToken: null,
  syncingInProgress: false,
  lastSynced: Date.now(),

  // Setters
  setSearchTerm: (searchTerm) => set({ searchTerm }),
  setShowTagFilter: (showTagFilter) => set({ showTagFilter }),
  setSelectedFolder: (selectedFolderId) => {
    const updatedFolders = get().folders.map((folder) => ({
      ...folder,
      expanded: folder.id === selectedFolderId,
    }));

    set({
      selectedFolder: selectedFolderId,
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
  setSelectedNote: (selectedNote) => {
    get().setSelectedFolder(selectedNote.folderId);
    set({ selectedNote });
  },
  setIsPreview: (isPreview) => set({ isPreview }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setEditingTitle: (editingTitle) => set({ editingTitle }),
  setTempTitle: (tempTitle) => set({ tempTitle }),
  setTempImages: (tempImages) => set({ tempImages }),
  setShowNewFolderForm: (showNewFolderForm) => set({ showNewFolderForm }),
  setNewFolderName: (newFolderName) => set({ newFolderName }),
  setNewFolderColor: (newFolderColor) => set({ newFolderColor }),
  setEditingTags: (editingTags) => set({ editingTags }),
  setTempTags: (tempTags) => set({ tempTags }),
  setTempContent: (tempContent) => set({ tempContent }),
  setOpenMoveNoteModal: (openMoveNoteModal) => set({ openMoveNoteModal }),
  setOpenRenameFolderModal: (openRenameFolderModal) => set(
    { openRenameFolderModal }
  ),
  setTargetFolderId: (targetFolderId) => set({ targetFolderId }),
  setNewFolderName: (newFolderName) => set({ newFolderName }),
  setSyncingInProgress: (syncingInProgress) => set({ syncingInProgress });
  setNotesIndex: (notesIndex) => set({ notesIndex }),

  // Actions
  addFolder: (folder) => {
    const exists = get().folders.filter(f => f.id == folder.id);
    if (exists.length === 0) {
      (async () => {
        await db.folders.add(folder);
      })();
      set({ folders: [...get().folders, folder] });
    }
  },
  addNote: (note) => {
    (async () => {
      const newNote = { ...note };
      newNote.version = await hash(newNote.content + newNote.updatedAt);
      await db.notes.add(newNote);
      set({ notes: [...get().notes, newNote] });
      get().updateNotesIndex(newNote.id, newNote.version);
    })();
  },

  // Centralized Logic
  createNewFolder: () => {
    const newFolderName = get().newFolderName.trim();
    if (!newFolderName) return;

    const newFolder = {
      id: newFolderName.toLowerCase(),
      name: newFolderName,
      expanded: true,
      color: get().newFolderColor
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

  setupNewNote: () => {
    set({
      selectedNote: {},
      selectedFolder: null,
    });
  },

  createNewNote: (folderId = 'misc') => {
    const newNote = {
      id: uuid(),
      title: get().tempTitle.trim() ?? 'Untitled Note',
      content: get().tempContent ?? '',
      images: get().tempImages ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId,
      tags: []
    };

    get().addNote(newNote);
    get().setSelectedNote(newNote);
    set({ isPreview: false, tempTitle: '', tempContent: '', tempImages: [] });
  },

  updateNote: (noteId, updates) => {
    var updatedNote = {};
    const updatedNotesPromise = get().notes.map(
      async (note) => {
        if (note.id === noteId) {
          updatedNote = {
            ...note,
            ...updates,
            updatedAt: new Date().toISOString(),
            version: await hash(note.content + note.updatedAt)
          };
          get().updateNotesIndex(updatedNote.id, updatedNote.version);

          return updatedNote;
        }

        return note;
      }
    );

    (async () => {
      await db.notes.update(
        noteId,
        updatedNote
      );
      const updatedNotes = await Promise.all(updatedNotesPromise);
      get().setNotes(updatedNotes);
    })();

    if (get().selectedNote.id === noteId) {
      get().setSelectedNote({ ...get().selectedNote, ...updates });
    }
  },

  moveNoteToFolder: (noteId, folderId) => {
    get().updateNote(noteId, { folderId });
    get().setSelectedFolder(folderId);
  },

  renameFolder: (folder, newFolderName) => {
    if (!newFolderName.trim()) return;

    (async () => {
      await db.folders.update(
        folder.id,
        { ...folder, name: newFolderName }
      );
    })();
    const currentFolderId = folder.id;

    const updatedFolders = get().folders.map(
      folder => folder.id === currentFolderId ? { ...folder, name: newFolderName } : folder
    );
    get().setFolders(updatedFolders);
  },

  deleteFolder: (folderId) => {
    (async () => {
      await db.notes.where("folderId").equals(folderId)
        .modify({ folderId: 'misc' });

      const updatedNotes = await db.notes.toArray();
      get().setNotes(updatedNotes);
    })();

    const updatedFolders = get().folders.filter(folder => {

      if (folder.id === folderId) (async () => {
        await db.folders.delete(folderId);
      })();

      return folder.id !== folderId
    });
    get().setFolders(updatedFolders);

    if (get().selectedFolder === folderId) {
      get().setSelectedNote(get().notes[0]);
    }
  },

  deleteNote: (noteId) => {
    const newNotes = get().notes.filter(note => {

      if (note.id === noteId) (async () => {
        await db.notes.delete(noteId);
      })();

      return note.id !== noteId
    });
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

  updateNotesIndex: (id, hash) => {
    (async () => {
      const updatedIndex = new Map(get().notesIndex);
      updatedIndex.set(id, hash);
      await db.notesIndex.put({ id, hash });
      set({ notesIndex: updatedIndex });
    })();
  },
}));
