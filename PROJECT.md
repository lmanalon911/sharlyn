# The Days Before Me — Project Handoff

A private romantic fairytale web app, built as a birthday gift for **Sharlyn (Mommy)** from **Lemuel/Daddy** and their daughter **Sofiel**. It is a 9-screen linear journey.

---

## Live URL & Deployment

- **Live:** https://sharlyn.vercel.app
- **Repo:** https://github.com/lmanalon911/sharlyn
- **Deploy:** Auto-deploy on push to `main` via Vercel

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, Turbopack) |
| Styling | Tailwind CSS v4 — uses `@import "tailwindcss"` and `@theme {}` block (NOT `tailwind.config.js`) |
| Animation | Framer Motion (`motion`, `AnimatePresence`) |
| Storage | Supabase Storage — public bucket `Media` |
| Photos | Google Drive thumbnail URLs: `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1200` |
| Auth | Cookie-based: `tdbm_auth=true`, checked by `AuthGuard` component |
| Fonts | Playfair Display (`font-display`) + Nunito (`font-body`) via Google Fonts |

---

## Environment Variables

File: `.env.local` — **gitignored, never commit**

```
NEXT_PUBLIC_SUPABASE_URL=https://ayvgxtdwylgpsjkpiulc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xImUW29DgB88qDjelJJ6-A_7IIWL4R_
SUPABASE_SECRET_KEY=sb_secret_Y7fyOI_33mipOKSdUtsmbA_VQDVJ4CL
```

---

## Page Routes (in order)

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Password screen |
| `/welcome` | `app/welcome/page.tsx` | "Hi Mommy!" — Daddy & Sofiel cutout with hover speech bubbles |
| `/more-like-you` | `app/more-like-you/page.tsx` | Full music player with Ken Burns photos + synced lyrics |
| `/book` | `app/book/page.tsx` | Sofiel invitation — speech bubble is the clickable button |
| `/the-days-before-me` | `app/the-days-before-me/page.tsx` | 15-spread storybook with 3D page-curl flip |
| `/surprise` | `app/surprise/page.tsx` | Daddy surprise page (placeholder) |
| `/video` | `app/video/page.tsx` | Video page (placeholder) |
| `/game` | `app/game/page.tsx` | "Asan si Mommy?" game (placeholder) |
| `/finale` | `app/finale/page.tsx` | Final message page (placeholder) |
| `/calibrate` | `app/calibrate/page.tsx` | Lyric timing tool — **remove or protect before launch** |

### Navigation Flow
```
/ → /welcome → /more-like-you → /book → /the-days-before-me → /surprise → ... → /finale
```

---

## Password

```
simsimbibilabidabs04
```

---

## Key Assets

### Cutout image (Daddy + Sofiel, used on /welcome)
```
https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/ChatGPT%20Image%20Jun%2024,%202026,%2009_33_52%20PM.png
```
- Left half = Daddy, Right half = Sofiel
- Cropped in CSS using `left: 0` / `right: 0` with `width: 200%` and `overflow: hidden`

### Sofiel transparent cutout (used on /book)
```
https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/ChatGPT%20Image%20Jun%2025,%202026,%2002_15_41%20AM.png
```

### Song (used on /more-like-you)
```
https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/More%20Like%20You.mp3
```

### Storybook spreads (used on /the-days-before-me)
```
https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/1.png
https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media/2.png
... (1.png through 15.png)
```
- **Required aspect ratio: 2:1 landscape** (e.g. 2000×1000 px)
- Each image spans both pages of a spread

---

## Color Palette

| Name | Hex | Usage |
|---|---|---|
| Rose Gold | `#B76E79` | Primary buttons, accents |
| Deep Rose | `#8B3A52` | Headings, active lyrics |
| Blush | `#F7C5CC` | Light accents, inactive dots |
| Lavender | `#C9B8D8` | Background glow |
| Peach | `#FFBE88` | Background glow |
| Cream | `#FDF6EC` | Page background |
| Warm White | `#FFFDF9` | Cards, page fade color |
| Parchment | `#F5EDD8` | Book pages |
| Warm Brown | `#5C3D2E` | Body text |

---

## Global CSS (`app/globals.css`)

