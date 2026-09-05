import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FiUsers, FiCalendar, FiBriefcase, FiFileText, FiSettings,
  FiBarChart2, FiHome, FiBook, FiMessageSquare, FiBell,
  FiDownload, FiUserCheck, FiGrid, FiMenu, FiX, FiLogOut, FiImage,
  FiLayout, FiRadio, FiTrendingUp, FiStar, FiAward, FiAlignLeft,
} from 'react-icons/fi';
import { useAdminAuth } from '../../context/AdminAuthContext';
import DashboardPanel from './panels/DashboardPanel';
import UsersPanel from './panels/UsersPanel';
import SchoolsPanel from './panels/SchoolsPanel';
import EventsPanel from './panels/EventsPanel';
import NewsPanel from './panels/NewsPanel';
import BlogsPanel from './panels/BlogsPanel';
import MentorsPanel from './panels/MentorsPanel';
import JobsPanel from './panels/JobsPanel';
import TestimonialsPanel from './panels/TestimonialsPanel';
import NoticeBoardPanel from './panels/NoticeBoardPanel';
import AnalyticsPanel from './panels/AnalyticsPanel';
import SettingsPanel from './panels/SettingsPanel';
import GalleryPanel from './panels/GalleryPanel';
import HeroBannerPanel from './panels/HeroBannerPanel';
import TickerPanel from './panels/TickerPanel';
import StatsPanel from './panels/StatsPanel';
import QuickAccessPanel from './panels/QuickAccessPanel';
import FeaturedAlumniPanel from './panels/FeaturedAlumniPanel';
import UpcomingEventsPanel from './panels/UpcomingEventsPanel';
import NoticeBoardCMSPanel from './panels/NoticeBoardCMSPanel';
import TestimonialsCMSPanel from './panels/TestimonialsCMSPanel';
import GalleryCMSPanel from './panels/GalleryCMSPanel';
import CTAPanel from './panels/CTAPanel';
import AlumniPhotosPanel from './panels/AlumniPhotosPanel';
import AlumniDirectoryPanel from './panels/AlumniDirectoryPanel';

const navItems = [
  { icon: FiUsers, label: 'Alumni Directory', group: 'main' },
  { icon: FiUsers, label: 'Alumni Photos', group: 'main' },
  { icon: FiHome, label: 'Dashboard', group: 'main' },
  { icon: FiUsers, label: 'Users', group: 'main' },
  { icon: FiGrid, label: 'Schools', group: 'main' },
  { icon: FiCalendar, label: 'Events', group: 'main' },
  { icon: FiFileText, label: 'News', group: 'main' },
  { icon: FiBook, label: 'Blogs', group: 'main' },
  { icon: FiImage, label: 'Gallery', group: 'main' },
  { icon: FiUserCheck, label: 'Mentors', group: 'main' },
  { icon: FiBriefcase, label: 'Jobs', group: 'main' },
  { icon: FiMessageSquare, label: 'Testimonials', group: 'main' },
  { icon: FiBell, label: 'Notice Board', group: 'main' },
  { icon: FiBarChart2, label: 'Analytics', group: 'main' },
  { icon: FiSettings, label: 'Settings', group: 'main' },
  // ── Home CMS ──
  { icon: FiLayout, label: 'Hero Banner', group: 'cms' },
  { icon: FiRadio, label: 'News Ticker', group: 'cms' },
  { icon: FiTrendingUp, label: 'Statistics', group: 'cms' },
  { icon: FiGrid, label: 'Quick Access', group: 'cms' },
  { icon: FiAward, label: 'Featured Alumni', group: 'cms' },
  { icon: FiCalendar, label: 'Home Events', group: 'cms' },
  { icon: FiBell, label: 'Home Notices', group: 'cms' },
  { icon: FiStar, label: 'Home Testimonials', group: 'cms' },
  { icon: FiImage, label: 'Home Gallery', group: 'cms' },
  { icon: FiAlignLeft, label: 'CTA Section', group: 'cms' },
];

