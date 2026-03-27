import { useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Plus, Check, X } from 'lucide-react';
import type { Block, BlockType } from '../../types';

export default function NoteEditor() {
  const { getActiveNote } = useAppStore();
  const note = getActiveNote();
  if (!note) return null;

  let numCounter = 0;
  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="px-10 py-10">
        {/* Bloklar */}
        <div className="space-y-[2px]">
          {note.blocks.map((block) => {
            if (block.type === 'numberedList') numCounter++; else numCounter = 0;
            return <BlockRow key={block.id} block={block} numIndex={block.type === 'numberedList' ? numCounter : 0} />;
          })}
        </div>

        {/* Alt bosluk — tiklaninca yeni blok */}
        <div className="h-40 cursor-text" onClick={() => {
          const lastBlock = note.blocks[note.blocks.length - 1];
          if (lastBlock && lastBlock.content.trim() === '' && lastBlock.type === 'text') {
            useAppStore.getState().setFocusedBlock(lastBlock.id);
          } else {
            useAppStore.getState().addBlock(lastBlock?.id ?? null, 'text');
          }
        }} />
      </div>
    </div>
  );
}

function BlockRow({ block, numIndex }: { block: Block; numIndex: number }) {
  const { addBlock, updateBlock, deleteBlock, changeBlockType, setFocusedBlock, focusedBlockId } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  const focused = focusedBlockId === block.id;
  const mountedRef = useRef(false);

  useEffect(() => {
    if (ref.current && !mountedRef.current) {
      ref.current.innerText = block.content;
      mountedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (ref.current && mountedRef.current) {
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

  // Gorsel
  if ((block.type as string) === 'image') {
    return (
      <div className="group relative my-3" onClick={() => setFocusedBlock(block.id)}>
        <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} className="w-6 h-6 flex items-center justify-center rounded-lg text-[#CBD5E1] hover:text-[#EF4444] hover:bg-[#FEF2F2] cursor-pointer"><X size={13} /></button>
        </div>
        {block.content ? (
          <img src={block.content} alt="" className="rounded-xl max-w-full h-auto shadow-sm" />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed border-[#E5E7EB] hover:border-[#06B6D4]/30 hover:bg-[#ECFEFF]/30 transition-all cursor-pointer">
            <span className="text-[13px] text-[#9CA3AF]">Gorsel eklemek icin tiklayin</span>
          </div>
        )}
      </div>
    );
  }

  // Ayirici
  if (block.type === 'divider') {
    return (
      <div className="group relative py-4" onClick={() => setFocusedBlock(block.id)}>
        <div className="h-px bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
      </div>
    );
  }

  const styles: Record<string, string> = {
    text: 'text-[15px] leading-[1.8] text-[#374151]',
    heading1: 'text-[26px] font-bold leading-[1.3] text-[#0F172A]',
    heading2: 'text-[20px] font-semibold leading-[1.35] text-[#0F172A]',
    heading3: 'text-[16px] font-semibold leading-[1.4] text-[#64748B]',
    bulletList: 'text-[15px] leading-[1.8] text-[#374151]',
    numberedList: 'text-[15px] leading-[1.8] text-[#374151]',
    checklist: 'text-[15px] leading-[1.8]',
    quote: 'text-[15px] leading-[1.8] text-[#64748B] italic',
    code: 'text-[13px] leading-[1.6] font-mono text-[#E2E8F0]',
  };

  const placeholders: Record<string, string> = {
    text: 'Bir seyler yazin...',
    heading1: 'Baslik 1',
    heading2: 'Baslik 2',
    heading3: 'Baslik 3',
    bulletList: 'Liste ogesi...',
    numberedList: 'Liste ogesi...',
    checklist: 'Gorev...',
    quote: 'Alinti...',
    code: '// Kod yazin...',
  };

  const prefix = block.type === 'bulletList' ? <span className="text-[#06B6D4] font-bold mr-2.5 select-none text-[18px] leading-[1.8]">•</span>
    : block.type === 'numberedList' ? <span className="text-[#06B6D4] font-semibold mr-2.5 select-none text-[14px] leading-[1.8]">{numIndex}.</span>
    : block.type === 'checklist' ? (
      <button onClick={() => updateBlock(block.id, { meta: { checked: !block.meta?.checked } })}
        className={`w-[18px] h-[18px] mt-[5px] mr-2.5 rounded-md flex items-center justify-center shrink-0 border-[1.5px] transition-all cursor-pointer ${
          block.meta?.checked ? 'bg-[#06B6D4] border-[#06B6D4] text-white' : 'border-[#D1D5DB] bg-white hover:border-[#06B6D4]/50'
        }`}>
        {block.meta?.checked && <Check size={11} strokeWidth={3} />}
      </button>
    ) : null;

  const isQuote = block.type === 'quote';
  const isCode = block.type === 'code';
  const isHeading = block.type.startsWith('heading');

  return (
    <div className="group flex items-start relative" onClick={() => setFocusedBlock(block.id)}>
      {/* Gutter — hover'da gorunur */}
      <div className="absolute -left-8 flex items-center gap-0.5 pt-[5px] opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={(e) => { e.stopPropagation(); addBlock(block.id, 'text'); }}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-[#D1D5DB] hover:text-[#06B6D4] hover:bg-[#ECFEFF] cursor-pointer transition-all">
          <Plus size={13} />
        </button>
      </div>

      {/* Icerik */}
      <div className={`flex-1 flex items-start rounded-lg transition-all ${
        isQuote ? 'border-l-[3px] border-[#06B6D4] pl-4 py-1.5 bg-[#ECFEFF]/30 rounded-l-none' : ''
      } ${isCode ? 'bg-[#1E293B] rounded-xl p-4 my-1' : ''} ${
        isHeading ? 'mt-4 mb-1' : ''
      }`}>
        {prefix}
        <div ref={ref} contentEditable suppressContentEditableWarning onInput={onInput} onKeyDown={onKeyDown}
          data-placeholder={placeholders[block.type]}
          className={`outline-none flex-1 min-h-[1.5em] cursor-text [&:empty::before]:content-[attr(data-placeholder)] [&:empty::before]:text-[#CBD5E1] [&:empty::before]:pointer-events-none ${styles[block.type]} ${block.meta?.checked ? 'line-through text-[#9CA3AF]' : ''}`}>
        </div>
      </div>
    </div>
  );
}
