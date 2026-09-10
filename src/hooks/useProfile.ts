import { useState, useCallback, useMemo, useEffect } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ProfileData, Skill, Experience, Education, Project, Achievement, GalleryItem } from '../types/profile';

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY ?? 'profile_v1';

function loadStored(uid: string): Partial<ProfileData> {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${uid}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function persist(uid: string, data: Partial<ProfileData>) {
  try { localStorage.setItem(`${STORAGE_KEY}_${uid}`, JSON.stringify(data)); } catch { /* noop */ }
}

// Fields saved to Firestore profile doc
const FIRESTORE_FIELDS: (keyof ProfileData)[] = [
  'name','bio','objective','designation','company','department','batch','school',
  'admissionNo','employeeId','studentId','teacherId','alumniId','phone','website',
  'city','state','country','industry','availability','languages','interests',
  'photoURL','coverURL','coverColor','verified','role','joinedDate',
  'socialLinks','skills','experience','education','projects','achievementsList','gallery',
  'followers','following','connections','posts','eventsJoined','certificates','achievements','profileViews',
];

export function useProfile(user: FirebaseUser | null) {
  const stored = useMemo(() => user ? loadStored(user.uid) : {}, [user]);

  const [profile, setProfileState] = useState<ProfileData>(() => ({
    uid: user?.uid ?? '',
    email: user?.email ?? '',
    name: user?.displayName || stored.name || 'Alumni Member',
    role: stored.role ?? 'alumni',
    photoURL: user?.photoURL ?? stored.photoURL,
    coverURL: stored.coverURL,
    verified: stored.verified ?? false,
    bio: stored.bio ?? '',
    objective: stored.objective ?? '',
    designation: stored.designation ?? '',
    company: stored.company ?? '',
    department: stored.department ?? '',
    batch: stored.batch ?? '',
    school: stored.school ?? 'Campus School Pantnagar',
    admissionNo: stored.admissionNo ?? '',
    employeeId: stored.employeeId ?? '',
    studentId: stored.studentId ?? '',
    teacherId: stored.teacherId ?? '',
    alumniId: stored.alumniId ?? '',
    phone: stored.phone ?? '',
    website: stored.website ?? '',
    city: stored.city ?? '',
    state: stored.state ?? '',
    country: stored.country ?? 'India',
    industry: stored.industry ?? '',
    availability: stored.availability ?? '',
    languages: stored.languages ?? ['English', 'Hindi'],
    interests: stored.interests ?? [],
    joinedDate: stored.joinedDate ?? new Date().toISOString().split('T')[0],
    lastActive: new Date().toISOString().split('T')[0],
    profileViews: stored.profileViews ?? 0,
    followers: stored.followers ?? 0,
    following: stored.following ?? 0,
    connections: stored.connections ?? 0,
    posts: stored.posts ?? 0,
    eventsJoined: stored.eventsJoined ?? 0,
    certificates: stored.certificates ?? 0,
    achievements: stored.achievements ?? 0,
    skills: stored.skills ?? [],
    experience: stored.experience ?? [],
    education: stored.education ?? [],
    projects: stored.projects ?? [],
    achievementsList: stored.achievementsList ?? [],
    gallery: stored.gallery ?? [],
    socialLinks: stored.socialLinks ?? {},
    coverColor: stored.coverColor ?? 'linear-gradient(135deg,#0B6B4B 0%,#094d36 50%,#D4AF37 100%)',
  }));

  // Real-time Firestore listener — loads profile + counts
  useEffect(() => {
    if (!user) return;
    const ref = doc(db, 'profiles', user.uid);
    const unsub = onSnapshot(ref, snap => {
      if (!snap.exists()) {
        // First time — seed from users collection
        getDoc(doc(db, 'users', user.uid)).then(usnap => {
          const u = usnap.data() ?? {};
          const seed: Partial<ProfileData> = {
            name: u.full_name || user.displayName || 'Alumni Member',
            batch: u.batch_year || '',
            school: u.school || 'Campus School Pantnagar',
            email: user.email ?? '',
            joinedDate: u.createdAt?.toDate?.().toISOString().split('T')[0] ?? new Date().toISOString().split('T')[0],
            followers: 0, following: 0, connections: 0,
            posts: 0, eventsJoined: 0, certificates: 0, profileViews: 0,
          };
          setDoc(ref, seed, { merge: true });
        }).catch(() => {});
        return;
      }
      const d = snap.data();
      setProfileState(prev => {
        const updated = { ...prev, ...d, uid: user.uid, email: user.email ?? prev.email };
        persist(user.uid, updated);
        return updated;
      });
    }, () => {/* offline */});
    return unsub;
  }, [user]);

  const updateProfile = useCallback((updates: Partial<ProfileData>) => {
    setProfileState(prev => {
      const next = { ...prev, ...updates };
      if (user) {
        persist(user.uid, next);
        // Save only allowed fields to Firestore
        const fsData: Record<string, unknown> = {};
        FIRESTORE_FIELDS.forEach(k => { if (k in updates) fsData[k] = updates[k]; });
        if (Object.keys(fsData).length > 0) {
          setDoc(doc(db, 'profiles', user.uid), fsData, { merge: true }).catch(() => {});
        }
      }
      return next;
    });
  }, [user]);

  const completion = useMemo(() => {
    const fields: (keyof ProfileData)[] = [
      'name', 'bio', 'designation', 'company', 'batch', 'city', 'phone', 'website',
    ];
    const filled = fields.filter(f => !!profile[f]).length;
    const hasSkills = (profile.skills?.length ?? 0) > 0 ? 1 : 0;
    const hasExp = (profile.experience?.length ?? 0) > 0 ? 1 : 0;
    const hasEdu = (profile.education?.length ?? 0) > 0 ? 1 : 0;
    const hasPhoto = profile.photoURL ? 1 : 0;
    const total = filled + hasSkills + hasExp + hasEdu + hasPhoto;
    return Math.min(100, Math.round((total / 12) * 100));
  }, [profile]);

  /* ── list mutators ── */
  const addSkill = useCallback((s: Skill) => updateProfile({ skills: [...(profile.skills ?? []), s] }), [profile.skills, updateProfile]);
  const removeSkill = useCallback((id: string) => updateProfile({ skills: profile.skills?.filter(x => x.id !== id) }), [profile.skills, updateProfile]);

  const addExperience = useCallback((e: Experience) => updateProfile({ experience: [...(profile.experience ?? []), e] }), [profile.experience, updateProfile]);
  const removeExperience = useCallback((id: string) => updateProfile({ experience: profile.experience?.filter(x => x.id !== id) }), [profile.experience, updateProfile]);

  const addEducation = useCallback((e: Education) => updateProfile({ education: [...(profile.education ?? []), e] }), [profile.education, updateProfile]);
  const removeEducation = useCallback((id: string) => updateProfile({ education: profile.education?.filter(x => x.id !== id) }), [profile.education, updateProfile]);

  const addProject = useCallback((p: Project) => updateProfile({ projects: [...(profile.projects ?? []), p] }), [profile.projects, updateProfile]);
  const removeProject = useCallback((id: string) => updateProfile({ projects: profile.projects?.filter(x => x.id !== id) }), [profile.projects, updateProfile]);

  const addAchievement = useCallback((a: Achievement) => {
    const newList = [...(profile.achievementsList ?? []), a];
    const certCount = newList.filter(x => x.type === 'certification').length;
    updateProfile({ achievementsList: newList, certificates: certCount, achievements: newList.length });
  }, [profile.achievementsList, updateProfile]);

  const removeAchievement = useCallback((id: string) => {
    const newList = (profile.achievementsList ?? []).filter(x => x.id !== id);
    const certCount = newList.filter(x => x.type === 'certification').length;
    updateProfile({ achievementsList: newList, certificates: certCount, achievements: newList.length });
  }, [profile.achievementsList, updateProfile]);

  const updateAchievement = useCallback((a: Achievement) => {
    const newList = (profile.achievementsList ?? []).map(x => x.id === a.id ? a : x);
    const certCount = newList.filter(x => x.type === 'certification').length;
    updateProfile({ achievementsList: newList, certificates: certCount, achievements: newList.length });
  }, [profile.achievementsList, updateProfile]);

  const addGalleryItem = useCallback((g: GalleryItem) => updateProfile({ gallery: [...(profile.gallery ?? []), g] }), [profile.gallery, updateProfile]);
  const removeGalleryItem = useCallback((id: string) => updateProfile({ gallery: profile.gallery?.filter(x => x.id !== id) }), [profile.gallery, updateProfile]);

  return {
    profile, updateProfile, completion,
    addSkill, removeSkill,
    addExperience, removeExperience,
    addEducation, removeEducation,
    addProject, removeProject,
    addAchievement, removeAchievement, updateAchievement,
    addGalleryItem, removeGalleryItem,
  };
}
