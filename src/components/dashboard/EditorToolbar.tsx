import { ArrowLeft, Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, CheckSquare, Heading1, Heading2, Heading3, Quote, Code, Minus, ImagePlus, Link2, Undo2, Redo2, Type, ChevronDown, Paintbrush, Highlighter, Star, MoreHorizontal, Printer, Download, Eraser, SeparatorHorizontal, Indent, Outdent } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState, createContext, useContext, useEffect, useRef } from 'react';
import type { BlockType } from '../../types';

const MenuCtx = createContext<{ open: string | null; setOpen: (id: string | null) => void }>({ open: null, setOpen: () => {} });

const TEXT_COLORS = ['#0F172A', '#334155', '#64748B', '#DC2626', '#EA580C', '#D97706', '#16A34A', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
const BG_COLORS = ['transparent', '#FEE2E2', '#FFEDD5', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#EDE9FE', '#FCE7F3', '#F1F5F9', '#E2E8F0', '#FEF9C3', '#CCFBF1'];

export default function EditorToolbar() {
  const { getActiveFile, updateFileTitle, toggleFavorite, goHome, activeCell, setCellFormat, getCell, addBlock, focusedBlockId } = useAppStore();
  const file = getActiveFile();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenu) return;
    const handler = (e: MouseEvent) => { if (barRef.current && !barRef.current.contains(e.target as Node)) setOpenMenu(null); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  if (!file) return null;

  const isNote = file.type === 'note';
  const isSpreadsheet = file.type === 'spreadsheet';
  const cell = activeCell ? getCell(activeCell.row, activeCell.col) : undefined;
  const fmt = cell?.format ?? {};
  const icon = file.icon ?? '📄';
  const accent = icon === '📕' ? '#DC2626' : icon === '📙' ? '#EA580C' : icon === '📑' ? '#8B5CF6' : icon === '📃' ? '#2563EB' : icon === '🖼️' ? '#EC4899' : isSpreadsheet ? '#10B981' : '#3B82F6';
  const typeLabel = isSpreadsheet ? 'Tablo' : icon === '📕' ? 'PDF' : icon === '📙' ? 'Sunum' : icon === '📑' ? 'MD' : icon === '📃' ? 'Word' : icon === '🖼️' ? 'Görsel' : 'Not';

  return (
    <MenuCtx.Provider value={{ open: openMenu, setOpen: setOpenMenu }}>
    <div ref={barRef} className="flex items-center h-[44px] px-2.5 bg-white border-b border-[#E2E8F0] shrink-0 gap-0.5">
      {/* Geri */}
      <button onClick={goHome} title="Geri" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all cursor-pointer">
        <ArrowLeft size={16} />
      </button>

      <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

      {/* Dosya */}
      <span className="text-[15px] shrink-0">{icon}</span>
      <input type="text" value={file.title} onChange={(e) => updateFileTitle(file.id, e.target.value)} className="bg-transparent text-[13px] font-semibold text-[#0F172A] outline-none px-1.5 py-1 rounded-lg hover:bg-[#F8FAFC] focus:bg-[#F8FAFC] transition-all max-w-[180px] min-w-[80px]" spellCheck={false} />
      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: accent, backgroundColor: `${accent}15` }}>{typeLabel}</span>

      <div className="w-px h-5 bg-[#E2E8F0] mx-1.5" />

      {/* Not araçları */}
      {isNote && (
        <>
          <Group>
            <Btn icon={Undo2} onClick={() => document.execCommand('undo')} tip="Geri al" />
            <Btn icon={Redo2} onClick={() => document.execCommand('redo')} tip="İleri al" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <FontSizeDrop />
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <Group>
            <Btn icon={Bold} onClick={() => document.execCommand('bold')} tip="Kalın" color="#0F172A" />
            <Btn icon={Italic} onClick={() => document.execCommand('italic')} tip="İtalik" color="#0F172A" />
            <Btn icon={Underline} onClick={() => document.execCommand('underline')} tip="Altı çizili" color="#0F172A" />
            <Btn icon={Strikethrough} onClick={() => document.execCommand('strikeThrough')} tip="Üstü çizili" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <Group>
            <ColorDrop icon={Paintbrush} tip="Yazı rengi" colors={TEXT_COLORS} command="foreColor" accent="#3B82F6" />
            <ColorDrop icon={Highlighter} tip="Vurgu rengi" colors={BG_COLORS} command="hiliteColor" accent="#F59E0B" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <Group>
            <Btn icon={AlignLeft} onClick={() => document.execCommand('justifyLeft')} tip="Sol" />
            <Btn icon={AlignCenter} onClick={() => document.execCommand('justifyCenter')} tip="Orta" />
            <Btn icon={AlignRight} onClick={() => document.execCommand('justifyRight')} tip="Sağ" />
            <Btn icon={AlignJustify} onClick={() => document.execCommand('justifyFull')} tip="Yasla" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <Group>
            <Btn icon={Indent} onClick={() => document.execCommand('indent')} tip="Girinti artır" />
            <Btn icon={Outdent} onClick={() => document.execCommand('outdent')} tip="Girinti azalt" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <BlockTypeDrop />
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <Group>
            <Btn icon={ImagePlus} onClick={() => addBlock(focusedBlockId, 'image' as BlockType)} tip="Görsel" color="#EC4899" />
            <Btn icon={Link2} onClick={() => { const u = prompt('Bağlantı URL:'); if (u) document.execCommand('createLink', false, u); }} tip="Bağlantı" color="#6366F1" />
            <Btn icon={SeparatorHorizontal} onClick={() => addBlock(focusedBlockId, 'divider')} tip="Ayırıcı" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />

          <Btn icon={Eraser} onClick={() => document.execCommand('removeFormat')} tip="Biçimi temizle" />
        </>
      )}

      {/* Tablo araçları */}
      {isSpreadsheet && (
        <>
          <Group>
            <Btn icon={Bold} active={fmt.bold} onClick={() => setCellFormat({ bold: !fmt.bold })} tip="Kalın" color="#0F172A" />
            <Btn icon={Italic} active={fmt.italic} onClick={() => setCellFormat({ italic: !fmt.italic })} tip="İtalik" color="#0F172A" />
            <Btn icon={Underline} active={fmt.underline} onClick={() => setCellFormat({ underline: !fmt.underline })} tip="Altı çizili" color="#0F172A" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />
          <Group>
            <Btn icon={AlignLeft} active={fmt.align === 'left'} onClick={() => setCellFormat({ align: 'left' })} tip="Sol" />
            <Btn icon={AlignCenter} active={fmt.align === 'center'} onClick={() => setCellFormat({ align: 'center' })} tip="Orta" />
            <Btn icon={AlignRight} active={fmt.align === 'right'} onClick={() => setCellFormat({ align: 'right' })} tip="Sağ" />
          </Group>
          <div className="w-px h-5 bg-[#E2E8F0] mx-1" />
          <Group>
            <ColorDrop icon={Paintbrush} tip="Yazı rengi" colors={TEXT_COLORS} command="textColor" onSelect={(c) => setCellFormat({ textColor: c })} accent="#3B82F6" />
            <ColorDrop icon={Highlighter} tip="Arka plan" colors={BG_COLORS} command="fillColor" onSelect={(c) => setCellFormat({ fillColor: c === 'transparent' ? undefined : c })} accent="#F59E0B" />
          </Group>
        </>
      )}

      <div className="flex-1" />

      {/* Sağ */}
      <Btn icon={Star} active={file.isFavorite} onClick={() => toggleFavorite(file.id)} tip="Favori" activeColor="#F59E0B" />
      <Btn icon={Printer} onClick={() => window.print()} tip="Yazdır" />
      <Btn icon={Download} tip="İndir" />
      <button title="Diğer" className="w-8 h-8 flex items-center justify-center rounded-lg text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#64748B] transition-all cursor-pointer">
        <MoreHorizontal size={16} />
      </button>
    </div>
    </MenuCtx.Provider>
  );
}

