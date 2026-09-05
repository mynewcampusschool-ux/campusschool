import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { FiArrowUp, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 40,
        width: 44, height: 44, borderRadius: '0.75rem',
        background: 'linear-gradient(135deg, #0B6B4B, #094d36)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(11,107,75,0.4)',
        transition: 'all 0.3s',
        color: '#ffffff',
      }}
      title="Back to top"
    >
      <FiArrowUp size={18} />
    </button>
  );
};

const ContactButtons: React.FC = () => (
  <div style={{
    position: 'fixed',
    bottom: '5.5rem',
    right: '1.5rem',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  }}>
    <style>{`
      .float-btn {
        width: 44px; height: 44px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        color: #fff;
        text-decoration: none;
        position: relative;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .float-btn::before {
        content: '';
        position: absolute; inset: 0;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.25s ease;
      }
      .float-btn:hover { transform: translateY(-3px) scale(1.08); }
      .float-btn:hover::before { opacity: 1; }
      .float-btn:active { transform: scale(0.95); }

      .float-btn .tooltip {
        position: absolute;
        right: 54px;
        background: rgba(20,20,20,0.88);
        color: #fff;
        font-size: 12px;
        font-weight: 600;
        padding: 5px 10px;
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transform: translateX(6px);
        transition: opacity 0.2s ease, transform 0.2s ease;
        backdrop-filter: blur(6px);
      }
      .float-btn:hover .tooltip {
        opacity: 1;
        transform: translateX(0);
      }

      .float-wa {
        background: #25D366;
        box-shadow: 0 4px 15px rgba(37,211,102,0.45);
      }
      .float-wa:hover {
        box-shadow: 0 8px 25px rgba(37,211,102,0.6);
      }
      .float-call {
        background: #0B6B4B;
        box-shadow: 0 4px 15px rgba(11,107,75,0.45);
      }
      .float-call:hover {
        box-shadow: 0 8px 25px rgba(11,107,75,0.6);
      }

      @keyframes pulse-wa {
        0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.5); }
        70%  { box-shadow: 0 0 0 12px rgba(37,211,102,0); }
        100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
      }
      @keyframes pulse-call {
        0%   { box-shadow: 0 0 0 0 rgba(11,107,75,0.5); }
        70%  { box-shadow: 0 0 0 12px rgba(11,107,75,0); }
        100% { box-shadow: 0 0 0 0 rgba(11,107,75,0); }
      }
      .float-wa  { animation: pulse-wa   2.5s ease-out infinite; }
      .float-call{ animation: pulse-call 2.5s ease-out infinite 0.8s; }
      .float-wa:hover, .float-call:hover { animation: none; }
    `}</style>

    <a href="https://wa.me/919654304903" target="_blank" rel="noopener noreferrer"
      className="float-btn float-wa">
      <FaWhatsapp size={20} />
      <span className="tooltip">WhatsApp</span>
    </a>

    <a href="tel:+915944233530" className="float-btn float-call">
      <FiPhone size={18} />
      <span className="tooltip">Call Us</span>
    </a>
  </div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <ScrollToTop />
    <Header />
    <main className="flex-1 pt-[68px] md:pt-[112px]">{children}</main>
    <Footer />
    <ContactButtons />
    <BackToTop />
  </div>
);

export default Layout;
