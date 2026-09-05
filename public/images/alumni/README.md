# Alumni Profile Photos

Drop alumni profile images here. They are served statically by Vite from the root.

## Naming Convention

Images are matched by **alumni ID** (highest priority) or **name slug**:

| Alumni | ID-based filename | Slug-based filename |
|--------|-------------------|---------------------|
| Amit Gupta (id: 28) | `28.jpg` | `amit-gupta.jpg` |
| Deepti Gupta (id: 4) | `4.jpg` | `deepti-gupta.jpg` |
| Shobhit Dhaka (id: 3) | `3.jpg` | `shobhit-dhaka.jpg` |
| DR AMIT GAURAV (id: 31) | `31.jpg` | `dr-amit-gaurav.jpg` |

## Supported Formats

`.jpg` · `.jpeg` · `.png` · `.webp`

## Priority Order

1. Admin-uploaded photo (via Admin Dashboard → Alumni Photos)
2. Local file in this folder (ID match, then slug match)
3. `photoUrl` from Excel (non-Google-Drive, non-LinkedIn URLs only)
4. Initials avatar (automatic fallback — always works)

## Why not LinkedIn photos?

LinkedIn requires OAuth 2.0 authentication for all profile data.
Direct `<img src="linkedin.com/...">` requests are blocked by CORS.
LinkedIn ToS §8.2 prohibits scraping or automated extraction.
