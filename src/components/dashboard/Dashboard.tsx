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
      <div className="flex h-screen w-screen bg-[#F1F5F9]">
        <Sidebar />
        <Home />
      </div>
    );
  }

  // Spreadsheet has its own header/toolbar built in
  if (file.type === 'spreadsheet') {
    return (
      <div className="flex h-screen w-screen bg-[#F1F5F9]">
        <Sidebar />
        <SpreadsheetEditor />
      </div>
    );
  }

  // Notes use the shared EditorToolbar
  return (
    <div className="flex h-screen w-screen bg-[#F1F5F9]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <EditorToolbar />
        <NoteEditor />
      </div>
    </div>
  );
}
