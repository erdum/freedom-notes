import { useStore } from './store';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Tagsbar from './Tagsbar';
import Editor from './Editor';
import StatusBar from './StatusBar';

function App() {

  return (
    <div className="h-screen bg-gray-50 flex">

      {/*Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <Tagsbar />
        <Editor />
        <StatusBar />
      </div>
    </div>
  );
}

export default App
