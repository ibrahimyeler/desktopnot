import { create } from 'zustand';
import type { AnyFile, NoteFile, SpreadsheetFile, Block, BlockType, CellData, CellFormat, Sheet, AppRoute, HomeTab, Task, TeamMember, Team, CalendarEvent } from '../types';
import { uid, cellKey, createBlock, createNote, createSpreadsheet } from '../types';
import { ApiUser, ApiFile, ApiTask, ApiCalendarEvent, ApiTeam, filesApi, tasksApi, calendarApi, teamsApi, clearTokens } from '../services/api';

// ── API ↔ Local type mappers ──

function apiFileToLocal(f: ApiFile): AnyFile {
  const base = {
    id: f.id,
    title: f.title,
    icon: f.icon || '📄',
    isFavorite: f.is_favorite,
    createdAt: f.created_at,
    updatedAt: f.updated_at,
  };
  if (f.type === 'spreadsheet') {
    const content = f.content || {};
    return {
      ...base,
      type: 'spreadsheet',
      sheets: content.sheets || [{ id: uid(), name: 'Sayfa 1', cells: {}, colWidths: {} }],
      activeSheetId: content.activeSheetId || content.sheets?.[0]?.id || uid(),
    } as SpreadsheetFile;
  }
  const content = f.content || {};
  return {
    ...base,
    type: 'note',
    blocks: content.blocks?.length ? content.blocks : [createBlock('text')],
  } as NoteFile;
}

function localFileToContent(f: AnyFile): any {
  if (f.type === 'note') return { blocks: (f as NoteFile).blocks };
  const sp = f as SpreadsheetFile;
  return { sheets: sp.sheets, activeSheetId: sp.activeSheetId };
}

function apiTaskToLocal(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    description: t.description || '',
    status: (t.status as Task['status']) || 'pending',
    priority: (t.priority as Task['priority']) || 'medium',
    assignedTo: t.assigned_to || '',
    assignedBy: t.assigned_by || '',
    dueDate: t.due_date || '',
    note: t.note || '',
    createdAt: t.created_at,
    updatedAt: t.updated_at,
  };
}

function apiEventToLocal(e: ApiCalendarEvent): CalendarEvent {
  return {
    id: e.id,
    title: e.title,
    date: e.date,
    note: e.note || '',
    color: e.color || '#3B82F6',
    createdAt: e.created_at,
  };
}

function apiTeamToLocal(t: ApiTeam): Team {
  return {
    id: t.id,
    name: t.name,
    memberIds: t.members?.map(m => m.user_id) || [],
    createdAt: t.created_at,
  };
}

function apiTeamToMembers(t: ApiTeam): TeamMember[] {
  return (t.members || []).map(m => ({
    id: m.user_id,
    username: m.email?.split('@')[0] || '',
    name: m.name || '',
    role: m.role || 'member',
    avatar: '#06B6D4',
    isOnline: false,
  }));
}

// ── Debounced file save ──
let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSaveFile(fileId: string, content: any) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      await filesApi.update(fileId, { content });
    } catch {
      // silent — data is still in local state
    }
  }, 1500);
}

// ── Store ──
interface AppState {
  route: AppRoute;
  setRoute: (r: AppRoute) => void;

  homeTab: HomeTab;
  setHomeTab: (t: HomeTab) => void;

  // Auth user
  user: ApiUser | null;
  setUser: (u: ApiUser | null) => void;
  isAdmin: () => boolean;

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

  // Data sync
  isSyncing: boolean;
  loadData: () => Promise<void>;
  logout: () => void;

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

  // Auth
  user: null,
  setUser: (u) => set({ user: u }),
  isAdmin: () => get().user?.role === 'admin',

  currentUser: { id: '', username: '', name: '', role: '', avatar: '#06B6D4', isOnline: true },

  allMembers: [],
  addMember: (m) => set(s => ({ allMembers: [...s.allMembers, m] })),
  removeMember: (id) => set(s => ({
    allMembers: s.allMembers.filter(m => m.id !== id),
    teams: s.teams.map(t => ({ ...t, memberIds: t.memberIds.filter(mid => mid !== id) })),
  })),

  teams: [],
  activeTeamId: '',

  createTeam: (name) => {
    const tempId = uid();
    const userId = get().currentUser.id;
    const t: Team = { id: tempId, name, memberIds: [userId], createdAt: new Date().toISOString() };
    set(s => ({ teams: [...s.teams, t], activeTeamId: t.id }));
    teamsApi.create(name).then(apiTeam => {
      set(s => ({
        teams: s.teams.map(x => x.id === tempId ? apiTeamToLocal(apiTeam) : x),
        activeTeamId: s.activeTeamId === tempId ? apiTeam.id : s.activeTeamId,
        allMembers: mergeMembers(s.allMembers, apiTeamToMembers(apiTeam)),
      }));
    }).catch(() => {
      set(s => ({ teams: s.teams.filter(x => x.id !== tempId) }));
    });
  },

