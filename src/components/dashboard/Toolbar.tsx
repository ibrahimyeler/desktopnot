import { Undo2, Redo2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Table, BarChart3, Image, Share2, PanelLeft, PanelRight, ChevronDown, Cloud, Loader2, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Toolbar() {
  const { docs, activeDocId, updateDocTitle, saveStatus, sidebarOpen, toggleSidebar, inspectorOpen, toggleInspector, undo, redo, undoStack, redoStack, activeCell, setCellFormat, getCell } = useAppStore();
  const doc = docs.find((d) => d.id === activeDocId);
  const cell = activeCell ? getCell(activeCell.row, activeCell.col) : undefined;
  const fmt = cell?.format ?? {};

  return (
    <div className="flex items-center h-[48px] px-3 bg-white border-b border-[#E2E8F0] shrink-0 gap-1">
      <Btn icon={PanelLeft} active={sidebarOpen} onClick={toggleSidebar} label="Kenar çubuğu" />
      <Sep />
      <div className="flex items-center gap-2 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center shadow-sm"><Sparkles size={12} className="text-white" /></div>
        <input type="text" value={doc?.title ?? ''} onChange={(e) => doc && updateDocTitle(doc.id, e.target.value)} className="bg-transparent text-[13px] font-semibold text-[#0F172A] outline-none px-1.5 py-1 rounded-lg hover:bg-[#F1F5F9] focus:bg-[#F1F5F9] focus:ring-2 focus:ring-[#3B82F6]/15 transition-all max-w-[220px]" spellCheck={false} />
        <SaveBadge status={saveStatus} />
      </div>
      <div className="flex-1" />
      <Btn icon={Undo2} disabled={!undoStack.length} onClick={undo} label="Geri al" />
      <Btn icon={Redo2} disabled={!redoStack.length} onClick={redo} label="İleri al" />
      <Sep />
      <Btn icon={Bold} active={fmt.bold} onClick={() => setCellFormat({ bold: !fmt.bold })} label="Kalın" />
      <Btn icon={Italic} active={fmt.italic} onClick={() => setCellFormat({ italic: !fmt.italic })} label="İtalik" />
      <Btn icon={Underline} active={fmt.underline} onClick={() => setCellFormat({ underline: !fmt.underline })} label="Altı çizili" />
      <Sep />
      <Btn icon={AlignLeft} active={fmt.align === 'left'} onClick={() => setCellFormat({ align: 'left' })} label="Sola hizala" />
      <Btn icon={AlignCenter} active={fmt.align === 'center'} onClick={() => setCellFormat({ align: 'center' })} label="Ortala" />
      <Btn icon={AlignRight} active={fmt.align === 'right'} onClick={() => setCellFormat({ align: 'right' })} label="Sağa hizala" />
      <Sep />
      <button className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-lg shadow-sm shadow-blue-500/20 hover:shadow-md transition-all cursor-pointer active:scale-[0.97]">
        <Share2 size={13} /> Paylaş
      </button>
      <Sep />
      <Btn icon={PanelRight} active={inspectorOpen} onClick={toggleInspector} label="Denetçi" />
    </div>
  );
}

function Btn({ icon: I, active, disabled, onClick, label, size = 16 }: { icon: React.ComponentType<{ size?: number }>; label: string; active?: boolean; disabled?: boolean; onClick?: () => void; size?: number }) {
  return (
    <button title={label} disabled={disabled} onClick={onClick} className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all ${active ? 'bg-[#EFF6FF] text-[#3B82F6]' : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'} ${disabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}`}>
      <I size={size} />
    </button>
  );
}

function Sep() { return <div className="w-px h-5 bg-[#E2E8F0] mx-1" />; }

function SaveBadge({ status }: { status: string }) {
  if (status === 'saved') return <span className="flex items-center gap-1 text-[11px] text-[#16A34A] font-semibold px-2 py-0.5 rounded-full bg-[#DCFCE7]"><Cloud size={10} /> Kaydedildi</span>;
  if (status === 'saving') return <span className="flex items-center gap-1 text-[11px] text-[#D97706] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7]"><Loader2 size={10} className="animate-spin" /> Kaydediliyor...</span>;
  return null;
}
