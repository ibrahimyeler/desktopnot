import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const COLORS = ['#0F172A', '#64748B', '#DC2626', '#D97706', '#16A34A', '#3B82F6', '#6366F1', '#8B5CF6', '#FFFFFF', '#F1F5F9', '#FEE2E2', '#FEF3C7', '#DCFCE7', '#DBEAFE', '#EDE9FE', '#F5F3FF'];

export default function Inspector() {
  const { inspectorOpen, activeCell, setCellFormat, getCell } = useAppStore();
  if (!inspectorOpen) return null;
  const cell = activeCell ? getCell(activeCell.row, activeCell.col) : undefined;
  const fmt = cell?.format ?? {};

  return (
    <div className="w-[220px] h-full bg-[#F8FAFC] flex flex-col shrink-0 border-l border-[#E2E8F0]">
      <div className="h-[36px] flex items-center px-4 border-b border-[#E2E8F0]">
        <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Biçimlendirme</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3.5 space-y-5">
        {!activeCell ? (
          <div className="flex flex-col items-center justify-center h-32 text-[#CBD5E1]">
            <Type size={20} className="mb-2" />
            <p className="text-[11px]">Bir hücre seçin</p>
          </div>
        ) : (
          <>
            <Section title="Metin Stili">
              <div className="flex gap-1">
                <SmBtn icon={Bold} active={fmt.bold} onClick={() => setCellFormat({ bold: !fmt.bold })} />
                <SmBtn icon={Italic} active={fmt.italic} onClick={() => setCellFormat({ italic: !fmt.italic })} />
                <SmBtn icon={Underline} active={fmt.underline} onClick={() => setCellFormat({ underline: !fmt.underline })} />
              </div>
            </Section>
            <Section title="Hizalama">
              <div className="flex gap-1">
                <SmBtn icon={AlignLeft} active={fmt.align === 'left'} onClick={() => setCellFormat({ align: 'left' })} />
                <SmBtn icon={AlignCenter} active={fmt.align === 'center'} onClick={() => setCellFormat({ align: 'center' })} />
                <SmBtn icon={AlignRight} active={fmt.align === 'right'} onClick={() => setCellFormat({ align: 'right' })} />
              </div>
            </Section>
            <Section title="Metin Rengi">
              <div className="grid grid-cols-8 gap-1.5">
                {COLORS.map((c) => <button key={`t${c}`} onClick={() => setCellFormat({ textColor: c })} className="w-5 h-5 rounded-md border border-[#E2E8F0] cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} />)}
              </div>
            </Section>
            <Section title="Arka Plan">
              <div className="grid grid-cols-8 gap-1.5">
                {COLORS.map((c) => <button key={`b${c}`} onClick={() => setCellFormat({ fillColor: c })} className="w-5 h-5 rounded-md border border-[#E2E8F0] cursor-pointer hover:scale-110 transition-transform shadow-sm" style={{ backgroundColor: c }} />)}
              </div>
            </Section>
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-2">{title}</div>{children}</div>;
}

function SmBtn({ icon: I, active, onClick }: { icon: React.ComponentType<{ size?: number }>; active?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer ${active ? 'bg-[#EFF6FF] text-[#3B82F6]' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}><I size={13} /></button>;
}
