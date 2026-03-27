import { Plus, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';

const TAB_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SheetTabs() {
  const { getActiveSpreadsheet, addSheet, removeSheet, renameSheet, setActiveSheet } = useAppStore();
  const sp = getActiveSpreadsheet();
  if (!sp) return null;
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  return (
    <div className="flex items-center h-[32px] px-3 bg-white border-t border-[#E5E7EB] shrink-0 gap-0.5">
      {sp.sheets.map((sh, i) => {
        const active = sh.id === sp.activeSheetId;
        return (
          <div key={sh.id} onClick={() => setActiveSheet(sh.id)} onDoubleClick={() => { setEditId(sh.id); setEditName(sh.name); }}
            className={`flex items-center gap-1.5 px-3 h-[26px] rounded-md text-[11px] cursor-pointer group transition-all duration-150
              ${active ? 'bg-[#F3F4F6] text-[#111827] font-semibold' : 'text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F9FAFB]'}`}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: TAB_COLORS[i % TAB_COLORS.length] }} />
            {editId === sh.id ? (
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                onBlur={() => { if (editName.trim()) renameSheet(sh.id, editName.trim()); setEditId(null); }}
                onKeyDown={e => { if (e.key === 'Enter') { if (editName.trim()) renameSheet(sh.id, editName.trim()); setEditId(null); } }}
                autoFocus className="bg-transparent text-[11px] outline-none w-14 font-semibold" spellCheck={false} />
            ) : <span>{sh.name}</span>}
            {sp.sheets.length > 1 && active && (
              <button onClick={e => { e.stopPropagation(); removeSheet(sh.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#FEE2E2] transition-all duration-150 cursor-pointer">
                <X size={9} />
              </button>
            )}
          </div>
        );
      })}
      <button onClick={addSheet}
        className="w-6 h-6 flex items-center justify-center rounded-md text-[#D1D5DB] hover:text-[#3B82F6] hover:bg-[#EFF6FF] transition-all duration-150 cursor-pointer ml-1">
        <Plus size={13} />
      </button>
      <div className="flex-1" />
      <span className="text-[10px] text-[#D1D5DB]">{sp.sheets.length} sayfa</span>
    </div>
  );
}
