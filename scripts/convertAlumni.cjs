/**
 * scripts/convertAlumni.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads  : public/data/alumni.xlsx.xlsx
 * Writes : src/lib/alumniData.ts  (auto-generated — do not edit manually)
 *
 * Run    : node scripts/convertAlumni.js
 * Or via : npm run alumni:convert
 *
 * Also scans public/images/alumni/ and embeds matched local image paths
 * so cards show photos immediately without any runtime fetch.
 *
 * Image matching priority (same as runtime resolvePhoto):
 *   1. public/images/alumni/{id}.{ext}
 *   2. public/images/alumni/{slug}.{ext}
 *   3. Google Drive thumbnail URL from Excel (runtime CORS check applies)
 *
 * Column map (0-indexed):
 *   0  Timestamp
 *   1  Full Name
 *   2  Nickname
 *   3  Mobile
 *   4  Email
 *   5  Highest Qualification
 *   6  Profession
 *   7  Current Organization
 *   8  LinkedIn URL
 *   9  Facebook (name or URL)
 *  10  Gender
 *  11  Date of Birth
 *  12  Marriage Anniversary
 *  13  Batch (Year of Passing)
 *  14  Did not graduate note
 *  15  Stream
 *  16  School-days address
 *  17  Current City
 *  18  Country
 *  19  (empty)
 *  20  Google Drive photo link
 *  21  Current Designation
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const EXCEL_PATH  = path.join(__dirname, '..', 'public', 'data', 'alumni.xlsx.xlsx');
const OUT_PATH    = path.join(__dirname, '..', 'src', 'lib', 'alumniData.ts');
const IMAGES_DIR  = path.join(__dirname, '..', 'public', 'images', 'alumni');
const IMAGES_BASE = '/images/alumni'; // public URL base
const EXTS        = ['jpg', 'jpeg', 'png', 'webp'];

/* ── helpers ── */

/** "Amit Gupta" → "amit-gupta" */
function nameToSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Build a Set of filenames present in public/images/alumni/ (lowercase) */
function buildLocalImageSet() {
  try {
    if (!fs.existsSync(IMAGES_DIR)) return new Set();
    return new Set(
      fs.readdirSync(IMAGES_DIR)
        .filter(f => EXTS.some(e => f.toLowerCase().endsWith('.' + e)))
        .map(f => f.toLowerCase()),
    );
  } catch (_) {
    return new Set();
  }
}

/**
 * Return the public URL of a local image if one exists for this alumni,
 * otherwise return ''.
 */
function findLocalImage(id, fullName, imageSet) {
  const slug = nameToSlug(fullName);
  for (const ext of EXTS) {
    const byId = `${id}.${ext}`;
    if (imageSet.has(byId)) return `${IMAGES_BASE}/${byId}`;
  }
  for (const ext of EXTS) {
    const bySlug = `${slug}.${ext}`;
    if (imageSet.has(bySlug)) return `${IMAGES_BASE}/${bySlug}`;
  }
  return '';
}

/** Convert any Google Drive share/open link → thumbnail URL (no auth needed for public files) */
function driveToImg(raw) {
  if (!raw || typeof raw !== 'string') return '';
  const first = raw.split(',')[0].trim();
  const m =
    first.match(/\/file\/d\/([^/?]+)/) ||
    first.match(/[?&]id=([^&,\s]+)/);
  if (!m) return '';
  const id = m[1].trim();
  return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;
}

function str(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

/** Extract the last 4-digit year from batch string */
function normBatch(v) {
  if (!v) return '';
  const s = String(v).trim();
  const years = s.match(/\b(19|20)\d{2}\b/g);
  if (!years) return s;
  return years[years.length - 1];
}

function normCountry(v) {
  const s = str(v);
  if (!s) return 'India';
  return s.replace(/\b\w/g, (c) => c.toUpperCase()).trim();
}

function normCity(v) {
  return str(v).replace(/\s*\(.*?\)\s*/g, '').trim();
}

function isUrl(s) {
  return typeof s === 'string' && (s.startsWith('http://') || s.startsWith('https://'));
}

/** Convert Excel serial timestamp → YYYY-MM-DD */
function serialToDate(ts) {
  if (!ts) return '';
  try {
    const d = XLSX.SSF.parse_date_code(ts);
    if (!d) return '';
    return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
  } catch (_) {
    return '';
  }
}

/* ── read Excel ── */
const wb   = XLSX.readFile(EXCEL_PATH);
const ws   = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
const data = rows.slice(1).filter((r) => r[1]); // skip rows without a name

/* ── scan local images ── */
const imageSet = buildLocalImageSet();
console.log(`Found ${imageSet.size} local image(s) in ${IMAGES_DIR}`);

/* ── map rows → AlumniRecord objects ── */
const records = data.map((r, i) => {
  const id       = String(i + 1);
  const fullName = str(r[1]);

  // Prefer local image → fall back to Drive URL
  const localImg = findLocalImage(id, fullName, imageSet);
  const driveImg = driveToImg(str(r[20]));
  const photoUrl = localImg || driveImg;

  if (localImg) {
    console.log(`  ✓ Local image matched: ${fullName} → ${localImg}`);
  }

  return {
    id,
    fullName,
    nickname:      str(r[2]),
    batch:         normBatch(r[13]),
    designation:   str(r[21]),
    organization:  str(r[7]),
    profession:    str(r[6]),
    qualification: str(r[5]),
    city:          normCity(r[17]),
    country:       normCountry(r[18]),
    photoUrl,
    linkedinUrl:   isUrl(str(r[8])) ? str(r[8]) : '',
    facebookUrl:   isUrl(str(r[9])) ? str(r[9]) : '',
    registeredAt:  serialToDate(r[0]),
  };
});

/* ── write TypeScript source ── */
const tsContent = `/**
 * alumniData.ts — AUTO-GENERATED
 * Source : public/data/alumni.xlsx.xlsx
 * Generated : ${new Date().toISOString()}
 *
 * DO NOT EDIT MANUALLY.
 * To regenerate run: npm run alumni:convert
 */

import type { AlumniRecord } from '../types/alumni';

export const ALUMNI_DATA: AlumniRecord[] = ${JSON.stringify(records, null, 2)};
`;

fs.writeFileSync(OUT_PATH, tsContent, 'utf8');
console.log(`\nConverted ${records.length} alumni records → ${OUT_PATH}`);
