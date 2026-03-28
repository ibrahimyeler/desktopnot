import { ArrowLeft, Plus, Filter, ArrowUpDown, Copy, Download, MoreHorizontal, Star, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Paintbrush, Highlighter } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import { colLabel } from '../../types';
import Grid from './Grid';
import SheetTabs from './SheetTabs';

const TEXT_COLORS = ['#111827', '#374151', '#6B7280', '#DC2626', '#EA580C', '#D97706', '#16A34A', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const BG_COLORS = ['transparent', '#FEE2E2', '#FFEDD5', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#EDE9FE', '#FCE7F3', '#F3F4F6', '#E5E7EB', '#FEF9C3', '#CCFBF1'];

export default function SpreadsheetEditor() {
  const { getActiveSpreadsheet, getActiveSheet, updateFileTitle, toggleFavorite, goHome, activeCell, getCell, setCellFormat, isEditing, editValue, setEditValue, startEditing, stopEditing } = useAppStore();
  const sp = getActiveSpreadsheet();
  const sheet = getActiveSheet();
  const [openDrop, setOpenDrop] = useState<string | null>(null);

  if (!sp) return null;

  const cell = activeCell ? getCell(activeCell.row, activeCell.col) : undefined;
  const fmt = cell?.format ?? {};
  const cellRef = activeCell ? `${colLabel(activeCell.col)}${activeCell.row + 1}` : '';
  const display = isEditing ? editValue : cell?.formula ?? cell?.value ?? '';

  // Row count
  const rowCount = Object.keys(sheet?.cells ?? {}).reduce((max, k) => {
    const r = parseInt(k.split(':')[0]);
    return r > max ? r : max;
  }, 0) + 1;

  const timeAgo = 'Az önce güncellendi';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* ═══ TABLE HEADER ═══ */}
      <div className="flex items-center justify-between h-[72px] px-6 bg-white border-b border-[#E5E7EB] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={goHome} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#111827] transition-all cursor-pointer">
            <ArrowLeft size={17} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px]">{sp.icon}</span>
              <input type="text" value={sp.title} onChange={e => updateFileTitle(sp.id, e.target.value)}
                className="bg-transparent text-[16px] font-semibold text-[#111827] outline-none hover:bg-[#F9FAFB] focus:bg-[#F9FAFB] px-1.5 py-0.5 rounded-lg transition-all" spellCheck={false} />
            </div>
            <div className="text-[12px] text-[#9CA3AF] ml-9">{rowCount} satır · {timeAgo}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-9 px-4 bg-[#3B82F6] text-white text-[13px] font-semibold rounded-lg hover:bg-[#2563EB] transition-all cursor-pointer shadow-sm">
            <Plus size={14} />Add Row
          </button>
          <button className="flex items-center gap-1.5 h-9 px-3 border border-[#E5E7EB] text-[13px] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-all cursor-pointer">
            <Plus size={14} />Column
          </button>
          <button className="h-9 px-3 border border-[#E5E7EB] text-[13px] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-all cursor-pointer flex items-center gap-1.5">
            <Filter size={13} />Filter
          </button>
          <button className="h-9 px-3 border border-[#E5E7EB] text-[13px] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-all cursor-pointer flex items-center gap-1.5">
            <ArrowUpDown size={13} />Sort
          </button>
          <div className="w-px h-5 bg-[#E5E7EB] mx-1" />
          <button onClick={() => toggleFavorite(sp.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-all cursor-pointer">
            <Star size={15} className={sp.isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D1D5DB]'} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-all cursor-pointer text-[#9CA3AF]">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* ═══ TOOLBAR ═══ */}
      <div className="flex items-center h-12 px-6 bg-white border-b border-[#E5E7EB] shrink-0 gap-2">
        {/* Cell ref + Formula */}
        <div className="flex items-center gap-2 min-w-[280px]">
          <div className="flex items-center justify-center min-w-[52px] h-7 px-2 bg-[#F3F4F6] rounded-md border border-[#E5E7EB]">
            <span className="text-[11px] font-mono font-bold text-[#3B82F6]">{cellRef || '—'}</span>
          </div>
          <div className="w-px h-4 bg-[#E5E7EB]" />
          <input type="text" value={display}
            onChange={e => setEditValue(e.target.value)}
            onFocus={() => { if (!isEditing && activeCell) startEditing(); }}
            onKeyDown={e => { if (e.key === 'Enter') stopEditing(true); if (e.key === 'Escape') stopEditing(false); }}
            placeholder={activeCell ? 'Değer veya formül...' : 'Bir hücre seçin'}
            className="flex-1 h-7 bg-transparent text-[12px] text-[#111827] outline-none font-mono placeholder:text-[#D1D5DB]" spellCheck={false} />
        </div>

        <div className="w-px h-5 bg-[#E5E7EB]" />

        {/* Cell formatting */}
        <div className="flex items-center gap-0.5">
          <TbBtn icon={Bold} active={fmt.bold} onClick={() => setCellFormat({ bold: !fmt.bold })} tip="Bold" />
          <TbBtn icon={Italic} active={fmt.italic} onClick={() => setCellFormat({ italic: !fmt.italic })} tip="Italic" />
          <TbBtn icon={Underline} active={fmt.underline} onClick={() => setCellFormat({ underline: !fmt.underline })} tip="Underline" />
        </div>

        <div className="w-px h-5 bg-[#E5E7EB]" />

        <div className="flex items-center gap-0.5">
          <TbBtn icon={AlignLeft} active={fmt.align === 'left'} onClick={() => setCellFormat({ align: 'left' })} tip="Left" />
          <TbBtn icon={AlignCenter} active={fmt.align === 'center'} onClick={() => setCellFormat({ align: 'center' })} tip="Center" />
          <TbBtn icon={AlignRight} active={fmt.align === 'right'} onClick={() => setCellFormat({ align: 'right' })} tip="Right" />
        </div>

        <div className="w-px h-5 bg-[#E5E7EB]" />

        {/* Color pickers */}
        <ColorDrop icon={Paintbrush} tip="Text color" colors={TEXT_COLORS} open={openDrop === 'tc'} onToggle={() => setOpenDrop(openDrop === 'tc' ? null : 'tc')}
          onSelect={c => { setCellFormat({ textColor: c }); setOpenDrop(null); }} accent="#3B82F6" />
        <ColorDrop icon={Highlighter} tip="Fill color" colors={BG_COLORS} open={openDrop === 'fc'} onToggle={() => setOpenDrop(openDrop === 'fc' ? null : 'fc')}
          onSelect={c => { setCellFormat({ fillColor: c === 'transparent' ? undefined : c }); setOpenDrop(null); }} accent="#F59E0B" />

        <div className="flex-1" />

        {/* Right side actions */}
        <button className="flex items-center gap-1.5 h-7 px-2.5 text-[11px] text-[#9CA3AF] hover:text-[#6B7280] rounded-md hover:bg-[#F3F4F6] transition-all cursor-pointer">
          <Copy size={12} />Duplicate
        </button>
        <button className="flex items-center gap-1.5 h-7 px-2.5 text-[11px] text-[#9CA3AF] hover:text-[#6B7280] rounded-md hover:bg-[#F3F4F6] transition-all cursor-pointer">
          <Download size={12} />Export
        </button>
      </div>

      {/* ═══ GRID ═══ */}
      <div className="flex-1 min-h-0">
        <Grid />
      </div>

      {/* ═══ SHEET TABS ═══ */}
      <SheetTabs />
    </div>
  );
}

// ── Toolbar Button ──
function TbBtn({ icon: I, active, onClick, tip }: { icon: React.ComponentType<{ size?: number }>; active?: boolean; onClick?: () => void; tip: string }) {
  return (
    <button title={tip} onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded-md transition-all duration-150 cursor-pointer
        ${active ? 'bg-[#EFF6FF] text-[#3B82F6]' : 'text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151]'}`}>
      <I size={14} />
    </button>
  );
}

// ── Color Dropdown ──
function ColorDrop({ icon: I, tip, colors, open, onToggle, onSelect, accent }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; tip: string; colors: string[]; open: boolean; onToggle: () => void; onSelect: (c: string) => void; accent: string;
}) {
  return (
    <div className="relative">
      <button title={tip} onClick={onToggle}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#F3F4F6] transition-all duration-150 cursor-pointer">
        <I size={14} style={{ color: accent }} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-20 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-3 w-[180px]">
            <div className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">{tip}</div>
            <div className="grid grid-cols-6 gap-1.5">
              {colors.map(c => (
                <button key={c} onClick={() => onSelect(c)}
                  className="w-6 h-6 rounded-lg border border-[#E5E7EB] cursor-pointer hover:scale-110 hover:shadow-md transition-all duration-150"
                  style={{
                    backgroundColor: c === 'transparent' ? '#fff' : c,
                    backgroundImage: c === 'transparent' ? 'linear-gradient(45deg,#f3f4f6 25%,transparent 25%,transparent 75%,#f3f4f6 75%),linear-gradient(45deg,#f3f4f6 25%,transparent 25%,transparent 75%,#f3f4f6 75%)' : undefined,
                    backgroundSize: c === 'transparent' ? '6px 6px' : undefined,
                    backgroundPosition: c === 'transparent' ? '0 0,3px 3px' : undefined,
                  }} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
