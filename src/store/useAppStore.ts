import { create } from 'zustand';
import type { AnyFile, NoteFile, SpreadsheetFile, Block, BlockType, CellData, CellFormat, Sheet, AppRoute, HomeTab, Task, TeamMember, Team, CalendarEvent } from '../types';
import { uid, cellKey, createBlock, createNote, createSpreadsheet } from '../types';

// ── Varsayılan kullanıcı (login sonrası güncellenecek) ──
const ME: TeamMember = { id: 'me', username: '', name: '', role: '', avatar: '#007AFF', isOnline: true };

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

  allMembers: [ME],
  addMember: (m) => set(s => ({ allMembers: [...s.allMembers, m] })),
  removeMember: (id) => set(s => ({
    allMembers: s.allMembers.filter(m => m.id !== id),
    teams: s.teams.map(t => ({ ...t, memberIds: t.memberIds.filter(mid => mid !== id) })),
  })),

  teams: [],
  activeTeamId: '',
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

  tasks: [],
  addTask: (t) => set(s => ({ tasks: [t, ...s.tasks] })),
  updateTask: (id, updates) => set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
  deleteTask: (id) => set(s => ({ tasks: s.tasks.filter(t => t.id !== id) })),

  calendarEvents: [],
  addCalendarEvent: (e) => set(s => ({ calendarEvents: [...s.calendarEvents, e] })),
  updateCalendarEvent: (id, updates) => set(s => ({ calendarEvents: s.calendarEvents.map(e => e.id === id ? { ...e, ...updates } : e) })),
  deleteCalendarEvent: (id) => set(s => ({ calendarEvents: s.calendarEvents.filter(e => e.id !== id) })),

  files: [],
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
