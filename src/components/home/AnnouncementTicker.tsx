import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { useCMS } from '../../context/CMSContext';

const Sep: React.FC = () => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block',
      width: 5,
      height: 5,
      background: '#D4AF37',
      transform: 'rotate(45deg)',
      flexShrink: 0,
      opacity: 0.7,
      margin: '0 52px',
    }}
  />
);

const AnnouncementTicker: React.FC = () => {
  const { cms } = useCMS();
  const ANNOUNCEMENTS = cms.ticker.filter((t) => t.enabled);
  if (ANNOUNCEMENTS.length === 0) return null;
  /* Duplicate the list once — animation moves -50% so it loops perfectly */
  const doubled = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];

  return (
    <div
      style={{
        background: '#0B5D3B',
        borderBottom: '2px solid rgba(212,175,55,0.35)',
        height: 42,
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 49,
      }}
    >
      {/* ── LATEST badge ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'linear-gradient(135deg,#D4AF37,#b8962e)',
          color: '#fff',
          padding: '0 14px',
          fontSize: '0.62rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          zIndex: 3,
          boxShadow: '4px 0 12px rgba(0,0,0,0.25)',
        }}
      >
        {/* live dot */}
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#fff',
            display: 'inline-block',
            animation: 'pulse 1.6s ease-in-out infinite',
            flexShrink: 0,
          }}
        />
        Latest
      </div>

      {/* ── Scrolling viewport ── */}
      <div
        className="news-ticker-viewport"
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          /* soft fade on both edges */
          maskImage:
            'linear-gradient(to right, transparent 0px, #000 48px, #000 calc(100% - 48px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0px, #000 48px, #000 calc(100% - 48px), transparent 100%)',
        }}
      >
        <div
          className="news-ticker-track"
          style={{ height: 42, alignItems: 'center' }}
        >
          {doubled.map((item, i) => (
            <React.Fragment key={i}>
              {/* news item */}
              <span
                title={`${item.text} ${item.highlight}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.74rem',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  color: 'rgba(255,255,255,0.88)',
                  cursor: 'default',
                  userSelect: 'none',
                }}
              >
                <span style={{ fontSize: '0.85rem', lineHeight: 1 }}>{item.emoji}</span>
                {item.text}&nbsp;
                <span
                  style={{
                    color: '#D4AF37',
                    fontWeight: 700,
                  }}
                >
                  {item.highlight}
                </span>
              </span>

              {/* separator — skip after last item of second copy */}
              {i < doubled.length - 1 && <Sep />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── View All button ── */}
      <Link
        to="/notice-board"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          color: '#D4AF37',
          fontSize: '0.68rem',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textDecoration: 'none',
          padding: '0 14px',
          flexShrink: 0,
          whiteSpace: 'nowrap',
          borderLeft: '1px solid rgba(255,255,255,0.12)',
          zIndex: 3,
          transition: 'color 0.2s',
          textTransform: 'uppercase',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#D4AF37')}
      >
        View All <FiArrowRight size={11} />
      </Link>
    </div>
  );
};

export default AnnouncementTicker;
