import { create } from 'zustand'

export const useStore = create((set) => ({
  searchTerm: '',
  showTagFilter: false,
  selectedFolder: null,
  selectedTag: null,
  folders: [{ id: 'inbox', name: 'Inbox', expanded: true, color: '#3b82f6' }],

  setSearchTerm: (searchTerm) => set((state) => ({ searchTerm: searchTerm })),
  setShowTagFilter: (showTagFilter) => set(
    (state) => ({ showTagFilter: showTagFilter })
  ),
  setSelectedFolder: (selectedFolder) => set(
    (state) => ({ selectedFolder: selectedFolder })
  ),
  setSelectedTag: (selectedTag) => set(
    (state) => ({ selectedTag: selectedTag })
  ),
  addFolder: (folder) => set(
    (state) => ({ ...state, folders: [...folders, folder] })
  ),
  setFolders: (folders) => set(
    (state) => ({ folders: folders }),
    true
  ),

  setSidebarOpen: () => set((state) => ({ isSidebarOpen: true })),
  setSidebarClose: () => set((state) => ({ isSidebarOpen: false })),

  setSelectedUser: (user) => set((state) => ({ selectedUser: user })),

  addMessage: (userEmail, messagePayload) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [userEmail]: [
          ...(state.messages[userEmail] || []),
          messagePayload,
        ],
      },
    })),

  setMessages: (userEmail, messagesArray) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [userEmail]: messagesArray,
      },
    })),
}));
