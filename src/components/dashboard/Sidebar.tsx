import { LayoutGrid, CheckSquare, Table2, Users, Plus, LogOut, ChevronDown, Briefcase, Check, Settings, Shield, X, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import { authApi, ApiError } from '../../services/api';
import type { HomeTab } from '../../types';

const NAV: { id: HomeTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'dashboard', label: 'Ana Alan', icon: LayoutGrid },
  { id: 'tasks', label: 'Gorevler', icon: CheckSquare },
  { id: 'files', label: 'Tablolar & Notlar', icon: Table2 },
  { id: 'team', label: 'Ekip', icon: Users },
];

// ── Sifre Degistirme Modali ──
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = currentPass.trim() && newPass.trim().length >= 6 && newPass === confirmPass && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await authApi.changePassword(currentPass, newPass);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) setError('Mevcut sifre hatali.');
        else setError(err.message);
      } else {
        setError('Baglanti hatasi. Tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[200]" onClick={onClose} />
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/10 flex items-center justify-center">
                <Lock size={15} className="text-[#06B6D4]" />
              </div>
              <span className="text-[15px] font-bold text-[#0F172A]">Sifre Degistir</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#94A3B8] hover:text-[#64748B] hover:bg-[#F1F5F9] transition-colors cursor-pointer">
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {success ? (
              <div className="flex flex-col items-center py-6">
                <div className="w-12 h-12 rounded-full bg-[#DCFCE7] flex items-center justify-center mb-3">
                  <CheckCircle2 size={24} className="text-[#16A34A]" />
                </div>
                <p className="text-[14px] font-semibold text-[#0F172A]">Sifre basariyla guncellendi</p>
              </div>
            ) : (
              <>
                {error && (
                  <div className="px-3.5 py-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-[12px] text-[#DC2626]">{error}</div>
                )}

                {/* Mevcut Sifre */}
                <div>
                  <label className="text-[12px] font-semibold text-[#374151] mb-1.5 block">Mevcut Sifre</label>
                  <div className="relative">
                    <input
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPass}
                      onChange={e => setCurrentPass(e.target.value)}
                      placeholder="Mevcut sifreniz"
                      className="w-full h-10 px-3.5 pr-10 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] cursor-pointer">
                      {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Yeni Sifre */}
                <div>
                  <label className="text-[12px] font-semibold text-[#374151] mb-1.5 block">Yeni Sifre</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      placeholder="En az 6 karakter"
                      className="w-full h-10 px-3.5 pr-10 bg-white border border-[#E2E8F0] rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] cursor-pointer">
                      {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Sifre Tekrar */}
                <div>
                  <label className="text-[12px] font-semibold text-[#374151] mb-1.5 block">Yeni Sifre (Tekrar)</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    placeholder="Yeni sifrenizi tekrar girin"
                    className={`w-full h-10 px-3.5 bg-white border rounded-xl text-[13px] text-[#0F172A] outline-none placeholder:text-[#CBD5E1] focus:ring-2 transition-all ${
                      confirmPass && confirmPass !== newPass
                        ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10'
                        : 'border-[#E2E8F0] focus:border-[#06B6D4] focus:ring-[#06B6D4]/10'
                    }`}
                  />
                  {confirmPass && confirmPass !== newPass && (
                    <p className="text-[11px] text-[#EF4444] mt-1">Sifreler eslesmiyor</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={onClose}
                    className="flex-1 py-2.5 text-[13px] font-semibold text-[#64748B] bg-[#F1F5F9] rounded-xl hover:bg-[#E2E8F0] transition-colors cursor-pointer">
                    Vazgec
                  </button>
                  <button type="submit" disabled={!canSubmit}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                      canSubmit
                        ? 'text-white shadow-lg shadow-cyan-500/25 hover:brightness-110'
                        : 'bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                    }`}
                    style={canSubmit ? { background: 'linear-gradient(135deg, #06B6D4, #0891B2)' } : undefined}>
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {loading ? 'Kaydediliyor...' : 'Sifreyi Guncelle'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

// ── Sidebar ──
export default function Sidebar() {
  const { sidebarOpen, homeTab, setHomeTab, setRoute, currentUser, tasks, team, teams, activeTeamId, setActiveTeam, createTeam, user, logout } = useAppStore();
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!sidebarOpen) return null;

  const myPendingTasks = tasks.filter(t => t.assignedTo === currentUser.id && t.status !== 'completed').length;
  const activeTeam = teams.find(t => t.id === activeTeamId);

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    createTeam(newTeamName.trim());
    setNewTeamName('');
    setShowNewTeam(false);
    setShowTeamDropdown(false);
  };

  return (
    <div className="w-[240px] h-full flex flex-col shrink-0 select-none"
      style={{ background: 'linear-gradient(180deg, #0F2027 0%, #203A43 50%, #2C5364 100%)' }}>

      {/* Workspace / Ekip Secici */}
      <div className="px-5 pt-5 pb-4 relative">
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => setShowTeamDropdown(!showTeamDropdown)}>
          <div className="w-8 h-8 rounded-lg bg-[#06B6D4] flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Briefcase size={14} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-white tracking-tight truncate">{activeTeam?.name ?? 'NotApp'}</span>
              <span className="text-[10px] text-[#67E8F9] bg-[#06B6D4]/20 px-1.5 py-0.5 rounded font-semibold">{team.length}</span>
            </div>
          </div>
          <ChevronDown size={13} className={`text-[#94A3B8] group-hover:text-white transition-all ${showTeamDropdown ? 'rotate-180' : ''}`} />
        </div>

        {/* Ekip Dropdown */}
        {showTeamDropdown && (
          <>
            <div className="fixed inset-0 z-[100]" onClick={() => { setShowTeamDropdown(false); setShowNewTeam(false); }} />
            <div className="absolute left-4 right-4 top-full mt-1 z-[101] bg-[#0F2027] border border-[#06B6D4]/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
              <div className="px-3 py-2 text-[10px] font-bold text-[#67E8F9] uppercase tracking-wider">Ekiplerim</div>
              {teams.map(t => (
                <button key={t.id}
                  onClick={() => { setActiveTeam(t.id); setShowTeamDropdown(false); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all cursor-pointer ${
                    t.id === activeTeamId ? 'bg-[#06B6D4]/15 text-white' : 'text-[#CBD5E1] hover:bg-white/5'
                  }`}>
                  <div className="w-6 h-6 rounded-md bg-[#06B6D4]/20 flex items-center justify-center text-[10px] font-bold text-[#67E8F9]">
                    {t.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold truncate">{t.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">{t.memberIds.length}</span>
                    </div>
                  </div>
                  {t.id === activeTeamId && <Check size={13} className="text-[#06B6D4] shrink-0" />}
                </button>
              ))}
              <div className="border-t border-white/[0.08] mt-1 pt-1 pb-1.5">
                {showNewTeam ? (
                  <div className="px-3 py-1.5">
                    <input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Ekip adi..."
                      className="w-full h-8 px-2.5 bg-white/5 border border-[#06B6D4]/20 rounded-lg text-[12px] text-white outline-none placeholder:text-[#64748B] focus:border-[#06B6D4]/50"
                      autoFocus onKeyDown={e => { if (e.key === 'Enter') handleCreateTeam(); if (e.key === 'Escape') setShowNewTeam(false); }} />
                    <div className="flex gap-1.5 mt-1.5">
                      <button onClick={() => setShowNewTeam(false)} className="text-[10px] text-[#64748B] hover:text-[#CBD5E1] cursor-pointer">Vazgec</button>
                      <div className="flex-1" />
                      <button onClick={handleCreateTeam}
                        className={`text-[10px] font-semibold cursor-pointer px-2 py-0.5 rounded ${newTeamName.trim() ? 'text-[#06B6D4] bg-[#06B6D4]/10' : 'text-[#64748B]'}`}>
                        Olustur
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowNewTeam(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-[#64748B] hover:text-[#CBD5E1] hover:bg-white/5 transition-all cursor-pointer">
                    <Plus size={13} />Yeni Ekip Olustur
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Profile */}
      <div className="mx-4 mb-5 p-3 rounded-xl bg-white/[0.08] border border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#06B6D4] flex items-center justify-center text-white text-[11px] font-bold shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400/20">
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white truncate">{currentUser.name}</div>
            <div className="text-[11px] text-[#94A3B8]">@{currentUser.username}</div>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] shadow-lg shadow-green-500/30" />
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-3 space-y-0.5">
        <div className="px-3 mb-2.5 text-[10px] font-bold text-[#67E8F9]/60 uppercase tracking-[0.12em]">Menu</div>
        {NAV.map(item => {
          const active = homeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setHomeTab(item.id); setRoute('home'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-[10px] rounded-xl text-[13px] transition-all duration-150 cursor-pointer relative
                ${active
                  ? 'bg-white/[0.12] text-white font-semibold'
                  : 'text-[#CBD5E1] hover:bg-white/[0.06] hover:text-white'}`}
            >
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#06B6D4] rounded-r-full shadow-lg shadow-cyan-500/30" />}
              <item.icon size={17} strokeWidth={active ? 2.2 : 1.5} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'tasks' && myPendingTasks > 0 && (
                <span className="text-[10px] bg-[#EF4444] text-white rounded-full min-w-[20px] h-[20px] flex items-center justify-center font-bold px-1 shadow-lg shadow-red-500/30">
                  {myPendingTasks}
                </span>
              )}
              {item.id === 'team' && (
                <span className="text-[11px] text-[#94A3B8] font-medium">{team.length}</span>
              )}
            </button>
          );
        })}

        {/* Admin — Kullanicilar */}
        {user?.role === 'admin' && (
          <>
            <div className="px-3 mt-5 mb-2.5 text-[10px] font-bold text-[#67E8F9]/60 uppercase tracking-[0.12em]">Yonetim</div>
            <button
              onClick={() => { setHomeTab('users'); setRoute('home'); }}
              className={`w-full flex items-center gap-2.5 px-3 py-[10px] rounded-xl text-[13px] transition-all duration-150 cursor-pointer relative
                ${homeTab === 'users'
                  ? 'bg-white/[0.12] text-white font-semibold'
                  : 'text-[#CBD5E1] hover:bg-white/[0.06] hover:text-white'}`}
            >
              {homeTab === 'users' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#06B6D4] rounded-r-full shadow-lg shadow-cyan-500/30" />}
              <Shield size={17} strokeWidth={homeTab === 'users' ? 2.2 : 1.5} />
              <span className="flex-1 text-left">Kullanicilar</span>
            </button>
          </>
        )}

        {/* Hizli Olustur */}
        <div className="pt-5 mt-4 border-t border-white/[0.08]">
          <div className="px-3 mb-2.5 text-[10px] font-bold text-[#67E8F9]/60 uppercase tracking-[0.12em]">Hizli Olustur</div>
          <button
            onClick={() => useAppStore.getState().createFile('note')}
            className="w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] text-[#CBD5E1]/70 hover:bg-white/[0.06] hover:text-white transition-all duration-150 cursor-pointer"
          >
            <Plus size={15} />
            <span>Yeni Not</span>
          </button>
          <button
            onClick={() => useAppStore.getState().createFile('spreadsheet')}
            className="w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] text-[#CBD5E1]/70 hover:bg-white/[0.06] hover:text-white transition-all duration-150 cursor-pointer"
          >
            <Plus size={15} />
            <span>Yeni Tablo</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/[0.08] space-y-0.5">
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] text-[#CBD5E1]/70 hover:bg-white/[0.06] hover:text-white transition-all duration-150 cursor-pointer"
        >
          <Settings size={15} />
          <span>Ayarlar</span>
        </button>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-2.5 px-3 py-[8px] rounded-xl text-[13px] text-[#F87171] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-all duration-150 cursor-pointer"
        >
          <LogOut size={15} />
          <span>Cikis Yap</span>
        </button>
      </div>

      {/* Sifre Degistirme Modali */}
      {showSettings && <ChangePasswordModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
