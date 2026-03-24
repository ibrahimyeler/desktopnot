import { create } from 'zustand';
import type { AnyFile, NoteFile, SpreadsheetFile, Block, BlockType, CellData, CellFormat, Sheet, AppRoute } from '../types';
import { uid, cellKey, createBlock, createNote, createSpreadsheet } from '../types';

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

const demoSheet = createSpreadsheet('Ürün Envanter Tablosu');
demoSheet.icon = '📊';
const sh = demoSheet.sheets[0];
const data: Record<string, { v: string; bold?: boolean; fill?: string }> = {
  '0:0': { v: 'Ürün', bold: true, fill: '#F1F5F9' },
  '0:1': { v: 'Kategori', bold: true, fill: '#F1F5F9' },
  '0:2': { v: 'Fiyat (₺)', bold: true, fill: '#F1F5F9' },
  '0:3': { v: 'Stok', bold: true, fill: '#F1F5F9' },
  '0:4': { v: 'Durum', bold: true, fill: '#F1F5F9' },
  '1:0': { v: 'MacBook Air' }, '1:1': { v: 'Elektronik' }, '1:2': { v: '42.999' }, '1:3': { v: '24' }, '1:4': { v: 'Aktif' },
  '2:0': { v: 'iPad Pro' }, '2:1': { v: 'Elektronik' }, '2:2': { v: '34.499' }, '2:3': { v: '18' }, '2:4': { v: 'Aktif' },
  '3:0': { v: 'AirPods Pro' }, '3:1': { v: 'Aksesuar' }, '3:2': { v: '7.999' }, '3:3': { v: '156' }, '3:4': { v: 'Aktif' },
  '4:0': { v: 'Magic Keyboard' }, '4:1': { v: 'Aksesuar' }, '4:2': { v: '11.499' }, '4:3': { v: '42' }, '4:4': { v: 'Aktif' },
  '5:0': { v: 'Studio Display' }, '5:1': { v: 'Monitör' }, '5:2': { v: '52.999' }, '5:3': { v: '8' }, '5:4': { v: 'Düşük Stok' },
};
for (const [k, d] of Object.entries(data)) {
  sh.cells[k] = { value: d.v, format: d.bold ? { bold: true, fillColor: d.fill } : undefined };
}

const demoNote2 = createNote('Toplantı Notları');
demoNote2.icon = '📋';
demoNote2.blocks = [
  createBlock('heading1', 'Haftalık Toplantı'),
  createBlock('text', '15 Mart 2026 — Katılımcılar: Ahmet, Ayşe, Mehmet'),
  createBlock('heading2', 'Gündem'),
  createBlock('numberedList', 'Sprint değerlendirmesi'),
  createBlock('numberedList', 'Yeni özellik planlaması'),
  createBlock('numberedList', 'Bug raporları'),
  createBlock('text', ''),
];

// Demo: PDF dosyası
const demoPdf = createNote('Şirket Politikası 2026');
demoPdf.icon = '📕';
demoPdf.blocks = [
  createBlock('heading1', 'Şirket Politikası'),
  createBlock('text', 'Bu belge, şirket içi çalışma kurallarını ve politikalarını içermektedir.'),
  createBlock('heading2', 'Çalışma Saatleri'),
  createBlock('text', 'Hafta içi 09:00 - 18:00 arasında çalışılır. Esnek çalışma saatleri mevcuttur.'),
  createBlock('heading2', 'İzin Politikası'),
  createBlock('bulletList', 'Yıllık izin: 14 gün'),
  createBlock('bulletList', 'Hastalık izni: Rapor ile sınırsız'),
  createBlock('bulletList', 'Uzaktan çalışma: Haftada 2 gün'),
];

