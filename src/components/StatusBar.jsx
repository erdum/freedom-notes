import { RefreshCw, Download } from 'lucide-react';
import { useStore } from '../store';

function StatusBar() {
  const selectedNote = useStore((state) => state.selectedNote);
  const formatDate = useStore((state) => state.formatDate);
  const syncingInProgress = useStore((state) => state.syncingInProgress);
  const importInProgress = useStore((state) => state.importInProgress);

  return (
    <div className="bg-gray-50 border-t border-gray-200 px-6 py-2 text-xs text-gray-500 flex items-center justify-between">
      <span>
        {selectedNote?.content?.length} characters • {selectedNote?.content?.split('\n').length} lines
      </span>
      <div className="flex items-center gap-4">
        {syncingInProgress &&
          <div title="Sync in progress">
            <RefreshCw className="w-4 h-4 animate-spin" />
          </div>
        }
        {importInProgress &&
          <div title="Import in progress">
            <Download className="w-4 h-4 animate-bounce" />
          </div>
        }
        <span>
          Last updated: {formatDate(selectedNote.updatedAt)}
        </span>
      </div>
    </div>
  );
}

export default StatusBar;