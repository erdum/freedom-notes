import { X } from 'lucide-react';
import Searchbar from './Searchbar';
import Filters from './Filters';
import { useStore } from '../../../store';

function Header() {
  const setSidebarOpen = useStore((state) => state.setSidebarOpen);

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Freedom</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 hover:bg-gray-100 rounded lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <Searchbar />
      {/*<Filters />*/}

    </div>
  );
}

export default Header
