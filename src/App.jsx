import { useEffect } from 'react';
import { useStore } from './store';
import { loadMarked } from './markdown';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Tagsbar from './components/Tagsbar';
import Editor from './components/Editor';
import StatusBar from './components/StatusBar';
import { db } from './db';

function App() {
  useEffect(() => {
    const init = async () => {
      const [notes, folders] = await Promise.all([
        db.notes.toArray(),
        db.folders.toArray(),
      ]);

      if (folders.length === 0) {
        useStore.getState().setFolders(useStore.getState().folders);
      } else {
        useStore.getState().setFolders(folders);
      }

      if (notes.length === 0) {
        useStore.getState().setNotes(useStore.getState().notes);
      } else {
        useStore.getState().setNotes(notes);
      }
    };
    init();
  }, []);

  // Load marked library on component mount
  useEffect(() => {
    loadMarked().then(useStore.getState().setMarked);
  }, []);

  return (
    <div className="h-screen bg-gray-50 flex">

      {/*Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        {/*<Tagsbar />*/}
        <Editor />
        <StatusBar />
      </div>
    </div>
  );
}

export default App
