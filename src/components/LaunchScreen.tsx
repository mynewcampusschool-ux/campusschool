import React, { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'csp_launch_seen';

const LaunchScreen: React.FC = () => {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(STORAGE_KEY));
  const [opening, setOpening] = useState(false);
  const [done, setDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (visible) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [visible]);

  type Particle = {
    x: number; y: number; vx: number; vy: number;
    size: number; color: string; type: 'sparkle' | 'petal';
    rotation: number; rotSpeed: number; alpha: number; life: number;
  };

  const launchParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#D4AF37', '#FFD700', '#FFF8DC', '#F5DEB3', '#FFFACD', '#FFE4B5'];
    const petalColors = ['#FFB7C5', '#FF9EAD', '#FFCDD2', '#F8BBD0', '#FCE4EC', '#FFF0F5'];

    particlesRef.current = Array.from({ length: 80 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: i < 40 ? -20 - Math.random() * 100 : Math.random() * canvas.height * 0.3,
      vx: (Math.random() - 0.5) * 2,
      vy: 1 + Math.random() * 2.5,
      size: i < 40 ? 6 + Math.random() * 10 : 3 + Math.random() * 5,
      color: i < 40 ? petalColors[Math.floor(Math.random() * petalColors.length)] : colors[Math.floor(Math.random() * colors.length)],
      type: i < 40 ? 'petal' : 'sparkle',
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.08,
      alpha: 1,
      life: 1,
    }));

    let elapsed = 0;
    const draw = () => {
      elapsed += 16;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life = Math.max(0, 1 - elapsed / 4000);
        p.alpha = p.life;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'petal') {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          for (let j = 0; j < 4; j++) {
            ctx.rotate(Math.PI / 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(p.size * 0.3, p.size);
            ctx.lineTo(0, p.size * 0.7);
            ctx.lineTo(-p.size * 0.3, p.size);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.restore();
      });

      if (elapsed < 4000) animFrameRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animFrameRef.current = requestAnimationFrame(draw);
  };

  const handleEnter = () => {
    setOpening(true);
    launchParticles();
    setTimeout(() => {
      setDone(true);
      setVisible(false);
      document.body.style.overflow = '';
      sessionStorage.setItem(STORAGE_KEY, '1');
      cancelAnimationFrame(animFrameRef.current);
    }, 2200);
  };

  if (!visible && done) return null;
  if (!visible) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none' }}
      />
      <div style={{ position: 'fixed', inset: 0, zIndex: 99998, overflow: 'hidden' }}>
        {/* Left curtain */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
          background: 'linear-gradient(135deg, #0a3d2b 0%, #0B6B4B 40%, #094d36 100%)',
          transform: opening ? 'translateX(-100%)' : 'translateX(0)',
          transition: opening ? 'transform 2s cubic-bezier(0.77,0,0.18,1)' : 'none',
          boxShadow: 'inset -8px 0 32px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)`,
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '100%', height: '100%',
            background: 'linear-gradient(to right, transparent 60%, rgba(0,0,0,0.25) 100%)',
          }} />
        </div>

        {/* Right curtain */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
          background: 'linear-gradient(225deg, #0a3d2b 0%, #0B6B4B 40%, #094d36 100%)',
          transform: opening ? 'translateX(100%)' : 'translateX(0)',
          transition: opening ? 'transform 2s cubic-bezier(0.77,0,0.18,1)' : 'none',
          boxShadow: 'inset 8px 0 32px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)`,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'linear-gradient(to left, transparent 60%, rgba(0,0,0,0.25) 100%)',
          }} />
        </div>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 2,
          opacity: opening ? 0 : 1,
          transition: opening ? 'opacity 0.6s ease' : 'none',
          pointerEvents: opening ? 'none' : 'auto',
        }}>
          {/* Gold top line */}
          <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', marginBottom: 24 }} />

          {/* Logo */}
          <img
            src="/logo.jpg"
            alt="Campus School Pantnagar"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
            style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '3px solid #D4AF37', marginBottom: 20, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
          />

          <p style={{ color: '#D4AF37', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'Poppins, sans-serif' }}>
            Welcome to
          </p>
          <h1 style={{ color: '#ffffff', fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 900, textAlign: 'center', letterSpacing: '0.05em', fontFamily: 'Poppins, sans-serif', marginBottom: 4, padding: '0 1rem' }}>
            Campus School Pantnagar
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 32, fontFamily: 'Poppins, sans-serif' }}>
            Alumni Portal
          </p>

          {/* Gold divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
            <div style={{ width: 6, height: 6, background: '#D4AF37', transform: 'rotate(45deg)' }} />
            <div style={{ width: 40, height: 1, background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
          </div>

          {/* CTA Button */}
          <button
            onClick={handleEnter}
            style={{
              background: 'transparent',
              border: '1.5px solid #D4AF37',
              color: '#D4AF37',
              padding: '14px 48px',
              fontSize: '0.8rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#D4AF37';
              (e.currentTarget as HTMLButtonElement).style.color = '#0B6B4B';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37';
            }}
          >
            Enter
          </button>

          {/* Bottom line */}
          <div style={{ width: 60, height: 2, background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', marginTop: 32 }} />
        </div>
      </div>
    </>
  );
};

export default LaunchScreen;
