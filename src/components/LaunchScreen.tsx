import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'csp_launch_v2';

type Phase = 'countdown' | 'enter' | 'opening' | 'done';

const LaunchScreen: React.FC = () => {
  const seen = sessionStorage.getItem(STORAGE_KEY);
  const [phase, setPhase] = useState<Phase>(seen ? 'done' : 'countdown');
  const [count, setCount] = useState(5);
  const [countAnim, setCountAnim] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  // Lock scroll
  useEffect(() => {
    if (phase === 'done') return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [phase]);

  // Countdown 5→1 then show ENTER
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count === 0) { setPhase('enter'); return; }
    setCountAnim(false);
    const t1 = setTimeout(() => setCountAnim(true), 50);
    const t2 = setTimeout(() => setCount(c => c - 1), 1000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, count]);

  // Particle canvas
  const startParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    type P = {
      x: number; y: number; vx: number; vy: number;
      size: number; color: string; type: 'sparkle' | 'petal';
      rot: number; rotV: number; alpha: number;
    };

    const gold = ['#D4AF37','#FFD700','#FFF8DC','#FFE066','#FFFACD'];
    const flowerColors = [
      '#FF6B9D','#FF4757','#FF6348','#FFA502','#ECCC68',
      '#FF9FF3','#54A0FF','#5F27CD','#00D2D3','#FF9F43',
      '#EE5A24','#C44569','#E84393','#9B59B6','#3DC1D3',
    ];

    const pts: P[] = Array.from({ length: 120 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: i < 80 ? -30 - Math.random() * 150 : Math.random() * canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 2,
      vy: 0.6 + Math.random() * 2.5,
      size: i < 80 ? 10 + Math.random() * 16 : 3 + Math.random() * 5,
      color: i < 80
        ? flowerColors[Math.floor(Math.random() * flowerColors.length)]
        : gold[Math.floor(Math.random() * gold.length)],
      type: i < 80 ? 'petal' : 'sparkle',
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.06,
      alpha: 1,
    }));

    let elapsed = 0;
    const DURATION = 4500;

    const draw = () => {
      elapsed += 16;
      const progress = Math.min(elapsed / DURATION, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.alpha = Math.max(0, 1 - progress * 1.2);
        if (p.y > canvas.height + 20) { p.y = -20; p.x = Math.random() * canvas.width; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.type === 'petal') {
          // Realistic flower petal shape
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.6, p.size * 0.6, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.6, -p.size * 0.6, -p.size * 0.6, 0, -p.size);
          ctx.fill();
          // Petal center line
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.8);
          ctx.lineTo(0, p.size * 0.8);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          for (let j = 0; j < 4; j++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(p.size * 0.28, p.size);
            ctx.lineTo(0, p.size * 0.65);
            ctx.lineTo(-p.size * 0.28, p.size);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.restore();
      });

      if (elapsed < DURATION) rafRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    rafRef.current = requestAnimationFrame(draw);
  };

  const handleEnter = () => {
    setPhase('opening');
    startParticles();
    setTimeout(() => {
      setPhase('done');
      document.body.style.overflow = '';
      sessionStorage.setItem(STORAGE_KEY, '1');
      cancelAnimationFrame(rafRef.current);
    }, 2400);
  };

  if (phase === 'done') return null;

  const isOpening = phase === 'opening';

  return (
    <>
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 100000, pointerEvents: 'none' }}
      />

      {/* Overlay wrapper */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, overflow: 'hidden' }}>

        {/* LEFT curtain */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
          background: 'linear-gradient(160deg, #062a1c 0%, #0B6B4B 45%, #083d2a 100%)',
          transform: isOpening ? 'translateX(-100%)' : 'translateX(0)',
          transition: isOpening ? 'transform 2.2s cubic-bezier(0.76,0,0.24,1)' : 'none',
          willChange: 'transform',
        }}>
          {/* Fabric lines */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 36px)',
          }} />
          {/* Edge shadow */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '30%', height: '100%',
            background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.35))',
          }} />
          {/* Gold trim */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 3, height: '100%',
            background: 'linear-gradient(to bottom, transparent, #D4AF37 20%, #D4AF37 80%, transparent)',
          }} />
        </div>

        {/* RIGHT curtain */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
          background: 'linear-gradient(200deg, #062a1c 0%, #0B6B4B 45%, #083d2a 100%)',
          transform: isOpening ? 'translateX(100%)' : 'translateX(0)',
          transition: isOpening ? 'transform 2.2s cubic-bezier(0.76,0,0.24,1)' : 'none',
          willChange: 'transform',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.07,
            backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 36px)',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '30%', height: '100%',
            background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.35))',
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
            background: 'linear-gradient(to bottom, transparent, #D4AF37 20%, #D4AF37 80%, transparent)',
          }} />
        </div>

        {/* CENTER content */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: isOpening ? 0 : 1,
          transition: isOpening ? 'opacity 0.5s ease' : 'none',
          pointerEvents: isOpening ? 'none' : 'auto',
          padding: '1rem',
        }}>
          {/* Top gold line */}
          <div style={{ width: 56, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', marginBottom: 22 }} />

          {/* Logo */}
          <img
            src="/logo.jpg"
            alt="Campus School Pantnagar"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            style={{
              width: 'clamp(64px, 12vw, 88px)',
              height: 'clamp(64px, 12vw, 88px)',
              borderRadius: '50%', objectFit: 'cover',
              border: '2.5px solid #D4AF37',
              marginBottom: 18,
              boxShadow: '0 0 28px rgba(212,175,55,0.45)',
            }}
          />

          <p style={{ color: '#D4AF37', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Poppins,sans-serif' }}>
            Welcome to
          </p>
          <h1 style={{
            color: '#fff', fontWeight: 900, textAlign: 'center',
            fontSize: 'clamp(1rem, 3.5vw, 1.8rem)',
            letterSpacing: '0.04em', fontFamily: 'Poppins,sans-serif',
            marginBottom: 2, padding: '0 0.5rem',
          }}>
            Campus School Pantnagar
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(0.6rem, 1.5vw, 0.72rem)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 28, fontFamily: 'Poppins,sans-serif' }}>
            Alumni Portal
          </p>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{ width: 36, height: 1, background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
            <div style={{ width: 5, height: 5, background: '#D4AF37', transform: 'rotate(45deg)' }} />
            <div style={{ width: 36, height: 1, background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
          </div>

          {/* COUNTDOWN */}
          {phase === 'countdown' && (
            <div style={{
              width: 'clamp(80px, 18vw, 110px)',
              height: 'clamp(80px, 18vw, 110px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid rgba(212,175,55,0.4)',
              borderRadius: '50%',
              boxShadow: '0 0 30px rgba(212,175,55,0.2)',
              marginBottom: 8,
            }}>
              <span
                key={count}
                style={{
                  color: '#D4AF37',
                  fontSize: 'clamp(2.2rem, 8vw, 3.8rem)',
                  fontWeight: 900,
                  fontFamily: 'Poppins,sans-serif',
                  textShadow: '0 0 20px rgba(212,175,55,0.7)',
                  opacity: countAnim ? 1 : 0,
                  transform: countAnim ? 'scale(1)' : 'scale(1.4)',
                  transition: 'opacity 0.35s ease, transform 0.35s ease',
                  display: 'block',
                  lineHeight: 1,
                }}
              >
                {count === 0 ? '' : count}
              </span>
            </div>
          )}

          {/* ENTER BUTTON */}
          {phase === 'enter' && (
            <button
              onClick={handleEnter}
              style={{
                background: 'transparent',
                border: '1.5px solid #D4AF37',
                color: '#D4AF37',
                padding: 'clamp(10px,2vw,14px) clamp(32px,6vw,52px)',
                fontSize: 'clamp(0.7rem, 1.8vw, 0.82rem)',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                fontFamily: 'Poppins,sans-serif',
                fontWeight: 600,
                cursor: 'pointer',
                animation: 'csp-pulse 1.8s ease-in-out infinite',
                transition: 'background 0.25s, color 0.25s',
                minHeight: 44,
                minWidth: 140,
              }}
              onMouseEnter={e => {
                const b = e.currentTarget;
                b.style.background = '#D4AF37';
                b.style.color = '#0B6B4B';
              }}
              onMouseLeave={e => {
                const b = e.currentTarget;
                b.style.background = 'transparent';
                b.style.color = '#D4AF37';
              }}
            >
              Enter
            </button>
          )}

          {/* Bottom gold line */}
          <div style={{ width: 56, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', marginTop: 28 }} />
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes csp-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(212,175,55,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </>
  );
};

export default LaunchScreen;