// Demo: Excel dosyası
const demoExcel = createSpreadsheet('Bütçe Raporu Q1');
demoExcel.icon = '📊';
const exSheet = demoExcel.sheets[0];
const exData: Record<string, { v: string; bold?: boolean; fill?: string }> = {
  '0:0': { v: 'Ay', bold: true, fill: '#F0FDF4' }, '0:1': { v: 'Gelir (₺)', bold: true, fill: '#F0FDF4' }, '0:2': { v: 'Gider (₺)', bold: true, fill: '#F0FDF4' }, '0:3': { v: 'Kâr (₺)', bold: true, fill: '#F0FDF4' },
  '1:0': { v: 'Ocak' }, '1:1': { v: '125.000' }, '1:2': { v: '87.500' }, '1:3': { v: '37.500' },
  '2:0': { v: 'Şubat' }, '2:1': { v: '142.000' }, '2:2': { v: '91.300' }, '2:3': { v: '50.700' },
  '3:0': { v: 'Mart' }, '3:1': { v: '158.500' }, '3:2': { v: '95.200' }, '3:3': { v: '63.300' },
};
for (const [k, d] of Object.entries(exData)) {
  exSheet.cells[k] = { value: d.v, format: d.bold ? { bold: true, fillColor: d.fill } : undefined };
}

// Demo: Word dosyası
const demoWord = createNote('Proje Teklifi — NotApp');
demoWord.icon = '📃';
demoWord.blocks = [
  createBlock('heading1', 'NotApp Proje Teklifi'),
  createBlock('text', 'Tarih: 24 Mart 2026'),
  createBlock('divider'),
  createBlock('heading2', 'Özet'),
  createBlock('text', 'NotApp, masaüstü ve mobil platformlarda çalışan modern bir not alma ve tablo yönetim uygulamasıdır. Kullanıcılar metin, tablo, kontrol listesi ve görsel içeriklerini tek bir yerden yönetebilir.'),
  createBlock('heading2', 'Hedefler'),
  createBlock('numberedList', 'Kullanıcı dostu arayüz tasarımı'),
  createBlock('numberedList', 'Gerçek zamanlı senkronizasyon'),
  createBlock('numberedList', 'Çoklu platform desteği (masaüstü, mobil, web)'),
  createBlock('numberedList', 'Güvenli veri depolama'),
];

// Demo: PowerPoint dosyası
const demoPpt = createNote('Ürün Lansmanı Sunumu');
demoPpt.icon = '📙';
demoPpt.blocks = [
  createBlock('heading1', 'NotApp — Ürün Lansmanı'),
  createBlock('text', 'Q2 2026 Lansman Planı'),
  createBlock('divider'),
  createBlock('heading2', 'Slayt 1: Vizyon'),
  createBlock('quote', 'Notlarınızı bir üst seviyeye taşıyın.'),
  createBlock('heading2', 'Slayt 2: Özellikler'),
  createBlock('bulletList', 'Blok tabanlı zengin editör'),
  createBlock('bulletList', 'Akıllı tablo yönetimi'),
  createBlock('bulletList', 'Anlık masaüstü-mobil eşitleme'),
  createBlock('heading2', 'Slayt 3: Yol Haritası'),
  createBlock('checklist', 'Alpha sürüm — Nisan 2026', { checked: true }),
  createBlock('checklist', 'Beta sürüm — Haziran 2026', { checked: false }),
  createBlock('checklist', 'Genel kullanıma açılış — Eylül 2026', { checked: false }),
];

// Demo: Metin dosyası
const demoTxt = createNote('hızlı notlar');
demoTxt.icon = '📝';
demoTxt.blocks = [
  createBlock('text', 'Alışveriş listesi: süt, ekmek, yumurta, peynir'),
  createBlock('text', 'Toplantı saati: 14:30'),
  createBlock('text', 'Kargo takip numarası: TR9283746501'),
  createBlock('divider'),
  createBlock('text', 'Fikir: Uygulama içi yapay zeka asistanı eklenebilir'),
];

// Demo: Markdown dosyası
const demoMd = createNote('API Dokümantasyonu');
demoMd.icon = '📑';
demoMd.blocks = [
  createBlock('heading1', 'NotApp API v1'),
  createBlock('text', 'RESTful API ile tüm dosya işlemlerini gerçekleştirebilirsiniz.'),
  createBlock('heading2', 'Kimlik Doğrulama'),
  createBlock('code', 'Authorization: Bearer <token>', { language: 'http' }),
  createBlock('heading2', 'Uç Noktalar'),
  createBlock('heading3', 'Dosyaları Listele'),
  createBlock('code', 'GET /api/v1/files\nContent-Type: application/json', { language: 'http' }),
  createBlock('heading3', 'Dosya Oluştur'),
  createBlock('code', 'POST /api/v1/files\n{\n  "title": "Yeni Not",\n  "type": "note"\n}', { language: 'json' }),
];

