import { X } from 'lucide-react';
function Header() {

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Notes</h1>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1 hover:bg-gray-100 rounded lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>


    </div>
  );
}

export default Header