  deleteTeam: (id) => {
    const prev = get().teams;
    set(s => {
      const teams = s.teams.filter(t => t.id !== id);
      return { teams, activeTeamId: s.activeTeamId === id ? (teams[0]?.id ?? '') : s.activeTeamId };
    });
    teamsApi.delete(id).catch(() => {
      set({ teams: prev });
    });
  },

  renameTeam: (id, name) => {
    set(s => ({ teams: s.teams.map(t => t.id === id ? { ...t, name } : t) }));
    teamsApi.update(id, name).catch(() => {});
  },

  setActiveTeam: (id) => set({ activeTeamId: id }),

  addMemberToTeam: (teamId, memberId) => {
    set(s => ({
      teams: s.teams.map(t => t.id === teamId && !t.memberIds.includes(memberId) ? { ...t, memberIds: [...t.memberIds, memberId] } : t),
    }));
    teamsApi.addMember(teamId, memberId).catch(() => {});
  },

  removeMemberFromTeam: (teamId, memberId) => {
    set(s => ({
      teams: s.teams.map(t => t.id === teamId ? { ...t, memberIds: t.memberIds.filter(id => id !== memberId) } : t),
    }));
    teamsApi.removeMember(teamId, memberId).catch(() => {});
  },

  // Computed: aktif ekip uyeleri
  get team() {
    const s = get();
    const activeTeam = s.teams.find(t => t.id === s.activeTeamId);
    if (!activeTeam) return s.allMembers;
    return s.allMembers.filter(m => activeTeam.memberIds.includes(m.id));
  },

  addTeamMember: (m) => {
    const s = get();
    if (!s.allMembers.find(x => x.id === m.id)) {
      set(st => ({ allMembers: [...st.allMembers, m] }));
    }
    s.addMemberToTeam(s.activeTeamId, m.id);
  },

  removeTeamMember: (id) => {
    const s = get();
    s.removeMemberFromTeam(s.activeTeamId, id);
  },

  // ── Görevler (API-backed) ──
  tasks: [],
  addTask: (t) => {
    set(s => ({ tasks: [t, ...s.tasks] }));
    tasksApi.create({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      assigned_to: t.assignedTo || undefined,
      due_date: t.dueDate || undefined,
      note: t.note,
    }).then(apiTask => {
      set(s => ({ tasks: s.tasks.map(x => x.id === t.id ? apiTaskToLocal(apiTask) : x) }));
    }).catch(() => {
      set(s => ({ tasks: s.tasks.filter(x => x.id !== t.id) }));
    });
  },

