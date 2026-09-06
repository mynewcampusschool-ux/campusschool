import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiPhone, FiMail, FiChevronDown, FiMenu, FiX, FiUser, FiLogOut,
} from 'react-icons/fi';
import {
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
} from 'react-icons/fa';
import { NAV_ITEMS } from '../../lib/data';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMobileExpanded(null); }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Top Bar ── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ background: '#0B6B4B', overflow: 'hidden' }}
          >
            <div
              style={{
                maxWidth: '80rem',
                margin: '0 auto',
                padding: '0.35rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.25rem',
                fontSize: '0.78rem',
                color: '#ffffff',
              }}
            >
              {/* Mobile: 2-row compact layout | Desktop: single row */}

              {/* Row 1 (mobile) — contact info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href="tel:+919654304903"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#ffffff', textDecoration: 'none', fontSize: '0.72rem' }}
                >
                  <FiPhone size={11} /> +91 96543 04903
                </a>
                <a
                  href="mailto:campusschoolpantnagar@gmail.com"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.68rem' }}
                >
                  <FiMail size={11} />
                  <span className="hidden sm:inline">campusschoolpantnagar@gmail.com</span>
                  <span className="sm:hidden">Email Us</span>
                </a>
              </div>

              {/* Row 2 (mobile) — socials + auth */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'nowrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem' }} className="hidden sm:inline">Follow Us:</span>
                {[
                  { icon: <FaFacebookF size={11} />, href: 'https://www.facebook.com/Campusalumni/' },
                  { icon: <FaInstagram size={11} />, href: 'https://www.instagram.com/campusschoolpantnagaralumn' },
                  { icon: <FaLinkedinIn size={11} />, href: 'https://www.linkedin.com/company/campus-school-pantnagar' },
                  { icon: <FaYoutube size={11} />, href: 'https://www.youtube.com/channel/UCgPKP8cmNPq_lSevfihUrCQ' },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22 }}>
                    {s.icon}
                  </a>
                ))}
                <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.3)', display: 'inline-block', margin: '0 0.1rem' }} />
                {user ? (
                  <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffffff', fontWeight: 600, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FiLogOut size={11} /> <span className="hidden sm:inline">LOGOUT</span>
                  </button>
                ) : (
                  <Link to="/auth/login" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 700, fontSize: '0.7rem' }}>LOGIN</Link>
                )}
                <a
                  href="https://campusschoolpantnagar.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#D4AF37', color: '#ffffff', textDecoration: 'none',
                    fontWeight: 700, fontSize: '0.65rem', padding: '0.18rem 0.55rem',
                    borderRadius: '0.3rem', letterSpacing: '0.03em', whiteSpace: 'nowrap',
                  }}
                >
                  <span className="hidden sm:inline">SCHOOL WEBSITE</span>
                  <span className="sm:hidden">STAY P</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Nav ── */}
      <div
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : '#ffffff',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled
            ? '0 4px 24px 0 rgba(11,107,75,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.06)'
            : '0 1px 0 0 #E5E7EB',
          transition: 'all 0.3s',
          padding: scrolled ? '0.35rem 0' : '0.5rem 0',
        }}
      >
        <div
          style={{
            maxWidth: '80rem',
            margin: '0 auto',
            padding: '0 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src="/logo.jpg"
              alt="Campus School Pantnagar"
              className="w-10 h-10 lg:w-[72px] lg:h-[72px]"
              style={{ borderRadius: 10, objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontWeight: 900, color: '#0B6B4B', fontSize: '0.78rem', lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Campus School<br />Pantnagar
              </div>
              <div style={{ fontSize: '0.58rem', color: '#6B7280', fontWeight: 500 }}>Glory To God and Service To All</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', flex: 1, justifyContent: 'center' }} className="hidden lg:flex">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: '0.45rem 0.6rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: location.pathname === item.path ? '#0B6B4B' : '#374151',
                    background: location.pathname === item.path ? 'rgba(11,107,75,0.07)' : 'transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    borderBottom: location.pathname === item.path ? '2px solid #0B6B4B' : '2px solid transparent',
                  }}
                >
                  {item.label}
                  {item.children && (
                    <FiChevronDown
                      size={12}
                      style={{
                        transition: 'transform 0.2s',
                        transform: activeDropdown === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '0.3rem',
                        width: '13rem',
                        background: '#ffffff',
                        borderRadius: '0.75rem',
                        boxShadow: '0 8px 32px 0 rgba(11,107,75,0.13)',
                        border: '1px solid rgba(229,231,235,0.7)',
                        overflow: 'hidden',
                        zIndex: 100,
                      }}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.path}
                          style={{
                            display: 'block',
                            padding: '0.6rem 1rem',
                            fontSize: '0.82rem',
                            color: '#374151',
                            textDecoration: 'none',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(11,107,75,0.06)';
                            (e.currentTarget as HTMLElement).style.color = '#0B6B4B';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#374151';
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex" style={{ alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 600, color: '#0B6B4B', textDecoration: 'none' }}>
                  <FiUser size={15} /> Profile
                </Link>
                <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
                  <FiLogOut size={15} />
                </button>
              </div>
            ) : (
              <Link to="/auth/register" className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem', whiteSpace: 'nowrap' }}>
                <FiUser size={14} /> Register Now
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', color: '#374151' }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: '#ffffff', borderTop: '1px solid #E5E7EB', boxShadow: '0 4px 24px 0 rgba(11,107,75,0.10)', overflow: 'hidden' }}
          >
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0.75rem 0.75rem 1rem' }}>
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === item.label ? null : item.label)}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '0.7rem 0.875rem', borderRadius: '0.625rem',
                          fontSize: '0.875rem', fontWeight: 700, color: '#111827',
                          background: mobileExpanded === item.label ? 'rgba(11,107,75,0.06)' : 'transparent',
                          border: 'none', cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <span>{item.label}</span>
                        <FiChevronDown
                          size={15}
                          style={{
                            color: '#0B6B4B', flexShrink: 0,
                            transition: 'transform 0.2s',
                            transform: mobileExpanded === item.label ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ overflow: 'hidden', marginLeft: '0.875rem', borderLeft: '2px solid rgba(11,107,75,0.15)', paddingLeft: '0.75rem', marginBottom: '0.25rem' }}
                          >
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                to={child.path}
                                style={{
                                  display: 'flex', alignItems: 'center', padding: '0.55rem 0.5rem',
                                  fontSize: '0.82rem', color: '#374151', textDecoration: 'none',
                                  fontWeight: 500, borderRadius: '0.5rem', transition: 'color 0.15s',
                                }}
                              >
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#D4AF37', display: 'inline-block', marginRight: '0.6rem', flexShrink: 0 }} />
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      style={{
                        display: 'flex', alignItems: 'center', padding: '0.7rem 0.875rem',
                        borderRadius: '0.625rem', fontSize: '0.875rem', fontWeight: 700,
                        color: location.pathname === item.path ? '#0B6B4B' : '#111827',
                        background: location.pathname === item.path ? 'rgba(11,107,75,0.06)' : 'transparent',
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #E5E7EB', marginTop: '0.5rem' }}>
                {user ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to="/profile" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '0.65rem 1rem' }}>
                      <FiUser size={14} /> My Profile
                    </Link>
                    <button onClick={logout} style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: '0.625rem', padding: '0.65rem 1rem', cursor: 'pointer', color: '#6B7280', fontWeight: 600, fontSize: '0.82rem' }}>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to="/auth/login" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', borderRadius: '0.625rem', padding: '0.65rem 1rem', color: '#374151', fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none' }}>
                      Login
                    </Link>
                    <Link to="/auth/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '0.65rem 1rem' }}>
                      <FiUser size={14} /> Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
