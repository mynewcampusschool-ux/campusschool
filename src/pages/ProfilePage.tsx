import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import type { ProfileTab } from '../types/profile';

import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSidebar from '../components/profile/ProfileSidebar';
import EditProfileModal from '../components/profile/EditProfileModal';
import { ProfileHeaderSkeleton, CardSkeleton, SidebarSkeleton } from '../components/profile/ProfileSkeletons';

import OverviewTab     from '../components/profile/tabs/OverviewTab';
import ExperienceTab   from '../components/profile/tabs/ExperienceTab';
import EducationTab    from '../components/profile/tabs/EducationTab';
import SkillsTab       from '../components/profile/tabs/SkillsTab';
import AchievementsTab from '../components/profile/tabs/AchievementsTab';
import ProjectsTab     from '../components/profile/tabs/ProjectsTab';
import GalleryTab      from '../components/profile/tabs/GalleryTab';
import NetworkTab      from '../components/profile/tabs/NetworkTab';
import EventsTab       from '../components/profile/tabs/EventsTab';
import MentorshipTab   from '../components/profile/tabs/MentorshipTab';
import JobsTab         from '../components/profile/tabs/JobsTab';
import SettingsTab     from '../components/profile/tabs/SettingsTab';

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [editOpen, setEditOpen] = useState(false);

  const {
    profile, updateProfile, completion,
    addSkill, removeSkill,
    addExperience, removeExperience,
    addEducation, removeEducation,
    addProject, removeProject,
    addAchievement, removeAchievement, updateAchievement,
    addGalleryItem, removeGalleryItem,
  } = useProfile(user);

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <ProfileHeaderSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-5">
            <CardSkeleton rows={4} />
            <CardSkeleton rows={3} />
          </div>
          <SidebarSkeleton />
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/login" replace />;

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab profile={profile} />;
      case 'experience':
        return (
          <ExperienceTab
            items={profile.experience ?? []}
            onAdd={addExperience}
            onRemove={removeExperience}
          />
        );
      case 'education':
        return (
          <EducationTab
            items={profile.education ?? []}
            onAdd={addEducation}
            onRemove={removeEducation}
          />
        );
      case 'skills':
        return (
          <SkillsTab
            items={profile.skills ?? []}
            onAdd={addSkill}
            onRemove={removeSkill}
          />
        );
      case 'achievements':
        return (
          <AchievementsTab
            items={profile.achievementsList ?? []}
            onAdd={addAchievement}
            onRemove={removeAchievement}
            onUpdate={updateAchievement}
          />
        );
      case 'projects':
        return (
          <ProjectsTab
            items={profile.projects ?? []}
            onAdd={addProject}
            onRemove={removeProject}
          />
        );
      case 'gallery':
        return (
          <GalleryTab
            items={profile.gallery ?? []}
            onAdd={addGalleryItem}
            onRemove={removeGalleryItem}
          />
        );
      case 'network':
        return <NetworkTab profile={profile} />;
      case 'events':
        return <EventsTab />;
      case 'mentorship':
        return <MentorshipTab />;
      case 'jobs':
        return <JobsTab role={profile.role} />;
      case 'settings':
        return <SettingsTab profile={profile} onUpdate={updateProfile} />;
      default:
        return <OverviewTab profile={profile} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>{profile.name} | Campus School Pantnagar Alumni Portal</title>
        <meta name="description" content={profile.bio ?? `${profile.name}'s alumni profile`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <ProfileHeader
          profile={profile}
          completion={completion}
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
          onEditClick={() => setEditOpen(true)}
          onCoverChange={url => updateProfile({ coverURL: url })}
          onPhotoChange={url => updateProfile({ photoURL: url })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            {renderTab()}
          </div>
          <div>
            <ProfileSidebar profile={profile} completion={completion} />
          </div>
        </div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />
    </>
  );
};

export default ProfilePage;
