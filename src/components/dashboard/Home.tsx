import { FileText, Table2, Star, Trash2, Search, Plus, Clock, CheckCircle2, Circle, UserPlus, ChevronRight, ExternalLink, ArrowUpDown, List, Columns3, ChevronDown, Calendar, Bell, Zap, AlertTriangle, Flame, Timer, CalendarClock, TrendingUp, Sparkles, X, StickyNote, Target, Users, MoreHorizontal, LayoutGrid as GridIcon, LayoutList } from 'lucide-react';
import UsersView from './UsersView';
import type { NoteFile, SpreadsheetFile } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useState, useMemo, useRef } from 'react';
import type { AnyFile, Task, TeamMember, TaskStatus, TaskPriority } from '../../types';
import { createTask, uid } from '../../types';

// ══════════════════════════════════════
// DASHBOARD — Control Center (v3)
// ══════════════════════════════════════
function DashboardView() {
  const { tasks, team, files, currentUser, openFile, setHomeTab, addTask } = useAppStore();
  const [quickInput, setQuickInput] = useState('');
  const [quickAssignee, setQuickAssignee] = useState(currentUser.id);
  const [showQuickAssignee, setShowQuickAssignee] = useState(false);
  const [quickStep, setQuickStep] = useState<'input' | 'assign'>('input');
  const [quickHighlight, setQuickHighlight] = useState(0);
  const [inlineAdd, setInlineAdd] = useState('');

  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;

  const criticalTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed');
  const todayPending = tasks.filter(t => t.status === 'pending' && t.priority !== 'high');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const recentFiles = [...files].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const firstSheet = recentFiles.find(f => f.type === 'spreadsheet');

  const parts: string[] = [];
  if (pending + inProgress > 0) parts.push(`${pending + inProgress} görev`);
  if (criticalTasks.length > 0) parts.push(`${criticalTasks.length} kritik teslimat`);
  const subtitle = parts.join(' · ') || 'Tüm işler yolunda';

  const handleQuickEnter = () => {
    if (!quickInput.trim()) return;
    if (quickStep === 'input') {
      setQuickStep('assign');
      setQuickHighlight(0);
    } else {
      handleQuickAssignSelect(team[quickHighlight]?.id ?? currentUser.id);
    }
  };

  const handleQuickKeyDown = (e: React.KeyboardEvent) => {
    if (quickStep === 'input') {
      if (e.key === 'Enter') handleQuickEnter();
      if (e.key === 'Escape') setQuickInput('');
      return;
    }
    // assign step keyboard
    if (e.key === 'ArrowDown') { e.preventDefault(); setQuickHighlight(h => (h + 1) % team.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setQuickHighlight(h => (h - 1 + team.length) % team.length); }
    else if (e.key === 'Enter') { e.preventDefault(); handleQuickAssignSelect(team[quickHighlight]?.id ?? currentUser.id); }
    else if (e.key === 'Escape') { handleQuickCancel(); }
  };

  const handleQuickAssignSelect = (memberId: string) => {
    setQuickAssignee(memberId);
    addTask(createTask(quickInput.trim(), memberId, currentUser.id, 'medium'));
    setQuickInput('');
    setQuickStep('input');
    setQuickAssignee(currentUser.id);
  };

  const handleQuickCancel = () => {
    setQuickStep('input');
  };

  const quickAssigneeMember = team.find(m => m.id === quickAssignee);

  const handleInlineAdd = () => {
    if (!inlineAdd.trim()) return;
    addTask(createTask(inlineAdd.trim(), currentUser.id, currentUser.id, 'medium'));
    setInlineAdd('');
  };

  const todayCompleted = completed;
  const newToday = tasks.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ═══ TOP BAR ═══ */}
      <div className="px-8 pt-5 pb-5 flex items-center gap-6 relative z-50">
        <div className="shrink-0">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none">Günün Planı</h1>
          <p className="text-[13px] text-[#6B7280] mt-1">{subtitle}</p>
        </div>
        <div className="flex-1" />
        <div className="relative min-w-[440px] max-w-[600px] w-[50vw]">
          <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 h-10 transition-all duration-200 hover:-translate-y-px"
            style={{ boxShadow: quickStep === 'assign' ? '0 0 0 2px rgba(37,99,235,0.2), 0 4px 16px rgba(37,99,235,0.08)' : '0 0 0 1px rgba(37,99,235,0.06), 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(37,99,235,0.04)' }}>
            <Zap size={14} className="text-[#06B6D4] shrink-0" />
            {quickStep === 'input' ? (
              <input value={quickInput} onChange={e => setQuickInput(e.target.value)} placeholder="Hızlı görev ekle..."
                className="flex-1 text-[13px] text-[#111827] outline-none placeholder:text-[#CBD5E1] bg-transparent min-w-0"
                onKeyDown={handleQuickKeyDown} />
            ) : (
              <input readOnly autoFocus className="flex-1 text-[13px] outline-none bg-transparent min-w-0 caret-transparent cursor-default"
                value="" placeholder={`"${quickInput}" — Kime atansın? (↑↓ seç, Enter onayla)`}
                onKeyDown={handleQuickKeyDown} />
            )}
            {/* Assignee badge (sadece input modunda) */}
            {quickStep === 'input' && (
              <div className="relative shrink-0">
                <button onClick={() => setShowQuickAssignee(!showQuickAssignee)}
                  className="flex items-center gap-1 h-6 px-1.5 rounded-md hover:bg-[#F3F4F6] transition-all cursor-pointer">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-bold"
                    style={{ backgroundColor: quickAssigneeMember?.avatar ?? '#9CA3AF' }}>
                    {quickAssigneeMember?.name[0] ?? '?'}
                  </div>
                  <span className="text-[11px] text-[#6B7280]">{quickAssigneeMember?.id === currentUser.id ? 'Ben' : quickAssigneeMember?.name.split(' ')[0]}</span>
                  <ChevronDown size={10} className="text-[#D1D5DB]" />
                </button>
                {showQuickAssignee && (
                  <>
                    <div className="fixed inset-0 z-[200]" onClick={() => setShowQuickAssignee(false)} />
                    <div className="absolute top-full right-0 mt-1.5 z-[201] bg-white border border-[#E5E7EB] rounded-lg shadow-xl py-1 min-w-[180px]">
                      {team.map(m => (
                        <button key={m.id} onClick={() => { setQuickAssignee(m.id); setShowQuickAssignee(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[#F3F4F6] transition-colors cursor-pointer ${m.id === quickAssignee ? 'bg-[#EFF6FF]' : ''}`}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-bold" style={{ backgroundColor: m.avatar }}>
                            {m.name[0]}
                          </div>
                          <span className="text-[12px] text-[#374151]">{m.id === currentUser.id ? `${m.name} (Ben)` : m.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <span className={`text-[9px] shrink-0 px-1.5 py-0.5 rounded transition-all duration-200 ${
              quickStep === 'assign' ? 'bg-[#06B6D4] text-white' : quickInput.trim() ? 'bg-[#06B6D4] text-white' : 'bg-[#F3F4F6] text-[#D1D5DB]'
            }`}>{quickStep === 'assign' ? 'Sec' : 'Enter'}</span>
          </div>
          {/* Step 2: Assign dropdown */}
          {quickStep === 'assign' && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-[201] bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1.5 overflow-hidden">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">Görevi ata</div>
              {team.map((m, i) => (
                <button key={m.id} onClick={() => handleQuickAssignSelect(m.id)}
                  onMouseEnter={() => setQuickHighlight(i)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors cursor-pointer ${i === quickHighlight ? 'bg-[#EFF6FF]' : 'hover:bg-[#F3F4F6]'}`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: m.avatar }}>
                    {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] text-[#374151] font-medium">{m.id === currentUser.id ? `${m.name} (Ben)` : m.name}</span>
                    <span className="text-[10px] text-[#9CA3AF] ml-1.5">{m.role}</span>
                  </div>
                  {i === quickHighlight && <span className="text-[9px] text-[#2563EB] bg-[#DBEAFE] px-1.5 py-0.5 rounded font-medium">Enter</span>}
                </button>
              ))}
              <div className="border-t border-[#F3F4F6] mt-1 pt-1 px-3 py-1.5">
                <button onClick={handleQuickCancel} className="text-[11px] text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer transition-colors">Vazgeç</button>
              </div>
            </div>
          )}
          {quickStep === 'assign' && <div className="fixed inset-0 z-[200]" onClick={handleQuickCancel} />}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setHomeTab('calendar')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#ECFEFF] text-[#06B6D4] hover:bg-[#CFFAFE] hover:text-[#0891B2] transition-all cursor-pointer"
            style={{ boxShadow: '0 0 0 1px rgba(6,182,212,0.15), 0 1px 2px rgba(6,182,212,0.08)' }}>
            <Calendar size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#FEF3C7] text-[#D97706] hover:bg-[#FDE68A] hover:text-[#B45309] transition-all cursor-pointer relative"
            style={{ boxShadow: '0 0 0 1px rgba(217,119,6,0.1), 0 1px 2px rgba(217,119,6,0.06)' }}>
            <Bell size={18} />
            {criticalTasks.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full text-[8px] text-white font-bold flex items-center justify-center shadow-sm shadow-red-500/30">{criticalTasks.length}</span>}
          </button>
          <button onClick={() => useAppStore.getState().createFile('note')} className="flex items-center gap-1.5 h-10 px-5 text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)', boxShadow: '0 2px 8px rgba(6,182,212,0.25)' }}>
            <Plus size={15} />Yeni Not
          </button>
        </div>
      </div>

      {/* ═══ SMART CARDS ═══ */}
      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <SmartCard label="Bekleyen" value={pending} color="#F59E0B" accent="#FEF3C7" svgIcon={<PendingIcon />}
          detail={pending > 0 ? `${pending} iş sırada` : 'Temiz'} />
        <SmartCard label="Devam Eden" value={inProgress} color="#3B82F6" accent="#DBEAFE" svgIcon={<InProgressIcon />}
          detail="Aktif çalışma" />
        <SmartCard label="Tamamlanan" value={completed} color="#10B981" accent="#D1FAE5" svgIcon={<CompletedIcon />}
          detail={total > 0 ? `%${Math.round(completed / total * 100)} başarı` : '—'} />
        <SmartCard label="Ekip" value={team.length} color="#6366F1" accent="#EDE9FE" svgIcon={<TeamIcon />}
          detail={`${team.filter(m => m.isOnline).length} çevrimiçi`} avatars={team} />
      </div>

      {/* ═══ 2-COLUMN LAYOUT ═══ */}
      <div className="px-8 pb-6 grid grid-cols-2 gap-5 items-stretch" style={{ minHeight: 440 }}>

        {/* COL 1 — Görevler (gruplu + inline add) */}
        <div className="bg-white rounded-xl overflow-hidden flex flex-col"
          style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#FEF3C7] flex items-center justify-center"><Timer size={13} className="text-[#F59E0B]" /></div>
              <h2 className="text-[14px] font-semibold text-[#111827]">Bugün Yapılacaklar</h2>
            </div>
            <button onClick={() => setHomeTab('tasks')} className="text-[11px] text-[#06B6D4] font-semibold hover:underline cursor-pointer flex items-center gap-0.5">
              Tümünü <ChevronRight size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Kritik */}
            {criticalTasks.length > 0 && (
              <div>
                <div className="px-5 pt-3.5 pb-1.5 flex items-center gap-1.5">
                  <Flame size={11} className="text-[#EF4444]" />
                  <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider">Kritik</span>
                  <span className="text-[10px] text-[#FCA5A5] font-medium">{criticalTasks.length}</span>
                </div>
                {criticalTasks.map(t => <RichTaskRow key={t.id} task={t} />)}
              </div>
            )}

            {/* Bugün */}
            {todayPending.length > 0 && (
              <div>
                <div className="px-5 pt-3.5 pb-1.5 flex items-center gap-1.5">
                  <Timer size={11} className="text-[#F59E0B]" />
                  <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">Bugün</span>
                  <span className="text-[10px] text-[#FCD34D] font-medium">{todayPending.length}</span>
                </div>
                {todayPending.slice(0, 4).map(t => <RichTaskRow key={t.id} task={t} />)}
              </div>
            )}

            {/* Yaklaşan (devam eden) */}
            {inProgressTasks.length > 0 && (
              <div>
                <div className="px-5 pt-3.5 pb-1.5 flex items-center gap-1.5">
                  <CalendarClock size={11} className="text-[#6366F1]" />
                  <span className="text-[10px] font-bold text-[#6366F1] uppercase tracking-wider">Yaklaşan</span>
                  <span className="text-[10px] text-[#A5B4FC] font-medium">{inProgressTasks.length}</span>
                </div>
                {inProgressTasks.slice(0, 3).map(t => <RichTaskRow key={t.id} task={t} showDate />)}
              </div>
            )}

            {criticalTasks.length === 0 && todayPending.length === 0 && inProgressTasks.length === 0 && (
              <div className="p-10 text-center">
                <Sparkles size={24} className="text-[#D1D5DB] mx-auto mb-2" />
                <div className="text-[13px] font-medium text-[#111827]">Temiz!</div>
                <div className="text-[11px] text-[#9CA3AF] mt-1">Tüm görevler tamamlandı.</div>
              </div>
            )}
          </div>

          {/* Inline add */}
          <div className="px-5 py-3 border-t border-[#F3F4F6] shrink-0">
            <div className="flex items-center gap-2">
              <Plus size={14} className="text-[#D1D5DB] shrink-0" />
              <input value={inlineAdd} onChange={e => setInlineAdd(e.target.value)} placeholder="Görev ekle..."
                className="flex-1 text-[12px] text-[#111827] outline-none placeholder:text-[#D1D5DB] bg-transparent"
                onKeyDown={e => e.key === 'Enter' && handleInlineAdd()} />
            </div>
          </div>
        </div>

        {/* COL 2 — Tablo + Özet */}
        <div className="flex flex-col gap-4">
          {/* Canlı Tablo */}
          <div className="bg-white rounded-xl overflow-hidden flex-1 flex flex-col"
            style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)' }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#DBEAFE] flex items-center justify-center"><Table2 size={13} className="text-[#3B82F6]" /></div>
                <h2 className="text-[14px] font-semibold text-[#111827]">Canlı Tablo</h2>
              </div>
              <div className="flex items-center gap-2">
                {firstSheet && (
                  <button onClick={() => openFile(firstSheet.id)} className="text-[11px] text-[#06B6D4] font-semibold hover:underline cursor-pointer flex items-center gap-0.5">
                    Aç <ExternalLink size={11} />
                  </button>
                )}
              </div>
            </div>
            {firstSheet && firstSheet.type === 'spreadsheet' ? <MiniTable file={firstSheet} /> : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <Table2 size={24} className="text-[#D1D5DB] mx-auto mb-1.5" />
                  <div className="text-[12px] text-[#9CA3AF]">Henüz tablo yok</div>
                  <button onClick={() => useAppStore.getState().createFile('spreadsheet')}
                    className="mt-2 text-[11px] text-[#3B82F6] font-medium hover:underline cursor-pointer">Oluştur</button>
                </div>
              </div>
            )}
          </div>

          {/* Günün Özeti — Glassmorphism */}
          <div className="rounded-xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 40%, #DBEAFE 100%)', boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 4px 24px rgba(99,102,241,0.08)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-blue-400/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-violet-400/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-[#6366F1]" />
                <span className="text-[11px] font-bold text-[#6366F1] uppercase tracking-[0.12em]">Günün Özeti</span>
              </div>
              <div className="space-y-3">
                <SummaryRow icon={CheckCircle2} color="#059669" text={`${todayCompleted} görev tamamlandı`} />
                {criticalTasks.length > 0 && <SummaryRow icon={AlertTriangle} color="#D97706" text={`${criticalTasks.length} kritik iş bekliyor`} />}
                <SummaryRow icon={Plus} color="#2563EB" text={`${newToday} yeni görev eklendi`} />
                <SummaryRow icon={TrendingUp} color="#059669" text={total > 0 ? `%${Math.round(completed / total * 100)} tamamlanma oranı` : 'Görev bekleniyor'} />
              </div>
            </div>
          </div>

          {/* Son Dosyalar */}
          <div className="bg-white rounded-xl overflow-hidden flex flex-col" style={{ maxHeight: 180, boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)' }}>
            <div className="px-5 py-3 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider border-b border-[#F3F4F6] shrink-0 flex items-center justify-between">
              <span>Son Dosyalar</span>
              {recentFiles.length > 4 && (
                <button onClick={() => setHomeTab('files')} className="text-[10px] text-[#3B82F6] font-medium hover:underline cursor-pointer normal-case tracking-normal">Tümü</button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
            {recentFiles.slice(0, 4).map(f => (
              <button key={f.id} onClick={() => openFile(f.id)} className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-[#F9FAFB] transition-all text-left cursor-pointer group border-b border-[#F9FAFB] last:border-b-0">
                <span className="text-[13px]">{f.icon}</span>
                <span className="flex-1 text-[12px] text-[#374151] truncate group-hover:text-[#111827] transition-colors">{f.title}</span>
                <ChevronRight size={12} className="text-[#D1D5DB] opacity-0 group-hover:opacity-100 transition-all" />
              </button>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard helper components
// ── Custom SVG Icons ──
function PendingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="11" cy="11" r="3.5" fill="#F59E0B" opacity="0.8" />
      <path d="M11 5V8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 14V17" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 11H8" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 11H17" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InProgressIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" stroke="#3B82F6" strokeWidth="1.5" opacity="0.2" />
      <path d="M11 2C15.97 2 20 6.03 20 11C20 13.76 18.67 16.2 16.6 17.73" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="11" r="2" fill="#3B82F6" />
      <path d="M11 7V11L13.5 13" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CompletedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="9" fill="#10B981" opacity="0.12" />
      <circle cx="11" cy="11" r="9" stroke="#10B981" strokeWidth="1.5" />
      <path d="M7 11.5L9.8 14.3L15 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="8" cy="8" r="3" stroke="#6366F1" strokeWidth="1.5" />
      <path d="M2 18C2 14.69 4.69 13 8 13" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15" cy="9" r="2.5" stroke="#6366F1" strokeWidth="1.5" />
      <path d="M12 18C12 15.24 13.34 14 15 14C16.66 14 20 15.24 20 18" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15" cy="9" r="1" fill="#6366F1" opacity="0.4" />
      <circle cx="8" cy="8" r="1" fill="#6366F1" opacity="0.4" />
    </svg>
  );
}

function SmartCard({ label, value, color, accent, svgIcon, detail, avatars }: {
  label: string; value: number; color: string; accent: string; svgIcon: React.ReactNode;
  detail: string; avatars?: TeamMember[];
}) {
  return (
    <div className="bg-white rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-200 cursor-default group h-[130px] flex items-end relative overflow-hidden"
      style={{ boxShadow: `0 0 0 1px ${color}08, 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px ${color}06` }}>
      {/* Subtle gradient bg */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 60%)` }} />
      {/* Icon — sağ üst */}
      <div className="absolute top-4 right-4 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent }}>
        {svgIcon}
      </div>
      {/* Content — sol alt */}
      <div className="relative">
        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.08em] mb-1.5">{label}</div>
        <div className="text-[28px] font-bold text-[#0F172A] leading-none mb-1.5">{value}</div>
        {avatars ? (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {avatars.slice(0, 4).map(m => (
                <div key={m.id} className="rounded-full border-[1.5px] border-white flex items-center justify-center text-white text-[6px] font-bold" style={{ backgroundColor: m.avatar, width: 16, height: 16 }}>
                  {m.name[0]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22C55E]" />
              </span>
              <span className="text-[10px] font-semibold text-[#22C55E]">{detail}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[11px] text-[#6B7280]">{detail}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RichTaskRow({ task, showDate }: { task: Task; showDate?: boolean }) {
  const { updateTask, team } = useAppStore();
  const assignee = team.find(m => m.id === task.assignedTo);
  const cycleStatus = () => {
    const next: Record<string, TaskStatus> = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
    updateTask(task.id, { status: next[task.status], updatedAt: new Date().toISOString() });
  };
  const priorityColors: Record<TaskPriority, string> = { high: '#EF4444', medium: '#F59E0B', low: '#D1D5DB' };

  const currentUser = useAppStore.getState().currentUser;
  const sub = assignee ? (assignee.id === currentUser.id ? 'Ben' : assignee.role) : '';

  return (
    <div className="flex items-center gap-2.5 px-5 py-2.5 hover:bg-[#F9FAFB] transition-all duration-150 group cursor-pointer">
      <button onClick={cycleStatus} className="shrink-0 cursor-pointer mt-0.5">
        {task.status === 'completed' ? <CheckCircle2 size={17} className="text-[#10B981]" /> :
          task.status === 'in_progress' ? <Clock size={17} className="text-[#3B82F6]" /> :
            <Circle size={17} className="text-[#D1D5DB] group-hover:text-[#9CA3AF] transition-colors" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-medium truncate ${task.status === 'completed' ? 'text-[#9CA3AF] line-through' : 'text-[#111827]'}`}>{task.title}</div>
        {sub && <div className="text-[11px] text-[#C0C5CE] mt-0.5 truncate">{sub}</div>}
      </div>
      {showDate && task.dueDate && (
        <span className="text-[10px] text-[#9CA3AF] shrink-0">{formatDate(task.dueDate)}</span>
      )}
      {assignee && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[8px] font-bold shrink-0 shadow-sm" style={{ backgroundColor: assignee.avatar }}>
          {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      )}
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: priorityColors[task.priority] }} />
    </div>
  );
}

function SummaryRow({ icon: Icon, color, text }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
        <Icon size={12} style={{ color }} />
      </div>
      <span className="text-[12px] text-[#374151] font-medium">{text}</span>
    </div>
  );
}

// ══════════════════════════════════════
// GÖREVLER — Sleek Görev Yönetimi (v2)
// ══════════════════════════════════════
function TasksView() {
  const { tasks, team, currentUser, addTask, updateTask } = useAppStore();
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailTask, setDetailTask] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length;
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter);
    if (assigneeFilter !== 'all') list = list.filter(t => t.assignedTo === assigneeFilter);
    if (priorityFilter !== 'all') list = list.filter(t => t.priority === priorityFilter);
    if (search) list = list.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'priority') {
      const order: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else {
      list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return list;
  }, [tasks, statusFilter, assigneeFilter, priorityFilter, search, sortBy]);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    addTask(createTask(newTitle.trim(), newAssignee || currentUser.id, currentUser.id, newPriority));
    setNewTitle(''); setNewAssignee(''); setNewPriority('medium'); setShowNew(false);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map(t => t.id)));
  };

  const openDetail = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setDetailTask(taskId);
    setNoteInput(task?.note ?? '');
  };

  const closeDetail = () => {
    setDetailTask(null);
    setNoteInput('');
  };

  const saveNote = () => {
    if (detailTask) {
      updateTask(detailTask, { note: noteInput, updatedAt: new Date().toISOString() });
    }
  };

  const activeDetail = tasks.find(t => t.id === detailTask);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* ═══ HEADER ═══ */}
      <div className="px-8 pt-5 pb-5 flex items-center gap-6">
        <div className="shrink-0">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none">Gorevler</h1>
          <p className="text-[13px] text-[#6B7280] mt-1">
            {total > 0 ? `${pending + inProgress} aktif gorev · ${highPriority > 0 ? `${highPriority} kritik` : 'Kritik yok'}` : 'Henuz gorev eklenmedi'}
          </p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setSortBy(s => s === 'date' ? 'priority' : 'date')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#ECFEFF] text-[#06B6D4] hover:bg-[#CFFAFE] hover:text-[#0891B2] transition-all cursor-pointer"
            style={{ boxShadow: '0 0 0 1px rgba(6,182,212,0.15), 0 1px 2px rgba(6,182,212,0.08)' }}
            title={sortBy === 'date' ? 'Tarihe gore' : 'Oncelige gore'}>
            <ArrowUpDown size={18} />
          </button>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-1.5 h-10 px-5 text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)', boxShadow: '0 2px 8px rgba(6,182,212,0.25)' }}>
            <Plus size={15} />Yeni Gorev
          </button>
        </div>
      </div>

      {/* ═══ STAT CARDS ═══ */}
      <div className="px-8 grid grid-cols-4 gap-4 mb-6">
        <TaskStatCard label="Bekleyen" value={pending} color="#F59E0B" accent="#FEF3C7"
          icon={<Circle size={16} className="text-[#F59E0B]" />}
          onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          active={statusFilter === 'pending'} />
        <TaskStatCard label="Devam Eden" value={inProgress} color="#3B82F6" accent="#DBEAFE"
          icon={<Clock size={16} className="text-[#3B82F6]" />}
          onClick={() => setStatusFilter(statusFilter === 'in_progress' ? 'all' : 'in_progress')}
          active={statusFilter === 'in_progress'} />
        <TaskStatCard label="Tamamlanan" value={completed} color="#10B981" accent="#D1FAE5"
          icon={<CheckCircle2 size={16} className="text-[#10B981]" />}
          onClick={() => setStatusFilter(statusFilter === 'completed' ? 'all' : 'completed')}
          active={statusFilter === 'completed'} />
        <TaskStatCard label="Basari Orani" value={total > 0 ? Math.round(completed / total * 100) : 0} color="#6366F1" accent="#EDE9FE"
          icon={<Target size={16} className="text-[#6366F1]" />}
          suffix="%" />
      </div>

      {/* ═══ FILTER BAR ═══ */}
      <div className="px-8 pb-4 flex items-center gap-3 shrink-0">
        <div className="relative flex-1 max-w-[320px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Gorev ara..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#E5E7EB] rounded-xl text-[13px] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/10 transition-all"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }} />
        </div>

        <div className="w-px h-5 bg-[#E5E7EB]" />

        <FilterPill label="Kisi" value={assigneeFilter === 'all' ? 'Tumu' : team.find(m => m.id === assigneeFilter)?.name ?? 'Tumu'}
          options={[['all', 'Tumu'], ...team.map(m => [m.id, m.id === currentUser.id ? `${m.name} (Ben)` : m.name] as [string, string])]}
          onChange={v => setAssigneeFilter(v)} />

        <FilterPill label="Oncelik" value={priorityFilter === 'all' ? 'Tumu' : PRIORITY_LABELS[priorityFilter]}
          options={[['all', 'Tumu'], ['high', 'Yuksek'], ['medium', 'Orta'], ['low', 'Dusuk']]}
          onChange={v => setPriorityFilter(v as typeof priorityFilter)} />

        <div className="flex-1" />

        {/* Gorunum */}
        <div className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <button onClick={() => setView('list')}
            className={`h-9 px-3.5 flex items-center gap-1.5 text-[12px] transition-all cursor-pointer ${view === 'list' ? 'bg-[#F3F4F6] text-[#111827] font-medium' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
            <List size={13} />Liste
          </button>
          <button onClick={() => setView('kanban')}
            className={`h-9 px-3.5 flex items-center gap-1.5 text-[12px] transition-all cursor-pointer border-l border-[#E5E7EB] ${view === 'kanban' ? 'bg-[#F3F4F6] text-[#111827] font-medium' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
            <Columns3 size={13} />Pano
          </button>
        </div>
      </div>

      {/* ═══ YENİ GÖREV FORMU ═══ */}
      {showNew && (
        <div className="mx-8 mb-4">
          <div className="flex items-center gap-2 bg-white rounded-2xl px-4 h-[52px] transition-all duration-200"
            style={{ boxShadow: '0 0 0 2px rgba(6,182,212,0.2), 0 4px 20px rgba(6,182,212,0.08)' }}>
            <Zap size={15} className="text-[#2563EB] shrink-0" />
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Gorev basligini yazin..."
              className="flex-1 text-[14px] text-[#111827] outline-none placeholder:text-[#CBD5E1] bg-transparent min-w-0 font-medium" autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') { setShowNew(false); setNewTitle(''); } }} />

            {/* Kisi secimi */}
            <div className="flex items-center gap-1 h-8 px-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] shrink-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-bold shrink-0"
                style={{ backgroundColor: (newAssignee ? team.find(m => m.id === newAssignee)?.avatar : currentUser.avatar) ?? '#9CA3AF' }}>
                {(newAssignee ? team.find(m => m.id === newAssignee)?.name[0] : currentUser.name[0]) ?? '?'}
              </div>
              <select value={newAssignee} onChange={e => setNewAssignee(e.target.value)}
                className="text-[12px] text-[#374151] outline-none bg-transparent cursor-pointer appearance-none pr-4 font-medium">
                <option value="">Ben</option>
                {team.filter(m => m.id !== currentUser.id).map(m => <option key={m.id} value={m.id}>{m.name.split(' ')[0]}</option>)}
              </select>
              <ChevronDown size={10} className="text-[#D1D5DB] -ml-3 pointer-events-none" />
            </div>

            {/* Oncelik secimi */}
            <div className="flex items-center gap-0.5 h-8 px-2.5 rounded-lg bg-[#F8FAFC] border border-[#E5E7EB] shrink-0">
              <div className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: newPriority === 'high' ? '#EF4444' : newPriority === 'medium' ? '#F59E0B' : '#D1D5DB' }} />
              <select value={newPriority} onChange={e => setNewPriority(e.target.value as TaskPriority)}
                className="text-[12px] text-[#374151] outline-none bg-transparent cursor-pointer appearance-none pr-4 font-medium">
                <option value="low">Dusuk</option>
                <option value="medium">Orta</option>
                <option value="high">Yuksek</option>
              </select>
              <ChevronDown size={10} className="text-[#D1D5DB] -ml-3 pointer-events-none" />
            </div>

            {/* Vazgec */}
            <button onClick={() => { setShowNew(false); setNewTitle(''); }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-all cursor-pointer shrink-0">
              <X size={14} className="text-[#9CA3AF]" />
            </button>

            {/* Olustur */}
            <button onClick={handleCreate}
              className={`h-8 px-4 text-[12px] font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                newTitle.trim() ? 'bg-[#06B6D4] text-white hover:bg-[#0891B2]' : 'bg-[#F3F4F6] text-[#D1D5DB] cursor-default'
              }`}
              style={newTitle.trim() ? { boxShadow: '0 1px 2px rgba(37,99,235,0.3)' } : undefined}>
              Olustur
            </button>
          </div>
        </div>
      )}

      {/* ═══ İÇERİK ═══ */}
      <div className="flex-1 px-8 pb-6 overflow-y-auto">
        {view === 'list' ? (
          <TaskListView tasks={filtered} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleAll={toggleAll} onOpenDetail={openDetail} />
        ) : (
          <KanbanView tasks={filtered} onOpenDetail={openDetail} />
        )}
      </div>

      {/* ═══ GÖREV DETAY PANELİ ═══ */}
      {activeDetail && detailTask && (
        <TaskDetailPanel task={activeDetail} noteInput={noteInput} setNoteInput={setNoteInput} saveNote={saveNote} onClose={closeDetail} />
      )}
    </div>
  );
}

// ── Stat Card ──
function TaskStatCard({ label, value, color, accent, icon, suffix, onClick, active }: {
  label: string; value: number; color: string; accent: string; icon: React.ReactNode; suffix?: string; onClick?: () => void; active?: boolean;
}) {
  return (
    <div onClick={onClick}
      className={`bg-white rounded-xl p-4 transition-all duration-200 cursor-pointer group relative overflow-hidden ${active ? '' : 'hover:-translate-y-0.5'}`}
      style={{
        boxShadow: active ? `0 0 0 2px ${color}40, 0 4px 12px ${color}15` : `0 0 0 1px ${color}08, 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px ${color}04`,
      }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 60%)` }} />
      <div className="flex items-center justify-between relative">
        <div>
          <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em] mb-1">{label}</div>
          <div className="text-[24px] font-bold text-[#0F172A] leading-none">{value}{suffix}</div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ── Görev Detay Paneli ──
function TaskDetailPanel({ task, noteInput, setNoteInput, saveNote, onClose }: {
  task: Task; noteInput: string; setNoteInput: (v: string) => void; saveNote: () => void; onClose: () => void;
}) {
  const { updateTask, deleteTask, team, currentUser } = useAppStore();
  const assignee = team.find(m => m.id === task.assignedTo);
  const assigner = team.find(m => m.id === task.assignedBy);

  const cycleStatus = () => {
    const next: Record<string, TaskStatus> = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
    updateTask(task.id, { status: next[task.status], updatedAt: new Date().toISOString() });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[100] backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-[440px] bg-white z-[101] shadow-2xl flex flex-col overflow-hidden"
        style={{ boxShadow: '-8px 0 32px rgba(0,0,0,0.08)' }}>
        {/* Panel Header */}
        <div className="px-6 py-5 border-b border-[#F3F4F6] shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#DBEAFE] flex items-center justify-center">
                <Target size={14} className="text-[#2563EB]" />
              </div>
              <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em]">Gorev Detayi</span>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-all cursor-pointer">
              <X size={16} className="text-[#9CA3AF]" />
            </button>
          </div>
          <h2 className={`text-[18px] font-bold leading-snug ${task.status === 'completed' ? 'text-[#9CA3AF] line-through' : 'text-[#0F172A]'}`}>
            {task.title}
          </h2>
        </div>

        {/* Panel Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Durum & Öncelik */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8FAFC] rounded-xl p-3.5">
              <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Durum</div>
              <button onClick={cycleStatus} className="cursor-pointer">
                <StatusBadge status={task.status} />
              </button>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-3.5">
              <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Oncelik</div>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {/* Atanan & Atayan */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F8FAFC] rounded-xl p-3.5">
              <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Atanan Kisi</div>
              {assignee && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: assignee.avatar }}>
                    {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-[#111827]">{assignee.id === currentUser.id ? 'Ben' : assignee.name}</div>
                    <div className="text-[10px] text-[#9CA3AF]">{assignee.role}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-3.5">
              <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Atayan Kisi</div>
              {assigner && (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: assigner.avatar }}>
                    {assigner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-[12px] font-medium text-[#111827]">{assigner.id === currentUser.id ? 'Ben' : assigner.name}</div>
                    <div className="text-[10px] text-[#9CA3AF]">{assigner.role}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tarih */}
          <div className="bg-[#F8FAFC] rounded-xl p-3.5">
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Olusturulma Tarihi</div>
            <div className="text-[12px] text-[#374151] font-medium">{formatDate(task.createdAt)}</div>
          </div>

          {/* ═══ NOT BÖLÜMÜ ═══ */}
          <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.08), 0 2px 8px rgba(99,102,241,0.04)' }}>
            <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#EEF2FF] to-[#F5F3FF]">
              <StickyNote size={14} className="text-[#6366F1]" />
              <span className="text-[12px] font-bold text-[#6366F1]">Gorev Notu</span>
            </div>
            <div className="p-4 bg-white">
              <textarea
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                onBlur={saveNote}
                placeholder="Bu goreve not ekleyin..."
                className="w-full min-h-[120px] text-[13px] text-[#374151] leading-relaxed outline-none resize-none placeholder:text-[#CBD5E1] bg-transparent"
              />
              {noteInput !== (task.note ?? '') && (
                <div className="flex justify-end pt-2 border-t border-[#F3F4F6]">
                  <button onClick={saveNote}
                    className="h-8 px-4 bg-[#6366F1] text-white text-[12px] font-semibold rounded-lg hover:bg-[#4F46E5] cursor-pointer transition-all"
                    style={{ boxShadow: '0 1px 2px rgba(99,102,241,0.3)' }}>
                    Kaydet
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="px-6 py-4 border-t border-[#F3F4F6] shrink-0 flex items-center gap-2">
          <button onClick={() => { deleteTask(task.id); onClose(); }}
            className="h-9 px-4 text-[12px] text-[#EF4444] font-medium hover:bg-[#FEF2F2] rounded-lg cursor-pointer transition-all flex items-center gap-1.5">
            <Trash2 size={13} />Gorevi Sil
          </button>
          <div className="flex-1" />
          <button onClick={onClose}
            className="h-9 px-5 bg-[#F3F4F6] text-[#374151] text-[12px] font-semibold rounded-lg hover:bg-[#E5E7EB] cursor-pointer transition-all">
            Kapat
          </button>
        </div>
      </div>
    </>
  );
}

// ── Liste Görünümü ──
function TaskListView({ tasks, selectedIds, toggleSelect, toggleAll, onOpenDetail }: {
  tasks: Task[]; selectedIds: Set<string>; toggleSelect: (id: string) => void; toggleAll: () => void; onOpenDetail: (id: string) => void;
}) {
  const { updateTask, deleteTask, team, currentUser } = useAppStore();

  const cycleStatus = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    const next: Record<string, TaskStatus> = { pending: 'in_progress', in_progress: 'completed', completed: 'pending' };
    updateTask(task.id, { status: next[task.status], updatedAt: new Date().toISOString() });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)' }}>
      {/* Tablo Basligi */}
      <div className="grid grid-cols-[40px_1fr_140px_160px_110px_90px_48px] items-center h-10 px-4 bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
        <div className="flex justify-center">
          <input type="checkbox" checked={selectedIds.size === tasks.length && tasks.length > 0} onChange={toggleAll}
            className="w-3.5 h-3.5 rounded cursor-pointer accent-[#2563EB]" />
        </div>
        <span className="pl-1">Gorev</span>
        <span>Atanan</span>
        <span>Not</span>
        <span>Durum</span>
        <span>Oncelik</span>
        <span></span>
      </div>

      {/* Satirlar */}
      {tasks.length === 0 ? (
        <div className="py-16 text-center">
          <Sparkles size={28} className="text-[#D1D5DB] mx-auto mb-2" />
          <div className="text-[13px] font-medium text-[#111827]">Gorev bulunamadi</div>
          <div className="text-[11px] text-[#9CA3AF] mt-1">Filtreleri degistirin veya yeni gorev ekleyin</div>
        </div>
      ) : tasks.map(task => {
        const assignee = team.find(m => m.id === task.assignedTo);
        const assigner = team.find(m => m.id === task.assignedBy);
        const isSelected = selectedIds.has(task.id);
        const hasNote = task.note && task.note.trim().length > 0;

        return (
          <div key={task.id} onClick={() => onOpenDetail(task.id)}
            className={`grid grid-cols-[40px_1fr_140px_160px_110px_90px_48px] items-center h-14 px-4 border-b border-[#F3F4F6] last:border-b-0 group transition-all duration-150 cursor-pointer
              ${isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F9FAFB]'}`}>
            {/* Secim */}
            <div className="flex justify-center" onClick={e => e.stopPropagation()}>
              <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(task.id)}
                className="w-3.5 h-3.5 rounded cursor-pointer accent-[#2563EB]" />
            </div>

            {/* Gorev Adi */}
            <div className="pl-1 min-w-0 flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[13px] font-medium truncate ${task.status === 'completed' ? 'text-[#9CA3AF] line-through' : 'text-[#111827]'}`}>
                    {task.title}
                  </span>
                </div>
                {assigner && assigner.id !== task.assignedTo && (
                  <div className="text-[11px] text-[#D1D5DB] mt-0.5 truncate">{assigner.id === currentUser.id ? 'Ben' : assigner.name} tarafindan</div>
                )}
              </div>
            </div>

            {/* Atanan */}
            <div className="flex items-center gap-2">
              {assignee && (
                <>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0" style={{ backgroundColor: assignee.avatar }}>
                    {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span className="text-[12px] text-[#374151] truncate">{assignee.id === currentUser.id ? 'Ben' : assignee.name.split(' ')[0]}</span>
                </>
              )}
            </div>

            {/* Not */}
            <div className="min-w-0">
              {hasNote ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <StickyNote size={11} className="text-[#6366F1] shrink-0" />
                  <span className="text-[11px] text-[#6B7280] truncate">{task.note!.slice(0, 30)}{task.note!.length > 30 ? '...' : ''}</span>
                </div>
              ) : (
                <span className="text-[11px] text-[#D1D5DB] group-hover:text-[#9CA3AF] transition-colors flex items-center gap-1">
                  <Plus size={10} className="shrink-0" />Not ekle
                </span>
              )}
            </div>

            {/* Durum */}
            <div onClick={e => cycleStatus(e, task)}>
              <StatusBadge status={task.status} />
            </div>

            {/* Oncelik */}
            <PriorityBadge priority={task.priority} />

            {/* Islemler */}
            <div className="flex justify-center" onClick={e => e.stopPropagation()}>
              <button onClick={() => deleteTask(task.id)}
                className="w-7 h-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#FEF2F2] transition-all cursor-pointer">
                <Trash2 size={13} className="text-[#EF4444]/60" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Pano Görünümü ──
function KanbanView({ tasks, onOpenDetail }: { tasks: Task[]; onOpenDetail: (id: string) => void }) {
  const { team, currentUser } = useAppStore();
  const columns: { status: TaskStatus; title: string; color: string; accent: string }[] = [
    { status: 'pending', title: 'Bekleyen', color: '#F59E0B', accent: '#FEF3C7' },
    { status: 'in_progress', title: 'Devam Eden', color: '#3B82F6', accent: '#DBEAFE' },
    { status: 'completed', title: 'Tamamlanan', color: '#10B981', accent: '#D1FAE5' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status);
        return (
          <div key={col.status} className="flex flex-col min-h-0">
            {/* Kolon Basligi */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-[13px] font-semibold text-[#111827]">{col.title}</span>
              <span className="text-[11px] text-[#9CA3AF] bg-[#F3F4F6] rounded-full px-2 py-0.5 font-medium">{colTasks.length}</span>
            </div>

            {/* Kartlar */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {colTasks.map(task => {
                const assignee = team.find(m => m.id === task.assignedTo);
                const hasNote = task.note && task.note.trim().length > 0;
                return (
                  <div key={task.id} onClick={() => onOpenDetail(task.id)}
                    className="bg-white rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`text-[13px] font-medium leading-snug flex-1 ${task.status === 'completed' ? 'text-[#9CA3AF] line-through' : 'text-[#111827]'}`}>
                        {task.title}
                      </div>
                      <PriorityDot priority={task.priority} />
                    </div>
                    {hasNote && (
                      <div className="flex items-center gap-1 mb-2 text-[10px] text-[#6366F1]">
                        <StickyNote size={10} />
                        <span className="truncate">{task.note!.slice(0, 40)}{task.note!.length > 40 ? '...' : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      {assignee ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ backgroundColor: assignee.avatar }}>
                            {assignee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-[11px] text-[#6B7280]">{assignee.id === currentUser.id ? 'Ben' : assignee.name.split(' ')[0]}</span>
                        </div>
                      ) : <div />}
                      <div className="flex items-center gap-1 text-[10px] text-[#D1D5DB]">
                        <Calendar size={10} />{formatDate(task.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
              {colTasks.length === 0 && (
                <div className="text-center py-8">
                  <Circle size={20} className="text-[#E5E7EB] mx-auto mb-1.5" />
                  <div className="text-[12px] text-[#D1D5DB]">Gorev yok</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════
// EKİP — Coklu Ekip + Username (v3)
// ══════════════════════════════════════
function TeamView() {
  const { team, addTeamMember, removeTeamMember, currentUser, tasks, teams, activeTeamId, setActiveTeam, deleteTeam, renameTeam, allMembers, addMemberToTeam } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [addMode, setAddMode] = useState<'new' | 'existing'>('new');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [showTeamMenu, setShowTeamMenu] = useState(false);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [teamNameInput, setTeamNameInput] = useState('');
  const colors = ['#3730A3', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777', '#0891B2', '#4F46E5'];

  const activeTeam = teams.find(t => t.id === activeTeamId);
  const onlineCount = team.filter(m => m.isOnline).length;
  const totalActive = tasks.filter(t => t.status !== 'completed').length;
  const totalDone = tasks.filter(t => t.status === 'completed').length;

  // Mevcut ekipte olmayan uyeler
  const availableMembers = allMembers.filter(m => m.id !== currentUser.id && !team.find(tm => tm.id === m.id));

  const handleAddNew = () => {
    if (!name.trim() || !username.trim()) return;
    // Username benzersizlik kontrolu
    if (allMembers.find(m => m.username === username.trim().toLowerCase())) return;
    addTeamMember({ id: uid(), username: username.trim().toLowerCase(), name: name.trim(), role: role.trim() || 'Uye', avatar: colors[(allMembers.length) % colors.length], isOnline: false });
    setName(''); setUsername(''); setRole(''); setShowAdd(false);
  };

  const handleAddExisting = (memberId: string) => {
    addMemberToTeam(activeTeamId, memberId);
    setShowAdd(false);
  };

  const handleStartRename = () => {
    if (activeTeam) {
      setTeamNameInput(activeTeam.name);
      setEditingTeamName(true);
    }
  };

  const handleRename = () => {
    if (teamNameInput.trim() && activeTeam) {
      renameTeam(activeTeam.id, teamNameInput.trim());
    }
    setEditingTeamName(false);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ═══ HEADER ═══ */}
      <div className="px-8 pt-5 pb-5 flex items-center gap-6">
        <div className="shrink-0">
          {editingTeamName ? (
            <input value={teamNameInput} onChange={e => setTeamNameInput(e.target.value)}
              className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none outline-none border-b-2 border-[#2563EB] bg-transparent"
              autoFocus onBlur={handleRename} onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditingTeamName(false); }} />
          ) : (
            <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none cursor-pointer hover:text-[#2563EB] transition-colors"
              onClick={handleStartRename} title="Yeniden adlandir">
              {activeTeam?.name ?? 'Ekip'}
            </h1>
          )}
          <p className="text-[13px] text-[#6B7280] mt-1">{team.length} kisi · {onlineCount} cevrimici</p>
        </div>
        <div className="flex-1" />

        {/* Ekip Tablari */}
        <div className="flex items-center bg-white rounded-xl overflow-hidden shrink-0" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}>
          {teams.map(t => (
            <button key={t.id} onClick={() => setActiveTeam(t.id)}
              className={`h-9 px-4 text-[12px] font-medium transition-all cursor-pointer border-r border-[#F3F4F6] last:border-r-0 ${
                t.id === activeTeamId ? 'bg-[#06B6D4] text-white' : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
              }`}>
              {t.name}
              <span className={`ml-1.5 text-[10px] ${t.id === activeTeamId ? 'text-white/70' : 'text-[#D1D5DB]'}`}>{t.memberIds.length}</span>
            </button>
          ))}
        </div>

        {/* Ekip Islemleri */}
        <div className="relative shrink-0">
          <button onClick={() => setShowTeamMenu(!showTeamMenu)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#9CA3AF] hover:text-[#374151] hover:bg-[#F9FAFB] transition-all cursor-pointer"
            style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' }}>
            <MoreHorizontal size={18} />
          </button>
          {showTeamMenu && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setShowTeamMenu(false)} />
              <div className="absolute top-full right-0 mt-1 z-[101] bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-1 min-w-[180px]">
                <button onClick={() => { handleStartRename(); setShowTeamMenu(false); }}
                  className="w-full text-left px-3 py-2 text-[12px] text-[#374151] hover:bg-[#F3F4F6] cursor-pointer transition-colors">
                  Ekibi Yeniden Adlandir
                </button>
                {teams.length > 1 && (
                  <button onClick={() => { deleteTeam(activeTeamId); setShowTeamMenu(false); }}
                    className="w-full text-left px-3 py-2 text-[12px] text-[#EF4444] hover:bg-[#FEF2F2] cursor-pointer transition-colors">
                    Ekibi Sil
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <button onClick={() => { setShowAdd(true); setAddMode('new'); }}
          className="flex items-center gap-1.5 h-10 px-5 text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer shrink-0"
          style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)', boxShadow: '0 2px 8px rgba(6,182,212,0.25)' }}>
          <UserPlus size={15} />Kisi Ekle
        </button>
      </div>

      {/* ═══ OZET KARTLARI ═══ */}
      <div className="px-8 grid grid-cols-3 gap-4 mb-6">
        <TeamStatCard label="Toplam Uye" value={team.length} color="#6366F1" accent="#EDE9FE" icon={<Users size={16} className="text-[#6366F1]" />} />
        <TeamStatCard label="Aktif Gorev" value={totalActive} color="#3B82F6" accent="#DBEAFE" icon={<Clock size={16} className="text-[#3B82F6]" />} />
        <TeamStatCard label="Tamamlanan" value={totalDone} color="#10B981" accent="#D1FAE5" icon={<CheckCircle2 size={16} className="text-[#10B981]" />} />
      </div>

      {/* ═══ KISI EKLEME ═══ */}
      {showAdd && (
        <div className="mx-8 mb-5">
          {/* Tab: Yeni / Mevcut */}
          <div className="flex items-center gap-1 mb-3">
            <button onClick={() => setAddMode('new')}
              className={`h-8 px-3.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all ${addMode === 'new' ? 'bg-[#06B6D4] text-white' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}>
              Yeni Kisi
            </button>
            {availableMembers.length > 0 && (
              <button onClick={() => setAddMode('existing')}
                className={`h-8 px-3.5 rounded-lg text-[12px] font-medium cursor-pointer transition-all ${addMode === 'existing' ? 'bg-[#06B6D4] text-white' : 'text-[#6B7280] hover:bg-[#F3F4F6]'}`}>
                Mevcut Uyeden Ekle
                <span className="ml-1 text-[10px] opacity-70">{availableMembers.length}</span>
              </button>
            )}
            <div className="flex-1" />
            <button onClick={() => { setShowAdd(false); setName(''); setUsername(''); setRole(''); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] cursor-pointer transition-all">
              <X size={13} className="text-[#9CA3AF]" />
            </button>
          </div>

          {addMode === 'new' ? (
            <div className="flex items-center gap-2 bg-white rounded-2xl px-4 h-[52px] transition-all duration-200"
              style={{ boxShadow: '0 0 0 2px rgba(6,182,212,0.2), 0 4px 20px rgba(6,182,212,0.08)' }}>
              <UserPlus size={15} className="text-[#2563EB] shrink-0" />
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Ad Soyad" autoFocus
                className="flex-1 text-[14px] text-[#111827] outline-none placeholder:text-[#CBD5E1] bg-transparent min-w-0 font-medium"
                onKeyDown={e => { if (e.key === 'Enter') handleAddNew(); if (e.key === 'Escape') setShowAdd(false); }} />
              <div className="w-px h-5 bg-[#E5E7EB]" />
              <span className="text-[12px] text-[#CBD5E1] shrink-0">@</span>
              <input value={username} onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())} placeholder="kullaniciadi"
                className="w-[140px] text-[14px] text-[#111827] outline-none placeholder:text-[#CBD5E1] bg-transparent font-medium"
                onKeyDown={e => { if (e.key === 'Enter') handleAddNew(); if (e.key === 'Escape') setShowAdd(false); }} />
              <div className="w-px h-5 bg-[#E5E7EB]" />
              <input value={role} onChange={e => setRole(e.target.value)} placeholder="Rol"
                className="w-[100px] text-[13px] text-[#111827] outline-none placeholder:text-[#CBD5E1] bg-transparent"
                onKeyDown={e => { if (e.key === 'Enter') handleAddNew(); if (e.key === 'Escape') setShowAdd(false); }} />
              <button onClick={handleAddNew}
                className={`h-8 px-4 text-[12px] font-semibold rounded-lg transition-all cursor-pointer shrink-0 ${
                  name.trim() && username.trim() ? 'bg-[#06B6D4] text-white hover:bg-[#0891B2]' : 'bg-[#F3F4F6] text-[#D1D5DB] cursor-default'
                }`}
                style={name.trim() && username.trim() ? { boxShadow: '0 1px 2px rgba(37,99,235,0.3)' } : undefined}>
                Ekle
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)' }}>
              {availableMembers.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-all">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: m.avatar }}>
                    {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#111827] truncate">{m.name}</div>
                    <div className="text-[11px] text-[#9CA3AF]">@{m.username} · {m.role}</div>
                  </div>
                  <button onClick={() => handleAddExisting(m.id)}
                    className="h-7 px-3 bg-[#06B6D4] text-white text-[11px] font-semibold rounded-lg hover:bg-[#0891B2] cursor-pointer transition-all"
                    style={{ boxShadow: '0 1px 2px rgba(37,99,235,0.3)' }}>
                    Ekibe Ekle
                  </button>
                </div>
              ))}
              {availableMembers.length === 0 && (
                <div className="py-8 text-center text-[12px] text-[#9CA3AF]">Tum uyeler zaten bu ekipte</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ EKIP TABLOSU ═══ */}
      <div className="px-8 pb-8">
        <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)' }}>
          {/* Tablo Basligi */}
          <div className="grid grid-cols-[1fr_120px_80px_80px_80px_48px] items-center h-10 px-5 bg-[#F9FAFB] border-b border-[#E5E7EB] text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider">
            <span>Uye</span>
            <span>Rol</span>
            <span className="text-center">Aktif</span>
            <span className="text-center">Bitti</span>
            <span className="text-center">Durum</span>
            <span></span>
          </div>

          {/* Satirlar */}
          {team.map(m => {
            const active = tasks.filter(t => t.assignedTo === m.id && t.status !== 'completed').length;
            const done = tasks.filter(t => t.assignedTo === m.id && t.status === 'completed').length;

            return (
              <div key={m.id}
                className="grid grid-cols-[1fr_120px_80px_80px_80px_48px] items-center h-16 px-5 border-b border-[#F3F4F6] last:border-b-0 group hover:bg-[#F9FAFB] transition-all duration-150">
                {/* Avatar + Ad + Username */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                      style={{ backgroundColor: m.avatar }}>
                      {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${m.isOnline ? 'bg-[#22C55E]' : 'bg-[#D1D5DB]'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#111827] truncate flex items-center gap-1.5">
                      {m.name}
                      {m.id === currentUser.id && (
                        <span className="text-[9px] text-[#06B6D4] bg-[#ECFEFF] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Sen</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF] mt-0.5">@{m.username}</div>
                  </div>
                </div>

                {/* Rol */}
                <div className="text-[12px] text-[#6B7280] font-medium">{m.role}</div>

                {/* Aktif */}
                <div className="text-center">
                  {active > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-[#DBEAFE] text-[12px] font-bold text-[#1E40AF]">{active}</span>
                  ) : (
                    <span className="text-[12px] text-[#D1D5DB]">0</span>
                  )}
                </div>

                {/* Bitti */}
                <div className="text-center">
                  {done > 0 ? (
                    <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full bg-[#D1FAE5] text-[12px] font-bold text-[#065F46]">{done}</span>
                  ) : (
                    <span className="text-[12px] text-[#D1D5DB]">0</span>
                  )}
                </div>

                {/* Durum */}
                <div className="flex justify-center">
                  {m.isOnline ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-full">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22C55E]" />
                      </span>
                      Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#9CA3AF] bg-[#F3F4F6] px-2 py-1 rounded-full">Cevrimdisi</span>
                  )}
                </div>

                {/* Cikar */}
                <div className="flex justify-center">
                  {m.id !== currentUser.id ? (
                    <button onClick={() => removeTeamMember(m.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#FEF2F2] transition-all cursor-pointer"
                      title="Ekipten cikar">
                      <Trash2 size={13} className="text-[#EF4444]/60" />
                    </button>
                  ) : <div className="w-7" />}
                </div>
              </div>
            );
          })}

          {team.length === 0 && (
            <div className="py-16 text-center">
              <Users size={28} className="text-[#D1D5DB] mx-auto mb-2" />
              <div className="text-[13px] font-medium text-[#111827]">Bu ekipte henuz uye yok</div>
              <div className="text-[11px] text-[#9CA3AF] mt-1">Kisi Ekle butonuyla ekibinizi kurun</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TeamStatCard({ label, value, color, accent, icon }: { label: string; value: number; color: string; accent: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 relative overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
      style={{ boxShadow: `0 0 0 1px ${color}08, 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px ${color}04` }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ background: `linear-gradient(135deg, ${color} 0%, transparent 60%)` }} />
      <div className="flex items-center justify-between relative">
        <div>
          <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.08em] mb-1">{label}</div>
          <div className="text-[24px] font-bold text-[#0F172A] leading-none">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accent }}>{icon}</div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// DOSYALAR — Grid + Preview (v2)
// ══════════════════════════════════════
function FilesView() {
  const { files, openFile, deleteFile, toggleFavorite, createFile } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'recent' | 'mine' | 'sheets' | 'notes' | 'favorites'>('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const sorted = [...files].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  const filtered = sorted.filter(f => {
    if (filter === 'notes' && f.type !== 'note') return false;
    if (filter === 'sheets' && f.type !== 'spreadsheet') return false;
    if (filter === 'favorites' && !f.isFavorite) return false;
    if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const recentFiles = sorted.slice(0, 3);
  const sheets = sorted.filter(f => f.type === 'spreadsheet');
  const notes = sorted.filter(f => f.type === 'note');

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Az once';
    if (mins < 60) return `${mins} dk once`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat once`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} gun once`;
    return formatDate(iso);
  };

  const showGrouped = filter === 'all' && !search;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* ═══ HEADER ═══ */}
      <div className="px-8 pt-5 pb-5 flex items-center gap-6">
        <div className="shrink-0">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none">Tablolar & Notlar</h1>
          <p className="text-[13px] text-[#6B7280] mt-1">{files.length} dosya{files.length > 0 ? ` · Son guncelleme: ${timeAgo(sorted[0]?.updatedAt)}` : ''}</p>
        </div>
        <div className="flex-1" />
        <button onClick={() => createFile('spreadsheet')}
          className="flex items-center gap-1.5 h-10 px-5 text-white text-[13px] font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)', boxShadow: '0 2px 8px rgba(6,182,212,0.25)' }}>
          <Plus size={15} />Yeni Tablo
        </button>
        <button onClick={() => createFile('note')}
          className="flex items-center gap-1.5 h-10 px-4 bg-white text-[#374151] text-[13px] font-semibold rounded-xl hover:bg-[#F9FAFB] transition-all cursor-pointer border border-[#E5E7EB]"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <Plus size={15} />Yeni Not
        </button>
      </div>

      {/* ═══ FILTER BAR ═══ */}
      <div className="px-8 pb-5 flex items-center gap-3">
        <div className="relative flex-1 max-w-[360px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CBD5E1]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tablo ve notlarda ara..."
            className="w-full h-10 pl-10 pr-4 bg-white border border-[#E5E7EB] rounded-xl text-[13px] outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/10 transition-all"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }} />
        </div>
        <div className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          {([['all', 'Tumu'], ['recent', 'Son kullanilan'], ['mine', 'Bana ait'], ['favorites', 'Favoriler']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key as typeof filter)}
              className={`h-9 px-3.5 text-[12px] transition-all cursor-pointer border-r border-[#E5E7EB] last:border-r-0 flex items-center gap-1
                ${filter === key ? 'bg-[#06B6D4] text-white font-medium' : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'}`}>
              {key === 'favorites' && <Star size={11} className={filter === 'favorites' ? 'fill-white' : ''} />}
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex bg-white border border-[#E5E7EB] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <button onClick={() => setViewMode('grid')}
            className={`h-9 px-3 flex items-center gap-1 text-[12px] transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#F3F4F6] text-[#111827] font-medium' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
            <GridIcon size={13} />Grid
          </button>
          <button onClick={() => setViewMode('list')}
            className={`h-9 px-3 flex items-center gap-1 text-[12px] transition-all cursor-pointer border-l border-[#E5E7EB] ${viewMode === 'list' ? 'bg-[#F3F4F6] text-[#111827] font-medium' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}>
            <LayoutList size={13} />Liste
          </button>
        </div>
      </div>

      {/* ═══ İÇERİK ═══ */}
      <div className="px-8 pb-8">
        {files.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-[#D1D5DB]" />
            </div>
            <div className="text-[16px] font-semibold text-[#111827] mb-1">Henuz icerik yok</div>
            <div className="text-[13px] text-[#9CA3AF] mb-5">Ilk tablonuzu veya notunuzu olusturun</div>
            <div className="flex justify-center gap-3">
              <button onClick={() => createFile('spreadsheet')} className="h-10 px-5 text-white text-[13px] font-semibold rounded-xl hover:opacity-90 cursor-pointer transition-all flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #2563EB 100%)', boxShadow: '0 2px 8px rgba(6,182,212,0.25)' }}>
                <Table2 size={15} />Yeni Tablo
              </button>
              <button onClick={() => createFile('note')} className="h-10 px-5 bg-white text-[#374151] text-[13px] font-semibold rounded-xl hover:bg-[#F9FAFB] cursor-pointer transition-all border border-[#E5E7EB] flex items-center gap-1.5">
                <FileText size={15} />Yeni Not
              </button>
            </div>
          </div>
        ) : showGrouped ? (
          /* ── GRUPLU GORUNUM ── */
          <div className="space-y-7">
            {/* Son Kullanilan */}
            {recentFiles.length > 0 && (
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[15px] font-bold text-[#111827]">Son kullanilan</span>
                  {files.length > 3 && (
                    <button onClick={() => setFilter('recent')} className="text-[12px] text-[#06B6D4] font-semibold hover:underline cursor-pointer flex items-center gap-0.5">
                      Tumunu gor <ChevronRight size={13} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {recentFiles.map(f => <FileCard key={f.id} file={f} timeAgo={timeAgo} featured />)}
                </div>
              </div>
            )}

            {/* Tum Tablolar */}
            {sheets.length > 0 && (
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#111827]">Tum Tablolar</span>
                    <span className="text-[11px] text-[#2563EB] bg-[#DBEAFE] rounded-full px-2 py-0.5 font-bold">{sheets.length}</span>
                  </div>
                  <button onClick={() => createFile('spreadsheet')} className="text-[12px] text-[#06B6D4] font-semibold hover:underline cursor-pointer flex items-center gap-0.5">
                    <Plus size={12} />Tablo ekle
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {sheets.map(f => <FileCard key={f.id} file={f} timeAgo={timeAgo} />)}
                </div>
              </div>
            )}

            {/* Tum Notlar */}
            {notes.length > 0 && (
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.03)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#111827]">Tum Notlar</span>
                    <span className="text-[11px] text-[#D97706] bg-[#FEF3C7] rounded-full px-2 py-0.5 font-bold">{notes.length}</span>
                  </div>
                  <button onClick={() => createFile('note')} className="text-[12px] text-[#06B6D4] font-semibold hover:underline cursor-pointer flex items-center gap-0.5">
                    <Plus size={12} />Not ekle
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {notes.map(f => <FileCard key={f.id} file={f} timeAgo={timeAgo} compact />)}
                </div>
              </div>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* ── GRID GORUNUM ── */
          <div>
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Search size={24} className="text-[#D1D5DB] mx-auto mb-2" />
                <div className="text-[13px] font-medium text-[#111827]">Dosya bulunamadi</div>
                <div className="text-[11px] text-[#9CA3AF] mt-1">Farkli bir filtre deneyin</div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {filtered.map(f => <FileCard key={f.id} file={f} timeAgo={timeAgo} featured />)}
              </div>
            )}
          </div>
        ) : (
          /* ── LISTE GORUNUM ── */
          <div className="bg-white rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02)' }}>
            <div className="grid grid-cols-[1fr_80px_120px_60px] px-5 h-10 items-center text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <span>Ad</span><span>Tur</span><span>Guncelleme</span><span></span>
            </div>
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-[13px] text-[#9CA3AF]">Dosya bulunamadi</div>
            ) : filtered.map(f => (
              <div key={f.id} onClick={() => openFile(f.id)}
                className="grid grid-cols-[1fr_80px_120px_60px] items-center px-5 h-13 border-b border-[#F3F4F6] last:border-b-0 hover:bg-[#F9FAFB] transition-colors duration-150 cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.type === 'spreadsheet' ? 'bg-[#DBEAFE]' : 'bg-[#FEF3C7]'}`}>
                    {f.type === 'spreadsheet' ? <Table2 size={14} className="text-[#2563EB]" /> : <FileText size={14} className="text-[#D97706]" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[13px] font-medium text-[#111827] truncate block">{f.title}</span>
                    {f.isFavorite && <Star size={10} className="fill-[#F59E0B] text-[#F59E0B] inline" />}
                  </div>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex w-fit ${f.type === 'spreadsheet' ? 'bg-[#DBEAFE] text-[#1E40AF]' : 'bg-[#FEF3C7] text-[#92400E]'}`}>
                  {f.type === 'note' ? 'Not' : 'Tablo'}
                </span>
                <span className="text-[12px] text-[#9CA3AF]">{timeAgo(f.updatedAt)}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={e => { e.stopPropagation(); toggleFavorite(f.id); }} className="p-1 rounded-md hover:bg-[#F3F4F6] cursor-pointer">
                    <Star size={13} className={f.isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D1D5DB]'} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteFile(f.id); }} className="p-1 rounded-md hover:bg-[#FEF2F2] cursor-pointer">
                    <Trash2 size={13} className="text-[#EF4444]/50" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dosya Karti (Featured = buyuk preview, Compact = kucuk not karti) ──
function FileCard({ file, timeAgo, featured, compact }: { file: AnyFile; timeAgo: (iso: string) => string; featured?: boolean; compact?: boolean }) {
  const { openFile, toggleFavorite } = useAppStore();
  const isSheet = file.type === 'spreadsheet';
  const accentBg = isSheet ? '#DBEAFE' : '#FEF3C7';
  const accentColor = isSheet ? '#2563EB' : '#D97706';
  const borderColor = isSheet ? 'rgba(37,99,235,0.15)' : 'rgba(217,119,6,0.15)';

  // ─── FEATURED KART (Son kullanilan + Grid) ───
  if (featured) {
    return (
      <div onClick={() => openFile(file.id)}
        className="bg-white rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-0.5 transition-all duration-200"
        style={{ boxShadow: `0 0 0 1.5px ${borderColor}, 0 2px 8px rgba(0,0,0,0.03)` }}>
        {/* Ust bar */}
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}40 100%)` }} />

        <div className="p-4">
          {/* Baslik satiri */}
          <div className="flex items-start gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: accentBg }}>
              {isSheet ? <Table2 size={16} style={{ color: accentColor }} /> : <FileText size={16} style={{ color: accentColor }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-bold text-[#111827] truncate leading-tight">{file.title}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: accentBg, color: accentColor }}>
                  {isSheet ? 'Tablo' : 'Not'}
                </span>
                {file.isFavorite && (
                  <span className="flex items-center gap-0.5 text-[9px] text-[#F59E0B] font-semibold">
                    <Star size={9} className="fill-[#F59E0B]" />Favori
                  </span>
                )}
              </div>
            </div>
            {/* Hover actions */}
            <button onClick={e => { e.stopPropagation(); toggleFavorite(file.id); }}
              className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#F3F4F6] transition-all cursor-pointer shrink-0">
              {file.isFavorite ? <CheckCircle2 size={14} className="text-[#2563EB]" /> : <MoreHorizontal size={14} className="text-[#9CA3AF]" />}
            </button>
          </div>

          {/* Avatar + zaman */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-5 h-5 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[7px] font-bold">IY</div>
            <span className="text-[11px] text-[#9CA3AF]">{timeAgo(file.updatedAt)}</span>
          </div>

          {/* Preview */}
          {isSheet ? <SheetPreview file={file as SpreadsheetFile} /> : <NotePreview file={file as NoteFile} />}
        </div>
      </div>
    );
  }

  // ─── COMPACT KART (Notlar icin) ───
  if (compact) {
    return (
      <div onClick={() => openFile(file.id)}
        className="bg-[#F8FAFC] rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:bg-white transition-all duration-200 p-3.5"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04)' }}>
        <div className="flex items-start gap-2 mb-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: accentBg }}>
            <FileText size={13} style={{ color: accentColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-[#111827] truncate leading-tight">{file.title}</div>
            <div className="text-[10px] text-[#9CA3AF] mt-0.5 truncate">
              {file.type === 'note' ? (file as NoteFile).blocks.find(b => b.content.trim() && b.type !== 'divider' && !b.type.startsWith('heading'))?.content.slice(0, 50) ?? '' : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[6px] font-bold">IY</div>
            <span className="text-[10px] text-[#9CA3AF]">Ben · {timeAgo(file.updatedAt)}</span>
          </div>
          <button onClick={e => { e.stopPropagation(); toggleFavorite(file.id); }} className="cursor-pointer">
            <Star size={12} className={file.isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'} />
          </button>
        </div>
      </div>
    );
  }

  // ─── NORMAL KART (Tum Tablolar listesi) ───
  return (
    <div onClick={() => openFile(file.id)}
      className="bg-[#F8FAFC] rounded-xl overflow-hidden cursor-pointer group hover:-translate-y-0.5 hover:bg-white transition-all duration-200 p-3.5"
      style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04)' }}>
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: accentBg }}>
          {isSheet ? <Table2 size={14} style={{ color: accentColor }} /> : <FileText size={14} style={{ color: accentColor }} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-[#111827] truncate">{file.title}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: accentBg, color: accentColor }}>
              {isSheet ? 'Tablo' : 'Not'}
            </span>
            {isSheet && (
              <span className="text-[10px] text-[#9CA3AF]">· {Object.keys((file as SpreadsheetFile).sheets[0]?.cells ?? {}).length} hucre</span>
            )}
          </div>
        </div>
        {/* Avatar sag ust */}
        <div className="w-7 h-7 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[8px] font-bold shrink-0 opacity-70">IY</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-[#34C759] flex items-center justify-center text-white text-[6px] font-bold">AK</div>
          <span className="text-[10px] text-[#9CA3AF]">{timeAgo(file.updatedAt)}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); toggleFavorite(file.id); }} className="cursor-pointer">
          <Star size={13} className={file.isFavorite ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'} />
        </button>
      </div>
    </div>
  );
}

// ── Tablo Onizleme ──
function SheetPreview({ file }: { file: SpreadsheetFile }) {
  const sheet = file.sheets.find(s => s.id === file.activeSheetId) ?? file.sheets[0];
  if (!sheet) return null;

  return (
    <div className="rounded-lg border border-[#E5E7EB] overflow-hidden bg-white">
      <table className="w-full text-[10px]">
        <tbody>
          {Array.from({ length: 4 }, (_, r) => {
            const hasData = Array.from({ length: 4 }, (_, c) => sheet.cells[`${r}:${c}`]).some(Boolean);
            if (r > 0 && !hasData) return null;
            return (
              <tr key={r} className={r === 0 ? 'bg-[#F8FAFC]' : 'hover:bg-[#F9FAFB]'}>
                {Array.from({ length: 4 }, (_, c) => {
                  const cell = sheet.cells[`${r}:${c}`];
                  return (
                    <td key={c} className={`px-2.5 py-1.5 border-b border-r border-[#F3F4F6] last:border-r-0 truncate max-w-[90px] ${
                      cell?.format?.bold ? 'font-bold text-[#374151]' : 'text-[#6B7280]'
                    }`}>{cell?.value ?? ''}</td>
                  );
                })}
              </tr>
            );
          }).filter(Boolean)}
        </tbody>
      </table>
    </div>
  );
}

// ── Not Onizleme ──
function NotePreview({ file }: { file: NoteFile }) {
  const previewBlocks = file.blocks.filter(b => b.content.trim() && b.type !== 'divider').slice(0, 4);
  if (previewBlocks.length === 0) return null;

  return (
    <div className="bg-[#F8FAFC] rounded-lg px-3.5 py-3 space-y-1.5 border border-[#F3F4F6]">
      {previewBlocks.map(b => (
        <div key={b.id} className="text-[11px] text-[#6B7280] truncate leading-relaxed">
          {b.type === 'checklist' && (
            <span className={`mr-1.5 ${b.meta?.checked ? 'text-[#10B981]' : 'text-[#D1D5DB]'}`}>{b.meta?.checked ? '☑' : '☐'}</span>
          )}
          {b.type === 'bulletList' && <span className="mr-1.5 text-[#9CA3AF]">•</span>}
          {b.type.startsWith('heading') ? (
            <span className="font-bold text-[#374151]">{b.content}</span>
          ) : (
            b.content
          )}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════
// TAKVİM — Premium (v2)
// ══════════════════════════════════════
function CalendarView() {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, setHomeTab } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newColor, setNewColor] = useState('#2563EB');
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const monthNames = ['Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran', 'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik'];
  const dayNames = ['Pzt', 'Sal', 'Car', 'Per', 'Cum', 'Cmt', 'Paz'];
  const eventColors = ['#2563EB', '#10B981', '#EF4444', '#F59E0B', '#6366F1', '#EC4899', '#06B6D4'];

  const getDateStr = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const eventsForDate = (dateStr: string) => calendarEvents.filter(e => e.date === dateStr);

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];
  const selectedDateObj = selectedDate ? new Date(selectedDate) : null;
  const upcomingEvents = calendarEvents.filter(e => e.date >= todayStr).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const totalEvents = calendarEvents.filter(e => e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length;

  const handleAdd = () => {
    if (!newTitle.trim() || !selectedDate) return;
    addCalendarEvent({ id: uid(), title: newTitle.trim(), date: selectedDate, note: newNote, color: newColor, createdAt: new Date().toISOString() });
    setNewTitle(''); setNewNote(''); setNewColor('#2563EB'); setShowAdd(false);
  };

  const handleSaveNote = (eventId: string) => {
    updateCalendarEvent(eventId, { note: editNote });
    setEditingEvent(null);
  };

  const isWeekend = (day: number) => {
    const d = new Date(year, month, day).getDay();
    return d === 0 || d === 6;
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {/* ═══ HEADER ═══ */}
      <div className="px-8 pt-5 pb-4 flex items-center gap-4">
        <button onClick={() => setHomeTab('dashboard')} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F3F4F6] transition-all cursor-pointer">
          <ChevronRight size={18} className="text-[#9CA3AF] rotate-180" />
        </button>
        <div className="shrink-0">
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight leading-none">Takvim</h1>
          <p className="text-[13px] text-[#6B7280] mt-1">{totalEvents} plan bu ay · {upcomingEvents.length} yaklasan</p>
        </div>
        <div className="flex-1" />

        {/* Ay navigasyonu — turkuaz tema */}
        <div className="flex items-center gap-1 shrink-0 bg-white rounded-xl px-1 h-10" style={{ boxShadow: '0 0 0 1px rgba(6,182,212,0.1), 0 2px 8px rgba(6,182,212,0.06)' }}>
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ECFEFF] cursor-pointer transition-all">
            <ChevronRight size={15} className="text-[#06B6D4] rotate-180" />
          </button>
          <span className="text-[14px] font-bold text-[#0F172A] min-w-[130px] text-center">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ECFEFF] cursor-pointer transition-all">
            <ChevronRight size={15} className="text-[#06B6D4]" />
          </button>
        </div>
        <button onClick={() => { setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDate(todayStr); }}
          className="h-10 px-5 bg-gradient-to-r from-[#06B6D4] to-[#2563EB] text-white text-[12px] font-semibold rounded-xl hover:opacity-90 cursor-pointer transition-all"
          style={{ boxShadow: '0 2px 8px rgba(6,182,212,0.25)' }}>
          Bugun
        </button>
      </div>

      {/* ═══ STAT KARTLARI ═══ */}
      <div className="px-8 pb-4 flex gap-3">
        <div className="flex-1 rounded-xl p-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)', boxShadow: '0 0 0 1px rgba(6,182,212,0.1)' }}>
          <div className="text-[10px] font-bold text-[#06B6D4] uppercase tracking-wider">Bu Ay</div>
          <div className="text-[22px] font-bold text-[#0E7490] leading-tight mt-0.5">{totalEvents}</div>
          <div className="text-[10px] text-[#67E8F9]">plan</div>
        </div>
        <div className="flex-1 rounded-xl p-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', boxShadow: '0 0 0 1px rgba(37,99,235,0.1)' }}>
          <div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Yaklasan</div>
          <div className="text-[22px] font-bold text-[#1E40AF] leading-tight mt-0.5">{upcomingEvents.length}</div>
          <div className="text-[10px] text-[#93C5FD]">etkinlik</div>
        </div>
        <div className="flex-1 rounded-xl p-3 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', boxShadow: '0 0 0 1px rgba(16,185,129,0.1)' }}>
          <div className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Tamamlanan</div>
          <div className="text-[22px] font-bold text-[#059669] leading-tight mt-0.5">{calendarEvents.filter(e => e.date < todayStr).length}</div>
          <div className="text-[10px] text-[#86EFAC]">gecmis</div>
        </div>
      </div>

      {/* ═══ ANA ICERIK ═══ */}
      <div className="px-8 pb-8 flex-1 flex gap-5 min-h-0">
        {/* Sol: Takvim Grid */}
        <div className="flex-1 bg-white rounded-2xl overflow-hidden flex flex-col" style={{ boxShadow: '0 0 0 1px rgba(6,182,212,0.08), 0 2px 12px rgba(0,0,0,0.03)' }}>
          {/* Gun basliklari */}
          <div className="grid grid-cols-7" style={{ background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' }}>
            {dayNames.map((d, i) => (
              <div key={d} className={`text-center py-3 text-[11px] font-bold uppercase tracking-wider ${i >= 5 ? 'text-[#67E8F9]/60' : 'text-[#67E8F9]'}`}>{d}</div>
            ))}
          </div>
          {/* Gunler */}
          <div className="grid grid-cols-7 flex-1">
            {Array.from({ length: startOffset }, (_, i) => (
              <div key={`empty-${i}`} className="border-b border-r border-[#F3F4F6] bg-[#FAFAFA]" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dateStr = getDateStr(day);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const dayEvents = eventsForDate(dateStr);
              const weekend = isWeekend(day);
              const isPast = dateStr < todayStr;

              return (
                <div key={day} onClick={() => setSelectedDate(dateStr)}
                  className={`border-b border-r border-[#F3F4F6] p-1.5 cursor-pointer transition-all duration-150 min-h-[76px] relative ${
                    isSelected ? 'bg-gradient-to-br from-[#EFF6FF] to-[#ECFEFF] z-10' : weekend ? 'bg-[#FAFBFC]' : 'hover:bg-[#F8FAFC]'
                  }`}
                  style={isSelected ? { boxShadow: 'inset 0 0 0 2px rgba(6,182,212,0.3)' } : undefined}>
                  <div className={`text-[12px] font-bold mb-1 w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                    isToday ? 'bg-gradient-to-br from-[#06B6D4] to-[#2563EB] text-white shadow-md shadow-cyan-500/25' :
                    isSelected ? 'text-[#06B6D4] bg-[#ECFEFF]' :
                    isPast ? 'text-[#CBD5E1]' :
                    weekend ? 'text-[#94A3B8]' : 'text-[#374151]'
                  }`}>{day}</div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div key={ev.id} className="text-[9px] font-semibold truncate px-1.5 py-[3px] rounded-md"
                        style={{ backgroundColor: `${ev.color}12`, color: ev.color, borderLeft: `2px solid ${ev.color}` }}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-[#06B6D4] font-bold px-1.5">+{dayEvents.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sag Panel */}
        <div className="w-[320px] shrink-0 flex flex-col gap-4">
          {/* Secili gun detay */}
          <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(6,182,212,0.08), 0 2px 12px rgba(0,0,0,0.03)' }}>
            {selectedDate ? (
              <>
                {/* Gun header — gradient */}
                <div className="px-5 py-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' }}>
                  <div className="relative">
                    <div className="text-[28px] font-bold text-white leading-none">{selectedDateObj!.getDate()}</div>
                    <div className="text-[13px] text-[#67E8F9] font-medium mt-0.5">
                      {monthNames[selectedDateObj!.getMonth()]} · {['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'][selectedDateObj!.getDay()]}
                    </div>
                    {selectedEvents.length > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        <div className="text-[10px] text-[#06B6D4] bg-[#06B6D4]/15 px-2 py-0.5 rounded-full font-bold">{selectedEvents.length} plan</div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => setShowAdd(true)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 cursor-pointer transition-all backdrop-blur-sm">
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                  {/* Yeni plan formu */}
                  {showAdd && (
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#06B6D4]/10 space-y-2.5 mb-2">
                      <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Plan basligi..."
                        className="w-full h-9 px-3 bg-white border border-[#E5E7EB] rounded-lg text-[13px] outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10" autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setShowAdd(false); }} />
                      <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Not ekle..."
                        className="w-full h-14 px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-[12px] outline-none focus:border-[#06B6D4] resize-none" />
                      <div className="flex items-center gap-1.5">
                        {eventColors.map(c => (
                          <button key={c} onClick={() => setNewColor(c)}
                            className={`w-5 h-5 rounded-full cursor-pointer transition-all ${newColor === c ? 'ring-2 ring-offset-1 scale-110' : 'hover:scale-110'}`}
                            style={{ backgroundColor: c, '--tw-ring-color': c } as React.CSSProperties} />
                        ))}
                        <div className="flex-1" />
                        <button onClick={() => setShowAdd(false)} className="text-[11px] text-[#9CA3AF] hover:text-[#6B7280] cursor-pointer">Vazgec</button>
                        <button onClick={handleAdd}
                          className={`h-7 px-3 text-[11px] font-semibold rounded-lg cursor-pointer transition-all ${
                            newTitle.trim() ? 'bg-gradient-to-r from-[#06B6D4] to-[#2563EB] text-white' : 'bg-[#F3F4F6] text-[#D1D5DB]'
                          }`}>Ekle</button>
                      </div>
                    </div>
                  )}

                  {/* Etkinlikler */}
                  {selectedEvents.length === 0 && !showAdd ? (
                    <div className="text-center py-10">
                      <div className="w-12 h-12 rounded-2xl bg-[#ECFEFF] flex items-center justify-center mx-auto mb-3">
                        <Calendar size={20} className="text-[#06B6D4]" />
                      </div>
                      <div className="text-[13px] font-medium text-[#111827]">Plan yok</div>
                      <div className="text-[11px] text-[#9CA3AF] mt-1">Bu gun icin plan olusturun</div>
                      <button onClick={() => setShowAdd(true)}
                        className="mt-3 h-8 px-4 bg-gradient-to-r from-[#06B6D4] to-[#2563EB] text-white text-[11px] font-semibold rounded-lg cursor-pointer transition-all hover:opacity-90"
                        style={{ boxShadow: '0 2px 6px rgba(6,182,212,0.25)' }}>
                        <Plus size={12} className="inline mr-1" />Plan Ekle
                      </button>
                    </div>
                  ) : selectedEvents.map(ev => (
                    <div key={ev.id} className="rounded-xl p-3.5 transition-all hover:shadow-sm group"
                      style={{ backgroundColor: `${ev.color}06`, border: `1px solid ${ev.color}15` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                          <span className="text-[13px] font-bold text-[#111827]">{ev.title}</span>
                        </div>
                        <button onClick={() => deleteCalendarEvent(ev.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#FEF2F2] cursor-pointer transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 size={11} className="text-[#EF4444]/50" />
                        </button>
                      </div>
                      {editingEvent === ev.id ? (
                        <div className="mt-2">
                          <textarea value={editNote} onChange={e => setEditNote(e.target.value)}
                            className="w-full h-20 px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-[12px] text-[#374151] outline-none focus:border-[#06B6D4] resize-none" autoFocus />
                          <div className="flex justify-end gap-2 mt-1.5">
                            <button onClick={() => setEditingEvent(null)} className="text-[10px] text-[#9CA3AF] cursor-pointer">Vazgec</button>
                            <button onClick={() => handleSaveNote(ev.id)}
                              className="h-6 px-3 bg-[#06B6D4] text-white text-[10px] font-semibold rounded-md cursor-pointer">Kaydet</button>
                          </div>
                        </div>
                      ) : (
                        <div onClick={() => { setEditingEvent(ev.id); setEditNote(ev.note); }}
                          className="ml-5 cursor-pointer">
                          {ev.note ? (
                            <p className="text-[11px] text-[#6B7280] leading-relaxed">{ev.note}</p>
                          ) : (
                            <p className="text-[11px] text-[#D1D5DB] italic hover:text-[#9CA3AF] transition-colors flex items-center gap-1">
                              <StickyNote size={10} />Tikla, not ekle...
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ECFEFF] to-[#DBEAFE] flex items-center justify-center mx-auto mb-4">
                    <Calendar size={28} className="text-[#06B6D4]" />
                  </div>
                  <div className="text-[15px] font-bold text-[#111827]">Gun secin</div>
                  <div className="text-[12px] text-[#9CA3AF] mt-1">Planlarinizi gorun ve duzenleyin</div>
                </div>
              </div>
            )}
          </div>

          {/* Yaklasan planlar */}
          <div className="bg-white rounded-2xl p-4 overflow-hidden" style={{ boxShadow: '0 0 0 1px rgba(6,182,212,0.08), 0 2px 12px rgba(0,0,0,0.03)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-md bg-[#ECFEFF] flex items-center justify-center">
                <CalendarClock size={11} className="text-[#06B6D4]" />
              </div>
              <span className="text-[11px] font-bold text-[#06B6D4] uppercase tracking-wider">Yaklasan</span>
            </div>
            <div className="space-y-1.5">
              {upcomingEvents.map(ev => {
                const d = new Date(ev.date);
                const diffDays = Math.ceil((d.getTime() - today.getTime()) / 86400000);
                return (
                  <div key={ev.id} onClick={() => { setSelectedDate(ev.date); setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1)); }}
                    className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F8FAFC] cursor-pointer transition-all group">
                    <div className="w-2 h-9 rounded-full shrink-0" style={{ backgroundColor: ev.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[#111827] truncate">{ev.title}</div>
                      <div className="text-[10px] text-[#9CA3AF]">{d.getDate()} {monthNames[d.getMonth()]}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                      diffDays <= 2 ? 'bg-[#FEE2E2] text-[#EF4444]' : diffDays <= 5 ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#F3F4F6] text-[#9CA3AF]'
                    }`}>{diffDays === 0 ? 'Bugun' : diffDays === 1 ? 'Yarin' : `${diffDays} gun`}</span>
                  </div>
                );
              })}
              {upcomingEvents.length === 0 && (
                <div className="text-[11px] text-[#D1D5DB] text-center py-3">Yaklasan plan yok</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
// SHARED COMPONENTS
// ══════════════════════════════════════
const PRIORITY_LABELS: Record<TaskPriority, string> = { low: 'Dusuk', medium: 'Orta', high: 'Yuksek' };

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, { bg: string; text: string; label: string }> = {
    pending: { bg: '#FEF3C7', text: '#92400E', label: 'Bekleyen' },
    in_progress: { bg: '#DBEAFE', text: '#1E40AF', label: 'Devam Eden' },
    completed: { bg: '#D1FAE5', text: '#065F46', label: 'Tamamlandi' },
  };
  const s = styles[status];
  return <span className="inline-flex text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>;
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const styles: Record<TaskPriority, { bg: string; text: string; label: string }> = {
    low: { bg: '#F3F4F6', text: '#6B7280', label: 'Dusuk' },
    medium: { bg: '#FEF3C7', text: '#92400E', label: 'Orta' },
    high: { bg: '#FEE2E2', text: '#991B1B', label: 'Yuksek' },
  };
  const s = styles[priority];
  return <span className="inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.text }}>{s.label}</span>;
}

function PriorityDot({ priority }: { priority: TaskPriority }) {
  const colors: Record<TaskPriority, string> = { high: '#EF4444', medium: '#F59E0B', low: '#D1D5DB' };
  return <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ backgroundColor: colors[priority] }} />;
}

function FilterPill({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-8 px-3 text-[12px] text-[#6B7280] hover:text-[#111827] rounded-lg transition-all cursor-pointer border border-transparent hover:border-[#E5E7EB] hover:bg-white">
        <span className="text-[#9CA3AF]">{label}:</span>
        <span className="font-medium text-[#374151]">{value}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-20 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 min-w-[140px]">
            {options.map(([k, l]) => (
              <button key={k} onClick={() => { onChange(k); setOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-[12px] text-[#374151] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MiniTable({ file }: { file: AnyFile }) {
  if (file.type !== 'spreadsheet') return null;
  const sheet = file.sheets.find(s => s.id === file.activeSheetId) ?? file.sheets[0];
  if (!sheet) return null;
  return (
    <div className="flex-1 overflow-hidden">
      <table className="w-full text-[11px]">
        <tbody>
          {Array.from({ length: 6 }, (_, r) => (
            <tr key={r} className={r === 0 ? 'bg-[#F9FAFB]' : ''}>
              {Array.from({ length: 5 }, (_, c) => {
                const cell = sheet.cells[`${r}:${c}`];
                return (
                  <td key={c} className={`px-3 py-2 border-b border-r border-[#F3F4F6] last:border-r-0 ${cell?.format?.bold ? 'font-semibold text-[#374151]' : 'text-[#6B7280]'}`}
                    style={{ backgroundColor: cell?.format?.fillColor }}>{cell?.value ?? ''}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

// ══════════════════════════════════════
// ANA EXPORT
// ══════════════════════════════════════
export default function Home() {
  const homeTab = useAppStore(s => s.homeTab);
  return (
    <div className="flex-1 bg-[#F8FAFC] overflow-hidden flex flex-col rounded-tl-2xl">
      {homeTab === 'dashboard' && <DashboardView />}
      {homeTab === 'tasks' && <TasksView />}
      {homeTab === 'team' && <TeamView />}
      {homeTab === 'files' && <FilesView />}
      {homeTab === 'calendar' && <CalendarView />}
      {homeTab === 'users' && <UsersView />}
    </div>
  );
}
