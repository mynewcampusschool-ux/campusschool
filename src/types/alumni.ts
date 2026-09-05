export interface AlumniRecord {
  id: string;
  fullName: string;
  nickname?: string;
  batch: string;                  // e.g. "2005", "1998"
  designation: string;            // Current Designation
  organization: string;           // Current Organization
  profession: string;             // e.g. "Engineering", "Medicine"
  qualification: string;          // Highest Qualification
  city: string;                   // Current City
  country: string;
  photoUrl?: string;              // Google Drive direct link or any URL
  linkedinUrl?: string;
  facebookUrl?: string;
  registeredAt: string;           // ISO date string e.g. "2024-03-15"
}
