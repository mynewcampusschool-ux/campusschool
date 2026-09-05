import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { NAV_ITEMS } from '../lib/data';
import { api } from '../lib/api';

// NAV_ITEMS re-export so existing imports keep working
export { NAV_ITEMS };

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: number; image: string; title: string; subtitle: string;
  description: string; primaryBtnLabel: string; primaryBtnLink: string;
  secondaryBtnLabel: string; secondaryBtnLink: string; enabled: boolean;
}
export interface TickerItem {
  id: number; text: string; highlight: string; emoji: string; enabled: boolean;
}
export interface StatItem {
  id: number; label: string; value: number; suffix: string;
}
export interface QuickAccessCard {
  id: number; icon: string; title: string; link: string; enabled: boolean;
}
export interface FeaturedAlumnus {
  id: number; photo: string; name: string; batch: string; company: string;
  designation: string; description: string; linkedin?: string; enabled: boolean;
}
export interface CMSEvent {
  id: number; date: string; month: string; time: string; image: string;
  title: string; description: string; location: string; registerLink: string; enabled: boolean;
}
export interface CMSNotice {
  id: number; title: string; text: string; date: string; tag: string;
  tagColor: string; category: string; priority: string; enabled: boolean;
}
export interface CMSTestimonial {
  id: number; photo: string; name: string; batch: string;
  designation: string; text: string; enabled: boolean;
}
export interface GalleryImage {
  id: string; src: string; thumb: string; caption: string;
  category: string; span: string; order: number; enabled: boolean;
}
export interface CTAData {
  heading: string; description: string; primaryBtnLabel: string;
  primaryBtnLink: string; secondaryBtnLabel: string; secondaryBtnLink: string;
}

// ── New shared domains ────────────────────────────────────────────────────────

export interface CMSNewsItem {
  id: string | number; title: string; date: string; image: string;
  category: string; excerpt: string; author: string;
  status: string; content?: string;
}
export interface CMSBlog {
  id: string | number; title: string; author: string; date: string;
  image: string; category: string; excerpt: string;
  views: number; status: string; content?: string;
}
export interface CMSNewsletter {
  id: string | number; title: string; date: string; desc: string; pages: number;
}
export interface CMSJob {
  id: string | number; title: string; company: string; location: string;
  type: string; skills: string[]; deadline: string; postedBy: string;
  status: string; description?: string;
}
export interface CMSMentor {
  id: string | number; name: string; photo: string; designation: string;
  company: string; expertise: string[]; rating: number; sessions: number;
  bio: string; availability: string[]; status: string;
}
export interface CMSSchool {
  id: string | number; name: string; description: string; image: string;
  established: string; students: number; location: string; status: string;
}

export interface CMSStore {
  heroSlides: HeroSlide[];
  ticker: TickerItem[];
  stats: StatItem[];
  quickAccess: QuickAccessCard[];
  featuredAlumni: FeaturedAlumnus[];
  events: CMSEvent[];
  notices: CMSNotice[];
  testimonials: CMSTestimonial[];
  gallery: GalleryImage[];
  cta: CTAData;
  // ── new domains ──
  news: CMSNewsItem[];
  blogs: CMSBlog[];
  newsletters: CMSNewsletter[];
  jobs: CMSJob[];
  mentors: CMSMentor[];
  schools: CMSSchool[];
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  { id: 1, image: '/image 1.jpg', title: 'Campus School Pantnagar', subtitle: 'Alumni Portal', description: 'Reconnecting 42,000+ alumni across 25+ countries. Be a part of our global community and build a legacy that endures.', primaryBtnLabel: 'Join Alumni Network', primaryBtnLink: '/auth/register', secondaryBtnLabel: 'Explore Community', secondaryBtnLink: '/directory', enabled: true },
  { id: 2, image: '/image 3.jpg', title: 'Connect. Grow.', subtitle: 'Inspire.', description: 'Join thousands of alumni who are making a difference across the globe. Your network is your greatest asset.', primaryBtnLabel: 'Join Alumni Network', primaryBtnLink: '/auth/register', secondaryBtnLabel: 'Explore Community', secondaryBtnLink: '/directory', enabled: true },
  { id: 3, image: '/image 4.jpg', title: 'Your Network.', subtitle: 'Your Future.', description: 'Leverage the power of the Campus School Pantnagar alumni network. Mentorship, jobs, and lifelong friendships await.', primaryBtnLabel: 'Join Alumni Network', primaryBtnLink: '/auth/register', secondaryBtnLabel: 'Explore Community', secondaryBtnLink: '/directory', enabled: true },
  { id: 4, image: '/image 5.jpg', title: 'Glory To God.', subtitle: 'Service To All.', description: 'Rooted in our timeless motto, we celebrate 50+ years of excellence, integrity, and community service.', primaryBtnLabel: 'Join Alumni Network', primaryBtnLink: '/auth/register', secondaryBtnLabel: 'Explore Community', secondaryBtnLink: '/directory', enabled: true },
];

