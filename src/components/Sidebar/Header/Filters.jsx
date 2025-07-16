import { useStore } from '../store';
import { Filter } from 'lucide-react';

function Filters() {
  const showTagFilter = useStore((state) => state.showTagFilter);
  const selectedFolder = useStore((state) => state.selectedFolder);
  const selectedTag = useStore((state) => state.selectedTag);

  const setShowTagFilter = useStore((state) => state.setShowTagFilter);
  const setSelectedFolder = useStore((state) => state.setSelectedFolder);
  const setSelectedTag = useStore((state) => state.setSelectedTag);
  const setSearchTerm = useStore((state) => state.setSearchTerm);

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(note => note.tags || []))];

  const clearFilters = () => {
    setSelectedFolder(null);
    setSelectedTag(null);
    setSearchTerm('');
  };

  return (
    <div className="flex items-center gap-2 mb-3">
      <button
        onClick={() => setShowTagFilter(!showTagFilter)}
        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          showTagFilter ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}
      >
        <Filter className="w-3 h-3" />
        Filter
      </button>
      {(selectedFolder || selectedTag) && (
        <button
          onClick={clearFilters}
          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
        >
          Clear
        </button>
      )}
    </div>

    { /* Tag Filter */ }
    {
      showTagFilter && (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedTag === tag 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      )
    }
  );
}

export default Filters;