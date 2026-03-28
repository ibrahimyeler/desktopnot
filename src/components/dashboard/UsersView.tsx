import { useState, useEffect } from 'react';
import { Shield, UserCheck, UserX, Trash2, Loader2, Users, Clock, CheckCircle2 } from 'lucide-react';
import { adminApi, ApiUser } from '../../services/api';

type Tab = 'all' | 'pending';

export default function UsersView() {
  const [tab, setTab] = useState<Tab>('all');
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [pendingUsers, setPendingUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allRes, pendingRes] = await Promise.all([
        adminApi.listUsers({ limit: '200' }),
        adminApi.listPendingUsers(),
      ]);
      setUsers(allRes.users || []);
      setPendingUsers(pendingRes.users || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApi.approveUser(id);
      await fetchData();
    } catch {} finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApi.rejectUser(id);
      await fetchData();
    } catch {} finally { setActionLoading(null); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullaniciyi silmek istediginizden emin misiniz?')) return;
    setActionLoading(id);
    try {
      await adminApi.deleteUser(id);
      await fetchData();
    } catch {} finally { setActionLoading(null); }
  };

  const handleRoleChange = async (id: string, role: string) => {
    setActionLoading(id);
    try {
      await adminApi.updateRole(id, role);
      await fetchData();
    } catch {} finally { setActionLoading(null); }
  };

  const list = tab === 'pending' ? pendingUsers : users;

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
            <Shield size={22} className="text-[#06B6D4]" />
            Kullanicilar
          </h1>
          <p className="text-[13px] text-[#64748B] mt-1">
            Toplam {users.length} kullanici, {pendingUsers.length} onay bekliyor
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 w-fit shadow-sm border border-[#E2E8F0]">
        <button
          onClick={() => setTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
            tab === 'all' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Users size={14} />
          Tum Kullanicilar
          <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${tab === 'all' ? 'bg-white/20' : 'bg-[#F1F5F9]'}`}>{users.length}</span>
        </button>
        <button
          onClick={() => setTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
            tab === 'pending' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          <Clock size={14} />
          Onay Bekleyenler
          {pendingUsers.length > 0 && (
            <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${tab === 'pending' ? 'bg-[#EF4444] text-white' : 'bg-[#FEF2F2] text-[#EF4444]'}`}>
              {pendingUsers.length}
            </span>
          )}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-[#06B6D4]" />
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 text-[#94A3B8] text-[14px]">
          {tab === 'pending' ? 'Onay bekleyen kullanici yok.' : 'Henuz kullanici yok.'}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F1F5F9]">
                <th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Kullanici</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">E-posta</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Rol</th>
                <th className="text-left px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Durum</th>
                <th className="text-right px-5 py-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Islemler</th>
              </tr>
            </thead>
            <tbody>
              {list.map(u => (
                <tr key={u.id} className="border-b border-[#F8FAFC] hover:bg-[#F8FAFC]/60 transition-colors">
                  {/* Name + Avatar */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#06B6D4] flex items-center justify-center text-white text-[11px] font-bold">
                        {u.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                      </div>
                      <span className="text-[13px] font-semibold text-[#0F172A]">{u.name || '-'}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{u.email}</td>

                  {/* Role */}
                  <td className="px-5 py-3.5">
                    {tab === 'all' ? (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        disabled={actionLoading === u.id}
                        className="text-[12px] font-semibold px-2.5 py-1 rounded-lg border border-[#E2E8F0] bg-white outline-none cursor-pointer focus:border-[#06B6D4]"
                      >
                        <option value="user">Kullanici</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className="text-[12px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">{u.role}</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    {u.is_approved ? (
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#22C55E] bg-[#F0FDF4] px-2.5 py-1 rounded-lg">
                        <CheckCircle2 size={12} />Onayli
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#F59E0B] bg-[#FFFBEB] px-2.5 py-1 rounded-lg">
                        <Clock size={12} />Bekliyor
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {actionLoading === u.id ? (
                        <Loader2 size={14} className="animate-spin text-[#94A3B8]" />
                      ) : (
                        <>
                          {!u.is_approved && (
                            <>
                              <button
                                onClick={() => handleApprove(u.id)}
                                title="Onayla"
                                className="p-1.5 rounded-lg text-[#22C55E] hover:bg-[#F0FDF4] transition-colors cursor-pointer"
                              >
                                <UserCheck size={15} />
                              </button>
                              <button
                                onClick={() => handleReject(u.id)}
                                title="Reddet"
                                className="p-1.5 rounded-lg text-[#F59E0B] hover:bg-[#FFFBEB] transition-colors cursor-pointer"
                              >
                                <UserX size={15} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(u.id)}
                            title="Sil"
                            className="p-1.5 rounded-lg text-[#EF4444] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
