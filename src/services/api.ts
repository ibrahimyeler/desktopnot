const API_URL = 'http://72.61.155.171:9090/api';

// ── Token Management ──
let accessToken: string | null = localStorage.getItem('access_token');
let refreshToken: string | null = localStorage.getItem('refresh_token');

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getAccessToken() {
  return accessToken;
}

// ── Fetch Wrapper ──
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  // Token expired — try refresh
  if (res.status === 401 && refreshToken) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retryRes = await fetch(`${API_URL}${path}`, { ...options, headers });
      if (!retryRes.ok) {
        const err = await retryRes.json().catch(() => ({}));
        throw new ApiError(retryRes.status, err.error || 'Bir hata oluştu');
      }
      return retryRes.json();
    }
    clearTokens();
    throw new ApiError(401, 'Oturum süresi doldu');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.error || 'Bir hata oluştu');
  }

  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ── Error Class ──
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// ── Auth Types ──
export interface ApiUser {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: ApiUser;
  access_token: string;
  refresh_token: string;
}

// ── File Types ──
export interface ApiFile {
  id: string;
  user_id: string;
  type: string;
  title: string;
  icon: string;
  is_favorite: boolean;
  content: any;
  created_at: string;
  updated_at: string;
}

export interface FileListResponse {
  files: ApiFile[];
  total: number;
  page: number;
  limit: number;
}

// ── Task Types ──
export interface ApiTask {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_to: string | null;
  assigned_by: string | null;
  due_date: string | null;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  tasks: ApiTask[];
  total: number;
  page: number;
  limit: number;
}

// ── Calendar Types ──
export interface ApiCalendarEvent {
  id: string;
  user_id: string;
  title: string;
  date: string;
  note: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// ── Team Types ──
export interface ApiTeamMember {
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: string;
}

export interface ApiTeam {
  id: string;
  owner_id: string;
  name: string;
  members: ApiTeamMember[];
  created_at: string;
  updated_at: string;
}

// ── Auth API ──
export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    request<{ message: string; user: ApiUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, new_password: newPassword }),
    }),

  me: () => request<ApiUser>('/auth/me'),

  refresh: () =>
    request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    }),
};

// ── Files API ──
export const filesApi = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<FileListResponse>(`/files${q}`);
  },
  get: (id: string) => request<ApiFile>(`/files/${id}`),
  create: (data: { type: string; title?: string; icon?: string; content?: any }) =>
    request<ApiFile>('/files', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { title?: string; icon?: string; is_favorite?: boolean; content?: any }) =>
    request<ApiFile>(`/files/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<{ message: string }>(`/files/${id}`, { method: 'DELETE' }),
  toggleFavorite: (id: string) =>
    request<ApiFile>(`/files/${id}/favorite`, { method: 'POST' }),
};

// ── Tasks API ──
export const tasksApi = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<TaskListResponse>(`/tasks${q}`);
  },
  get: (id: string) => request<ApiTask>(`/tasks/${id}`),
  create: (data: { title: string; description?: string; status?: string; priority?: string; assigned_to?: string; due_date?: string; note?: string }) =>
    request<ApiTask>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { title?: string; description?: string; status?: string; priority?: string; assigned_to?: string; due_date?: string; note?: string }) =>
    request<ApiTask>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),
};

// ── Calendar API ──
export const calendarApi = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ events: ApiCalendarEvent[]; total: number }>(`/calendar${q}`);
  },
  get: (id: string) => request<ApiCalendarEvent>(`/calendar/${id}`),
  create: (data: { title: string; date: string; note?: string; color?: string }) =>
    request<ApiCalendarEvent>('/calendar', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: { title?: string; date?: string; note?: string; color?: string }) =>
    request<ApiCalendarEvent>(`/calendar/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<{ message: string }>(`/calendar/${id}`, { method: 'DELETE' }),
};

// ── Teams API ──
export const teamsApi = {
  list: () => request<{ teams: ApiTeam[] }>('/teams'),
  get: (id: string) => request<ApiTeam>(`/teams/${id}`),
  create: (name: string) =>
    request<ApiTeam>('/teams', { method: 'POST', body: JSON.stringify({ name }) }),
  update: (id: string, name: string) =>
    request<ApiTeam>(`/teams/${id}`, { method: 'PATCH', body: JSON.stringify({ name }) }),
  delete: (id: string) =>
    request<{ message: string }>(`/teams/${id}`, { method: 'DELETE' }),
  addMember: (teamId: string, userId: string, role?: string) =>
    request<{ message: string; members: ApiTeamMember[] }>(`/teams/${teamId}/members`, {
      method: 'POST', body: JSON.stringify({ user_id: userId, role: role || 'member' }),
    }),
  removeMember: (teamId: string, userId: string) =>
    request<{ message: string; members: ApiTeamMember[] }>(`/teams/${teamId}/members/${userId}`, { method: 'DELETE' }),
};

// ── Admin API ──
export const adminApi = {
  stats: () => request<{ total_users: number; total_files: number; pending_approvals: number }>('/admin/stats'),
  listUsers: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ users: ApiUser[]; total: number; page: number; limit: number }>(`/admin/users${q}`);
  },
  listPendingUsers: () =>
    request<{ users: ApiUser[]; total: number }>('/admin/users/pending'),
  approveUser: (id: string) =>
    request<{ message: string; user: ApiUser }>(`/admin/users/${id}/approve`, { method: 'PATCH' }),
  rejectUser: (id: string) =>
    request<{ message: string }>(`/admin/users/${id}/reject`, { method: 'PATCH' }),
  deleteUser: (id: string) =>
    request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' }),
  updateRole: (id: string, role: string) =>
    request<ApiUser>(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
};
