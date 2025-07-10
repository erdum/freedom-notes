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
    <div className="h-screen bg-gray-50 flex">
      

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {editingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={saveTitleEdit}
                onKeyPress={(e) => e.key === 'Enter' && saveTitleEdit()}
                className="text-lg font-medium bg-transparent border-b-2 border-blue-500 focus:outline-none"
                autoFocus
              />
            ) : (
              <h2 
                onClick={handleTitleEdit}
                className="text-lg font-medium cursor-pointer hover:text-blue-600"
              >
                {selectedNote.title}
              </h2>
            )}

            {/* Folder Badge */}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {folders.find(f => f.id === selectedNote.folderId)?.name || 'Inbox'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`p-2 rounded ${
                isPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              {isPreview ? <Edit3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tags Bar */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-500" />
            {editingTags ? (
              <input
                type="text"
                value={tempTags}
                onChange={(e) => setTempTags(e.target.value)}
                onBlur={saveTagEdit}
                onKeyPress={(e) => e.key === 'Enter' && saveTagEdit()}
                placeholder="Add tags separated by commas"
                className="flex-1 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2 flex-1">
                {selectedNote.tags && selectedNote.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedNote.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No tags</span>
                )}
                <button
                  onClick={handleTagEdit}
                  className="ml-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="flex-1 flex">
          {/* Editor */}
          <div className={`${isPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
            <textarea
              value={selectedNote.content}
              onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
              placeholder="Start writing your note..."
              className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Live Preview */}
          {isPreview && (
            <div className="w-1/2 border-l border-gray-200 bg-white">
              <div className="p-6 overflow-y-auto h-full">
                {marked ? (
                  <div 
                    className="prose prose-sm max-w-none leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: parseMarkdown(selectedNote.content)
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2 mx-auto"></div>
                      <p>Loading markdown parser...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-2 text-xs text-gray-500 flex items-center justify-between">
          <span>
            {selectedNote.content.length} characters • {selectedNote.content.split('\n').length} lines
          </span>
          <span>
            Last updated: {formatDate(selectedNote.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarkdownNotes;