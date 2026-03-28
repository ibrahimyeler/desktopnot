import { ArrowLeft, Bold, Italic, Underline, List, ListOrdered, CheckSquare, Quote, Code, Minus, Type, ChevronDown, Star, MoreHorizontal, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Save, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { BlockType } from '../../types';

export default function EditorToolbar() {
  const { getActiveFile, updateFileTitle, toggleFavorite, goHome, activeCell, setCellFormat, getCell, addBlock, focusedBlockId, changeBlockType } = useAppStore();
  const file = getActiveFile();
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showBlockMenu) return;
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowBlockMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showBlockMenu]);

  if (!file) return null;

  const isNote = file.type === 'note';
  const isSpreadsheet = file.type === 'spreadsheet';
  const cell = activeCell ? getCell(activeCell.row, activeCell.col) : undefined;
  const fmt = cell?.format ?? {};

  const blockItems: { type: BlockType; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string; shortcut: string; color: string }[] = [
    { type: 'text', icon: Type, label: 'Metin', shortcut: '', color: '#64748B' },
    { type: 'heading1', icon: Heading1, label: 'Baslik 1', shortcut: '#', color: '#06B6D4' },
    { type: 'heading2', icon: Heading2, label: 'Baslik 2', shortcut: '##', color: '#2563EB' },
    { type: 'bulletList', icon: List, label: 'Madde Listesi', shortcut: '-', color: '#8B5CF6' },
    { type: 'numberedList', icon: ListOrdered, label: 'Numarali Liste', shortcut: '1.', color: '#3B82F6' },
    { type: 'checklist', icon: CheckSquare, label: 'Kontrol Listesi', shortcut: '[]', color: '#10B981' },
    { type: 'quote', icon: Quote, label: 'Alinti', shortcut: '>', color: '#8B5CF6' },
    { type: 'code', icon: Code, label: 'Kod Blogu', shortcut: '', color: '#0EA5E9' },
    { type: 'divider', icon: Minus, label: 'Ayirici', shortcut: '---', color: '#94A3B8' },
  ];

  return (
    <div className="flex items-center h-[52px] px-4 bg-white border-b border-[#E5E7EB] shrink-0">
      {/* Geri */}
      <button onClick={goHome} className="w-9 h-9 flex items-center justify-center rounded-xl text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#374151] transition-all cursor-pointer mr-3">
        <ArrowLeft size={18} />
      </button>

      {/* Dosya adi */}
      <div className="flex items-center gap-2 mr-4">
        <span className="text-[16px]">{file.icon ?? '📄'}</span>
        <input type="text" value={file.title} onChange={(e) => updateFileTitle(file.id, e.target.value)}
          className="bg-transparent text-[15px] font-bold text-[#0F172A] outline-none px-1 py-1 rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-all max-w-[220px] min-w-[100px]" spellCheck={false} />
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isSpreadsheet ? 'bg-[#ECFEFF] text-[#06B6D4]' : 'bg-[#FEF3C7] text-[#D97706]'}`}>
          {isSpreadsheet ? 'Tablo' : 'Not'}
        </span>
      </div>

      {isNote && (
        <>
          <div className="w-px h-6 bg-[#E5E7EB] mx-2" />

          {/* Geri/Ileri al */}
          <div className="flex items-center gap-0.5 mr-2">
            <ToolBtn icon={Undo2} onClick={() => document.execCommand('undo')} tip="Geri al" />
            <ToolBtn icon={Redo2} onClick={() => document.execCommand('redo')} tip="Ileri al" />
          </div>

          <div className="w-px h-6 bg-[#E5E7EB] mx-2" />

          {/* Yazi bicimleme */}
          <div className="flex items-center gap-0.5 mr-2">
            <ToolBtn icon={Bold} onClick={() => document.execCommand('bold')} tip="Kalin (Ctrl+B)" />
            <ToolBtn icon={Italic} onClick={() => document.execCommand('italic')} tip="Italik (Ctrl+I)" />
            <ToolBtn icon={Underline} onClick={() => document.execCommand('underline')} tip="Alti cizili (Ctrl+U)" />
          </div>

          <div className="w-px h-6 bg-[#E5E7EB] mx-2" />

          {/* Hizalama */}
          <div className="flex items-center gap-0.5 mr-2">
            <ToolBtn icon={AlignLeft} onClick={() => document.execCommand('justifyLeft')} tip="Sola hizala" />
            <ToolBtn icon={AlignCenter} onClick={() => document.execCommand('justifyCenter')} tip="Ortala" />
            <ToolBtn icon={AlignRight} onClick={() => document.execCommand('justifyRight')} tip="Saga hizala" />
          </div>

          <div className="w-px h-6 bg-[#E5E7EB] mx-2" />

          {/* Blok tipi */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="flex items-center gap-1.5 h-8 px-3 text-[12px] font-semibold text-[#374151] bg-[#F8FAFC] hover:bg-[#F3F4F6] rounded-lg transition-all cursor-pointer border border-[#E5E7EB]">
              <List size={13} className="text-[#06B6D4]" />
              Blok Ekle
              <ChevronDown size={10} className="text-[#9CA3AF]" />
            </button>
            {showBlockMenu && (
              <div className="absolute top-full left-0 mt-2 z-50 w-[220px] bg-white border border-[#E5E7EB] rounded-xl py-2 overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                <div className="px-3 py-1.5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Blok Turu</div>
                {blockItems.map(it => (
                  <button key={it.type} onClick={() => {
                    if (focusedBlockId) changeBlockType(focusedBlockId, it.type);
                    else addBlock(null, it.type);
                    setShowBlockMenu(false);
                  }} className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#374151] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${it.color}10` }}>
                      <it.icon size={14} style={{ color: it.color }} />
                    </div>
                    <span className="flex-1 font-medium">{it.label}</span>
                    {it.shortcut && <span className="text-[10px] text-[#CBD5E1] font-mono">{it.shortcut}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Tablo araclari */}
      {isSpreadsheet && (
        <>
          <div className="w-px h-6 bg-[#E5E7EB] mx-2" />
          <div className="flex items-center gap-0.5 mr-2">
            <ToolBtn icon={Bold} active={fmt.bold} onClick={() => setCellFormat({ bold: !fmt.bold })} tip="Kalin" />
            <ToolBtn icon={Italic} active={fmt.italic} onClick={() => setCellFormat({ italic: !fmt.italic })} tip="Italik" />
            <ToolBtn icon={Underline} active={fmt.underline} onClick={() => setCellFormat({ underline: !fmt.underline })} tip="Alti cizili" />
          </div>
          <div className="w-px h-6 bg-[#E5E7EB] mx-2" />
          <div className="flex items-center gap-0.5">
            <ToolBtn icon={AlignLeft} active={fmt.align === 'left'} onClick={() => setCellFormat({ align: 'left' })} tip="Sol" />
            <ToolBtn icon={AlignCenter} active={fmt.align === 'center'} onClick={() => setCellFormat({ align: 'center' })} tip="Orta" />
            <ToolBtn icon={AlignRight} active={fmt.align === 'right'} onClick={() => setCellFormat({ align: 'right' })} tip="Sag" />
          </div>
        </>
      )}

      <div className="flex-1" />

      {/* Sag taraf */}
      <div className="flex items-center gap-1.5">
        <SaveButton />
        <button onClick={() => toggleFavorite(file.id)} title="Favori"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-all cursor-pointer">
          <Star size={16} className={file.isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D1D5DB]'} />
        </button>
        <button title="Diger" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F3F4F6] hover:text-[#6B7280] transition-all cursor-pointer">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}

function SaveButton() {
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleSave]);

  return (
    <button onClick={handleSave} title="Kaydet (Ctrl+S)"
      className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
        saved
          ? 'bg-[#ECFEFF] text-[#06B6D4]'
          : 'bg-[#F8FAFC] text-[#374151] hover:bg-[#F3F4F6] border border-[#E5E7EB]'
      }`}>
      {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
      {saved ? 'Kaydedildi' : 'Kaydet'}
    </button>
  );
}

function ToolBtn({ icon: I, active, onClick, tip }: { icon: React.ComponentType<{ size?: number; className?: string }>; active?: boolean; onClick?: () => void; tip: string }) {
  return (
    <button title={tip} onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
        active ? 'bg-[#ECFEFF] text-[#06B6D4]' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#374151]'
      }`}>
      <I size={15} />
    </button>
  );
}
