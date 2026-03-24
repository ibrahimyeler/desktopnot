import { useAppStore } from '../../store/useAppStore';
import Home from './Home';
import EditorToolbar from './EditorToolbar';
import NoteEditor from './NoteEditor';
import SpreadsheetEditor from './SpreadsheetEditor';
import Sidebar from './Sidebar';

export default function Dashboard() {
  const { route, getActiveFile } = useAppStore();
  const file = getActiveFile();

  if (route === 'home' || !file) {
    return (
      <div className="flex h-screen w-screen">
        <Sidebar />
        <Home />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <EditorToolbar />
      {file.type === 'note' ? <NoteEditor /> : <SpreadsheetEditor />}
    </div>
  );
}
