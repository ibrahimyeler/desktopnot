import { create } from 'zustand';
import type { AnyFile, NoteFile, SpreadsheetFile, Block, BlockType, CellData, CellFormat, Sheet, AppRoute, HomeTab, Task, TeamMember, Team, CalendarEvent } from '../types';
import { uid, cellKey, createBlock, createNote, createSpreadsheet, createTask } from '../types';

// ── Demo Veriler ──
const demoNote = createNote('Proje Notları');
demoNote.icon = '📝';
demoNote.blocks = [
  createBlock('heading1', 'Proje Planı'),
  createBlock('text', 'Bu belge proje ile ilgili notları içerir.'),
  createBlock('heading2', 'Yapılacaklar'),
  createBlock('checklist', 'Tasarım taslağını tamamla', { checked: true }),
  createBlock('checklist', 'Backend API entegrasyonu', { checked: false }),
  createBlock('checklist', 'Test senaryolarını yaz', { checked: false }),
  createBlock('divider'),
  createBlock('heading2', 'Notlar'),
  createBlock('bulletList', 'Toplantı her Pazartesi 10:00'),
  createBlock('bulletList', 'Sprint süresi 2 hafta'),
  createBlock('quote', 'İyi yazılım, iyi planlama ile başlar.'),
  createBlock('text', ''),
];

const demoSheet = createSpreadsheet('Urun Envanter Tablosu');
demoSheet.icon = '📊';
demoSheet.isFavorite = true;
const sh = demoSheet.sheets[0];
const data: Record<string, { v: string; bold?: boolean; fill?: string }> = {
  '0:0': { v: 'Urun', bold: true, fill: '#F1F5F9' },
  '0:1': { v: 'Kategori', bold: true, fill: '#F1F5F9' },
  '0:2': { v: 'Stok', bold: true, fill: '#F1F5F9' },
  '0:3': { v: 'Fiyat', bold: true, fill: '#F1F5F9' },
  '1:0': { v: 'MacBook Air' }, '1:1': { v: 'Elektronik' }, '1:2': { v: '24' }, '1:3': { v: '42.999' },
  '2:0': { v: 'iPad Pro' }, '2:1': { v: 'Elektronik' }, '2:2': { v: '18' }, '2:3': { v: '34.499' },
  '3:0': { v: 'AirPods Pro' }, '3:1': { v: 'Aksesuar' }, '3:2': { v: '156' }, '3:3': { v: '7.999' },
};
for (const [k, d] of Object.entries(data)) {
  sh.cells[k] = { value: d.v, format: d.bold ? { bold: true, fillColor: d.fill } : undefined };
}

// Ek demo dosyalar
const demoSheet2 = createSpreadsheet('Musteri Listesi');
demoSheet2.icon = '📋';
const sh2 = demoSheet2.sheets[0];
const data2: Record<string, { v: string; bold?: boolean; fill?: string }> = {
  '0:0': { v: 'Musteri', bold: true, fill: '#F1F5F9' }, '0:1': { v: 'Telefon', bold: true, fill: '#F1F5F9' }, '0:2': { v: 'Sehir', bold: true, fill: '#F1F5F9' },
  '1:0': { v: 'Ali Veli' }, '1:1': { v: '0532 111 22 33' }, '1:2': { v: 'Istanbul' },
  '2:0': { v: 'Zeynep Ak' }, '2:1': { v: '0544 222 33 44' }, '2:2': { v: 'Ankara' },
};
for (const [k, d] of Object.entries(data2)) {
  sh2.cells[k] = { value: d.v, format: d.bold ? { bold: true, fillColor: d.fill } : undefined };
}

