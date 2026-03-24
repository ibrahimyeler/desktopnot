import { FileText, Table2, Clock, Star, Folder, Sparkles, Plus, LogOut, ChevronDown, LayoutTemplate, FileType, Presentation, Image, BookOpen, X, Check } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState, useRef, useEffect } from 'react';

const FILE_COLORS: Record<string, { iconBg: string; iconBgActive: string; icon: string; iconActive: string; activeBg: string; activeText: string; dot: string }> = {
  '📝': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#DBEAFE]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#3B82F6]', activeBg: 'bg-[#EFF6FF]', activeText: 'text-[#2563EB]', dot: 'bg-[#3B82F6]' },
  '📑': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#DDD6FE]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#7C3AED]', activeBg: 'bg-[#F5F3FF]', activeText: 'text-[#7C3AED]', dot: 'bg-[#8B5CF6]' },
  '📃': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#BFDBFE]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#2563EB]', activeBg: 'bg-[#EFF6FF]', activeText: 'text-[#1D4ED8]', dot: 'bg-[#3B82F6]' },
  '📕': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#FECACA]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#DC2626]', activeBg: 'bg-[#FEF2F2]', activeText: 'text-[#DC2626]', dot: 'bg-[#EF4444]' },
  '📊': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#A7F3D0]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#059669]', activeBg: 'bg-[#ECFDF5]', activeText: 'text-[#059669]', dot: 'bg-[#10B981]' },
  '📙': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#FED7AA]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#EA580C]', activeBg: 'bg-[#FFF7ED]', activeText: 'text-[#EA580C]', dot: 'bg-[#F97316]' },
  '📋': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#BAE6FD]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#0284C7]', activeBg: 'bg-[#F0F9FF]', activeText: 'text-[#0284C7]', dot: 'bg-[#0EA5E9]' },
  '🖼️': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#FBCFE8]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#DB2777]', activeBg: 'bg-[#FDF2F8]', activeText: 'text-[#DB2777]', dot: 'bg-[#EC4899]' },
  'default': { iconBg: 'bg-transparent', iconBgActive: 'bg-[#DBEAFE]', icon: 'text-[#CBD5E1]', iconActive: 'text-[#3B82F6]', activeBg: 'bg-[#EFF6FF]', activeText: 'text-[#2563EB]', dot: 'bg-[#3B82F6]' },
};

const NEW_FILE_TYPES = [
  { type: 'note' as const, icon: FileText, label: 'Not (.note)', color: '#3B82F6', ext: 'note', defaultIcon: '📝' },
  { type: 'spreadsheet' as const, icon: Table2, label: 'Tablo (.xlsx)', color: '#10B981', ext: 'xlsx', defaultIcon: '📊' },
  { type: 'note' as const, icon: FileType, label: 'PDF (.pdf)', color: '#DC2626', ext: 'pdf', defaultIcon: '📕' },
  { type: 'note' as const, icon: FileText, label: 'Word (.docx)', color: '#2563EB', ext: 'docx', defaultIcon: '📃' },
  { type: 'note' as const, icon: Presentation, label: 'Sunum (.pptx)', color: '#EA580C', ext: 'pptx', defaultIcon: '📙' },
  { type: 'note' as const, icon: BookOpen, label: 'Markdown (.md)', color: '#8B5CF6', ext: 'md', defaultIcon: '📑' },
  { type: 'note' as const, icon: FileText, label: 'Metin (.txt)', color: '#64748B', ext: 'txt', defaultIcon: '📝' },
  { type: 'note' as const, icon: Image, label: 'Görsel (.png)', color: '#EC4899', ext: 'png', defaultIcon: '🖼️' },
];