// Araç grubu — arka planlı
function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center bg-[#F8FAFC] rounded-lg p-0.5 gap-0.5">{children}</div>;
}

// Buton
function Btn({ icon: I, active, onClick, tip, color, activeColor }: { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; active?: boolean; onClick?: () => void; tip: string; color?: string; activeColor?: string }) {
  return (
    <button title={tip} onClick={onClick} className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer ${active ? 'bg-white shadow-sm' : 'hover:bg-white hover:shadow-sm'}`}>
      <I size={15} style={{ color: active && activeColor ? activeColor : active ? '#3B82F6' : color ?? '#64748B' }} />
    </button>
  );
}

// Font boyut dropdown
function FontSizeDrop() {
  const { open: openMenu, setOpen: setOpenMenu } = useContext(MenuCtx);
  const open = openMenu === 'fontSize';
  const sizes = [
    { label: 'Küçük', value: '2', preview: 'text-[11px]' },
    { label: 'Normal', value: '3', preview: 'text-[13px]' },
    { label: 'Orta', value: '4', preview: 'text-[15px]' },
    { label: 'Büyük', value: '5', preview: 'text-[18px]' },
    { label: 'Çok büyük', value: '6', preview: 'text-[22px]' },
  ];
  return (
    <div className="relative">
      <button onClick={() => setOpenMenu(open ? null : 'fontSize')} className="flex items-center gap-1 h-7 px-2 text-[11px] font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-white hover:shadow-sm rounded-lg transition-all cursor-pointer">
        <Type size={13} /> Boyut <ChevronDown size={9} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-[140px] bg-white border border-[#E2E8F0] rounded-xl shadow-xl shadow-black/[0.08] py-1.5">
          {sizes.map((s) => (
            <button key={s.value} onClick={() => { document.execCommand('fontSize', false, s.value); setOpenMenu(null); }} className="w-full flex items-center justify-between px-3 py-1.5 hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <span className={`font-medium text-[#334155] ${s.preview}`}>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Blok tipi dropdown
function BlockTypeDrop() {
  const { addBlock, focusedBlockId, changeBlockType } = useAppStore();
  const { open: openMenu, setOpen: setOpenMenu } = useContext(MenuCtx);
  const open = openMenu === 'blockType';
  const items: { type: BlockType; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string; color: string }[] = [
    { type: 'text', icon: Type, label: 'Metin', color: '#64748B' },
    { type: 'heading1', icon: Heading1, label: 'Başlık 1', color: '#3B82F6' },
    { type: 'heading2', icon: Heading2, label: 'Başlık 2', color: '#6366F1' },
    { type: 'heading3', icon: Heading3, label: 'Başlık 3', color: '#10B981' },
    { type: 'bulletList', icon: List, label: 'Madde listesi', color: '#8B5CF6' },
    { type: 'numberedList', icon: ListOrdered, label: 'Numaralı liste', color: '#3B82F6' },
    { type: 'checklist', icon: CheckSquare, label: 'Kontrol listesi', color: '#16A34A' },
    { type: 'quote', icon: Quote, label: 'Alıntı', color: '#8B5CF6' },
    { type: 'code', icon: Code, label: 'Kod bloğu', color: '#0EA5E9' },
    { type: 'divider', icon: Minus, label: 'Ayırıcı', color: '#94A3B8' },
  ];
  return (
    <div className="relative">
      <button onClick={() => setOpenMenu(open ? null : 'blockType')} className="flex items-center gap-1 h-7 px-2 text-[11px] font-semibold text-[#64748B] bg-[#F8FAFC] hover:bg-white hover:shadow-sm rounded-lg transition-all cursor-pointer">
        Ekle <ChevronDown size={9} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-[180px] bg-white border border-[#E2E8F0] rounded-xl shadow-xl shadow-black/[0.08] py-1.5">
          {items.map((it) => (
            <button key={it.type} onClick={() => { if (focusedBlockId) changeBlockType(focusedBlockId, it.type); else addBlock(null, it.type); setOpenMenu(null); }} className="w-full flex items-center gap-2.5 px-3 py-[6px] text-[12px] text-[#334155] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
              <it.icon size={14} style={{ color: it.color }} /> {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Renk dropdown
function ColorDrop({ icon: I, tip, colors, command, onSelect, accent }: { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>; tip: string; colors: string[]; command: string; onSelect?: (c: string) => void; accent?: string }) {
  const menuId = `color-${command}`;
  const { open: openMenu, setOpen: setOpenMenu } = useContext(MenuCtx);
  const open = openMenu === menuId;
  return (
    <div className="relative">
      <button title={tip} onClick={() => setOpenMenu(open ? null : menuId)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all cursor-pointer">
        <I size={15} style={{ color: accent ?? '#64748B' }} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 z-50 bg-white border border-[#E2E8F0] rounded-xl shadow-xl shadow-black/[0.08] p-3 w-[192px]">
          <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2.5">{tip}</div>
          <div className="grid grid-cols-6 gap-2">
            {colors.map((c) => (
              <button key={c} onClick={() => { if (onSelect) onSelect(c); else document.execCommand(command, false, c === 'transparent' ? 'transparent' : c); setOpenMenu(null); }}
                className="w-6 h-6 rounded-lg border border-[#E2E8F0] cursor-pointer hover:scale-110 hover:shadow-md transition-all"
                style={{ backgroundColor: c === 'transparent' ? '#fff' : c, backgroundImage: c === 'transparent' ? 'linear-gradient(45deg,#f1f5f9 25%,transparent 25%,transparent 75%,#f1f5f9 75%),linear-gradient(45deg,#f1f5f9 25%,transparent 25%,transparent 75%,#f1f5f9 75%)' : undefined, backgroundSize: c === 'transparent' ? '6px 6px' : undefined, backgroundPosition: c === 'transparent' ? '0 0,3px 3px' : undefined }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
