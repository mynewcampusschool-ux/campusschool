export type UserRole =
  | 'alumni'
  | 'student'
  | 'teacher'
  | 'principal'
  | 'staff'
  | 'mentor'
  | 'recruiter'
  | 'hr'
  | 'business_owner'
  | 'admin'
  | 'super_admin'
  | 'guest';

export interface ProfileData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  photoURL?: string;
  coverURL?: string;
  verified: boolean;
  bio?: string;
  objective?: string;
  designation?: string;
  company?: string;
  department?: string;
  batch?: string;
  school?: string;
  admissionNo?: string;
  employeeId?: string;
  studentId?: string;
  teacherId?: string;
  alumniId?: string;
  phone?: string;
  website?: string;
  city?: string;
  state?: string;
  country?: string;
  industry?: string;
  availability?: string;
  languages?: string[];
  interests?: string[];
  joinedDate?: string;
  lastActive?: string;
  profileViews?: number;
  followers?: number;
  following?: number;
  connections?: number;
  posts?: number;
  eventsJoined?: number;
  certificates?: number;
  achievements?: number;
  skills?: Skill[];
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  achievementsList?: Achievement[];
  gallery?: GalleryItem[];
  socialLinks?: SocialLinks;
  coverColor?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: 'technical' | 'soft' | 'language' | 'tool' | 'framework';
  endorsements?: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  type: 'full-time' | 'part-time' | 'internship' | 'freelance' | 'contract';
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  description?: string;
  logo?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  course?: string;
  startYear: string;
  endYear?: string;
  cgpa?: string;
  logo?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  tech: string[];
  github?: string;
  demo?: string;
  image?: string;
}

export interface Achievement {
  id: string;
  title: string;
  org: string;
  year: string;
  desc?: string;
  type: 'award' | 'certification' | 'patent' | 'research' | 'competition' | 'sports' | 'other';
}

export interface GalleryItem {
  id: string;
  src: string;
  caption?: string;
  category?: 'professional' | 'campus' | 'events' | 'certificates';
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  website?: string;
  portfolio?: string;
}

export type ProfileTab =
  | 'overview'
  | 'experience'
  | 'education'
  | 'skills'
  | 'achievements'
  | 'projects'
  | 'gallery'
  | 'network'
  | 'events'
  | 'mentorship'
  | 'jobs'
  | 'settings';
