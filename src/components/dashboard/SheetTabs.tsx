import { Plus, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';

const TAB_DOTS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SheetTabs() {
  const { getActiveSpreadsheet, addSheet, removeSheet, renameSheet, setActiveSheet } = useAppStore();
  const sp = getActiveSpreadsheet();
  if (!sp) return null;
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  return (
    <div className="flex items-center h-[34px] px-2 bg-[#F8FAFC] border-t border-[#E2E8F0] shrink-0 gap-1">
      {sp.sheets.map((sh, i) => {
        const active = sh.id === sp.activeSheetId;
        return (
          <div key={sh.id} onClick={() => setActiveSheet(sh.id)} onDoubleClick={() => { setEditId(sh.id); setEditName(sh.name); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] cursor-pointer group transition-all ${active ? 'bg-white text-[#0F172A] font-semibold shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:bg-white/60 border border-transparent'}`}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: TAB_DOTS[i % TAB_DOTS.length] }} />
            {editId === sh.id ? (
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} onBlur={() => { if (editName.trim()) renameSheet(sh.id, editName.trim()); setEditId(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { if (editName.trim()) renameSheet(sh.id, editName.trim()); setEditId(null); } }} autoFocus className="bg-transparent text-[11px] outline-none w-16 font-semibold" spellCheck={false} />
            ) : <span>{sh.name}</span>}
            {sp.sheets.length > 1 && active && (
              <button onClick={(e) => { e.stopPropagation(); removeSheet(sh.id); }} className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#FEE2E2] transition-all cursor-pointer"><X size={9} /></button>
            )}
          </div>
        );
      })}
      <button onClick={addSheet} className="w-6 h-6 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#EFF6FF] transition-colors cursor-pointer ml-0.5"><Plus size={13} /></button>
      <div className="flex-1" />
      <span className="text-[10px] text-[#CBD5E1]">{sp.sheets.length} sayfa</span>
    </div>
  );
}
