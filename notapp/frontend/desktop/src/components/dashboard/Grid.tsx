import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { colLabel, cellKey } from '../../types';

const COL_W = 120;
const ROW_H = 32;
const HDR_H = 28;
const ROW_HDR_W = 48;
const ROWS = 500;
const COLS = 26;
const OVER = 4;

export default function Grid() {
  const ref = useRef<HTMLDivElement>(null);
  const [scroll, setScroll] = useState({ top: 0, left: 0 });
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selecting, setSelecting] = useState(false);
  const { activeCell, selection, isEditing, editValue, setActiveCell, setSelection, startEditing, stopEditing, setEditValue, setCellValue, getActiveSheet } = useAppStore();
  const sheet = getActiveSheet();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new ResizeObserver((e) => { const { width, height } = e[0].contentRect; setSize({ w: width, h: height }); });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const colPos = useMemo(() => { const p = [0]; for (let i = 0; i < COLS; i++) p.push(p[i] + (sheet?.colWidths[i] ?? COL_W)); return p; }, [sheet]);
  const totalW = colPos[COLS];
  const totalH = ROWS * ROW_H;
  const r0 = Math.max(0, Math.floor(scroll.top / ROW_H) - OVER);
  const r1 = Math.min(ROWS - 1, Math.ceil((scroll.top + size.h) / ROW_H) + OVER);
  const c0 = useMemo(() => { let c = 0; while (c < COLS && colPos[c + 1] < scroll.left) c++; return Math.max(0, c - OVER); }, [scroll.left, colPos]);
  const c1 = useMemo(() => { let c = c0; while (c < COLS && colPos[c] < scroll.left + size.w) c++; return Math.min(COLS - 1, c + OVER); }, [scroll.left, size.w, colPos, c0]);

  const onScroll = useCallback(() => { const el = ref.current; if (el) setScroll({ top: el.scrollTop, left: el.scrollLeft }); }, []);

  const mouseDown = useCallback((r: number, c: number, e: React.MouseEvent) => {
    if (e.detail === 2) return;
    if (isEditing) stopEditing(true);
    setActiveCell({ row: r, col: c });
    setSelecting(true);
  }, [isEditing, stopEditing, setActiveCell]);

  const mouseMove = useCallback((r: number, c: number) => {
    if (!selecting || !activeCell) return;
    setSelection({ start: activeCell, end: { row: r, col: c } });
  }, [selecting, activeCell, setSelection]);

  useEffect(() => { const up = () => setSelecting(false); window.addEventListener('mouseup', up); return () => window.removeEventListener('mouseup', up); }, []);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      if (!activeCell) return;
      if (isEditing) {
        if (e.key === 'Enter') { e.preventDefault(); stopEditing(true); setActiveCell({ row: activeCell.row + 1, col: activeCell.col }); }
        else if (e.key === 'Escape') stopEditing(false);
        else if (e.key === 'Tab') { e.preventDefault(); stopEditing(true); setActiveCell({ row: activeCell.row, col: Math.min(activeCell.col + 1, COLS - 1) }); }
        return;
      }
      const { row, col } = activeCell;
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveCell({ row: Math.max(0, row - 1), col }); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActiveCell({ row: Math.min(ROWS - 1, row + 1), col }); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setActiveCell({ row, col: Math.max(0, col - 1) }); }
      else if (e.key === 'ArrowRight' || e.key === 'Tab') { e.preventDefault(); setActiveCell({ row, col: Math.min(COLS - 1, col + 1) }); }
      else if (e.key === 'Enter') { e.preventDefault(); startEditing(); }
      else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); setCellValue(row, col, ''); }
      else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) startEditing(e.key);
    };
    window.addEventListener('keydown', kd);
    return () => window.removeEventListener('keydown', kd);
  }, [activeCell, isEditing, stopEditing, startEditing, setActiveCell, setCellValue]);

  const sel0 = selection ? { row: Math.min(selection.start.row, selection.end.row), col: Math.min(selection.start.col, selection.end.col) } : null;
  const sel1 = selection ? { row: Math.max(selection.start.row, selection.end.row), col: Math.max(selection.start.col, selection.end.col) } : null;
  const inSel = (r: number, c: number) => sel0 && sel1 && r >= sel0.row && r <= sel1.row && c >= sel0.col && c <= sel1.col;
  const isAct = (r: number, c: number) => activeCell?.row === r && activeCell?.col === c;

  return (
    <div ref={ref} className="flex-1 overflow-auto relative bg-white" onScroll={onScroll}>
      <div style={{ width: totalW + ROW_HDR_W, height: totalH + HDR_H, position: 'relative' }}>
        {/* Corner */}
        <div className="sticky top-0 left-0 z-30" style={{ width: ROW_HDR_W, height: HDR_H, position: 'absolute', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }} />

        {/* Col headers */}
        <div className="sticky top-0 z-20" style={{ position: 'absolute', left: ROW_HDR_W, top: 0, height: HDR_H }}>
          {Array.from({ length: c1 - c0 + 1 }, (_, i) => {
            const c = c0 + i;
            const act = activeCell?.col === c;
            return <div key={c} className="absolute top-0 flex items-center justify-center text-[11px] font-semibold select-none" style={{ left: colPos[c], width: colPos[c + 1] - colPos[c], height: HDR_H, background: act ? '#EFF6FF' : '#F8FAFC', color: act ? '#3B82F6' : '#64748B', borderBottom: '1px solid #E2E8F0', borderRight: '1px solid #F1F5F9' }}>{colLabel(c)}</div>;
          })}
        </div>

        {/* Row headers */}
        <div className="sticky left-0 z-20" style={{ position: 'absolute', left: 0, top: HDR_H }}>
          {Array.from({ length: r1 - r0 + 1 }, (_, i) => {
            const r = r0 + i;
            const act = activeCell?.row === r;
            return <div key={r} className="absolute flex items-center justify-center text-[11px] font-semibold select-none" style={{ top: r * ROW_H, width: ROW_HDR_W, height: ROW_H, background: act ? '#EFF6FF' : '#F8FAFC', color: act ? '#3B82F6' : '#64748B', borderBottom: '1px solid #F1F5F9', borderRight: '1px solid #E2E8F0' }}>{r + 1}</div>;
          })}
        </div>

        {/* Cells */}
        <div style={{ position: 'absolute', left: ROW_HDR_W, top: HDR_H }}>
          {Array.from({ length: r1 - r0 + 1 }, (_, ri) => {
            const r = r0 + ri;
            return Array.from({ length: c1 - c0 + 1 }, (_, ci) => {
              const c = c0 + ci;
              const k = cellKey(r, c);
              const cd = sheet?.cells[k];
              const act = isAct(r, c);
              const sel = inSel(r, c) && !act;
              const f = cd?.format;
              return (
                <div key={`${r}-${c}`} className="absolute select-none" style={{
                  left: colPos[c], top: r * ROW_H, width: colPos[c + 1] - colPos[c], height: ROW_H,
                  background: act ? '#fff' : sel ? 'rgba(59,130,246,0.04)' : f?.fillColor ?? '#fff',
                  borderBottom: '1px solid #F1F5F9', borderRight: '1px solid #F1F5F9',
                  ...(act ? { zIndex: 10, boxShadow: '0 0 0 2px #3B82F6, 0 0 0 4px rgba(59,130,246,0.1)' } : {}),
                  ...(sel ? { borderColor: 'rgba(59,130,246,0.12)' } : {}),
                  borderRadius: act ? '2px' : undefined,
                }} onMouseDown={(e) => mouseDown(r, c, e)} onMouseMove={() => mouseMove(r, c)} onDoubleClick={() => { setActiveCell({ row: r, col: c }); startEditing(); }}>
                  {act && isEditing ? (
                    <input autoFocus type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { stopEditing(true); setActiveCell({ row: r + 1, col: c }); } else if (e.key === 'Escape') stopEditing(false); else if (e.key === 'Tab') { e.preventDefault(); stopEditing(true); setActiveCell({ row: r, col: Math.min(c + 1, COLS - 1) }); } }}
                      className="w-full h-full px-2 text-[12px] outline-none border-none bg-white font-mono" style={{ fontWeight: f?.bold ? 600 : undefined, fontStyle: f?.italic ? 'italic' : undefined, textDecoration: f?.underline ? 'underline' : undefined, textAlign: f?.align ?? 'left', color: f?.textColor ?? '#0F172A' }} spellCheck={false} />
                  ) : (
                    <div className="w-full h-full px-2 flex items-center text-[12px] truncate" style={{ fontWeight: f?.bold ? 600 : undefined, fontStyle: f?.italic ? 'italic' : undefined, textDecoration: f?.underline ? 'underline' : undefined, textAlign: f?.align ?? 'left', justifyContent: f?.align === 'center' ? 'center' : f?.align === 'right' ? 'flex-end' : 'flex-start', color: f?.textColor ?? '#0F172A' }}>
                      {cd?.value ?? ''}
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>

        {/* Selection border */}
        {sel0 && sel1 && (
          <div className="absolute pointer-events-none z-10" style={{
            left: ROW_HDR_W + colPos[sel0.col], top: HDR_H + sel0.row * ROW_H,
            width: colPos[sel1.col + 1] - colPos[sel0.col], height: (sel1.row - sel0.row + 1) * ROW_H,
            border: '2px solid #3B82F6', borderRadius: '3px', boxShadow: '0 0 0 3px rgba(59,130,246,0.08)',
          }}>
            <div className="absolute -right-[4px] -bottom-[4px] w-2.5 h-2.5 rounded-full bg-[#3B82F6] border-2 border-white cursor-crosshair shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
}
