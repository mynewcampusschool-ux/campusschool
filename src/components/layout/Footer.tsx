import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiMail, FiMapPin, FiArrowRight, FiSend } from 'react-icons/fi';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer style={{ background: '#0a0f1a', color: '#ffffff' }}>
      {/* Pre-footer CTA strip */}
      <div style={{ background: 'linear-gradient(135deg, #0B6B4B 0%, #094d36 100%)', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
              Stay Connected with Your Alumni Community
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              Subscribe to our newsletter for updates, events, and opportunities.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0 footer-form-mobile">
            {subscribed ? (
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem 1.25rem', color: '#D4AF37', fontWeight: 600, fontSize: '0.875rem' }}>
                ✓ Subscribed! Thank you.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '0.75rem', padding: '0.75rem 1rem', color: '#ffffff',
                    fontSize: '0.875rem', outline: 'none', width: '100%', minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#D4AF37', color: '#ffffff', border: 'none',
                    borderRadius: '0.75rem', padding: '0.75rem 1.25rem',
                    fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    transition: 'background 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  <FiSend size={15} /> Subscribe
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10">

          {/* Brand — spans 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/logo.jpg"
                alt="Campus School Pantnagar"
                style={{ width: 56, height: 56, borderRadius: '0.875rem', objectFit: 'contain', border: '2px solid rgba(212,175,55,0.3)' }}
              />
              <div>
                <div style={{ fontWeight: 900, color: '#ffffff', fontSize: '0.9rem', lineHeight: 1.25, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Campus School<br />Pantnagar
                </div>
                <div style={{ fontSize: '0.65rem', color: '#D4AF37', fontWeight: 600, marginTop: 2 }}>Alumni Portal</div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.25rem' }}>
              Reconnecting alumni across the countries. Building relationships, creating opportunities, and celebrating the legacy of Campus School Pantnagar since 1972.
            </p>

            {/* Motto */}
            <div
              style={{
                background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem',
              }}
            >
              <p style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, fontStyle: 'italic' }}>
                "Glory To God and Service To All"
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', marginTop: 2 }}>— School Motto since 1972</p>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {[
                { icon: <FaFacebookF size={14} />, href: 'https://www.facebook.com/Campusalumni/', label: 'Facebook', color: '#1877F2' },
                { icon: <FaInstagram size={14} />, href: 'https://www.instagram.com/campusschoolpantnagaralumn', label: 'Instagram', color: '#E4405F' },
                { icon: <FaLinkedinIn size={14} />, href: 'https://www.linkedin.com/company/campus-school-pantnagar', label: 'LinkedIn', color: '#0A66C2' },
                { icon: <FaYoutube size={14} />, href: 'https://www.youtube.com/channel/UCgPKP8cmNPq_lSevfihUrCQ', label: 'YouTube', color: '#FF0000' },
                { icon: <FaWhatsapp size={14} />, href: '#', label: 'WhatsApp', color: '#25D366' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: 36, height: 36, borderRadius: '0.625rem',
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = s.color;
                    (e.currentTarget as HTMLElement).style.color = '#ffffff';
                    (e.currentTarget as HTMLElement).style.borderColor = s.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'About Us', path: '/about' },
                { label: 'Alumni Directory', path: '/directory' },
                { label: 'Events', path: '/events' },
                { label: 'Photo Gallery', path: '/events/gallery' },
                { label: 'Notice Board', path: '/notice-board' },
                { label: 'Our Schools', path: '/schools' },
                { label: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    <FiArrowRight size={11} style={{ color: '#0B6B4B', flexShrink: 0 }} /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Alumni Services */}
          <div>
            <h4 style={{ fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Alumni Services
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Register as Alumni', path: '/auth/register' },
                { label: 'Update Profile', path: '/profile' },
                { label: 'Find a Mentor', path: '/mentorship' },
                { label: 'Become a Mentor', path: '/mentorship' },
                { label: 'Job Opportunities', path: '/jobs' },
                { label: 'Internships', path: '/jobs/internships' },
                { label: 'Networking', path: '/networking' },
                { label: 'Success Stories', path: '/directory' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    <FiArrowRight size={11} style={{ color: '#0B6B4B', flexShrink: 0 }} /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex items-start gap-3">
                <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'rgba(11,107,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiMapPin size={14} style={{ color: '#0B6B4B' }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                  Campus School Pantnagar,<br />Udham Singh Nagar,<br />Uttarakhand – 263145
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'rgba(11,107,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiPhone size={14} style={{ color: '#0B6B4B' }} />
                </div>
                <a href="tel:+915944233530" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}>
                  +91-5944-233530
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ width: 32, height: 32, borderRadius: '0.5rem', background: 'rgba(11,107,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FiMail size={14} style={{ color: '#0B6B4B' }} />
                </div>
                <a href="mailto:campusschoolpantnagar@gmail.com" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.2s', wordBreak: 'break-all' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; }}>
                  campusschoolpantnagar@gmail.com
                </a>
              </div>
            </div>

            {/* Map embed placeholder */}
            <div
              style={{
                marginTop: '1.25rem', borderRadius: '0.75rem', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)', height: 100,
                background: 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <a
                href="https://maps.google.com/?q=Campus+School+Pantnagar+Uttarakhand"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <FiMapPin size={14} /> View on Google Maps →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', textAlign: 'center' }}>
            © {new Date().getFullYear()} Campus School Pantnagar Alumni Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link to="/privacy-policy" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}>
              Terms of Service
            </Link>
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4AF37'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