Key classes:
- `.fairytale-bg` — shared background for all pages (cream gradient with blush/lavender hints)
- `.glass` — glassmorphism card style
- `.font-display` / `.font-body` — font utilities
- `.paper-texture` — lined paper effect for book pages
- `.ken-zoom`, `.ken-left`, `.ken-right`, `.ken-zoom-out` — Ken Burns photo animations (18s, CSS-only)
- `@keyframes pageFlipForward/Backward` — 3D page curl with `rotateY` + `rotateX` bow
- `@keyframes pageFlipShadowForward/Backward` — curl shadow sweep
- `.perspective-2000` — `perspective: 2000px` utility

---

## /welcome Page Notes

- Uses single cutout PNG, crops left half for Daddy and right half for Sofiel
- Hover over either character shows speech bubble on the outer side
- Daddy (left) bubble: *"We should have been travelling right now or having a fancy celebration. I promise we'll do that very soon! For now, here's a little gift. 💕"*
- Sofiel (right) bubble: *"We love you, Mommy. 🥰"*
- "Hi Mommy!" title (no heart emoji)
- Button: "Continue ✦" → fades out then navigates to `/more-like-you`

---

## /more-like-you Page Notes

- Song: "More Like You"
- Subcaption: *"You may not always believe it, but I've always seen you as your best self all along."*
- 16 scenes matched to song sections — each scene has `t` (timestamp), `layout` (single/duo/trio), `photos` (Google Drive IDs)
- 48 calibrated lyrics with exact timestamps (shifted -1s from tapped values)
- Ken Burns CSS animations on photos (not Framer Motion — avoids crossfade interference)
- Single `<input type="range">` with CSS gradient background for progress bar
- Background: `fairytale-bg` (matches all other pages)
- On song end → auto-navigates to `/book` after 2.5s

---

## /the-days-before-me Page Notes

- 15 spreads, each a single 2:1 image spanning both pages
- 3D page-curl flip: right page lifts from spine (`transform-origin: left center`), `rotateY(0→-180deg)` with `rotateX(8deg)` bow at mid-flip
- Front face = current right half, Back face = next left half (using `background-size: 200%` CSS trick)
- Hard cover: dark brown (`#3b2010`) strips on both outer edges via flex layout
- Page edge texture: `repeating-linear-gradient` strip between cover and pages
- Spine: gradient overlay simulating light catch
- Gutter shadows on both pages near spine
- All 15 images preloaded on mount via `new Image()` to eliminate flip lag
- Last spread → navigates to `/surprise`

---

## Page Transitions

Every page uses a consistent **cream cross-dissolve**:
- **Fade in:** `motion.div` with `initial={{ opacity: 0 }} animate={{ opacity: 1 }}` on mount
- **Fade out:** `leaving` state triggers a full-screen `#FFFDF9` overlay that fades to opacity 1, then `router.push()` fires after 700ms

---

## Components

| File | Purpose |
|---|---|
| `components/AuthGuard.tsx` | Checks `tdbm_auth` cookie, redirects to `/` if missing |
| `components/ParticleField.tsx` | Floating sparkle particles background |

---

## Content File (`lib/content.ts`)

```ts
// Storybook spreads — 2:1 landscape images, 1.png–15.png
const BASE = "https://ayvgxtdwylgpsjkpiulc.supabase.co/storage/v1/object/public/Media";
export const storybookSpreads = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  spreadImage: `${BASE}/${i + 1}.png`,
}));
```

To add a new spread or replace an image, update this file.

---

## Remaining Work

| Page | Status | Notes |
|---|---|---|
| `/surprise` | Placeholder | Daddy surprise page — needs real content |
| `/video` | Placeholder | Needs real video link |
| `/game` | Placeholder | "Asan si Mommy?" — needs real photos + target coordinates |
| `/finale` | Placeholder | Needs real family photo + final message |
| `/calibrate` | Done (dev tool) | **Delete or add auth before launch** — currently public |

---

## Launch Checklist

- [ ] Fill in `/surprise`, `/video`, `/game`, `/finale` pages
- [ ] Delete or protect `/calibrate` (no auth currently)
- [ ] Test full flow end-to-end on mobile
- [ ] Confirm all 15 storybook images load correctly
- [ ] Verify password still works after Vercel redeploy
