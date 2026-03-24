import { FileText, Table2, Star, Trash2, Clock, Search, Upload, FileSpreadsheet, Presentation, FileType, Image, ArrowLeft, ClipboardList, Target, BarChart3, PenLine, ListChecks, BookOpen, Wallet, Users, Package, FolderKanban, CalendarDays, Building2 } from 'lucide-react';
import { useAppStore, TEMPLATES } from '../../store/useAppStore';
import { useState, useRef, useCallback } from 'react';
import type { AnyFile } from '../../types';

const FILE_THEME: Record<string, { gradient: string; iconGradient: string; badge: string; badgeBg: string; label: string; shadow: string }> = {
  note:        { gradient: 'from-[#EFF6FF] to-[#DBEAFE]', iconGradient: 'from-[#3B82F6] to-[#2563EB]', badge: 'text-[#2563EB]', badgeBg: 'bg-[#EFF6FF]', label: 'Not', shadow: 'hover:shadow-blue-500/10' },
  spreadsheet: { gradient: 'from-[#ECFDF5] to-[#D1FAE5]', iconGradient: 'from-[#10B981] to-[#059669]', badge: 'text-[#059669]', badgeBg: 'bg-[#ECFDF5]', label: 'Tablo', shadow: 'hover:shadow-emerald-500/10' },
  pdf:         { gradient: 'from-[#FEF2F2] to-[#FECACA]', iconGradient: 'from-[#EF4444] to-[#DC2626]', badge: 'text-[#DC2626]', badgeBg: 'bg-[#FEF2F2]', label: 'PDF', shadow: 'hover:shadow-red-500/10' },
  excel:       { gradient: 'from-[#F0FDF4] to-[#BBF7D0]', iconGradient: 'from-[#22C55E] to-[#16A34A]', badge: 'text-[#16A34A]', badgeBg: 'bg-[#F0FDF4]', label: 'Excel', shadow: 'hover:shadow-green-500/10' },
  word:        { gradient: 'from-[#EFF6FF] to-[#BFDBFE]', iconGradient: 'from-[#3B82F6] to-[#1D4ED8]', badge: 'text-[#1D4ED8]', badgeBg: 'bg-[#EFF6FF]', label: 'Word', shadow: 'hover:shadow-blue-500/10' },
  ppt:         { gradient: 'from-[#FFF7ED] to-[#FED7AA]', iconGradient: 'from-[#F97316] to-[#EA580C]', badge: 'text-[#EA580C]', badgeBg: 'bg-[#FFF7ED]', label: 'Sunum', shadow: 'hover:shadow-orange-500/10' },
  txt:         { gradient: 'from-[#F8FAFC] to-[#E2E8F0]', iconGradient: 'from-[#64748B] to-[#475569]', badge: 'text-[#475569]', badgeBg: 'bg-[#F8FAFC]', label: 'Metin', shadow: 'hover:shadow-slate-500/10' },
  md:          { gradient: 'from-[#F5F3FF] to-[#DDD6FE]', iconGradient: 'from-[#8B5CF6] to-[#7C3AED]', badge: 'text-[#7C3AED]', badgeBg: 'bg-[#F5F3FF]', label: 'Markdown', shadow: 'hover:shadow-violet-500/10' },
  image:       { gradient: 'from-[#FDF2F8] to-[#FBCFE8]', iconGradient: 'from-[#EC4899] to-[#DB2777]', badge: 'text-[#DB2777]', badgeBg: 'bg-[#FDF2F8]', label: 'Görsel', shadow: 'hover:shadow-pink-500/10' },
};

function getFileExt(file: AnyFile): string {
  if (file.type === 'spreadsheet') return 'spreadsheet';
  const icon = file.icon ?? '';
  if (icon === '📑') return 'md';
  if (icon === '📃') return 'word';
  if (icon === '📊') return 'excel';
  if (icon === '📕') return 'pdf';
  if (icon === '📙') return 'ppt';
  if (icon === '🖼️') return 'image';
  if (icon === '📝') return 'txt';
  return 'note';
}

function getFileIcon(ext: string) {
  switch (ext) {
    case 'spreadsheet': case 'excel': return FileSpreadsheet;
    case 'ppt': return Presentation;
    case 'pdf': return FileType;
    case 'image': return Image;
    default: return FileText;
  }
}

const ACCEPTED = '.txt,.md,.doc,.docx,.rtf,.pdf,.xls,.xlsx,.csv,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.webp';

const LUCIDE_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ClipboardList, Target, BarChart3, PenLine, ListChecks, BookOpen, Wallet, Users, Package, FolderKanban, CalendarDays, Building2,
};

