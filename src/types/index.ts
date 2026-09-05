export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'alumni' | 'admin' | 'student';
  batch?: string;
  school?: string;
  company?: string;
  designation?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  linkedin?: string;
  github?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image?: string;
  type: 'upcoming' | 'past';
  registrations?: number;
}

export interface News {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  date: string;
  category: string;
  author: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship';
  description: string;
  skills: string[];
  postedBy: string;
  postedAt: Date;
  deadline: string;
}

export interface Mentor {
  id: string;
  name: string;
  photo?: string;
  designation: string;
  company: string;
  expertise: string[];
  bio: string;
  availability: string[];
  rating: number;
  sessions: number;
}

export interface School {
  id: string;
  name: string;
  image: string;
  description: string;
  established: string;
  students: number;
}

export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}