const DEFAULT_TICKER: TickerItem[] = [
  { id: 1, text: 'Alumni Registration Open for Batch 2025', highlight: 'Register Now', emoji: '🎓', enabled: true },
  { id: 2, text: 'Annual Alumni Meet 2025 — June 20, Main Auditorium Pantnagar', highlight: 'RSVP Today', emoji: '📅', enabled: true },
  { id: 3, text: 'Campus School Pantnagar ranked', highlight: '#1 School in Uttarakhand 2025', emoji: '🏆', enabled: true },
];

const DEFAULT_STATS: StatItem[] = [
  { id: 1, label: 'Years of Excellence', value: 54, suffix: '+' },
  { id: 2, label: 'Registered Alumni', value: 55, suffix: '' },
  { id: 3, label: 'Companies', value: 10, suffix: '+' },
  { id: 4, label: 'Countries', value: 25, suffix: '+' },
];

const DEFAULT_QUICK_ACCESS: QuickAccessCard[] = [
  { id: 1, icon: '👥', title: 'Alumni Directory', link: '/directory', enabled: true },
  { id: 2, icon: '📅', title: 'Upcoming Events', link: '/events', enabled: true },
  { id: 3, icon: '💼', title: 'Job Opportunities', link: '/jobs', enabled: true },
  { id: 4, icon: '🎓', title: 'Find a Mentor', link: '/mentorship', enabled: true },
  { id: 5, icon: '📌', title: 'Notice Board', link: '/notice-board', enabled: true },
];

const DEFAULT_FEATURED_ALUMNI: FeaturedAlumnus[] = [];

const DEFAULT_EVENTS: CMSEvent[] = [];
const DEFAULT_NOTICES: CMSNotice[] = [];
const DEFAULT_TESTIMONIALS: CMSTestimonial[] = [];
const DEFAULT_GALLERY: GalleryImage[] = [
  { id: '1', src: '/image 1.jpg', thumb: '/image 1.jpg', caption: 'Campus Life', category: 'Campus', span: '', order: 0, enabled: true },
  { id: '2', src: '/image 2.jpg', thumb: '/image 2.jpg', caption: 'Events', category: 'Events', span: '', order: 1, enabled: true },
  { id: '3', src: '/image 3.jpg', thumb: '/image 3.jpg', caption: 'Academics', category: 'Academics', span: '', order: 2, enabled: true },
  { id: '4', src: '/image 4.jpg', thumb: '/image 4.jpg', caption: 'Sports', category: 'Sports', span: '', order: 3, enabled: true },
  { id: '5', src: '/image 5.jpg', thumb: '/image 5.jpg', caption: 'Cultural', category: 'Cultural', span: '', order: 4, enabled: true },
  { id: '6', src: '/image 6.jpg', thumb: '/image 6.jpg', caption: 'Campus', category: 'Campus', span: '', order: 5, enabled: true },
];

