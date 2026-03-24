import { FunctionSquare } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { colLabel } from '../../types';

export default function FormulaBar() {
  const { activeCell, isEditing, editValue, setEditValue, startEditing, stopEditing, getCell } = useAppStore();
  const ref = activeCell ? `${colLabel(activeCell.col)}${activeCell.row + 1}` : '';
  const cell = activeCell ? getCell(activeCell.row, activeCell.col) : undefined;
  const display = isEditing ? editValue : cell?.formula ?? cell?.value ?? '';

  return (
    <div className="flex items-center h-[36px] px-3 bg-white border-b border-[#E2E8F0] shrink-0 gap-2">
      <div className="flex items-center justify-center min-w-[56px] px-2 py-0.5 bg-[#F1F5F9] rounded-md border border-[#E2E8F0]">
        <span className="text-[11px] font-mono font-bold text-[#3B82F6]">{ref || '—'}</span>
      </div>
      <div className="w-6 h-6 rounded-md bg-[#ECFDF5] flex items-center justify-center">
        <FunctionSquare size={13} className="text-[#10B981]" />
      </div>
      <div className="w-px h-4 bg-[#E2E8F0]" />
      <input
        type="text" value={display}
        onChange={(e) => setEditValue(e.target.value)}
        onFocus={() => { if (!isEditing && activeCell) startEditing(); }}
        onKeyDown={(e) => { if (e.key === 'Enter') stopEditing(true); if (e.key === 'Escape') stopEditing(false); }}
        placeholder={activeCell ? 'Değer veya formül girin...' : 'Bir hücre seçin'}
        className="flex-1 bg-transparent text-[12px] text-[#0F172A] outline-none font-mono placeholder:text-[#CBD5E1]"
        spellCheck={false}
      />
    </div>
  );
}
