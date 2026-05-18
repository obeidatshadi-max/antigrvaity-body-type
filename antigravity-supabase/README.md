# The Human Body as a Company
### Antigravity-70s · Manager's Guide
**by Shadi Shafiq Obeidat · www.shobeidat.com**

---

## Project Structure

```
antigravity-supabase/
├── public/
│   └── index.html              ← Main web app (mobile-first)
├── supabase/
│   ├── config.toml             ← Supabase local config
│   └── functions/
│       └── og-image/
│           └── index.ts        ← Edge Function: generates OG social image
└── README.md
```

---

## Deployment — Step by Step

### 1. Prerequisites

```bash
npm install -g supabase
supabase login
```

### 2. Link to your Supabase project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

> Find your project ref at: https://app.supabase.com → Settings → General

### 3. Deploy the OG Image Edge Function

```bash
supabase functions deploy og-image --no-verify-jwt
```

This deploys to:
`https://YOUR_PROJECT_REF.supabase.co/functions/v1/og-image`

### 4. Host the static site

**Option A — Supabase Storage (recommended)**
```bash
# Create a public bucket called 'site'
supabase storage create-bucket site --public

# Upload the HTML
supabase storage upload public/index.html site/index.html

# Your site URL:
# https://YOUR_PROJECT_REF.supabase.co/storage/v1/object/public/site/index.html
```

**Option B — Vercel/Netlify (even simpler)**
```bash
# Just drag the /public folder into vercel.com or netlify.com
# Or connect your GitHub repo
```

### 5. Update the meta tags

After deployment, open `public/index.html` and replace all instances of:
```
YOUR_SUPABASE_PROJECT_REF
```
with your actual project ref, e.g.:
```
abcdefghijklmnop
```

Also update the `SITE_URL` constant in the JS section:
```javascript
const SITE_URL = 'https://abcdefghijklmnop.supabase.co';
```

### 6. Verify OG Image

Test your OG image renders correctly:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/og-image
```

Test social sharing preview at:
- https://developers.facebook.com/tools/debug/
- https://cards-dev.twitter.com/validator
- https://www.linkedin.com/post-inspector/

---

## OG Image Specs

| Property       | Value                    |
|----------------|--------------------------|
| Format         | SVG (universal support)  |
| Dimensions     | 1200 × 630 px            |
| Cache          | 24 hours (CDN cached)    |
| Platform       | Facebook ✓ LinkedIn ✓ WhatsApp ✓ Twitter/X ✓ iMessage ✓ Telegram ✓ |

---

## Local Development

```bash
supabase start
supabase functions serve og-image
# Open public/index.html in browser
```

---

## What the OG Image Shows

When someone shares the link, platforms show a 1200×630 card with:
- Rainbow stripe borders (matching the Antigravity-70s poster)
- "THE HUMAN BODY / AS A COMPANY" in bold display type
- All 7 organ pills with their company function and color
- Tagline: "When every part knows its role — extraordinary becomes inevitable"
- Author signature: Shadi Shafiq Obeidat · www.shobeidat.com

---

*Antigravity Framework · Shadi Shafiq Obeidat*
