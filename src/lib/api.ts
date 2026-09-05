// src/lib/api.ts — central API client

const BASE = import.meta.env.VITE_API_URL as string;

// If BASE points to localhost and we're in a browser, skip the network call
// entirely to avoid ERR_CONNECTION_REFUSED noise in the console.
const isLocalBackend = BASE?.includes('localhost') || BASE?.includes('127.0.0.1');

async function get<T>(path: string): Promise<T | null> {
  if (isLocalBackend) return null;
  try {
    const res = await fetch(`${BASE}${path}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json ?? null;
  } catch {
    return null;
  }
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T | null> {
  if (isLocalBackend) return null;
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? json ?? null;
  } catch {
    return null;
  }
}

async function del(path: string, token?: string): Promise<boolean> {
  if (isLocalBackend) return false;
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${BASE}${path}`, { method: 'DELETE', headers });
    return res.ok;
  } catch {
    return false;
  }
}

// ── CMS public reads ──────────────────────────────────────────────────────────
export const api = {
  cms: {
    settings:    () => get<Record<string, string>>('/cms/settings'),
    hero:        () => get<unknown[]>('/cms/hero'),
    ticker:      () => get<unknown[]>('/cms/ticker'),
    stats:       () => get<unknown[]>('/cms/stats'),
    quickAccess: () => get<unknown[]>('/cms/quick-access'),
    cta:         () => get<unknown>('/cms/cta'),
    events:      () => get<unknown[]>('/cms/events'),
    notices:     () => get<unknown[]>('/cms/notices'),
    testimonials:() => get<unknown[]>('/cms/testimonials'),
    gallery:     () => get<unknown[]>('/cms/gallery'),
    news:        () => get<unknown[]>('/cms/news'),
    blogs:       () => get<unknown[]>('/cms/blogs'),
    jobs:        () => get<unknown[]>('/cms/jobs'),
    mentors:     () => get<unknown[]>('/cms/mentors'),
    schools:     () => get<unknown[]>('/cms/schools'),
  },

  // ── CMS admin writes ────────────────────────────────────────────────────────
  admin: {
    saveSettings:    (d: unknown, t: string) => post('/admin/cms/settings', d, t),
    saveHero:        (d: unknown, t: string) => post('/admin/cms/hero', d, t),
    saveTicker:      (d: unknown, t: string) => post('/admin/cms/ticker', d, t),
    saveStats:       (d: unknown, t: string) => post('/admin/cms/stats', d, t),
    saveQuickAccess: (d: unknown, t: string) => post('/admin/cms/quick-access', d, t),
    saveCTA:         (d: unknown, t: string) => post('/admin/cms/cta', d, t),

    saveEvent:       (d: unknown, t: string) => post('/admin/cms/events', d, t),
    deleteEvent:     (id: number, t: string) => del(`/admin/cms/events/${id}`, t),

    saveNotice:      (d: unknown, t: string) => post('/admin/cms/notices', d, t),
    deleteNotice:    (id: number, t: string) => del(`/admin/cms/notices/${id}`, t),

    saveTestimonial: (d: unknown, t: string) => post('/admin/cms/testimonials', d, t),
    deleteTestimonial:(id: number, t: string)=> del(`/admin/cms/testimonials/${id}`, t),

    saveGallery:     (d: unknown, t: string) => post('/admin/cms/gallery', d, t),
    deleteGallery:   (id: number, t: string) => del(`/admin/cms/gallery/${id}`, t),

    saveNews:        (d: unknown, t: string) => post('/admin/cms/news', d, t),
    deleteNews:      (id: number, t: string) => del(`/admin/cms/news/${id}`, t),

    saveBlog:        (d: unknown, t: string) => post('/admin/cms/blogs', d, t),
    deleteBlog:      (id: number, t: string) => del(`/admin/cms/blogs/${id}`, t),

    saveJob:         (d: unknown, t: string) => post('/admin/cms/jobs', d, t),
    deleteJob:       (id: number, t: string) => del(`/admin/cms/jobs/${id}`, t),

    saveMentor:      (d: unknown, t: string) => post('/admin/cms/mentors', d, t),
    deleteMentor:    (id: number, t: string) => del(`/admin/cms/mentors/${id}`, t),

    saveSchool:      (d: unknown, t: string) => post('/admin/cms/schools', d, t),
    deleteSchool:    (id: number, t: string) => del(`/admin/cms/schools/${id}`, t),

    // alumni
    createAlumni:    (d: unknown, t: string) => post('/admin/alumni', d, t),
    deleteAlumni:    (id: number, t: string) => del(`/admin/alumni/${id}`, t),
  },

  // ── Alumni public ───────────────────────────────────────────────────────────
  alumni: {
    list: (params: Record<string, string | number>) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString();
      return get<{ data: unknown[]; total: number; page: number; totalPages: number }>(`/alumni?${qs}`);
    },
    count: () => get<{ count: number }>('/alumni/count'),
    batches: async () => {
      const res = await get<string[]>('/alumni/batches');
      if (res && res.length > 0) return res;
      const { ALUMNI_DATA } = await import('./alumniData');
      return [...new Set(ALUMNI_DATA.map((a) => a.batch).filter(Boolean))].sort((a, b) => b.localeCompare(a));
    },
    countries: async () => {
      const res = await get<string[]>('/alumni/countries');
      if (res && res.length > 0) return res;
      const { ALUMNI_DATA } = await import('./alumniData');
      return [...new Set(ALUMNI_DATA.map((a) => a.country).filter(Boolean))].sort();
    },
    get: (id: number) => get<unknown>(`/alumni/${id}`),
  },
};