// Demo: Görsel dosyası
const demoImage = createNote('Tasarım Mockup');
demoImage.icon = '🖼️';
demoImage.blocks = [
  createBlock('heading1', 'NotApp Arayüz Tasarımı'),
  createBlock('text', 'Aşağıda uygulamanın ana ekran tasarım taslağı yer almaktadır.'),
  createBlock('image', ''),
  createBlock('text', 'Not: Yukarıdaki görsel alanına cihazınızdan bir görsel yükleyebilirsiniz.'),
];

// ── Şablonlar ──
export interface Template {
  id: string;
  title: string;
  icon: string;
  lucideIcon: string;
  type: 'note' | 'spreadsheet';
  category: string;
  subcategory: string;
  description: string;
  color: string;
  blocks?: Array<{ type: BlockType; content: string; meta?: Block['meta'] }>;
  data?: Record<string, { v: string; bold?: boolean; fill?: string }>;
}

export const TEMPLATES: Template[] = [
  // Not — İş
  { id: 't1', title: 'Toplantı Notları', icon: '📋', lucideIcon: 'ClipboardList', type: 'note', category: 'not', subcategory: 'İş', description: 'Gündem, katılımcılar ve aksiyonlar', color: '#3B82F6',
    blocks: [{ type: 'heading1', content: 'Toplantı Notları' }, { type: 'text', content: 'Tarih: ' }, { type: 'text', content: 'Katılımcılar: ' }, { type: 'heading2', content: 'Gündem' }, { type: 'numberedList', content: '' }, { type: 'heading2', content: 'Kararlar' }, { type: 'checklist', content: '', meta: { checked: false } }, { type: 'heading2', content: 'Aksiyonlar' }, { type: 'checklist', content: '', meta: { checked: false } }] },
  { id: 't2', title: 'Proje Planı', icon: '🎯', lucideIcon: 'Target', type: 'note', category: 'not', subcategory: 'İş', description: 'Hedefler, görevler ve zaman çizelgesi', color: '#6366F1',
    blocks: [{ type: 'heading1', content: 'Proje Planı' }, { type: 'heading2', content: 'Proje Özeti' }, { type: 'text', content: '' }, { type: 'heading2', content: 'Hedefler' }, { type: 'checklist', content: '', meta: { checked: false } }, { type: 'checklist', content: '', meta: { checked: false } }, { type: 'heading2', content: 'Zaman Çizelgesi' }, { type: 'numberedList', content: 'Faz 1 — ' }, { type: 'numberedList', content: 'Faz 2 — ' }] },
  { id: 't3', title: 'Haftalık Rapor', icon: '📊', lucideIcon: 'BarChart3', type: 'note', category: 'not', subcategory: 'İş', description: 'Haftalık ilerleme ve hedefler', color: '#10B981',
    blocks: [{ type: 'heading1', content: 'Haftalık Rapor' }, { type: 'text', content: 'Hafta: ' }, { type: 'heading2', content: 'Tamamlanan İşler' }, { type: 'checklist', content: '', meta: { checked: true } }, { type: 'heading2', content: 'Devam Eden İşler' }, { type: 'checklist', content: '', meta: { checked: false } }, { type: 'heading2', content: 'Gelecek Hafta Planı' }, { type: 'bulletList', content: '' }] },

  // Not — İçerik
  { id: 't4', title: 'Blog Yazısı', icon: '✍️', lucideIcon: 'PenLine', type: 'note', category: 'not', subcategory: 'İçerik', description: 'Başlık, giriş, ana içerik, sonuç', color: '#8B5CF6',
    blocks: [{ type: 'heading1', content: '' }, { type: 'quote', content: 'Kısa bir özet veya alıntı' }, { type: 'heading2', content: 'Giriş' }, { type: 'text', content: '' }, { type: 'heading2', content: 'Ana İçerik' }, { type: 'text', content: '' }, { type: 'heading2', content: 'Sonuç' }, { type: 'text', content: '' }] },

  // Not — Üretkenlik
  { id: 't5', title: 'Yapılacaklar Listesi', icon: '✅', lucideIcon: 'ListChecks', type: 'note', category: 'not', subcategory: 'Üretkenlik', description: 'Günlük görev takibi', color: '#F59E0B',
    blocks: [{ type: 'heading1', content: 'Yapılacaklar' }, { type: 'heading2', content: 'Yüksek Öncelik' }, { type: 'checklist', content: '', meta: { checked: false } }, { type: 'checklist', content: '', meta: { checked: false } }, { type: 'heading2', content: 'Normal' }, { type: 'checklist', content: '', meta: { checked: false } }, { type: 'heading2', content: 'Düşük Öncelik' }, { type: 'checklist', content: '', meta: { checked: false } }] },

  // Not — Geliştirici
  { id: 't6', title: 'Teknik Dokümantasyon', icon: '📑', lucideIcon: 'BookOpen', type: 'note', category: 'not', subcategory: 'Geliştirici', description: 'API, kurulum, kullanım kılavuzu', color: '#0EA5E9',
    blocks: [{ type: 'heading1', content: 'Dokümantasyon' }, { type: 'heading2', content: 'Genel Bakış' }, { type: 'text', content: '' }, { type: 'heading2', content: 'Kurulum' }, { type: 'code', content: '', meta: { language: 'bash' } }, { type: 'heading2', content: 'Kullanım' }, { type: 'code', content: '', meta: { language: 'javascript' } }] },

  // Tablo — Finans
  { id: 't7', title: 'Bütçe Tablosu', icon: '💰', lucideIcon: 'Wallet', type: 'spreadsheet', category: 'tablo', subcategory: 'Finans', description: 'Gelir-gider takibi', color: '#16A34A',
    data: { '0:0': { v: 'Kalem', bold: true, fill: '#F0FDF4' }, '0:1': { v: 'Tutar (₺)', bold: true, fill: '#F0FDF4' }, '0:2': { v: 'Kategori', bold: true, fill: '#F0FDF4' }, '0:3': { v: 'Tarih', bold: true, fill: '#F0FDF4' } } },

  // Tablo — Satış
  { id: 't8', title: 'Müşteri Listesi', icon: '👥', lucideIcon: 'Users', type: 'spreadsheet', category: 'tablo', subcategory: 'Satış', description: 'İletişim bilgileri ve durumlar', color: '#3B82F6',
    data: { '0:0': { v: 'Ad Soyad', bold: true, fill: '#EFF6FF' }, '0:1': { v: 'E-posta', bold: true, fill: '#EFF6FF' }, '0:2': { v: 'Telefon', bold: true, fill: '#EFF6FF' }, '0:3': { v: 'Şirket', bold: true, fill: '#EFF6FF' }, '0:4': { v: 'Durum', bold: true, fill: '#EFF6FF' } } },
  { id: 't9', title: 'Ürün Envanteri', icon: '📦', lucideIcon: 'Package', type: 'spreadsheet', category: 'tablo', subcategory: 'Satış', description: 'Stok takibi ve fiyatlandırma', color: '#EA580C',
    data: { '0:0': { v: 'Ürün', bold: true, fill: '#FFF7ED' }, '0:1': { v: 'SKU', bold: true, fill: '#FFF7ED' }, '0:2': { v: 'Fiyat (₺)', bold: true, fill: '#FFF7ED' }, '0:3': { v: 'Stok', bold: true, fill: '#FFF7ED' }, '0:4': { v: 'Durum', bold: true, fill: '#FFF7ED' } } },

  // Tablo — Proje
  { id: 't10', title: 'Proje Takibi', icon: '🗂️', lucideIcon: 'FolderKanban', type: 'spreadsheet', category: 'tablo', subcategory: 'Proje', description: 'Görev, sorumlu ve ilerleme', color: '#6366F1',
    data: { '0:0': { v: 'Görev', bold: true, fill: '#EEF2FF' }, '0:1': { v: 'Sorumlu', bold: true, fill: '#EEF2FF' }, '0:2': { v: 'Durum', bold: true, fill: '#EEF2FF' }, '0:3': { v: 'Öncelik', bold: true, fill: '#EEF2FF' }, '0:4': { v: 'Tarih', bold: true, fill: '#EEF2FF' } } },

  // Tablo — Planlama
  { id: 't11', title: 'Takvim / Planlama', icon: '📅', lucideIcon: 'CalendarDays', type: 'spreadsheet', category: 'tablo', subcategory: 'Planlama', description: 'Haftalık veya aylık plan', color: '#EC4899',
    data: { '0:0': { v: 'Pazartesi', bold: true, fill: '#FDF2F8' }, '0:1': { v: 'Salı', bold: true, fill: '#FDF2F8' }, '0:2': { v: 'Çarşamba', bold: true, fill: '#FDF2F8' }, '0:3': { v: 'Perşembe', bold: true, fill: '#FDF2F8' }, '0:4': { v: 'Cuma', bold: true, fill: '#FDF2F8' } } },

  // Tablo — İK
  { id: 't12', title: 'İK — Personel Tablosu', icon: '🏢', lucideIcon: 'Building2', type: 'spreadsheet', category: 'tablo', subcategory: 'İK', description: 'Çalışan bilgileri', color: '#0D9488',
    data: { '0:0': { v: 'Ad Soyad', bold: true, fill: '#F0FDFA' }, '0:1': { v: 'Departman', bold: true, fill: '#F0FDFA' }, '0:2': { v: 'Pozisyon', bold: true, fill: '#F0FDFA' }, '0:3': { v: 'Başlangıç', bold: true, fill: '#F0FDFA' }, '0:4': { v: 'E-posta', bold: true, fill: '#F0FDFA' } } },
];

