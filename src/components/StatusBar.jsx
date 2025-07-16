import { useStore } from '../store';

function StatusBar() {
  const selectedNote = useStore((state) => state.selectedNote);
  const formatDate = useStore((state) => state.formatDate);

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-2 text-xs text-gray-500 flex items-center justify-between">
      <span>
        {selectedNote?.content?.length} characters • {selectedNote?.content?.split('\n').length} lines
      </span>
      <span>
        Last updated: {formatDate(selectedNote.updatedAt)}
      </span>
    </div>
  );
}

export default StatusBar;