  updateTask: (id, updates) => {
    set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...updates } : t) }));
    const apiUpdates: any = {};
    if (updates.title !== undefined) apiUpdates.title = updates.title;
    if (updates.description !== undefined) apiUpdates.description = updates.description;
    if (updates.status !== undefined) apiUpdates.status = updates.status;
    if (updates.priority !== undefined) apiUpdates.priority = updates.priority;
    if (updates.assignedTo !== undefined) apiUpdates.assigned_to = updates.assignedTo;
    if (updates.dueDate !== undefined) apiUpdates.due_date = updates.dueDate;
    if (updates.note !== undefined) apiUpdates.note = updates.note;
    tasksApi.update(id, apiUpdates).catch(() => {});
  },

  deleteTask: (id) => {
    const prev = get().tasks;
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    tasksApi.delete(id).catch(() => { set({ tasks: prev }); });
  },

  // ── Takvim (API-backed) ──
  calendarEvents: [],
  addCalendarEvent: (e) => {
    set(s => ({ calendarEvents: [...s.calendarEvents, e] }));
    calendarApi.create({
      title: e.title,
      date: e.date,
      note: e.note,
      color: e.color,
    }).then(apiEvent => {
      set(s => ({ calendarEvents: s.calendarEvents.map(x => x.id === e.id ? apiEventToLocal(apiEvent) : x) }));
    }).catch(() => {
      set(s => ({ calendarEvents: s.calendarEvents.filter(x => x.id !== e.id) }));
    });
  },

  updateCalendarEvent: (id, updates) => {
    set(s => ({ calendarEvents: s.calendarEvents.map(e => e.id === id ? { ...e, ...updates } : e) }));
    calendarApi.update(id, updates).catch(() => {});
  },

  deleteCalendarEvent: (id) => {
    const prev = get().calendarEvents;
    set(s => ({ calendarEvents: s.calendarEvents.filter(e => e.id !== id) }));
    calendarApi.delete(id).catch(() => { set({ calendarEvents: prev }); });
  },

  // ── Dosyalar ──
  files: [],
  activeFileId: null,
  focusedBlockId: null,
  activeCell: null,
  selection: null,
  isEditing: false,
  editValue: '',
  sidebarOpen: true,
  inspectorOpen: true,
  isSyncing: false,

  // ── Data Loading ──
  loadData: async () => {
    set({ isSyncing: true });
    try {
      const [filesRes, tasksRes, eventsRes, teamsRes] = await Promise.all([
        filesApi.list({ limit: '200' }),
        tasksApi.list({ limit: '200' }),
        calendarApi.list(),
        teamsApi.list(),
      ]);

      const localFiles = (filesRes.files || []).map(apiFileToLocal);
      const localTasks = (tasksRes.tasks || []).map(apiTaskToLocal);
      const localEvents = (eventsRes.events || []).map(apiEventToLocal);
      const apiTeams = teamsRes.teams || [];
      const localTeams = apiTeams.map(apiTeamToLocal);

      // Collect all members from teams
      let members: TeamMember[] = [];
      for (const t of apiTeams) {
        members = mergeMembers(members, apiTeamToMembers(t));
      }

      // Include current user in members
      const cu = get().currentUser;
      if (cu.id && !members.find(m => m.id === cu.id)) {
        members.push(cu);
      }

      set({
        files: localFiles,
        tasks: localTasks,
        calendarEvents: localEvents,
        teams: localTeams,
        allMembers: members,
        activeTeamId: localTeams[0]?.id || '',
        isSyncing: false,
      });
    } catch {
      set({ isSyncing: false });
    }
  },

  logout: () => {
    clearTokens();
    set({
      user: null,
      currentUser: { id: '', username: '', name: '', role: '', avatar: '#06B6D4', isOnline: true },
      route: 'splash',
      files: [],
      tasks: [],
      calendarEvents: [],
      teams: [],
      allMembers: [],
      activeFileId: null,
      activeTeamId: '',
    });
  },

  // ── Dosya Islemleri (API-backed) ──
  createFile: (type) => {
    const f = type === 'note' ? createNote() : createSpreadsheet();
    const tempId = f.id;
    set((s) => ({ files: [f, ...s.files], activeFileId: f.id, route: 'editor' }));

    filesApi.create({
      type,
      title: f.title,
      icon: f.icon,
      content: localFileToContent(f),
    }).then(apiFile => {
      set(s => ({
        files: s.files.map(x => x.id === tempId ? { ...apiFileToLocal(apiFile) } : x),
        activeFileId: s.activeFileId === tempId ? apiFile.id : s.activeFileId,
      }));
    }).catch(() => {
      set(s => ({ files: s.files.filter(x => x.id !== tempId), activeFileId: null, route: 'home' }));
    });
  },

  openFile: (id) => set({ activeFileId: id, route: 'editor', activeCell: null, selection: null, isEditing: false, focusedBlockId: null }),

  deleteFile: (id) => {
    const prev = get().files;
    set((s) => {
      const files = s.files.filter((f) => f.id !== id);
      return { files, activeFileId: s.activeFileId === id ? null : s.activeFileId, route: s.activeFileId === id ? 'home' : s.route };
    });
    filesApi.delete(id).catch(() => { set({ files: prev }); });
  },

  updateFileTitle: (id, title) => {
    set((s) => ({
      files: s.files.map((f) => f.id === id ? { ...f, title, updatedAt: new Date().toISOString() } : f),
    }));
    filesApi.update(id, { title }).catch(() => {});
  },

  toggleFavorite: (id) => {
    set((s) => ({
      files: s.files.map((f) => f.id === id ? { ...f, isFavorite: !f.isFavorite } : f),
    }));
    filesApi.toggleFavorite(id).catch(() => {});
  },

  importFile: (name, content, ext) => {
    const title = name.replace(/\.[^.]+$/, '');
    let file: AnyFile;

    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      const note = createNote(title);
      note.icon = '🖼️';
      note.blocks = [createBlock('image', content)];
      file = note;
    } else if (ext === 'csv') {
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
      file = sp;
    } else {
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
      file = note;
    }

    const tempId = file.id;
    set((s) => ({ files: [file, ...s.files], activeFileId: file.id, route: 'editor' as AppRoute }));

    filesApi.create({
      type: file.type,
      title: file.title,
      icon: file.icon,
      content: localFileToContent(file),
    }).then(apiFile => {
      set(s => ({
        files: s.files.map(x => x.id === tempId ? apiFileToLocal(apiFile) : x),
        activeFileId: s.activeFileId === tempId ? apiFile.id : s.activeFileId,
      }));
    }).catch(() => {});
  },

  goHome: () => set({ route: 'home', activeFileId: null, activeCell: null, selection: null, isEditing: false }),

  // ── Not Blokları (with debounced save) ──
  addBlock: (afterId, type, content = '', meta) => {
    const block = createBlock(type, content, meta);
    set((s) => {
      const note = s.getActiveNote();
      if (!note) return s;
      const idx = afterId ? note.blocks.findIndex((b) => b.id === afterId) : note.blocks.length - 1;
      const blocks = [...note.blocks];
      blocks.splice(idx + 1, 0, block);
      const updated = { ...note, blocks, updatedAt: new Date().toISOString() };
      debouncedSaveFile(note.id, localFileToContent(updated));
      return { files: s.files.map((f) => f.id === note.id ? updated : f), focusedBlockId: block.id };
    });
    return block.id;
  },

  updateBlock: (blockId, updates) => set((s) => {
    const note = s.getActiveNote();
    if (!note) return s;
    const updated = { ...note, blocks: note.blocks.map((b) => b.id === blockId ? { ...b, ...updates } : b), updatedAt: new Date().toISOString() };
    debouncedSaveFile(note.id, localFileToContent(updated as NoteFile));
    return { files: s.files.map((f) => f.id === note.id ? updated : f) };
  }),

  deleteBlock: (blockId) => set((s) => {
    const note = s.getActiveNote();
    if (!note) return s;
    let blocks = note.blocks.filter((b) => b.id !== blockId);
    if (blocks.length === 0) blocks = [createBlock('text')];
    const updated = { ...note, blocks };
    debouncedSaveFile(note.id, localFileToContent(updated as NoteFile));
    return { files: s.files.map((f) => f.id === note.id ? updated : f) };
  }),

  changeBlockType: (blockId, newType) => set((s) => {
    const note = s.getActiveNote();
    if (!note) return s;
    const updated = { ...note, blocks: note.blocks.map((b) => b.id === blockId ? { ...b, type: newType, meta: newType === 'checklist' ? { checked: false } : b.meta } : b) };
    debouncedSaveFile(note.id, localFileToContent(updated as NoteFile));
    return { files: s.files.map((f) => f.id === note.id ? updated : f) };
  }),

  setFocusedBlock: (id) => set({ focusedBlockId: id }),

  // ── Tablo (with debounced save) ──
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
    const updated = { ...sp, updatedAt: new Date().toISOString(), sheets: sp.sheets.map((sh) => sh.id === sp.activeSheetId ? { ...sh, cells: newCells } : sh) };
    debouncedSaveFile(sp.id, localFileToContent(updated as SpreadsheetFile));
    return { files: s.files.map((f) => f.id === sp.id ? updated : f) };
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
    const updated = { ...sp, sheets: sp.sheets.map((sh) => sh.id === sp.activeSheetId ? { ...sh, cells: newCells } : sh) };
    debouncedSaveFile(sp.id, localFileToContent(updated as SpreadsheetFile));
    return { files: s.files.map((f) => f.id === sp.id ? updated : f) };
  }),

  addSheet: () => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp) return s;
    const sh: Sheet = { id: uid(), name: `Sayfa ${sp.sheets.length + 1}`, cells: {}, colWidths: {} };
    const updated = { ...sp, sheets: [...sp.sheets, sh], activeSheetId: sh.id };
    debouncedSaveFile(sp.id, localFileToContent(updated as SpreadsheetFile));
    return { files: s.files.map((f) => f.id === sp.id ? updated : f) };
  }),

  removeSheet: (id) => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp || sp.sheets.length <= 1) return s;
    const sheets = sp.sheets.filter((sh) => sh.id !== id);
    const updated = { ...sp, sheets, activeSheetId: sp.activeSheetId === id ? sheets[0].id : sp.activeSheetId };
    debouncedSaveFile(sp.id, localFileToContent(updated as SpreadsheetFile));
    return { files: s.files.map((f) => f.id === sp.id ? updated : f) };
  }),

  renameSheet: (id, name) => set((s) => {
    const sp = s.getActiveSpreadsheet();
    if (!sp) return s;
    const updated = { ...sp, sheets: sp.sheets.map((sh) => sh.id === id ? { ...sh, name } : sh) };
    debouncedSaveFile(sp.id, localFileToContent(updated as SpreadsheetFile));
    return { files: s.files.map((f) => f.id === sp.id ? updated : f) };
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

// ── Helpers ──
function mergeMembers(existing: TeamMember[], newMembers: TeamMember[]): TeamMember[] {
  const map = new Map<string, TeamMember>();
  for (const m of existing) map.set(m.id, m);
  for (const m of newMembers) if (!map.has(m.id)) map.set(m.id, m);
  return Array.from(map.values());
}
