import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LaunchScreen from './components/LaunchScreen';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CMSProvider } from './context/CMSContext';
import { AlumniPhotoProvider } from './context/AlumniPhotoContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import RequireAdminAuth from './components/admin/RequireAdminAuth';
import Layout from './components/layout/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';

const HomePage          = lazy(() => import('./pages/HomePage'));
const AboutPage         = lazy(() => import('./pages/AboutPage'));
const PrincipalMessagePage = lazy(() => import('./pages/PrincipalMessagePage'));
const HistoryPage       = lazy(() => import('./pages/HistoryPage'));
const DirectoryPage     = lazy(() => import('./pages/DirectoryPage'));
const EventsPage        = lazy(() => import('./pages/EventsPage'));
const MentorshipPage    = lazy(() => import('./pages/MentorshipPage'));
const JobsPage          = lazy(() => import('./pages/JobsPage'));
const NewsPage          = lazy(() => import('./pages/NewsPage'));
const NoticeBoardPage   = lazy(() => import('./pages/NoticeBoardPage'));
const SchoolsPage       = lazy(() => import('./pages/SchoolsPage'));
const MainCampusPage    = lazy(() => import('./pages/MainCampusPage'));
const NetworkingPage    = lazy(() => import('./pages/NetworkingPage'));
const ProfilePage       = lazy(() => import('./pages/ProfilePage'));
const LoginPage         = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const AdminDashboard    = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLoginPage    = lazy(() => import('./pages/admin/AdminLoginPage'));
const NotFoundPage      = lazy(() => import('./pages/NotFoundPage'));
const GalleryPage            = lazy(() => import('./pages/GalleryPage'));
const ContactPage            = lazy(() => import('./pages/ContactPage'));
const BusinessDirectoryPage  = lazy(() => import('./pages/BusinessDirectoryPage'));
const UpcomingEventsPage     = lazy(() => import('./pages/UpcomingEventsPage'));
const ConnectPage            = lazy(() => import('./pages/ConnectPage'));
const StartupFoundersPage    = lazy(() => import('./pages/StartupFoundersPage'));
const InvestorsPage          = lazy(() => import('./pages/InvestorsPage'));
const LatestNewsPage         = lazy(() => import('./pages/LatestNewsPage'));
const BlogsPage              = lazy(() => import('./pages/BlogsPage'));
const NewsletterPage         = lazy(() => import('./pages/NewsletterPage'));
const AllSchoolsPage         = lazy(() => import('./pages/AllSchoolsPage'));
const JobListingsPage        = lazy(() => import('./pages/JobListingsPage'));
const InternshipsPage        = lazy(() => import('./pages/InternshipsPage'));
const CampusHiringPage       = lazy(() => import('./pages/CampusHiringPage'));
const TermsPage              = lazy(() => import('./pages/TermsPage'));
const PrivacyPolicyPage      = lazy(() => import('./pages/PrivacyPolicyPage'));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => (
  <ErrorBoundary>
  <LaunchScreen />
  <HelmetProvider>
    <AlumniPhotoProvider>
    <CMSProvider>
      <BrowserRouter>
        <AdminAuthProvider>
        <AuthProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth/login"           element={<LoginPage />} />
            <Route path="/auth/register"        element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin Login */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />

            {/* Admin Protected Routes */}
            <Route path="/admin/*" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />

            {/* Main layout routes */}
            <Route path="/"                    element={<Layout><HomePage /></Layout>} />

            {/* About */}
            <Route path="/about"                    element={<Layout><AboutPage /></Layout>} />
            <Route path="/about/principal"          element={<Layout><PrincipalMessagePage /></Layout>} />
            <Route path="/about/principal-message"  element={<Layout><PrincipalMessagePage /></Layout>} />
            <Route path="/about/history"            element={<Layout><HistoryPage /></Layout>} />

            {/* Directory */}
            <Route path="/directory"                element={<Layout><DirectoryPage /></Layout>} />
            <Route path="/directory/alumni"         element={<Layout><DirectoryPage /></Layout>} />
            <Route path="/directory/business"       element={<Layout><BusinessDirectoryPage /></Layout>} />

            {/* Events */}
            <Route path="/events"                   element={<Layout><EventsPage /></Layout>} />
            <Route path="/events/upcoming"          element={<Layout><UpcomingEventsPage /></Layout>} />
            <Route path="/events/gallery"           element={<Layout><GalleryPage /></Layout>} />

            {/* Jobs */}
            <Route path="/jobs"                     element={<Layout><JobsPage /></Layout>} />
            <Route path="/jobs/listings"            element={<Layout><JobListingsPage /></Layout>} />
            <Route path="/jobs/internships"         element={<Layout><InternshipsPage /></Layout>} />
            <Route path="/jobs/campus-hiring"       element={<Layout><CampusHiringPage /></Layout>} />

            {/* News / Updates */}
            <Route path="/news"                     element={<Layout><NewsPage /></Layout>} />
            <Route path="/news/latest"              element={<Layout><LatestNewsPage /></Layout>} />
            <Route path="/news/blogs"               element={<Layout><BlogsPage /></Layout>} />
            <Route path="/news/newsletter"          element={<Layout><NewsletterPage /></Layout>} />

            {/* Notice Board */}
            <Route path="/notice-board"             element={<Layout><NoticeBoardPage /></Layout>} />

            {/* Schools */}
            <Route path="/schools"                  element={<Layout><SchoolsPage /></Layout>} />
            <Route path="/schools/all"              element={<Layout><AllSchoolsPage /></Layout>} />
            <Route path="/schools/main"             element={<Layout><MainCampusPage /></Layout>} />
            <Route path="/schools/main-campus"      element={<Layout><MainCampusPage /></Layout>} />

            {/* Networking */}
            <Route path="/networking"               element={<Layout><NetworkingPage /></Layout>} />
            <Route path="/networking/connect"       element={<Layout><ConnectPage /></Layout>} />
            <Route path="/networking/startups"      element={<Layout><StartupFoundersPage /></Layout>} />
            <Route path="/networking/investors"     element={<Layout><InvestorsPage /></Layout>} />

            {/* Mentorship */}
            <Route path="/mentorship"          element={<Layout><MentorshipPage /></Layout>} />

            {/* Profile */}
            <Route path="/profile"             element={<Layout><ProfilePage /></Layout>} />

            {/* Contact */}
            <Route path="/contact"             element={<Layout><ContactPage /></Layout>} />

            {/* Legal */}
            <Route path="/terms"               element={<Layout><TermsPage /></Layout>} />
            <Route path="/privacy-policy"      element={<Layout><PrivacyPolicyPage /></Layout>} />

            {/* 404 */}
            <Route path="*"                    element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </Suspense>
        </AuthProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </CMSProvider>
    </AlumniPhotoProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