const demoSheet3 = createSpreadsheet('Gelir-Gider Takibi');
demoSheet3.icon = '💰';
const sh3 = demoSheet3.sheets[0];
const data3: Record<string, { v: string; bold?: boolean; fill?: string }> = {
  '0:0': { v: 'Tarih', bold: true, fill: '#F1F5F9' }, '0:1': { v: 'Aciklama', bold: true, fill: '#F1F5F9' }, '0:2': { v: 'Tutar', bold: true, fill: '#F1F5F9' },
  '1:0': { v: '01.03.2026' }, '1:1': { v: 'Kira odemesi' }, '1:2': { v: '-12.500' },
  '2:0': { v: '05.03.2026' }, '2:1': { v: 'Musteri odemesi' }, '2:2': { v: '+45.000' },
};
for (const [k, d] of Object.entries(data3)) {
  sh3.cells[k] = { value: d.v, format: d.bold ? { bold: true, fillColor: d.fill } : undefined };
}

const demoNote2 = createNote('Toplanti Notlari - 24 Mart');
demoNote2.icon = '📋';
demoNote2.isFavorite = true;
demoNote2.blocks = [
  createBlock('heading1', 'Haftalik Toplanti'),
  createBlock('text', 'Bugunku toplantida sunlar konusuldu:'),
  createBlock('bulletList', 'Istanbul teslimati 27 Nisana alindi'),
  createBlock('bulletList', 'Yeni sofor: Mehmet Yildiz'),
  createBlock('checklist', 'Fatura sistemi guncellenmeli', { checked: false }),
];

const demoNote3 = createNote('Operasyon Plani');
demoNote3.icon = '📑';
demoNote3.blocks = [
  createBlock('heading1', 'Operasyon Plani'),
  createBlock('text', 'Haftalik teslimat rotalari belirlendi'),
  createBlock('checklist', 'Rota optimizasyonu', { checked: true }),
  createBlock('checklist', 'Arac bakim takvimi', { checked: false }),
];

const demoNote4 = createNote('Yeni Sofor Oryantasyon');
demoNote4.icon = '📄';
demoNote4.blocks = [
  createBlock('heading1', 'Oryantasyon Rehberi'),
  createBlock('text', 'Mehmet Yildiz - 26 Nisan basliyor'),
  createBlock('bulletList', 'Arac teslim proseduru'),
  createBlock('bulletList', 'Guvenlik egitimi'),
];

// Demo ekip
const ME: TeamMember = { id: 'me', username: 'ibrahimyeler', name: 'Ibrahim Yeler', role: 'Yonetici', avatar: '#007AFF', isOnline: true };
const demoMembers: TeamMember[] = [
  ME,
  { id: 'driver1', username: 'ahmetkaya', name: 'Ahmet Kaya', role: 'Sofor', avatar: '#34C759', isOnline: true },
  { id: 'member1', username: 'aysedemir', name: 'Ayse Demir', role: 'Muhasebe', avatar: '#FF9500', isOnline: false },
];

// Demo ekipler
const demoTeams: Team[] = [
  { id: 'team-is', name: 'Is Ekibi', memberIds: ['me', 'driver1', 'member1'], createdAt: new Date().toISOString() },
  { id: 'team-gundelik', name: 'Gundelik', memberIds: ['me'], createdAt: new Date().toISOString() },
];

// Demo görevler
const demoTasks: Task[] = [
  { ...createTask('İstanbul deposundan malzeme al', 'driver1', 'me', 'high'), status: 'in_progress' },
  { ...createTask('Fatura ödemelerini kontrol et', 'member1', 'me', 'medium') },
  { ...createTask('Haftalık rapor hazırla', 'me', 'me', 'medium'), status: 'in_progress' },
  { ...createTask('Müşteri toplantısı notlarını gönder', 'me', 'me', 'low'), status: 'completed' },
];

// ── Store ──
interface AppState {
  route: AppRoute;
  setRoute: (r: AppRoute) => void;

  homeTab: HomeTab;
  setHomeTab: (t: HomeTab) => void;

  // Kullanici
  currentUser: TeamMember;

  // Tum uyeler (global havuz)
  allMembers: TeamMember[];
  addMember: (m: TeamMember) => void;
  removeMember: (id: string) => void;

  // Ekipler
  teams: Team[];
  activeTeamId: string;
  createTeam: (name: string) => void;
  deleteTeam: (id: string) => void;
  renameTeam: (id: string, name: string) => void;
  setActiveTeam: (id: string) => void;
  addMemberToTeam: (teamId: string, memberId: string) => void;
  removeMemberFromTeam: (teamId: string, memberId: string) => void;

