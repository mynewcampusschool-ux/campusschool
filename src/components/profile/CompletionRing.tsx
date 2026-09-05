import React from 'react';

interface Props { pct: number; size?: number; stroke?: number; }

const CompletionRing: React.FC<Props> = ({ pct, size = 96, stroke = 5 }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#0B6B4B' : pct >= 50 ? '#D4AF37' : '#EF4444';

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-label={`Profile ${pct}% complete`}>

      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
};

export default CompletionRing;