export default function Sidebar() {
  const { sidebarOpen, files, activeFileId, openFile, goHome, sidebarFilter, setSidebarFilter, setRoute, showTemplates, setShowTemplates } = useAppStore();
  const [showFiles, setShowFiles] = useState(true);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [naming, setNaming] = useState<{ type: 'note' | 'spreadsheet'; icon: string; ext: string } | null>(null);
  const [newName, setNewName] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  if (!sidebarOpen) return null;

  const favCount = files.filter((f) => f.isFavorite).length;

  // Dışarı tıklayınca menüyü kapat
  useEffect(() => {
    if (!showNewMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowNewMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNewMenu]);

  // İsimlendirme inputuna focus
  useEffect(() => {
    if (naming) nameInputRef.current?.focus();
  }, [naming]);

  const handleCreateFile = (item: typeof NEW_FILE_TYPES[0]) => {
    setShowNewMenu(false);
    setNaming({ type: item.type, icon: item.defaultIcon, ext: item.ext });
    setNewName('');
  };

  const confirmCreate = () => {
    if (!naming) return;
    const title = newName.trim() || 'Başlıksız';
    const store = useAppStore.getState();
    store.createFile(naming.type);
    // Son oluşturulan dosyayı güncelle
    const latest = useAppStore.getState().files[0];
    if (latest) {
      store.updateFileTitle(latest.id, title);
      // İkonu güncelle
      useAppStore.setState((s) => ({
        files: s.files.map((f) => f.id === latest.id ? { ...f, icon: naming!.icon } : f),
      }));
    }
    setNaming(null);
    setNewName('');
  };

  return (
    <div className="w-[220px] h-full bg-white flex flex-col shrink-0 border-r border-[#F1F5F9]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-[48px] shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center">
          <Sparkles size={12} className="text-white" />
        </div>
        <span className="text-[14px] font-bold text-[#0F172A] tracking-tight">NotApp</span>
      </div>

      {/* Navigasyon */}
      <div className="px-2.5 pt-1 pb-2 space-y-px">
        <NavItem icon={Clock} label="Son Kullanılan" active={!showTemplates && sidebarFilter === 'recent'} onClick={() => { setShowTemplates(false); setSidebarFilter('recent'); goHome(); }} />
        <NavItem icon={Star} label="Favoriler" active={!showTemplates && sidebarFilter === 'favorites'} badge={favCount || undefined} onClick={() => { setShowTemplates(false); setSidebarFilter('favorites'); goHome(); }} />
        <NavItem icon={Folder} label="Belgelerim" active={!showTemplates && sidebarFilter === 'all'} onClick={() => { setShowTemplates(false); setSidebarFilter('all'); goHome(); }} />
        <NavItem icon={LayoutTemplate} label="Şablonlar" active={showTemplates} onClick={() => { setShowTemplates(!showTemplates); }} />
      </div>

      <div className="mx-3 h-px bg-[#F1F5F9]" />

      {/* Dosyalar başlık */}
      <div className="px-3 pt-3 pb-1 flex items-center justify-between relative" ref={menuRef}>
        <button onClick={() => setShowFiles(!showFiles)} className="flex items-center gap-1 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.1em] cursor-pointer hover:text-[#64748B] transition-colors">
          <ChevronDown size={10} className={`transition-transform ${showFiles ? '' : '-rotate-90'}`} />
          Dosyalar
        </button>
        <button onClick={() => setShowNewMenu(!showNewMenu)} className="w-5 h-5 flex items-center justify-center rounded-md text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#EFF6FF] transition-all cursor-pointer">
          <Plus size={12} />
        </button>

        {/* Dropdown menü */}
        {showNewMenu && (
          <div className="absolute top-full left-2 right-2 mt-1 z-50 bg-white border border-[#E2E8F0] rounded-xl shadow-xl shadow-black/[0.06] py-1.5">
            <div className="px-3 py-1 mb-1">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Yeni Dosya Oluştur</span>
            </div>
            {NEW_FILE_TYPES.map((item) => (
              <button key={item.ext} onClick={() => handleCreateFile(item)} className="w-full flex items-center gap-2.5 px-3 py-[6px] text-[12px] text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                <item.icon size={14} style={{ color: item.color }} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* İsimlendirme alanı */}
      {naming && (
        <div className="px-2.5 py-1.5">
          <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#F8FAFC] border border-[#3B82F6]/30 rounded-lg">
            <span className="text-[12px] shrink-0">{naming.icon}</span>
            <input
              ref={nameInputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') confirmCreate(); if (e.key === 'Escape') setNaming(null); }}
              placeholder="Dosya adı..."
              className="bg-transparent text-[12px] text-[#0F172A] outline-none flex-1 min-w-0 placeholder:text-[#CBD5E1]"
              spellCheck={false}
            />
            <span className="text-[10px] text-[#94A3B8] shrink-0">.{naming.ext}</span>
            <button onClick={confirmCreate} className="w-5 h-5 flex items-center justify-center rounded bg-[#3B82F6] text-white cursor-pointer hover:bg-[#2563EB] transition-colors">
              <Check size={10} strokeWidth={3} />
            </button>
            <button onClick={() => setNaming(null)} className="w-5 h-5 flex items-center justify-center rounded text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEE2E2] cursor-pointer transition-colors">
              <X size={10} />
            </button>
          </div>
        </div>
      )}

      {/* Dosya listesi */}
      {showFiles && (
        <div className="flex-1 overflow-y-auto px-2.5 space-y-px">
          {files.map((f) => {
            const active = f.id === activeFileId;
            const c = FILE_COLORS[f.icon ?? ''] ?? FILE_COLORS['default'];
            return (
              <button key={f.id} onClick={() => openFile(f.id)} className={`w-full flex items-center gap-2 px-2 py-[6px] rounded-md text-left transition-all cursor-pointer ${active ? `${c.activeBg} ${c.activeText}` : 'text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9]'}`}>
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${active ? c.iconBgActive : 'bg-transparent'}`}>
                  {f.type === 'spreadsheet' ? <Table2 size={11} className={active ? c.iconActive : 'text-[#CBD5E1]'} /> : <FileText size={11} className={active ? c.iconActive : 'text-[#CBD5E1]'} />}
                </div>
                <span className={`text-[12px] truncate ${active ? 'font-semibold' : ''}`}>{f.title}</span>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ml-auto ${active ? c.dot : 'opacity-0'}`} />
              </button>
            );
          })}
        </div>
      )}

      {!showFiles && <div className="flex-1" />}

      {/* Çıkış */}
      <div className="px-2.5 py-2.5 border-t border-[#F1F5F9]">
        <button onClick={() => setRoute('splash')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12px] font-medium text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-all cursor-pointer">
          <LogOut size={14} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon: I, label, active, badge, onClick }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; active?: boolean; badge?: number; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[12px] transition-all cursor-pointer ${active ? 'bg-[#F8FAFC] text-[#0F172A] font-semibold' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'}`}>
      <I size={15} className={active ? 'text-[#3B82F6]' : 'text-[#94A3B8]'} />
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && <span className="text-[9px] font-bold text-[#3B82F6] bg-[#EFF6FF] w-5 h-5 flex items-center justify-center rounded-full">{badge}</span>}
    </button>
  );
}
