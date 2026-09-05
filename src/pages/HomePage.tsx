import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import AnnouncementTicker from '../components/home/AnnouncementTicker';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeatureCards from '../components/home/FeatureCards';
import AboutAlumni from '../components/home/AboutAlumni';
import VisionMissionSection from '../components/home/VisionMissionSection';
import PrincipalMessage from '../components/home/PrincipalMessage';
import HomeMiddle from '../components/home/HomeMiddle';
import AchievementsSection from '../components/home/AchievementsSection';
import NotableAlumni from '../components/home/NotableAlumni';
import SuccessStoriesSection from '../components/home/SuccessStoriesSection';
import GallerySection from '../components/home/GallerySection';
import NetworkingSection from '../components/home/NetworkingSection';
import SchoolsSection from '../components/sections/SchoolsSection';
import MentorshipBanner from '../components/home/MentorshipBanner';
import MentorsSection from '../components/sections/MentorsSection';
import JobsSection from '../components/sections/JobsSection';
import Testimonials from '../components/home/Testimonials';
import AlumniMap from '../components/home/AlumniMap';
import ContactSection from '../components/home/ContactSection';
import CTABanner from '../components/sections/CTABanner';

const HomePage: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 600, once: true, offset: 80 });
  }, []);

  return (
    <>
      <Helmet>
        <title>Campus School Pantnagar Alumni Portal | Home</title>
        <meta name="description" content="Campus School Pantnagar Alumni Portal — Reconnecting 42,000+ alumni across 25+ countries. Glory To God and Service To All. Est. 1972." />
        <meta property="og:title" content="Campus School Pantnagar Alumni Portal" />
        <meta property="og:description" content="Join 42,000+ alumni across 25+ countries. Connect, grow, and give back to the community that shaped you." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.jpg" />
        <meta name="keywords" content="Campus School Pantnagar, alumni portal, Uttarakhand school, alumni network, mentorship, Pantnagar alumni" />
        <link rel="canonical" href="https://campusschoolpantnagar.edu.in" />
      </Helmet>

      {/* Announcement ticker sits above hero, below sticky header */}
      <AnnouncementTicker />

      <HeroSection />
      <StatsSection />
      <FeatureCards />
      <AboutAlumni />
      <VisionMissionSection />
      <PrincipalMessage />
      <HomeMiddle />
      <AchievementsSection />
      <NotableAlumni />
      <SuccessStoriesSection />
      <GallerySection />
      <NetworkingSection />
      <SchoolsSection />
      <MentorshipBanner />
      <MentorsSection />
      <JobsSection />
      <Testimonials />
      <AlumniMap />
      <ContactSection />
      <CTABanner />
    </>
  );
};

export default HomePage;
