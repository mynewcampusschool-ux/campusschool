import type { NavItem } from '../types';

// Navigation structure — static, not CMS-managed
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  {
    label: 'About', path: '/about',
    children: [
      { label: 'About Us', path: '/about' },
      { label: 'Principal Message', path: '/about/principal-message' },
      { label: 'History', path: '/about/history' },
    ],
  },
  {
    label: 'Notable Alumni', path: '/directory',
    children: [
      { label: 'Alumni Directory', path: '/directory/alumni' },
    ],
  },
  {
    label: 'Events', path: '/events',
    children: [
      { label: 'Upcoming Events', path: '/events/upcoming' },
      { label: 'Gallery', path: '/events/gallery' },
    ],
  },
  { label: 'Mentorship', path: '/mentorship' },
  {
    label: 'Jobs & Internship', path: '/jobs',
    children: [
      { label: 'Job Listings', path: '/jobs/listings' },
      { label: 'Internships', path: '/jobs/internships' },
      { label: 'Campus Hiring', path: '/jobs/campus-hiring' },
    ],
  },
  {
    label: 'Networking', path: '/networking',
    children: [
      { label: 'Connect', path: '/networking/connect' },
      { label: 'Startup Founders', path: '/networking/startups' },
      { label: 'Investors', path: '/networking/investors' },
    ],
  },
  {
    label: 'Schools', path: '/schools',
    children: [
      { label: 'All Schools', path: '/schools/all' },
      { label: 'Main Campus', path: '/schools/main-campus' },
    ],
  },
  {
    label: 'Updates', path: '/news',
    children: [
      { label: 'Latest News', path: '/news/latest' },
      { label: 'Blogs', path: '/news/blogs' },
      { label: 'Newsletter', path: '/news/newsletter' },
    ],
  },
];
