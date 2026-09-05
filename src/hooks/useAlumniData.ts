import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { AlumniRecord } from '../types/alumni';
import { ALUMNI_DATA } from '../lib/alumniData';

interface AlumniListResult {
  data: AlumniRecord[];
  total: number;
  page: number;
  totalPages: number;
}

interface Filters {
  search?: string;
  batch?: string;
  country?: string;
  page?: number;
  limit?: number;
}

// Education rank — lower number = higher priority
const EDU_RANK: [string, number][] = [
  ['post doc',    0],
  ['post-doc',    0],
  ['phd',         1],
  ['ph.d',        1],
  ['doctorate',   2],
  ['m.ch',        3],
  ['m.tech',      4],
  ['mtech',       4],
  ['m.e',         5],
  ['mca',         6],
  ['mba',         7],
  ['m.sc',        8],
  ['msc',         8],
  ['m.a',         9],
  ['ma ',         9],
  ['mvsc',        9],
  ['dnb',         9],
  ['pgd',        10],
  ['post grad',  10],
  ['post-grad',  10],
  ['masters',    10],
  ['ms ',        10],
  ['ms(',        10],
  ['b.tech',     11],
  ['btech',      11],
  ['b.e',        12],
  ['be ',        12],
  ['bca',        13],
  ['b.sc',       14],
  ['bsc',        14],
  ['b.a',        15],
  ['ba ',        15],
  ['diploma',    16],
  ['graduate',   17],
  ['grad',       17],
  ['b.ed',       17],
];

function eduRank(qualification: string): number {
  const q = qualification.toLowerCase();
  for (const [key, rank] of EDU_RANK) {
    if (q.includes(key)) return rank;
  }
  return 99; // unknown / empty
}

function parseBatch(batch: string): number {
  const n = parseInt(batch, 10);
  if (isNaN(n)) return 9999;
  // handle 2-digit years like "94" → 1994
  return n < 100 ? 1900 + n : n;
}

function sortByPriority(list: AlumniRecord[]): AlumniRecord[] {
  return [...list].sort((a, b) => {
    const eduDiff = eduRank(a.qualification) - eduRank(b.qualification);
    if (eduDiff !== 0) return eduDiff;
    const batchDiff = parseBatch(a.batch) - parseBatch(b.batch);
    if (batchDiff !== 0) return batchDiff;
    return a.fullName.localeCompare(b.fullName);
  });
}

function mapRow(r: any): AlumniRecord {
  return {
    id: String(r.id),
    fullName: r.full_name ?? r.fullName ?? '',
    nickname: r.nickname || undefined,
    batch: r.batch ?? '',
    designation: r.designation ?? '',
    organization: r.organization ?? '',
    profession: r.profession ?? '',
    qualification: r.qualification ?? '',
    city: r.city ?? '',
    country: r.country ?? 'India',
    photoUrl: r.photo_url ?? r.photoUrl ?? undefined,
    linkedinUrl: r.linkedin_url ?? r.linkedinUrl ?? undefined,
    facebookUrl: r.facebook_url ?? r.facebookUrl ?? undefined,
    registeredAt: r.registered_at ?? r.registeredAt ?? '',
  };
}

export function useAlumniData(filters: Filters = {}) {
  const [data, setData] = useState<AlumniRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params: Record<string, string | number> = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 20,
  };
  if (filters.search)  params.search  = filters.search;
  if (filters.batch)   params.batch   = filters.batch;
  if (filters.country) params.country = filters.country;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await api.alumni.list(params) as AlumniListResult | null;
    if (result && Array.isArray(result.data) && result.data.length > 0) {
      setData(result.data.map(mapRow));
      setTotal(result.total ?? result.data.length);
      setTotalPages(result.totalPages ?? 1);
    } else {
      // API unavailable or DB empty — fall back to local alumniData.ts
      let filtered = ALUMNI_DATA;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.fullName.toLowerCase().includes(q) ||
            a.organization.toLowerCase().includes(q) ||
            a.profession.toLowerCase().includes(q) ||
            a.city.toLowerCase().includes(q),
        );
      }
      if (filters.batch)   filtered = filtered.filter((a) => a.batch === filters.batch);
      if (filters.country) filtered = filtered.filter((a) => a.country === filters.country);
      filtered = sortByPriority(filtered);
      const page  = filters.page  ?? 1;
      const limit = filters.limit ?? 20;
      const total = filtered.length;
      const start = (page - 1) * limit;
      setData(filtered.slice(start, start + limit));
      setTotal(total);
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    }
    setLoading(false);
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  return { data, total, totalPages, loading, error, reload: load };
}