const DEFAULT_CTA: CTAData = {
  heading: 'Be Part of the Campus School Pantnagar Family',
  description: 'Connect with 55 alumni across 25+ countries. Share your journey, find opportunities, and give back to the community that shaped you.',
  primaryBtnLabel: "Register Now — It's Free", primaryBtnLink: '/auth/register',
  secondaryBtnLabel: 'Explore Alumni', secondaryBtnLink: '/directory',
};

const DEFAULT_NEWS: CMSNewsItem[] = [];
const DEFAULT_BLOGS: CMSBlog[] = [];
const DEFAULT_NEWSLETTERS: CMSNewsletter[] = [];
const DEFAULT_JOBS: CMSJob[] = [];
const DEFAULT_MENTORS: CMSMentor[] = [];
const DEFAULT_SCHOOLS: CMSSchool[] = [];

const DEFAULT_STORE: CMSStore = {
  heroSlides: DEFAULT_HERO_SLIDES,
  ticker: DEFAULT_TICKER,
  stats: DEFAULT_STATS,
  quickAccess: DEFAULT_QUICK_ACCESS,
  featuredAlumni: DEFAULT_FEATURED_ALUMNI,
  events: DEFAULT_EVENTS,
  notices: DEFAULT_NOTICES,
  testimonials: DEFAULT_TESTIMONIALS,
  gallery: DEFAULT_GALLERY,
  cta: DEFAULT_CTA,
  news: DEFAULT_NEWS,
  blogs: DEFAULT_BLOGS,
  newsletters: DEFAULT_NEWSLETTERS,
  jobs: DEFAULT_JOBS,
  mentors: DEFAULT_MENTORS,
  schools: DEFAULT_SCHOOLS,
};

// ─── Persistence ──────────────────────────────────────────────────────────────

const LS_KEY = 'csp_cms_store';
const LS_VERSION = 8; // bumped — stats reduced to 4

// ── Field-level sanitisers ────────────────────────────────────────────────────

function safeArray<T>(val: unknown, fallback: T[]): T[] {
  return Array.isArray(val) && val.length >= 0 ? (val as T[]) : fallback;
}

function safeObject<T extends object>(val: unknown, fallback: T): T {
  return val !== null && typeof val === 'object' && !Array.isArray(val) ? (val as T) : fallback;
}

function sanitiseStore(raw: Partial<CMSStore> & { _v?: number }): CMSStore {
  return {
    heroSlides:      safeArray(raw.heroSlides,    DEFAULT_HERO_SLIDES),
    ticker:          safeArray(raw.ticker,         DEFAULT_TICKER),
    stats:           safeArray(raw.stats,          DEFAULT_STATS),
    quickAccess:     safeArray(raw.quickAccess,    DEFAULT_QUICK_ACCESS),
    featuredAlumni:  safeArray(raw.featuredAlumni, DEFAULT_FEATURED_ALUMNI),
    events:          safeArray(raw.events,         DEFAULT_EVENTS),
    notices:         safeArray(raw.notices,        DEFAULT_NOTICES),
    testimonials:    safeArray(raw.testimonials,   DEFAULT_TESTIMONIALS),
    gallery:         safeArray(raw.gallery,        DEFAULT_GALLERY),
    cta:             safeObject(raw.cta,           DEFAULT_CTA),
    news:            safeArray(raw.news,           DEFAULT_NEWS),
    blogs:           safeArray(raw.blogs,          DEFAULT_BLOGS),
    newsletters:     safeArray(raw.newsletters,    DEFAULT_NEWSLETTERS),
    jobs:            safeArray(raw.jobs,           DEFAULT_JOBS),
    mentors:         safeArray(raw.mentors,        DEFAULT_MENTORS),
    schools:         safeArray(raw.schools,        DEFAULT_SCHOOLS),
  };
}