  // Aktif ekip uyelerine erisim
  team: TeamMember[];
  addTeamMember: (m: TeamMember) => void;
  removeTeamMember: (id: string) => void;

  // Görevler
  tasks: Task[];
  addTask: (t: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Takvim
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (e: CalendarEvent) => void;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Dosyalar
  files: AnyFile[];
  activeFileId: string | null;

  // Not editörü
  focusedBlockId: string | null;

  // Tablo editörü
  activeCell: { row: number; col: number } | null;
  selection: { start: { row: number; col: number }; end: { row: number; col: number } } | null;
  isEditing: boolean;
  editValue: string;

  // UI
  sidebarOpen: boolean;
  inspectorOpen: boolean;

  // Dosya işlemleri
  createFile: (type: 'note' | 'spreadsheet') => void;
  openFile: (id: string) => void;
  deleteFile: (id: string) => void;
  updateFileTitle: (id: string, title: string) => void;
  toggleFavorite: (id: string) => void;
  goHome: () => void;
  importFile: (name: string, content: string, ext: string) => void;

  // Not blok işlemleri
  addBlock: (afterId: string | null, type: BlockType, content?: string, meta?: Block['meta']) => string;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  changeBlockType: (blockId: string, newType: BlockType) => void;
  setFocusedBlock: (id: string | null) => void;

  // Tablo işlemleri
  setActiveCell: (pos: { row: number; col: number } | null) => void;
  setSelection: (sel: { start: { row: number; col: number }; end: { row: number; col: number } } | null) => void;
  startEditing: (val?: string) => void;
  stopEditing: (save?: boolean) => void;
  setEditValue: (val: string) => void;
  setCellValue: (row: number, col: number, val: string) => void;
  setCellFormat: (fmt: Partial<CellFormat>) => void;
  addSheet: () => void;
  removeSheet: (id: string) => void;
  renameSheet: (id: string, name: string) => void;
  setActiveSheet: (id: string) => void;

  toggleSidebar: () => void;
  toggleInspector: () => void;

  // Helpers
  getActiveFile: () => AnyFile | null;
  getActiveNote: () => NoteFile | null;
  getActiveSpreadsheet: () => SpreadsheetFile | null;
  getActiveSheet: () => Sheet | null;
  getCell: (row: number, col: number) => CellData | undefined;
}

export const useAppStore = create<AppState>((set, get) => ({
  route: 'splash',
  setRoute: (r) => set({ route: r }),

  homeTab: 'dashboard',
  setHomeTab: (t) => set({ homeTab: t, route: 'home', activeFileId: null }),

  currentUser: ME,

  allMembers: demoMembers,
  addMember: (m) => set(s => ({ allMembers: [...s.allMembers, m] })),
  removeMember: (id) => set(s => ({
    allMembers: s.allMembers.filter(m => m.id !== id),
    teams: s.teams.map(t => ({ ...t, memberIds: t.memberIds.filter(mid => mid !== id) })),
  })),

  teams: demoTeams,
  activeTeamId: 'team-is',
  createTeam: (name) => {
    const t: Team = { id: uid(), name, memberIds: [get().currentUser.id], createdAt: new Date().toISOString() };
    set(s => ({ teams: [...s.teams, t], activeTeamId: t.id }));
  },
  deleteTeam: (id) => set(s => {
    const teams = s.teams.filter(t => t.id !== id);
    return { teams, activeTeamId: s.activeTeamId === id ? (teams[0]?.id ?? '') : s.activeTeamId };
  }),
  renameTeam: (id, name) => set(s => ({ teams: s.teams.map(t => t.id === id ? { ...t, name } : t) })),
  setActiveTeam: (id) => set({ activeTeamId: id }),
  addMemberToTeam: (teamId, memberId) => set(s => ({
    teams: s.teams.map(t => t.id === teamId && !t.memberIds.includes(memberId) ? { ...t, memberIds: [...t.memberIds, memberId] } : t),
  })),
  removeMemberFromTeam: (teamId, memberId) => set(s => ({
    teams: s.teams.map(t => t.id === teamId ? { ...t, memberIds: t.memberIds.filter(id => id !== memberId) } : t),
  })),

  // Computed: aktif ekip uyeleri
  get team() {
    const s = get();
    const activeTeam = s.teams.find(t => t.id === s.activeTeamId);
    if (!activeTeam) return s.allMembers;
    return s.allMembers.filter(m => activeTeam.memberIds.includes(m.id));
  },
  addTeamMember: (m) => {
    const s = get();
    // Uye havuzda yoksa ekle
    if (!s.allMembers.find(x => x.id === m.id)) {
      set(st => ({ allMembers: [...st.allMembers, m] }));
    }
    // Aktif ekibe ekle
    s.addMemberToTeam(s.activeTeamId, m.id);
  },
  removeTeamMember: (id) => {
    const s = get();
    s.removeMemberFromTeam(s.activeTeamId, id);
  },

  tasks: demoTasks,
  addTask: (t) => set(s => ({ tasks: [t, ...s.tasks] })),
  updateTask: (id, updates) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
  deleteTask: (id) => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

  calendarEvents: [
    { id: 'ce1', title: 'Istanbul teslimati', date: '2026-03-27', note: 'Depodan malzeme alinacak, Ahmet sofor', color: '#2563EB', createdAt: new Date().toISOString() },
    { id: 'ce2', title: 'Musteri toplantisi', date: '2026-03-28', note: '', color: '#10B981', createdAt: new Date().toISOString() },
    { id: 'ce3', title: 'Fatura son odeme', date: '2026-03-31', note: 'Elektrik + su faturalari', color: '#EF4444', createdAt: new Date().toISOString() },
  ],
  addCalendarEvent: (e) => set(s => ({ calendarEvents: [...s.calendarEvents, e] })),
  updateCalendarEvent: (id, updates) => set(s => ({ calendarEvents: s.calendarEvents.map(e => e.id === id ? { ...e, ...updates } : e) })),
  deleteCalendarEvent: (id) => set(s => ({ calendarEvents: s.calendarEvents.filter(e => e.id !== id) })),

  files: [demoSheet, demoNote2, demoSheet3, demoNote, demoSheet2, demoNote3, demoNote4],
  activeFileId: null,

  focusedBlockId: null,
  activeCell: null,
  selection: null,
  isEditing: false,
  editValue: '',
  sidebarOpen: true,
  inspectorOpen: true,

  // ── Dosya ──
  createFile: (type) => {
    const f = type === 'note' ? createNote() : createSpreadsheet();
    set((s) => ({ files: [f, ...s.files], activeFileId: f.id, route: 'editor' }));
  },

  openFile: (id) => set({ activeFileId: id, route: 'editor', activeCell: null, selection: null, isEditing: false, focusedBlockId: null }),

  deleteFile: (id) => set((s) => {
    const files = s.files.filter((f) => f.id !== id);
    return { files, activeFileId: s.activeFileId === id ? null : s.activeFileId, route: s.activeFileId === id ? 'home' : s.route };
  }),

  updateFileTitle: (id, title) => set((s) => ({
    files: s.files.map((f) => f.id === id ? { ...f, title, updatedAt: new Date().toISOString() } : f),
  })),

  toggleFavorite: (id) => set((s) => ({
    files: s.files.map((f) => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f),
  })),

  importFile: (name, content, ext) => {
    const title = name.replace(/\.[^.]+$/, '');
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      const note = createNote(title);
      note.icon = '🖼️';
      note.blocks = [createBlock('image', content)];
      set((s) => ({ files: [note, ...s.files], activeFileId: note.id, route: 'editor' as AppRoute }));
      return;
    }
    if (ext === 'csv') {
      const sp = createSpreadsheet(title);
      sp.icon = '📊';
      const sheet = sp.sheets[0];
      const rows = content.split('\n').filter((l) => l.trim());
      rows.forEach((row, ri) => {
        row.split(',').forEach((cell, ci) => {
          const val = cell.trim().replace(/^"|"$/g, '');
          if (val) sheet.cells[cellKey(ri, ci)] = { value: val, format: ri === 0 ? { bold: true, fillColor: '#F1F5F9' } : undefined };
        });
      });
      set((s) => ({ files: [sp, ...s.files], activeFileId: sp.id, route: 'editor' as AppRoute }));
      return;
    }
    const note = createNote(title);
    const lines = content.split('\n').filter((l) => l.trim());
    if (lines.length > 0) {
      note.blocks = lines.map((line) => {
        const t = line.trim();
        if (t.startsWith('# ')) return createBlock('heading1', t.slice(2));
        if (t.startsWith('## ')) return createBlock('heading2', t.slice(3));
        if (t.startsWith('### ')) return createBlock('heading3', t.slice(4));
        if (t.startsWith('- [ ] ')) return createBlock('checklist', t.slice(6), { checked: false });
        if (t.startsWith('- [x] ')) return createBlock('checklist', t.slice(6), { checked: true });
        if (t.startsWith('- ') || t.startsWith('* ')) return createBlock('bulletList', t.slice(2));
        if (/^\d+\.\s/.test(t)) return createBlock('numberedList', t.replace(/^\d+\.\s/, ''));
        if (t.startsWith('> ')) return createBlock('quote', t.slice(2));
        if (t === '---') return createBlock('divider');
        return createBlock('text', t);
      });
    }
    const icons: Record<string, string> = { txt: '📝', md: '📑', doc: '📃', docx: '📃', rtf: '📃', pdf: '📕', xls: '📊', xlsx: '📊', ppt: '📙', pptx: '📙' };
    note.icon = icons[ext] ?? '📄';
    set((s) => ({ files: [note, ...s.files], activeFileId: note.id, route: 'editor' as AppRoute }));
  },

  goHome: () => set({ route: 'home', activeFileId: null, activeCell: null, selection: null, isEditing: false }),

  // ── Not Blokları ──
  addBlock: (afterId, type, content = '', meta) => {
    const block = createBlock(type, content, meta);
    set((s) => {
      const note = s.getActiveNote();
      if (!note) return s;
      const idx = afterId ? note.blocks.findIndex((b) => b.id === afterId) : note.blocks.length - 1;
      const blocks = [...note.blocks];
      blocks.splice(idx + 1, 0, block);
      return { files: s.files.map((f) => f.id === note.id ? { ...f, blocks, updatedAt: new Date().toISOString() } : f), focusedBlockId: block.id };
    });
    return block.id;
  },

  updateBlock: (blockId, updates) => set((s) => {
    const note = s.getActiveNote();
    if (!note) return s;
    return { files: s.files.map((f) => f.id === note.id ? { ...f, blocks: (f as NoteFile).blocks.map((b) => b.id === blockId ? { ...b, ...updates } : b), updatedAt: new Date().toISOString() } : f) };
  }),

  deleteBlock: (blockId) => set((s) => {
    const note = s.getActiveNote();
    if (!note) return s;
    let blocks = note.blocks.filter((b) => b.id !== blockId);
    if (blocks.length === 0) blocks = [createBlock('text')];
    return { files: s.files.map((f) => f.id === note.id ? { ...f, blocks } : f) };
  }),

  changeBlockType: (blockId, newType) => set((s) => {
    const note = s.getActiveNote();
    if (!note) return s;
    return { files: s.files.map((f) => f.id === note.id ? { ...f, blocks: (f as NoteFile).blocks.map((b) => b.id === blockId ? { ...b, type: newType, meta: newType === 'checklist' ? { checked: false } : b.meta } : b) } : f) };
  }),

  setFocusedBlock: (id) => set({ focusedBlockId: id }),

  // ── Tablo ──
  setActiveCell: (pos) => set({ activeCell: pos, selection: pos ? { start: pos, end: pos } : null }),
  setSelection: (sel) => set({ selection: sel }),

  startEditing: (val) => {
    const { activeCell, getCell } = get();
    if (!activeCell) return;
    const c = getCell(activeCell.row, activeCell.col);
    set({ isEditing: true, editValue: val ?? c?.formula ?? c?.value ?? '' });
  },

  stopEditing: (save = true) => {
    const { isEditing, activeCell, editValue, setCellValue } = get();
    if (!isEditing || !activeCell) { set({ isEditing: false }); return; }
    if (save) setCellValue(activeCell.row, activeCell.col, editValue);
    set({ isEditing: false, editValue: '' });
  },

  setEditValue: (val) => set({ editValue: val }),

  setCellValue: (row, col, val) => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp) return s;
    const sheet = sp.sheets.find((sh) => sh.id === sp.activeSheetId);
    if (!sheet) return s;
    const key = cellKey(row, col);
    const newCells = { ...sheet.cells };
    if (!val) delete newCells[key]; else newCells[key] = { ...newCells[key], value: val };
    return { files: s.files.map((f) => f.id === sp.id ? { ...f, updatedAt: new Date().toISOString(), sheets: (f as SpreadsheetFile).sheets.map((sh) => sh.id === sp.activeSheetId ? { ...sh, cells: newCells } : sh) } : f) };
  }),

  setCellFormat: (fmt) => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp) return s;
    const sheet = sp.sheets.find((sh) => sh.id === sp.activeSheetId);
    if (!sheet || !s.activeCell) return s;
    const range = s.selection ?? { start: s.activeCell, end: s.activeCell };
    const newCells = { ...sheet.cells };
    const r0 = Math.min(range.start.row, range.end.row), r1 = Math.max(range.start.row, range.end.row);
    const c0 = Math.min(range.start.col, range.end.col), c1 = Math.max(range.start.col, range.end.col);
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      const k = cellKey(r, c);
      const existing = newCells[k];
      newCells[k] = { value: existing?.value ?? '', format: { ...existing?.format, ...fmt } };
    }
    return { files: s.files.map((f) => f.id === sp.id ? { ...f, sheets: (f as SpreadsheetFile).sheets.map((sh) => sh.id === sp.activeSheetId ? { ...sh, cells: newCells } : sh) } : f) };
  }),

  addSheet: () => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp) return s;
    const sh: Sheet = { id: uid(), name: `Sayfa ${sp.sheets.length + 1}`, cells: {}, colWidths: {} };
    return { files: s.files.map((f) => f.id === sp.id ? { ...f, sheets: [...(f as SpreadsheetFile).sheets, sh], activeSheetId: sh.id } : f) };
  }),

  removeSheet: (id) => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp || sp.sheets.length <= 1) return s;
    const sheets = sp.sheets.filter((sh) => sh.id !== id);
    return { files: s.files.map((f) => f.id === sp.id ? { ...f, sheets, activeSheetId: sp.activeSheetId === id ? sheets[0].id : sp.activeSheetId } : f) };
  }),

  renameSheet: (id, name) => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp) return s;
    return { files: s.files.map((f) => f.id === sp.id ? { ...f, sheets: (f as SpreadsheetFile).sheets.map((sh) => sh.id === id ? { ...sh, name } : sh) } : f) };
  }),

  setActiveSheet: (id) => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp) return s;
    return { files: s.files.map((f) => f.id === sp.id ? { ...f, activeSheetId: id } : f), activeCell: null, selection: null, isEditing: false };
  }),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleInspector: () => set((s) => ({ inspectorOpen: !s.inspectorOpen })),

  // ── Helpers ──
  getActiveFile: () => { const s = get(); return s.files.find((f) => f.id === s.activeFileId) ?? null; },
  getActiveNote: () => { const f = get().getActiveFile(); return f?.type === 'note' ? f as NoteFile : null; },
  getActiveSpreadsheet: () => { const f = get().getActiveFile(); return f?.type === 'spreadsheet' ? f as SpreadsheetFile : null; },
  getActiveSheet: () => { const sp = get().getActiveSpreadsheet(); return sp?.sheets.find((sh) => sh.id === sp.activeSheetId) ?? null; },
  getCell: (row, col) => { const sh = get().getActiveSheet(); return sh?.cells[cellKey(row, col)]; },
}));
