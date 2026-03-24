import { useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { GripVertical, Plus, Check, ImagePlus, X } from 'lucide-react';
import type { Block, BlockType } from '../../types';

export default function NoteEditor() {
  const { getActiveNote } = useAppStore();
  const note = getActiveNote();
  if (!note) return null;

  let numCounter = 0;
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="px-16 py-10">
        {/* Bloklar */}
        <div className="space-y-[2px]">
          {note.blocks.map((block, idx) => {
            if (block.type === 'numberedList') numCounter++; else numCounter = 0;
            return <BlockRow key={block.id} block={block} numIndex={block.type === 'numberedList' ? numCounter : idx} />;
          })}
        </div>
      </div>
    </div>
  );
}

function BlockRow({ block, numIndex }: { block: Block; numIndex: number }) {
  const { addBlock, updateBlock, deleteBlock, changeBlockType, setFocusedBlock, focusedBlockId } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  const focused = focusedBlockId === block.id;
  const mountedRef = useRef(false);

  // İlk mount'ta içeriği set et
  useEffect(() => {
    if (ref.current && !mountedRef.current) {
      ref.current.innerText = block.content;
      mountedRef.current = true;
    }
  }, []);

  // Blok tipi değişince içeriği güncelle
  useEffect(() => {
    if (ref.current && mountedRef.current) {
      // Sadece dışarıdan değiştiğinde (tip değişimi vb.)
      if (ref.current.innerText !== block.content && document.activeElement !== ref.current) {
        ref.current.innerText = block.content;
      }
    }
  }, [block.type, block.content]);

  useEffect(() => {
    if (focused && ref.current && document.activeElement !== ref.current) {
      ref.current.focus();
      const sel = window.getSelection();
      if (sel && ref.current.childNodes.length) { sel.selectAllChildren(ref.current); sel.collapseToEnd(); }
    }
  }, [focused]);

  const onInput = () => { if (ref.current) updateBlock(block.id, { content: ref.current.innerText }); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const text = ref.current?.innerText ?? '';
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!text && (block.type === 'bulletList' || block.type === 'numberedList' || block.type === 'checklist')) {
        changeBlockType(block.id, 'text');
      } else {
        const nextType = (block.type === 'bulletList' || block.type === 'numberedList') ? block.type : block.type === 'checklist' ? 'checklist' : 'text';
        addBlock(block.id, nextType, '', block.type === 'checklist' ? { checked: false } : undefined);
      }
    }
    if (e.key === 'Backspace' && !text) { e.preventDefault(); if (block.type !== 'text') changeBlockType(block.id, 'text'); else deleteBlock(block.id); }
    if (e.key === ' ' && text && block.type === 'text') {
      const map: Record<string, BlockType> = { '#': 'heading1', '##': 'heading2', '###': 'heading3', '-': 'bulletList', '*': 'bulletList', '1.': 'numberedList', '[]': 'checklist', '>': 'quote', '---': 'divider' };
      if (map[text]) { e.preventDefault(); updateBlock(block.id, { content: '' }); changeBlockType(block.id, map[text]); }
    }
  };

  // Görsel bloğu
  if ((block.type as string) === 'image') {
    return (
      <div className="group relative my-3" onClick={() => setFocusedBlock(block.id)}>
        <div className="flex items-center gap-px pt-1 mr-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity absolute -left-10 top-2">
          <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="w-5 h-5 flex items-center justify-center rounded text-[#CBD5E1] hover:text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer"><X size={13} /></button>
        </div>
        {block.content ? (
          <img src={block.content} alt="" className="rounded-xl max-w-full h-auto shadow-sm" />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed border-[#E2E8F0] hover:border-[#3B82F6]/30 hover:bg-[#F8FAFC] transition-all cursor-pointer">
            <ImagePlus size={24} className="text-[#94A3B8] mb-2" />
            <span className="text-[13px] text-[#94A3B8]">Görsel eklemek için tıklayın</span>
          </div>
        )}
      </div>
    );
  }

  // Ayırıcı bloğu
  if (block.type === 'divider') {
    return (
      <div className="group relative py-3" onClick={() => setFocusedBlock(block.id)}>
        <div className="h-px bg-gradient-to-r from-transparent via-[#E2E8F0] to-transparent" />
      </div>
    );
  }

  const styles: Record<string, string> = {
    text: 'text-[15px] leading-[1.75] text-[#0F172A]',
    heading1: 'text-[24px] font-bold leading-[1.3] text-[#0F172A]',
    heading2: 'text-[20px] font-semibold leading-[1.35] text-[#0F172A]',
    heading3: 'text-[16px] font-semibold leading-[1.4] text-[#64748B]',
    bulletList: 'text-[15px] leading-[1.75] text-[#0F172A]',
    numberedList: 'text-[15px] leading-[1.75] text-[#0F172A]',
    checklist: 'text-[15px] leading-[1.75]',
    quote: 'text-[15px] leading-[1.75] text-[#64748B] italic',
    code: 'text-[13px] leading-[1.6] font-mono text-[#E2E8F0]',
  };

  const borders: Record<string, string> = { heading1: 'border-l-[3px] border-[#3B82F6] pl-3 mt-6 mb-1', heading2: 'border-l-[3px] border-[#6366F1] pl-3 mt-4 mb-1', heading3: 'border-l-[3px] border-[#10B981] pl-3 mt-3' };
  const placeholders: Record<string, string> = { text: 'Bir şeyler yazın...', heading1: 'Başlık 1', heading2: 'Başlık 2', heading3: 'Başlık 3', bulletList: 'Liste öğesi...', numberedList: 'Liste öğesi...', checklist: 'Görev...', quote: 'Alıntı...', code: '// Kod yazın...' };

  const wrapClass = borders[block.type] ?? '';
  const isQuote = block.type === 'quote';
  const isCode = block.type === 'code';

  const prefix = block.type === 'bulletList' ? <span className="text-[#8B5CF6] font-bold mr-2 select-none text-[18px] leading-[1.75]">•</span>
    : block.type === 'numberedList' ? <span className="text-[#3B82F6] font-semibold mr-2 select-none">{numIndex}.</span>
    : block.type === 'checklist' ? (
      <button onClick={() => updateBlock(block.id, { meta: { checked: !block.meta?.checked } })} className={`w-[18px] h-[18px] mt-[4px] mr-2.5 rounded-[5px] flex items-center justify-center shrink-0 border-[1.5px] transition-all cursor-pointer ${block.meta?.checked ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-sm shadow-blue-500/20' : 'border-[#CBD5E1] bg-white hover:border-[#3B82F6]/50'}`}>
        {block.meta?.checked && <Check size={11} strokeWidth={3} />}
      </button>
    ) : null;

  return (
    <div className="group flex items-start" onClick={() => setFocusedBlock(block.id)}>
      {/* Gutter */}
      <div className="flex items-center gap-px pt-[5px] mr-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); addBlock(block.id, 'text'); }} className="w-5 h-5 flex items-center justify-center rounded text-[#CBD5E1] hover:text-[#3B82F6] hover:bg-[#EFF6FF] cursor-pointer"><Plus size={13} /></button>
        <button className="w-5 h-5 flex items-center justify-center rounded text-[#CBD5E1] hover:text-[#64748B] hover:bg-[#F1F5F9] cursor-grab"><GripVertical size={13} /></button>
      </div>

      {/* İçerik */}
      <div className={`flex-1 flex items-start ${wrapClass} ${isQuote ? 'border-l-[3px] border-[#8B5CF6] pl-4 py-1 bg-[#FAF5FF] rounded-r-lg' : ''} ${isCode ? 'bg-[#1E293B] rounded-xl p-4 my-1' : ''}`}>
        {prefix}
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={onInput} onKeyDown={onKeyDown}
          data-placeholder={placeholders[block.type]}
          className={`outline-none flex-1 min-h-[1.5em] cursor-text [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-[#CBD5E1] [&:empty::before]:pointer-events-none ${styles[block.type]} ${block.meta?.checked ? 'line-through text-[#94A3B8]' : ''}`}>
        </div>
      </div>
    </div>
  );
}
