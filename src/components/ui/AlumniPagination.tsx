import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AlumniPagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  /* Build page number array with ellipsis */
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const btnBase: React.CSSProperties = {
    minWidth: 36,
    height: 36,
    borderRadius: '0.625rem',
    border: '1.5px solid #E5E7EB',
    background: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    fontFamily: "'Poppins', sans-serif",
    color: '#374151',
    padding: '0 0.5rem',
  };

  const activeBtn: React.CSSProperties = {
    ...btnBase,
    background: '#0B6B4B',
    borderColor: '#0B6B4B',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(11,107,75,0.3)',
  };

  const disabledBtn: React.CSSProperties = {
    ...btnBase,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.375rem',
        marginTop: '2.5rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Prev */}
      <button
        style={currentPage === 1 ? disabledBtn : btnBase}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        <FiChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span
            key={`ellipsis-${i}`}
            style={{ ...btnBase, border: 'none', background: 'transparent', cursor: 'default', color: '#9CA3AF' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            style={p === currentPage ? activeBtn : btnBase}
            onClick={() => onPageChange(p as number)}
            onMouseEnter={(e) => {
              if (p !== currentPage) {
                (e.currentTarget as HTMLElement).style.borderColor = '#0B6B4B';
                (e.currentTarget as HTMLElement).style.color = '#0B6B4B';
              }
            }}
            onMouseLeave={(e) => {
              if (p !== currentPage) {
                (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB';
                (e.currentTarget as HTMLElement).style.color = '#374151';
              }
            }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        style={currentPage === totalPages ? disabledBtn : btnBase}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
};

export default AlumniPagination;
