import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Eye, Trash2, FileText, Settings, Menu, X, Folder, FolderOpen, Tag, ChevronDown, ChevronRight, Hash, Filter } from 'lucide-react';

// Load marked library for markdown parsing
const loadMarked = () => {
  return new Promise((resolve) => {
    if (window.marked) {
      resolve(window.marked);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js';
    script.onload = () => {
      // Configure marked with GitHub Flavored Markdown
      window.marked.setOptions({
        breaks: true,
        gfm: true,
        sanitize: false,
        smartypants: true
      });
      resolve(window.marked);
    };
    document.head.appendChild(script);
  });
};

const MarkdownNotes = () => {
  const [marked, setMarked] = useState(null);
  const [folders, setFolders] = useState([
    { id: 'inbox', name: 'Inbox', expanded: true, color: '#3b82f6' },
    { id: 'work', name: 'Work', expanded: true, color: '#10b981' },
    { id: 'personal', name: 'Personal', expanded: true, color: '#8b5cf6' },
  ]);

  // Load marked library on component mount
  useEffect(() => {
    loadMarked().then(setMarked);
  }, []);

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Welcome to Markdown Notes',
      content: `# Welcome to Markdown Notes

This is a **markdown-powered** note-taking app with live preview and organization features.

## Features
- Clean, minimalist interface
- Live markdown preview
- Responsive design
- Search functionality
- Easy note management
- **Folder organization**
- **Tag system**
- **Filtering options**

## Full Markdown Support

### Text Formatting
- **Bold text** and *italic text*
- ***Bold and italic combined***
- ~~Strikethrough text~~
- \`Inline code\`

### Code Blocks
\`\`\`javascript
function helloWorld() {
  console.log("Hello, World!");
}
\`\`\`

### Task Lists
- [x] Create markdown parser
- [x] Add folder system
- [x] Implement tags
- [ ] Add export functionality
- [ ] Implement sync

### Links and Images
- [Visit Example](https://example.com)
- ![Sample Image](https://via.placeholder.com/300x200)

### Blockquotes
> This is a blockquote
> It can span multiple lines

### Tables
| Feature | Status | Priority |
|---------|---------|----------|
| Folders | ✅ | High |
| Tags | ✅ | High |
| Search | ✅ | Medium |

### Lists
1. First ordered item
2. Second ordered item
   - Nested unordered item
   - Another nested item

### Horizontal Rule
---

Start typing to see the live preview in action!`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: 'inbox',
                    tags: ['welcome', 'tutorial', 'markdown', 'features']
    }
  ]);

  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingTags, setEditingTags] = useState(false);
  const [tempTags, setTempTags] = useState('');
  const [showTagFilter, setShowTagFilter] = useState(false);

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  // Parse markdown using marked library
  const parseMarkdown = (text) => {
    if (!marked || !text) return '';
    
    try {
      // Custom renderer for better styling
      const renderer = new marked.Renderer();
      
      // Custom heading renderer
      renderer.heading = (text, level) => {
        const sizes = {
          1: 'text-2xl font-bold mb-4 mt-6 text-gray-900',
          2: 'text-xl font-semibold mb-4 mt-5 text-gray-800',
          3: 'text-lg font-semibold mb-3 mt-4 text-gray-800',
          4: 'text-base font-semibold mb-2 mt-3 text-gray-700',
          5: 'text-sm font-semibold mb-2 mt-2 text-gray-700',
          6: 'text-xs font-semibold mb-1 mt-2 text-gray-600'
        };
        return `<h${level} class="${sizes[level]}">${text}</h${level}>`;
      };
      
      // Custom paragraph renderer
      renderer.paragraph = (text) => {
        return `<p class="mb-4 leading-relaxed">${text}</p>`;
      };
      
      // Custom list renderer
      renderer.list = (body, ordered) => {
        const type = ordered ? 'ol' : 'ul';
        const classes = ordered ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4';
        return `<${type} class="${classes}">${body}</${type}>`;
      };
      
      // Custom list item renderer
      renderer.listitem = (text) => {
        // Handle checkboxes
        if (text.includes('type="checkbox"')) {
          return `<li class="flex items-center mb-2 -ml-6">${text}</li>`;
        }
        return `<li class="mb-1">${text}</li>`;
      };
      
      // Custom code renderer
      renderer.code = (code, language) => {
        return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"><code class="font-mono text-sm">${code}</code></pre>`;
      };
      
      // Custom codespan renderer
      renderer.codespan = (code) => {
        return `<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">${code}</code>`;
      };
      
      // Custom blockquote renderer
      renderer.blockquote = (quote) => {
        return `<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4 bg-blue-50 py-2">${quote}</blockquote>`;
      };
      
      // Custom table renderer
      renderer.table = (header, body) => {
        return `<table class="table-auto border-collapse border border-gray-300 mb-4 w-full"><thead class="bg-gray-50">${header}</thead><tbody>${body}</tbody></table>`;
      };
      
      // Custom table row renderer
      renderer.tablerow = (content) => {
        return `<tr class="border-b border-gray-200">${content}</tr>`;
      };
      
      // Custom table cell renderer
      renderer.tablecell = (content, flags) => {
        const tag = flags.header ? 'th' : 'td';
        const classes = flags.header ? 'px-4 py-2 text-left font-semibold' : 'px-4 py-2';
        return `<${tag} class="${classes}">${content}</${tag}>`;
      };
      
      // Custom link renderer
      renderer.link = (href, title, text) => {
        return `<a href="${href}" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" title="${title || ''}">${text}</a>`;
      };
      
      // Custom image renderer
      renderer.image = (href, title, text) => {
        return `<img src="${href}" alt="${text}" title="${title || ''}" class="max-w-full h-auto rounded-lg mb-4 shadow-sm" />`;
      };
      
      // Custom horizontal rule renderer
      renderer.hr = () => {
        return `<hr class="border-gray-300 my-6">`;
      };
      
      // Custom strong renderer
      renderer.strong = (text) => {
        return `<strong class="font-semibold">${text}</strong>`;
      };
      
      // Custom emphasis renderer
      renderer.em = (text) => {
        return `<em class="italic">${text}</em>`;
      };
      
      // Custom delete renderer (strikethrough)
      renderer.del = (text) => {
        return `<del class="line-through text-gray-500">${text}</del>`;
      };
      
      // Configure marked with custom renderer
      marked.setOptions({
        renderer,
        breaks: true,
        gfm: true,
        sanitize: false,
        smartypants: true
      });
      
      return marked.parse(text);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return `<p class="text-red-500">Error parsing markdown</p>`;
    }
  };

  // Filter notes based on search, folder, and tag
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFolder = selectedFolder ? note.folderId === selectedFolder : true;
    const matchesTag = selectedTag ? (note.tags || []).includes(selectedTag) : true;
    
    return matchesSearch && matchesFolder && matchesTag;
  });

  // Group notes by folder
  const notesByFolder = filteredNotes.reduce((acc, note) => {
    if (!acc[note.folderId]) {
      acc[note.folderId] = [];
    }
    acc[note.folderId].push(note);
    return acc;
  }, {});

  const createNewNote = (folderId = 'inbox') => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId,
      tags: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsPreview(false);
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      const newFolder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        expanded: true,
        color: '#6b7280'
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolderForm(false);
    }
  };

  const toggleFolder = (folderId) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, expanded: !folder.expanded }
        : folder
    ));
  };

  const updateNote = (noteId, updates) => {
    setNotes(notes.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
    if (selectedNote.id === noteId) {
      setSelectedNote({ ...selectedNote, ...updates });
    }
  };

  const deleteNote = (noteId) => {
    if (notes.length === 1) return;
    
    const newNotes = notes.filter(note => note.id !== noteId);
    setNotes(newNotes);
    
    if (selectedNote.id === noteId) {
      setSelectedNote(newNotes[0]);
    }
  };

  const handleTitleEdit = () => {
    setEditingTitle(true);
    setTempTitle(selectedNote.title);
  };

  const saveTitleEdit = () => {
    if (tempTitle.trim()) {
      updateNote(selectedNote.id, { title: tempTitle.trim() });
    }
    setEditingTitle(false);
  };

  const handleTagEdit = () => {
    setEditingTags(true);
    setTempTags((selectedNote.tags || []).join(', '));
  };

  const saveTagEdit = () => {
    const tags = tempTags.split(',').map(tag => tag.trim()).filter(tag => tag);
    updateNote(selectedNote.id, { tags });
    setEditingTags(false);
  };

  const moveNoteToFolder = (noteId, folderId) => {
    updateNote(noteId, { folderId });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const clearFilters = () => {
    setSelectedFolder(null);
    setSelectedTag(null);
    setSearchTerm('');
  };

  return (
    
  );
};

export default MarkdownNotes;