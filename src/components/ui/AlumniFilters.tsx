import React from 'react';
import { FiSearch, FiX, FiSliders } from 'react-icons/fi';

export interface FilterState {
  search: string;
  batch: string;
  profession: string;
  organization: string;
  country: string;
  city: string;
  sort: 'az' | 'za' | 'newest' | 'oldest';
}

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  batches: string[];
  professions: string[];
  organizations: string[];
  countries: string[];
  cities: string[];
  total: number;
  filtered: number;
}

const sel: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  border: '1.5px solid #E5E7EB',
  borderRadius: '0.75rem',
  fontSize: '0.8rem',
  color: '#374151',
  background: '#ffffff',
  outline: 'none',
  fontFamily: "'Poppins', sans-serif",
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2rem',
};

const AlumniFilters: React.FC<Props> = ({
  filters, onChange, batches, professions, organizations, countries, cities, total, filtered,
}) => {
  const set = (key: keyof FilterState, val: string) =>
    onChange({ ...filters, [key]: val });

  const hasActive =
    filters.search || filters.batch || filters.profession ||
    filters.organization || filters.country || filters.city;

  const clearAll = () =>
    onChange({ search: '', batch: '', profession: '', organization: '', country: '', city: '', sort: filters.sort });

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '1.125rem',
        border: '1px solid rgba(229,231,235,0.7)',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        padding: '1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* ── Row 1: search + sort ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.75rem',
          marginBottom: '0.875rem',
        }}
        className="sm:!grid-cols-[1fr_auto]"
      >
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <FiSearch
            size={15}
            style={{
              position: 'absolute', left: '0.875rem',
              top: '50%', transform: 'translateY(-50%)',
              color: '#9CA3AF', pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search by name, batch, city, profession, company, country…"
            style={{
              width: '100%',
              padding: '0.65rem 2.5rem 0.65rem 2.5rem',
              border: '1.5px solid #E5E7EB',
              borderRadius: '0.75rem',
              fontSize: '0.8rem',
              color: '#374151',
              outline: 'none',
              fontFamily: "'Poppins', sans-serif",
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = '#0B6B4B')}
            onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = '#E5E7EB')}
          />
          {filters.search && (
            <button
              onClick={() => set('search', '')}
              style={{
                position: 'absolute', right: '0.75rem', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0,
              }}
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div style={{ position: 'relative' }}>
          <FiSliders
            size={13}
            style={{
              position: 'absolute', left: '0.75rem',
              top: '50%', transform: 'translateY(-50%)',
              color: '#6B7280', pointerEvents: 'none', zIndex: 1,
            }}
          />
          <select
            value={filters.sort}
            onChange={(e) => set('sort', e.target.value)}
            style={{ ...sel, paddingLeft: '2rem', width: '100%' }}
          >
            <option value="az">Sort: A → Z</option>
            <option value="za">Sort: Z → A</option>
            <option value="newest">Latest Registration</option>
            <option value="oldest">Oldest Registration</option>
          </select>
        </div>
      </div>

      {/* ── Row 2: dropdown filters ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.5rem',
          marginBottom: '0.875rem',
        }}
      >
        <div style={{ position: 'relative' }}>
          <select value={filters.batch} onChange={(e) => set('batch', e.target.value)} style={sel}>
            <option value="">All Batches</option>
            {batches.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <select value={filters.profession} onChange={(e) => set('profession', e.target.value)} style={sel}>
            <option value="">All Professions</option>
            {professions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <select value={filters.organization} onChange={(e) => set('organization', e.target.value)} style={sel}>
            <option value="">All Organizations</option>
            {organizations.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <select value={filters.country} onChange={(e) => set('country', e.target.value)} style={sel}>
            <option value="">All Countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <select value={filters.city} onChange={(e) => set('city', e.target.value)} style={sel}>
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Row 3: result count + clear ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <p style={{ fontSize: '0.78rem', color: '#6B7280', margin: 0 }}>
          Showing{' '}
          <span style={{ fontWeight: 700, color: '#0B6B4B' }}>{filtered}</span>
          {' '}of{' '}
          <span style={{ fontWeight: 700, color: '#111827' }}>{total}</span>
          {' '}alumni
        </p>
        {hasActive && (
          <button
            onClick={clearAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(239,68,68,0.07)', color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem',
              padding: '0.3rem 0.75rem', fontSize: '0.72rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.14)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.07)')}
          >
            <FiX size={12} /> Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default AlumniFilters;