// ── Store ──
interface AppState {
  route: AppRoute;
  setRoute: (r: AppRoute) => void;

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
  sidebarFilter: 'all' | 'recent' | 'favorites';
  setSidebarFilter: (f: 'all' | 'recent' | 'favorites') => void;
  showTemplates: boolean;
  templateFilter: string | null;
  setShowTemplates: (show: boolean, filter?: string | null) => void;
  createFromTemplate: (templateId: string) => void;

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

  files: [demoNote, demoSheet, demoNote2, demoPdf, demoExcel, demoWord, demoPpt, demoTxt, demoMd, demoImage],
  activeFileId: null,

  focusedBlockId: null,
  activeCell: null,
  selection: null,
  isEditing: false,
  editValue: '',
  sidebarOpen: true,
  inspectorOpen: true,
  sidebarFilter: 'all',
  setSidebarFilter: (f) => set({ sidebarFilter: f }),
  showTemplates: false,
  templateFilter: null,
  setShowTemplates: (show, filter = null) => set({ showTemplates: show, templateFilter: filter, route: 'home' as AppRoute, activeFileId: null }),

  createFromTemplate: (templateId) => {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    if (tpl.type === 'spreadsheet') {
      const sp = createSpreadsheet(tpl.title);
      sp.icon = tpl.icon;
      if (tpl.data) {
        const sheet = sp.sheets[0];
        for (const [k, v] of Object.entries(tpl.data)) {
          sheet.cells[k] = { value: v.v, format: v.bold ? { bold: true, fillColor: v.fill } : undefined };
        }
      }
      set((s) => ({ files: [sp, ...s.files], activeFileId: sp.id, route: 'editor' as AppRoute, showTemplates: false }));
    } else {
      const note = createNote(tpl.title);
      note.icon = tpl.icon;
      if (tpl.blocks) note.blocks = tpl.blocks.map((b) => createBlock(b.type, b.content, b.meta));
      set((s) => ({ files: [note, ...s.files], activeFileId: note.id, route: 'editor' as AppRoute, showTemplates: false }));
    }
  },

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

    // Görsel dosyaları — data URL olarak image bloğuna ekle
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
      const note = createNote(title);
      note.icon = '🖼️';
      note.blocks = [createBlock('image', content)];
      set((s) => ({ files: [note, ...s.files], activeFileId: note.id, route: 'editor' as AppRoute }));
      return;
    }

    // CSV → Spreadsheet olarak aç
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

    // Metin dosyaları → Not olarak aç
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
