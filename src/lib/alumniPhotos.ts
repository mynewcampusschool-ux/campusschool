/**
 * alumniPhotos.ts
 *
 * Photo resolution priority for every alumni record:
 *
 *   1. Admin-uploaded override  (localStorage, set via Admin Dashboard)
 *   2. Local file in            public/images/alumni/
 *        matched by:  {id}.jpg | {id}.png | {id}.webp
 *                     {slug}.jpg | {slug}.png | {slug}.webp
 *        e.g.  "Amit Gupta"  →  amit-gupta.jpg
 *   3. photoUrl from Excel      (only non-Google-Drive URLs — Drive blocks CORS)
 *   4. ''                       →  caller renders <DefaultAvatar> with initials
 *
 * LinkedIn profile photos are intentionally NOT fetched:
 *   - Require OAuth 2.0 authentication
 *   - Blocked by CORS (Access-Control-Allow-Origin: null)
 *   - Signed/expiring URLs even via official API
 *   - Prohibited by LinkedIn ToS §8.2 (no scraping / automated extraction)
 */

const LS_KEY = 'csp_alumni_photos';

export type PhotoMap = Record<string, string>;

// ─── Slug utility ─────────────────────────────────────────────────────────────

/**
 * Convert a full name to a URL-safe slug.
 * "Amit Gupta"  →  "amit-gupta"
 * "DR AMIT GAURAV"  →  "dr-amit-gaurav"
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // strip special chars
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-');            // collapse multiple hyphens
}

// ─── Local image candidates ───────────────────────────────────────────────────

const EXTS = ['jpg', 'jpeg', 'png', 'webp'] as const;
const BASE = '/images/alumni';

/**
 * Returns all candidate local paths for an alumni record, in priority order.
 * Vite serves everything in public/ at the root, so /images/alumni/amit-gupta.jpg
 * maps to  public/images/alumni/amit-gupta.jpg  on disk.
 */
export function localCandidates(id: string, fullName: string): string[] {
  const slug = nameToSlug(fullName);
  const candidates: string[] = [];
  for (const ext of EXTS) {
    candidates.push(`${BASE}/${id}.${ext}`);       // by numeric id
  }
  for (const ext of EXTS) {
    candidates.push(`${BASE}/${slug}.${ext}`);     // by name slug
  }
  return candidates;
}

// ─── localStorage override map ────────────────────────────────────────────────

export function loadPhotoMap(): PhotoMap {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as PhotoMap;
  } catch { /* ignore */ }
  return {};
}

export function savePhotoMap(map: PhotoMap): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(map));
  } catch {
    // localStorage full — remove largest entries and retry
    try {
      const entries = Object.entries(map);
      // sort by value length desc, drop the largest until it fits
      entries.sort((a, b) => b[1].length - a[1].length);
      const trimmed = { ...map };
      for (const [key] of entries) {
        delete trimmed[key];
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(trimmed));
          return;
        } catch { continue; }
      }
    } catch { /* ignore */ }
  }
}

// ─── Primary resolver (sync — returns first definite URL to try) ──────────────

/**
 * Returns the best photo URL to attempt for this alumni.
 * The caller (<AlumniCard>) must still handle onError to cascade
 * through localCandidates if the first attempt fails.
 *
 * Returns '' when no URL is available → show initials avatar.
 */
export function resolvePhoto(
  id: string,
  fullName: string,
  photoUrl: string | undefined,
  overrides: PhotoMap,
): string {
  // 1. Admin-uploaded override (highest priority)
  if (overrides[id]) return overrides[id];

  // 2. First local candidate — AlumniCard will cascade through the rest on error
  const first = localCandidates(id, fullName)[0];
  if (first) return first;

  // 3. Excel photoUrl — skip Google Drive (CORS blocked) and LinkedIn (auth required)
  if (
    photoUrl &&
    !photoUrl.includes('drive.google.com') &&
    !photoUrl.includes('linkedin.com')
  ) {
    return photoUrl;
  }

  // 4. No image available
  return '';
}