function loadStore(): CMSStore {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed._v === LS_VERSION) return sanitiseStore(parsed);
    }
  } catch { /* ignore */ }
  return DEFAULT_STORE;
}

function saveStore(store: CMSStore) {
  localStorage.setItem(LS_KEY, JSON.stringify({ ...store, _v: LS_VERSION }));
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CMSContextValue {
  cms: CMSStore;
  updateHeroSlides: (v: HeroSlide[]) => void;
  updateTicker: (v: TickerItem[]) => void;
  updateStats: (v: StatItem[]) => void;
  updateQuickAccess: (v: QuickAccessCard[]) => void;
  updateFeaturedAlumni: (v: FeaturedAlumnus[]) => void;
  updateEvents: (v: CMSEvent[]) => void;
  updateNotices: (v: CMSNotice[]) => void;
  updateTestimonials: (v: CMSTestimonial[]) => void;
  updateGallery: (v: GalleryImage[]) => void;
  updateCTA: (v: CTAData) => void;
  // ── new domains ──
  updateNews: (v: CMSNewsItem[]) => void;
  updateBlogs: (v: CMSBlog[]) => void;
  updateNewsletters: (v: CMSNewsletter[]) => void;
  updateJobs: (v: CMSJob[]) => void;
  updateMentors: (v: CMSMentor[]) => void;
  updateSchools: (v: CMSSchool[]) => void;
}

const CMSContext = createContext<CMSContextValue | null>(null);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cms, setCMS] = useState<CMSStore>(loadStore);

  // Load from API on mount; merge into store
  useEffect(() => {
    const load = async () => {
      const [hero, ticker, stats, quickAccess, cta, events, notices, testimonials, gallery, news, blogs, jobs, mentors, schools, alumniCount] = await Promise.all([
        api.cms.hero(), api.cms.ticker(), api.cms.stats(), api.cms.quickAccess(), api.cms.cta(),
        api.cms.events(), api.cms.notices(), api.cms.testimonials(), api.cms.gallery(),
        api.cms.news(), api.cms.blogs(), api.cms.jobs(), api.cms.mentors(), api.cms.schools(),
        api.alumni.count(),
      ]);

      const mapHero = (rows: unknown[]): HeroSlide[] => rows.map((r: any) => ({
        id: r.id, image: r.image, title: r.title, subtitle: r.subtitle ?? '',
        description: r.description ?? '', primaryBtnLabel: r.primary_btn_label ?? 'Join Alumni Network',
        primaryBtnLink: r.primary_btn_link ?? '/auth/register',
        secondaryBtnLabel: r.secondary_btn_label ?? 'Explore Community',
        secondaryBtnLink: r.secondary_btn_link ?? '/directory',
        enabled: !!r.enabled,
      }));

      const mapTicker = (rows: unknown[]): TickerItem[] => rows.map((r: any) => ({
        id: r.id, text: r.text, highlight: r.highlight ?? '', emoji: r.emoji ?? '', enabled: !!r.enabled,
      }));

      const mapStats = (rows: unknown[]): StatItem[] => rows.map((r: any) => ({
        id: r.id, label: r.label, value: Number(r.value), suffix: r.suffix ?? '',
      }));

      const mapQA = (rows: unknown[]): QuickAccessCard[] => rows.map((r: any) => ({
        id: r.id, icon: r.icon, title: r.title, link: r.link, enabled: !!r.enabled,
      }));

      const mapCTA = (r: any): CTAData => ({
        heading: r?.heading ?? DEFAULT_CTA.heading,
        description: r?.description ?? DEFAULT_CTA.description,
        primaryBtnLabel: r?.primary_btn_label ?? DEFAULT_CTA.primaryBtnLabel,
        primaryBtnLink: r?.primary_btn_link ?? DEFAULT_CTA.primaryBtnLink,
        secondaryBtnLabel: r?.secondary_btn_label ?? DEFAULT_CTA.secondaryBtnLabel,
        secondaryBtnLink: r?.secondary_btn_link ?? DEFAULT_CTA.secondaryBtnLink,
      });

      const mapEvents = (rows: unknown[]): CMSEvent[] => rows.map((r: any) => ({
        id: r.id, title: r.title, date: r.date_day ?? r.date ?? '', month: r.date_month ?? r.month ?? '',
        time: r.time ?? '', location: r.location ?? '', image: r.image ?? '',
        description: r.description ?? '', registerLink: r.register_link ?? '/events', enabled: !!r.enabled,
      }));

      const mapNotices = (rows: unknown[]): CMSNotice[] => rows.map((r: any) => ({
        id: r.id, title: r.title, text: r.text ?? '', date: r.date ?? '',
        tag: r.tag ?? '', tagColor: r.tag_color ?? '#0B6B4B',
        category: r.category ?? 'General', priority: r.priority ?? 'medium', enabled: !!r.enabled,
      }));

      const mapTestimonials = (rows: unknown[]): CMSTestimonial[] => rows.map((r: any) => ({
        id: r.id, name: r.name, batch: r.batch ?? '', designation: r.designation ?? '',
        photo: r.photo ?? '', text: r.text, enabled: !!r.enabled,
      }));

      const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22300%22%3E%3Crect width%3D%22400%22 height%3D%22300%22 fill%3D%22%23e5e7eb%22%2F%3E%3Ctext x%3D%2250%25%22 y%3D%2250%25%22 dominant-baseline%3D%22middle%22 text-anchor%3D%22middle%22 fill%3D%22%239ca3af%22 font-size%3D%2216%22%3ENo Image%3C%2Ftext%3E%3C%2Fsvg%3E';
      const mapGallery = (rows: unknown[]): GalleryImage[] => rows.map((r: any) => {
        const src = r.src && typeof r.src === 'string' && r.src.trim() ? r.src.trim() : PLACEHOLDER;
        const thumb = r.thumb && typeof r.thumb === 'string' && r.thumb.trim() ? r.thumb.trim() : src;
        return { id: String(r.id), src, thumb, caption: r.caption ?? '', category: r.category ?? 'General', span: r.span ?? '', order: r.sort_order ?? 0, enabled: !!r.enabled };
      });

      const mapNews = (rows: unknown[]): CMSNewsItem[] => rows.map((r: any) => ({
        id: r.id, title: r.title, date: r.date ?? '', image: r.image ?? '',
        category: r.category ?? 'General', excerpt: r.excerpt ?? '',
        author: r.author ?? 'Admin', status: r.status ?? 'Published', content: r.content ?? '',
      }));

      const mapBlogs = (rows: unknown[]): CMSBlog[] => rows.map((r: any) => ({
        id: r.id, title: r.title, author: r.author ?? '', category: r.category ?? 'General',
        date: r.date ?? '', image: r.image ?? '', excerpt: r.excerpt ?? '',
        views: Number(r.views ?? 0), status: r.status ?? 'Published', content: r.content ?? '',
      }));

      const mapJobs = (rows: unknown[]): CMSJob[] => rows.map((r: any) => ({
        id: r.id, title: r.title, company: r.company ?? '', location: r.location ?? '',
        type: r.type ?? 'Full-time',
        skills: typeof r.skills === 'string' ? r.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        postedBy: r.posted_by ?? '', deadline: r.deadline ?? '',
        status: r.status ?? 'Active', description: r.description ?? '',
      }));

      const mapMentors = (rows: unknown[]): CMSMentor[] => rows.map((r: any) => ({
        id: r.id, name: r.name, photo: r.photo ?? '', designation: r.designation ?? '',
        company: r.company ?? '',
        expertise: typeof r.expertise === 'string' ? r.expertise.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        rating: Number(r.rating ?? 5), sessions: Number(r.sessions ?? 0),
        bio: r.bio ?? '',
        availability: typeof r.availability === 'string' ? r.availability.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
        status: r.status ?? 'Active',
      }));

      const mapSchools = (rows: unknown[]): CMSSchool[] => rows.map((r: any) => ({
        id: r.id, name: r.name, description: r.description ?? '', image: r.image ?? '',
        established: r.established ?? '', students: Number(r.students ?? 0),
        location: r.location ?? 'Pantnagar', status: r.status ?? 'Active',
      }));

      const partial: Partial<CMSStore> = {};
      if (Array.isArray(hero) && hero.length)         partial.heroSlides    = mapHero(hero);
      if (Array.isArray(ticker) && ticker.length)     partial.ticker        = mapTicker(ticker);
      if (Array.isArray(stats) && stats.length)       partial.stats         = mapStats(stats);
      // Override Registered Alumni count with live user count
      if (alumniCount && typeof alumniCount.count === 'number') {
        const baseStats = (Array.isArray(stats) && stats.length) ? mapStats(stats) : DEFAULT_STATS;
        partial.stats = baseStats.map(s =>
          s.label === 'Registered Alumni' ? { ...s, value: alumniCount.count } : s
        );
      }
      if (Array.isArray(quickAccess) && quickAccess.length) partial.quickAccess = mapQA(quickAccess);
      if (cta)                                        partial.cta           = mapCTA(cta);
      if (Array.isArray(events))                      partial.events        = mapEvents(events);
      if (Array.isArray(notices))                     partial.notices       = mapNotices(notices);
      if (Array.isArray(testimonials))                partial.testimonials  = mapTestimonials(testimonials);
      if (Array.isArray(gallery))                     partial.gallery       = mapGallery(gallery);
      if (Array.isArray(news))                        partial.news          = mapNews(news);
      if (Array.isArray(blogs))                       partial.blogs         = mapBlogs(blogs);
      if (Array.isArray(jobs))                        partial.jobs          = mapJobs(jobs);
      if (Array.isArray(mentors))                     partial.mentors       = mapMentors(mentors);
      if (Array.isArray(schools))                     partial.schools       = mapSchools(schools);

      if (Object.keys(partial).length > 0) {
        setCMS((prev) => {
          const merged = sanitiseStore({ ...prev, ...partial });
          saveStore(merged);
          return merged;
        });
      }
    };
    load();
  }, []);

  const patch = useCallback((partial: Partial<CMSStore>) => {
    setCMS((prev) => {
      try {
        const merged = { ...prev, ...partial };
        const next = sanitiseStore(merged);
        saveStore(next);
        return next;
      } catch {
        return prev; // keep previous state on any error
      }
    });
  }, []);

  return (
    <CMSContext.Provider value={{
      cms,
      updateHeroSlides:    (heroSlides)    => patch({ heroSlides }),
      updateTicker:        (ticker)        => patch({ ticker }),
      updateStats:         (stats)         => patch({ stats }),
      updateQuickAccess:   (quickAccess)   => patch({ quickAccess }),
      updateFeaturedAlumni:(featuredAlumni)=> patch({ featuredAlumni }),
      updateEvents:        (events)        => patch({ events }),
      updateNotices:       (notices)       => patch({ notices }),
      updateTestimonials:  (testimonials)  => patch({ testimonials }),
      updateGallery:       (gallery)       => patch({ gallery }),
      updateCTA:           (cta)           => patch({ cta }),
      updateNews:          (news)          => patch({ news }),
      updateBlogs:         (blogs)         => patch({ blogs }),
      updateNewsletters:   (newsletters)   => patch({ newsletters }),
      updateJobs:          (jobs)          => patch({ jobs }),
      updateMentors:       (mentors)       => patch({ mentors }),
      updateSchools:       (schools)       => patch({ schools }),
    }}>
      {children}
    </CMSContext.Provider>
  );
};

export function useCMS(): CMSContextValue {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used inside CMSProvider');
  return ctx;
}