const AdminDashboard: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Open sidebar by default on desktop
  React.useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const panels: Record<string, React.ReactNode> = {
    'Alumni Directory': <AlumniDirectoryPanel />,
    'Alumni Photos': <AlumniPhotosPanel />,
    Dashboard: <DashboardPanel />,
    Users: <UsersPanel />,
    Schools: <SchoolsPanel />,
    Events: <EventsPanel />,
    News: <NewsPanel />,
    Blogs: <BlogsPanel />,
    Gallery: <GalleryPanel />,
    Mentors: <MentorsPanel />,
    Jobs: <JobsPanel />,
    Testimonials: <TestimonialsPanel />,
    'Notice Board': <NoticeBoardPanel />,
    Analytics: <AnalyticsPanel />,
    Settings: <SettingsPanel />,
    // Home CMS
    'Hero Banner': <HeroBannerPanel />,
    'News Ticker': <TickerPanel />,
    'Statistics': <StatsPanel />,
    'Quick Access': <QuickAccessPanel />,
    'Featured Alumni': <FeaturedAlumniPanel />,
    'Home Events': <UpcomingEventsPanel />,
    'Home Notices': <NoticeBoardCMSPanel />,
    'Home Testimonials': <TestimonialsCMSPanel />,
    'Home Gallery': <GalleryCMSPanel />,
    'CTA Section': <CTAPanel />,
  };

  return (
    <>
      <Helmet><title>Admin Dashboard | Campus School Pantnagar</title></Helmet>
      <div style={{ display: 'flex', height: '100vh', background: '#F8FAFC', overflow: 'hidden', fontFamily: 'Poppins, sans-serif', position: 'relative' }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden"
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside style={{
          width: 240,
          minWidth: 240,
          background: '#ffffff',
          borderRight: '1px solid #E5E7EB',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.25s',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}>
          {/* Logo */}
          <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 900, color: '#0B6B4B', fontSize: '0.72rem', textTransform: 'uppercase', lineHeight: 1.2, whiteSpace: 'nowrap' }}>Campus School</div>
              <div style={{ fontSize: '0.62rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>Admin Panel</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '0.75rem', overflowY: 'auto' }}>
            {/* Main section */}
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.25rem 0.875rem 0.5rem', marginTop: '0.25rem' }}>Main</div>
            {navItems.filter((i) => i.group === 'main').map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.6rem 0.875rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer',
                    marginBottom: '0.15rem', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap',
                    background: active ? '#0B6B4B' : 'transparent',
                    color: active ? '#ffffff' : '#6B7280',
                    boxShadow: active ? '0 2px 8px rgba(11,107,75,0.25)' : 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(11,107,75,0.07)'; (e.currentTarget as HTMLElement).style.color = '#0B6B4B'; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; } }}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
            {/* Home CMS section */}
            <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.75rem 0.875rem 0.5rem', marginTop: '0.5rem', borderTop: '1px solid #F3F4F6' }}>Home CMS</div>
            {navItems.filter((i) => i.group === 'cms').map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.65rem',
                    padding: '0.6rem 0.875rem', borderRadius: '0.6rem', border: 'none', cursor: 'pointer',
                    marginBottom: '0.15rem', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap',
                    background: active ? '#0B6B4B' : 'transparent',
                    color: active ? '#ffffff' : '#6B7280',
                    boxShadow: active ? '0 2px 8px rgba(11,107,75,0.25)' : 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(11,107,75,0.07)'; (e.currentTarget as HTMLElement).style.color = '#0B6B4B'; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; } }}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </nav>

          {/* User */}
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '0.5rem', background: '#0B6B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
              {admin?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin?.email ?? 'Admin'}</div>
              <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>Administrator</div>
            </div>
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '0.25rem' }} title="Logout">
              <FiLogOut size={15} />
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginLeft: sidebarOpen ? 240 : 0, transition: 'margin-left 0.25s' }}>
          {/* Top Bar */}
          <div style={{ background: '#ffffff', borderBottom: '1px solid #E5E7EB', padding: '0.875rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => setSidebarOpen(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: '1.05rem', color: '#111827', margin: 0 }}>{activeNav}</h1>
                <p style={{ fontSize: '0.7rem', color: '#9CA3AF', margin: 0 }}>Campus School Pantnagar Alumni Portal</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  const exportData: Record<string, string[][]> = {
                    Users: [['Name','Email','Batch','School','Role','Status'],['Rahul Sharma','rahul@gmail.com','2020','Main Campus','Alumni','Active'],['Priya Singh','priya@gmail.com','2018','North Wing','Alumni','Active']],
                    Events: [['Title','Date','Location','Type','Registrations'],['Alumni Meet 2025','2025-06-20','Main Auditorium','Upcoming','145'],['Career Guidance Webinar','2025-07-05','Online','Upcoming','89']],
                    Jobs: [['Title','Company','Location','Type','Status'],['Software Engineer','TechCorp India','Bangalore','Full-time','Active'],['Data Science Intern','Analytics Hub','Remote','Internship','Active']],
                    News: [['Title','Category','Date','Status'],['Campus School Ranked Top','Achievement','May 20, 2025','Published']],
                  };
                  const rows = exportData[activeNav] || [['No export available for this section']];
                  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = `${activeNav}_export.csv`; a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#0B6B4B', color: '#fff', border: 'none', borderRadius: '0.6rem', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                <FiDownload size={13} /> Export CSV
              </button>
            </div>
          </div>

          {/* Content */}
          <div key={activeNav} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
            {panels[activeNav]}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
