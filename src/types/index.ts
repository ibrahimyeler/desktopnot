// ── Dosya Tipleri ──
export type FileType = 'note' | 'spreadsheet';
export type AppRoute = 'splash' | 'login' | 'forgot-password' | 'register' | 'home' | 'editor';
export type HomeTab = 'dashboard' | 'tasks' | 'team' | 'files' | 'templates' | 'calendar' | 'users';

// ── Görev Sistemi ──
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // TeamMember id
  assignedBy: string; // TeamMember id
  dueDate: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// ── Ekip ──
export interface TeamMember {
  id: string;
  username: string; // benzersiz kullanici adi
  name: string;
  role: string;
  avatar: string; // initials color
  isOnline: boolean;
}

export interface Team {
  id: string;
  name: string;
  memberIds: string[]; // TeamMember id listesi
  createdAt: string;
}

// ── Takvim ──
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  note: string;
  color: string;
  createdAt: string;
}

// ── Dosya ──
export interface FileItem {
  id: string;
  type: FileType;
  title: string;
  icon?: string;
  updatedAt: string;
  createdAt: string;
  isFavorite: boolean;
}

// ── Not Blokları ──
export type BlockType = 'text' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'checklist' | 'divider' | 'quote' | 'code' | 'image';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  meta?: { checked?: boolean; language?: string };
}

export interface NoteFile extends FileItem {
  type: 'note';
  blocks: Block[];
}

// ── Tablo ──
export interface CellData {
  value: string;
  formula?: string;
  format?: CellFormat;
}

export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  textColor?: string;
  fillColor?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Sheet {
  id: string;
  name: string;
  cells: Record<string, CellData>;
  colWidths: Record<number, number>;
}

export interface SpreadsheetFile extends FileItem {
  type: 'spreadsheet';
  sheets: Sheet[];
  activeSheetId: string;
}

export type AnyFile = NoteFile | SpreadsheetFile;

// ── Yardımcılar ──
export const uid = () => crypto.randomUUID();
export const cellKey = (r: number, c: number) => `${r}:${c}`;
export const colLabel = (col: number): string => {
  let s = '', n = col;
  while (n >= 0) { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; }
  return s;
};

export function createBlock(type: BlockType, content = '', meta?: Block['meta']): Block {
  return { id: uid(), type, content, meta };
}

export function createNote(title = 'Başlıksız Not'): NoteFile {
  return { id: uid(), type: 'note', title, icon: '📄', blocks: [createBlock('text')], updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), isFavorite: false };
}

export function createSpreadsheet(title = 'Başlıksız Tablo'): SpreadsheetFile {
  const sh: Sheet = { id: uid(), name: 'Sayfa 1', cells: {}, colWidths: {} };
  return { id: uid(), type: 'spreadsheet', title, icon: '📊', sheets: [sh], activeSheetId: sh.id, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString(), isFavorite: false };
}

export function createTask(title: string, assignedTo: string, assignedBy: string, priority: TaskPriority = 'medium'): Task {
  return {
    id: uid(), title, description: '', status: 'pending', priority,
    assignedTo, assignedBy,
    dueDate: '', note: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
}