export default function Home() {
  const store = useAppStore();
  const { files, createFile, openFile, deleteFile, toggleFavorite, sidebarFilter, importFile } = store;
  const showTemplates = store.showTemplates ?? false;
  const setShowTemplates = store.setShowTemplates;
  const createFromTemplate = store.createFromTemplate;
  const templateFilter = store.templateFilter ?? null;

  // Tüm hook'lar burada — early return'den ÖNCE
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'note' | 'spreadsheet'>('all');
  const [dragging, setDragging] = useState(false);
  const [tplCat, setTplCat] = useState<'all' | 'not' | 'tablo'>('all');
  const [tplSub, setTplSub] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (content) importFile(file.name, content, ext);
      };
      if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) reader.readAsDataURL(file);
      else reader.readAsText(file);
    });
  }, [importFile]);

  const onDrop = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }, [handleFiles]);

  // ── ŞABLON GALERİSİ ──
  if (showTemplates) {
    const subcategories = [...new Set(TEMPLATES.filter((t) => tplCat === 'all' || t.category === tplCat).map((t) => t.subcategory))];
    const filtered2 = TEMPLATES.filter((t) => tplCat === 'all' || t.category === tplCat).filter((t) => !tplSub || t.subcategory === tplSub);

    return (
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <div className="px-10 py-8">
          {/* Üst bar */}
          <div className="flex items-center gap-4 mb-5">
            <button onClick={() => setShowTemplates(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:bg-white hover:text-[#0F172A] transition-colors cursor-pointer">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-[18px] font-bold text-[#0F172A] tracking-tight">Şablonlar</h1>
            <div className="flex-1" />
            {/* Tür filtresi */}
            <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
              {(['all', 'not', 'tablo'] as const).map((f) => (
                <button key={f} onClick={() => { setTplCat(f); setTplSub(null); }} className={`px-3 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${tplCat === f ? 'bg-[#EFF6FF] text-[#3B82F6]' : 'text-[#64748B] hover:text-[#0F172A]'}`}>
                  {f === 'all' ? 'Tümü' : f === 'not' ? 'Notlar' : 'Tablolar'}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori chip'leri */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <button onClick={() => setTplSub(null)} className={`px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-colors cursor-pointer ${!tplSub ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#94A3B8]'}`}>
              Tüm kategoriler
            </button>
            {subcategories.map((sub) => (
              <button key={sub} onClick={() => setTplSub(sub)} className={`px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-colors cursor-pointer ${tplSub === sub ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#94A3B8]'}`}>
                {sub}
              </button>
            ))}
          </div>

          {/* Şablon kartları */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered2.map((t) => {
              const LIcon = LUCIDE_MAP[t.lucideIcon] ?? FileText;
              return (
                <button key={t.id} onClick={() => createFromTemplate(t.id)} className="group text-left bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${t.color}, ${t.color}66)` }} />
                  <div className="p-3.5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm shrink-0" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}CC)` }}>
                        <LIcon size={16} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-[#0F172A] truncate">{t.title}</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ color: t.color, backgroundColor: `${t.color}12` }}>{t.type === 'note' ? 'Not' : 'Tablo'}</span>
                          <span className="text-[9px] text-[#94A3B8]">{t.subcategory}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">{t.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── DOSYA LİSTESİ ──
  const baseFiles = sidebarFilter === 'favorites' ? files.filter((f) => f.isFavorite)
    : sidebarFilter === 'recent' ? [...files].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    : files;

  const filteredFiles = baseFiles
    .filter((f) => filter === 'all' || f.type === filter)
    .filter((f) => !search || f.title.toLowerCase().includes(search.toLowerCase()));

  const favorites = sidebarFilter !== 'favorites' ? filteredFiles.filter((f) => f.isFavorite) : [];
  const recent = sidebarFilter === 'favorites' ? filteredFiles : filteredFiles.filter((f) => !f.isFavorite);
  const pageTitle = sidebarFilter === 'favorites' ? 'Favoriler' : sidebarFilter === 'recent' ? 'Son Kullanılan' : 'Belgelerim';

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC] relative" onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
      {dragging && (
        <div className="absolute inset-0 z-50 bg-[#3B82F6]/5 border-2 border-dashed border-[#3B82F6] rounded-2xl m-4 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-4"><Upload size={28} className="text-[#3B82F6]" /></div>
          <p className="text-[16px] font-bold text-[#3B82F6]">Dosyayı buraya bırakın</p>
          <p className="text-[13px] text-[#64748B] mt-1">PDF, Excel, Word, TXT, görseller ve daha fazlası</p>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept={ACCEPTED} multiple onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = ''; }} className="hidden" />

      <div className="px-10 py-8">
        <div className="flex items-center gap-4 mb-5">
          <h1 className="text-[18px] font-bold text-[#0F172A] tracking-tight shrink-0">{pageTitle}</h1>
          <div className="flex items-center gap-2 flex-1 max-w-[240px] px-3 py-1.5 bg-white border border-[#E2E8F0] rounded-lg focus-within:border-[#3B82F6]/40 transition-all">
            <Search size={13} className="text-[#94A3B8]" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ara..." className="bg-transparent text-[12px] text-[#0F172A] outline-none w-full placeholder:text-[#CBD5E1]" />
          </div>
          <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
            {(['all', 'note', 'spreadsheet'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1.5 text-[11px] font-semibold transition-colors cursor-pointer ${filter === f ? 'bg-[#EFF6FF] text-[#3B82F6]' : 'text-[#64748B] hover:text-[#0F172A]'}`}>
                {f === 'all' ? 'Tümü' : f === 'note' ? 'Notlar' : 'Tablolar'}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] text-[12px] font-semibold text-[#64748B] rounded-lg hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all cursor-pointer">
              <Upload size={13} /> Yükle
            </button>
            <button onClick={() => createFile('note')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] rounded-lg hover:bg-[#EFF6FF] hover:border-[#3B82F6]/30 transition-all cursor-pointer">
              <FileText size={13} className="text-[#3B82F6]" /> Not
            </button>
            <button onClick={() => createFile('spreadsheet')} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E2E8F0] text-[12px] font-semibold text-[#0F172A] rounded-lg hover:bg-[#ECFDF5] hover:border-[#10B981]/30 transition-all cursor-pointer">
              <Table2 size={13} className="text-[#10B981]" /> Tablo
            </button>
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <Star size={13} className="text-[#F59E0B]" />
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Favoriler</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {favorites.map((f) => <FileCard key={f.id} file={f} onOpen={() => openFile(f.id)} onDelete={() => deleteFile(f.id)} onFav={() => toggleFavorite(f.id)} />)}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Clock size={13} className="text-[#94A3B8]" />
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">{sidebarFilter === 'favorites' ? 'Favoriler' : 'Son Dosyalar'}</span>
          </div>
          {recent.length === 0 && favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mb-4"><Upload size={24} className="text-[#3B82F6]/40" /></div>
              <p className="text-[14px] text-[#64748B] font-medium">Henüz dosya yok</p>
              <p className="text-[12px] text-[#94A3B8] mt-1 mb-4">Yeni bir dosya oluşturun veya cihazınızdan yükleyin</p>
              <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-[#3B82F6] bg-[#EFF6FF] rounded-xl hover:bg-[#DBEAFE] transition-colors cursor-pointer">
                <Upload size={14} /> Dosya Yükle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {recent.map((f) => <FileCard key={f.id} file={f} onOpen={() => openFile(f.id)} onDelete={() => deleteFile(f.id)} onFav={() => toggleFavorite(f.id)} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FileCard({ file, onOpen, onDelete, onFav }: { file: AnyFile; onOpen: () => void; onDelete: () => void; onFav: () => void }) {
  const ext = getFileExt(file);
  const theme = FILE_THEME[ext] ?? FILE_THEME.note;
  const Icon = getFileIcon(ext);

  return (
    <div onClick={onOpen} className={`group rounded-2xl overflow-hidden hover:shadow-xl ${theme.shadow} hover:-translate-y-1 transition-all cursor-pointer`}>
      <div className={`bg-gradient-to-br ${theme.gradient} px-4 pt-4 pb-3 relative`}>
        <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onFav(); }} className="p-1.5 rounded-lg bg-white/60 hover:bg-white cursor-pointer transition-colors backdrop-blur-sm">
            <Star size={11} className={file.isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#94A3B8]'} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg bg-white/60 hover:bg-[#FEE2E2] cursor-pointer transition-colors backdrop-blur-sm">
            <Trash2 size={11} className="text-[#94A3B8] hover:text-[#DC2626]" />
          </button>
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.iconGradient} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="bg-white px-4 py-3 border-x border-b border-[#E2E8F0]/60">
        <div className="text-[13px] font-semibold text-[#0F172A] truncate mb-1.5">{file.title}</div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.badgeBg} ${theme.badge}`}>{theme.label}</span>
          <span className="text-[10px] text-[#94A3B8]">{new Date(file.updatedAt).toLocaleDateString('tr-TR')}</span>
        </div>
      </div>
    </div>
  );
}
