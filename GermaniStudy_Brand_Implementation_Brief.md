# GermaniStudy — Brand Asset Implementation Brief

**For:** Antigravity
**From:** Dev (via Claude)
**Status:** Ready to execute. This supersedes any prior ad-hoc logo placement.

This brief is written as a set of commands. Do not deviate from stated sizes, backgrounds, or file paths without flagging it at a stop-and-confirm checkpoint.

---

## 0. Why the previous attempt looked cheap

Diagnosed root causes — fix all three, not just one:

1. **Background mismatch.** None of the six assets have alpha transparency — every file is a flat RGB rectangle with a solid painted background. When these get placed on a container with a *different* background color, the asset's own rectangle edge becomes a visible box. This is the #1 cause of "looks pasted on."
2. **Wrong asset for the wrong slot.** There are two logo *shapes* (stacked square lockup, and horizontal/lateral lockup) and one icon mark (favicon "gs"). Using the stacked square version in a horizontal navbar (or vice versa) forces distortion or awkward whitespace — this reads as unprofessional even before color is considered.
3. **No consistent sizing/spacing system.** Logos placed at arbitrary or inconsistent sizes across pages breaks visual trust. Every placement below has a fixed size and clear space rule — treat these as fixed, not adjustable per-page.

---

## 1. Asset Inventory (verified pixel data)

| File | Dimensions | Format | Background | Layout | Text color |
|---|---|---|---|---|---|
| `main_logo.jpeg` | 1254×1254 | JPEG | `#FEFEFE` (white) | Stacked (germani / study) | orange + black |
| `dark_theme_logo.png` | 1254×1254 | PNG | `#0A0B0E` (near-black) | Stacked (germani / study) | orange + white |
| `lateral_light.png` | 1774×887 | PNG | `#FEFEFE` (white) | Horizontal (germani study side-by-side) | orange + black |
| `lateral.png` | 1821×864 | PNG | `#060506` (near-black) | Horizontal (germani study side-by-side) | orange + white |
| `favicon.png` | 1254×1254 | PNG | `#FDFDFD` (white, rounded-square baked in) | Icon mark "gs" | orange + black |
| `favicon_dark.png` | 1254×1254 | PNG | `#0A0C11` (near-black, rounded-square baked in) | Icon mark "gs" | orange + white |

**Brand orange (sampled from source files):** `#F6B21B`
Use this hex anywhere the orange needs to be recreated in CSS (e.g., an animated accent, a loading dot) — do not eyeball it from screenshots.

**Known defect:** `main_logo.jpeg` has visible compression artifacts at small render sizes because it's a JPEG. **Do not use `main_logo.jpeg` anywhere in the live site.**

---

## 1a. Reconciliation with the existing codebase

The app already has a populated `public/assets/branding/` folder, wired into `index.html` and components. **Do not create a competing `/public/brand/` folder — target the existing path.** Overwrite in place, keep existing filenames (components already import them; renaming means a repo-wide find/replace for no real benefit).

Existing file → correct master mapping:

| Existing file (in repo) | Size on disk | Replace with (from the six verified masters) |
|---|---|---|
| `favicon_light.png` | 445 KB | `favicon.png` (icon, light bg) |
| `favicon_dark.png` | 538 KB | `favicon_dark.png` (icon, dark bg) |
| `logo_light.png` | 180 KB | re-exported PNG of `main_logo.jpeg` (stacked, light bg) |
| `logo_dark.png` | 155 KB | `dark_theme_logo.png` (stacked, dark bg) |
| `logo_wide_light.png` | 62 KB | `lateral_light.png` (horizontal, light bg) |
| `logo_wide_dark.png` | 58 KB | `lateral.png` (horizontal, dark bg) |

**Stop-and-confirm checkpoint — `logo_dark_2.png`:** there is a seventh file in the existing folder with no corresponding master and no clear purpose. Before doing anything else, grep the codebase for `logo_dark_2` to find every place it's imported. Report back to Dev: which component(s) use it, and how it currently differs visually from `logo_dark.png`. Do not delete it and do not guess which one is "correct" — this needs a human decision, not a silent overwrite.

**Also flag, don't independently fix, this performance issue:** the existing favicon files are 445–538 KB — roughly 10–25x larger than a favicon needs to be, since a favicon should render at 16–192px, not ship as a full-resolution 1254×1254 PNG. Stage 1, Step 2 below replaces these with correctly-sized exports, which resolves this as a side effect.

For the rest of this brief, all placement instructions in Stage 3 reference the **existing filenames** (`logo_light.png`, `logo_dark.png`, `logo_wide_light.png`, `logo_wide_dark.png`, `favicon_light.png`, `favicon_dark.png`) — read these as "the correct master, now living at the existing path," not as new files to create.

---

## Stage 1 — Asset Preparation (do this before touching any component)

### Step 1: Resolve the JPEG source
`main_logo.jpeg` is the only white-background stacked logo among the six masters, and it's JPEG — every other master is PNG.

**Command:** Re-export `main_logo.jpeg` as a lossless PNG at the same 1254×1254 canvas, same white `#FEFEFE` background, no re-compression artifacts introduced. Use this to overwrite `public/assets/branding/logo_light.png` — replace it regardless of what's there now, to guarantee it's sourced from the verified master rather than an older or previously re-compressed copy. Move the original `.jpeg` into an untracked `archive/` folder outside `public/` — do not delete it, but do not reference it in code.

### Step 2: Overwrite existing branding files + generate favicon size variants
**Command:** Overwrite the remaining five existing files per the mapping table in section 1a, sourcing from the six verified masters. Keep filenames as they are in the repo today.

The favicon masters are 1254×1254 with rounded corners baked in. Browsers and OS's need multiple fixed sizes — do not let the browser scale one large PNG at runtime, it softens the icon and looks blurry in browser tabs, and it's the direct cause of the oversized file sizes flagged in section 1a.

**Command:** From the `favicon.png` master (light background — most browser chrome is light-themed), generate and place in `public/` (root level, not `public/assets/branding/`, since favicon discovery conventions expect root):
- `favicon-16x16.png`
- `favicon-32x32.png`
- `favicon-192x192.png` (Android/PWA)
- `apple-touch-icon.png` at 180×180 — no square/unrounded master exists (confirmed). Export this from the rounded favicon master as-is. iOS will apply its own rounding mask on top, producing marginally softer corners than ideal — cosmetic only, not worth blocking on. Scoped as a future nice-to-have if a square master ever gets commissioned (see Stage 4).
- `favicon.ico` (multi-resolution, containing 16×16 + 32×32) for legacy browser support

**Command:** Wire these into `index.html`, replacing whatever favicon `<link>` tags currently exist:
```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" href="/favicon.ico" />
<link rel="manifest" href="/site.webmanifest" />
```

**Command:** Create/update `site.webmanifest` referencing `favicon-192x192.png` and set `theme_color` to `#0A0B0E` (matches the dark background used in the dark icon, gives Android task-switcher a consistent frame) and `background_color` to `#FEFEFE`.

**Command:** Run every overwritten PNG (branding files + generated favicons) through lossless compression (e.g. `pngquant` or equivalent) before committing. Target: full-size logo PNGs under 150 KB, generated favicon files under 15 KB each.

---

## Stage 2 — The Hard Rule for Every Placement

Before placing any logo anywhere in the app, apply this check:

> **The container's background color must exactly match the logo asset's own painted background.** If the container is `#FFFFFF`/white or a light neutral, use the `-light` asset. If the container is `#0A0B0E`/black or a dark neutral, use the `-dark` asset. Never place a `-light` asset on a dark container or a `-dark` asset on a light container — this recreates the exact box-artifact problem this brief exists to fix.

If GermaniStudy's design system uses a container background that is *neither* pure white nor near-black (e.g., a light gray `#F5F5F5` navbar), that is a **stop-and-confirm checkpoint** — do not place either asset and do not attempt a CSS blend-mode or filter workaround to fake a match. Flag it back to Dev; the fix is either (a) change that one container's background to match one of the two exact asset backgrounds, or (b) commission a transparent version of the asset. Do not invent a third option.

---

## Stage 3 — Placement Specification

### 3.1 Navbar (primary site header)
- **Asset:** `logo_wide_light.png` on light navbar, `logo_wide_dark.png` on dark navbar. Use the lateral (horizontal) lockup here, not the stacked one — a stacked square logo in a horizontal navbar either gets squashed or forces excess navbar height.
- **Rendered height:** 32px on desktop, 26px on mobile (viewport < 640px). Width auto-scales, preserving aspect ratio (source is 1774×887, roughly 2:1 — expect ~64px desktop width, ~52px mobile).
- **Clear space:** minimum 16px padding on all sides between the logo and any adjacent nav element (links, buttons, hamburger icon).
- **Click behavior:** wraps in a link to `/`, no visible border/outline on focus beyond the standard accessible focus ring already used elsewhere in the app.
- **Animation:** none on the navbar logo itself. It should feel stable and always-present, not decorative. Do not add hover-scale or hover-rotate — this is a persistent UI anchor, not a marketing moment.

### 3.2 Favicon / browser tab
Covered in Stage 1, Step 2. No further action here beyond verifying it renders correctly in a real browser tab (Chrome + Safari) and as an iOS home-screen icon if the app is added to home screen.

### 3.3 Footer
- **Asset:** `logo_light.png` or `logo_dark.png`, matched to the footer's background per the Stage 2 rule. Stacked is appropriate here since the footer is vertically roomy and this reinforces brand recall at page-exit.
- **Rendered size:** 80px width (auto height, ~80px since it's roughly square).
- **Placement:** left-aligned in the footer's top row, above or beside the column of footer links (site map, legal, contact) — not centered, not competing with the link columns for attention.
- **Animation:** none.

### 3.4 Auth pages (login / signup / password reset)
Actual layout, confirmed from the codebase: a split panel. The **left branding panel is fixed dark** (`#13151A`), regardless of app theme. The **right panel (auth form)** uses `var(--background)`, which switches between `#F7F6F2` (light mode) and `#111413` (dark mode).

- **Logo placement:** the left branding panel only. Do not place a logo on the right form panel — its background changes at runtime and adds a second surface to keep in sync for no benefit, since the left panel already carries brand presence.
- **Background fix required first:** `#13151A` does not exactly match either master background (`#0A0B0E` dark master, `#FEFEFE` light master) — it's close but not identical, which under the Stage 2 rule would still leave a faint seam around the logo. **Command:** change the left panel's background from `#13151A` to `#0A0B0E` to exactly match the dark logo master. This is a one-line CSS change with no other visible side effects (both are near-black; the difference is imperceptible except directly behind the logo edge).
- **Asset:** `logo_dark.png` (stacked), placed on the now-corrected `#0A0B0E` left panel.
- **Rendered size:** 64px width, vertically centered in the branding panel.
- **Animation:** on initial page load only — a single fade-in + subtle upward slide (translateY 8px → 0, opacity 0 → 1, 400ms ease-out, no bounce/spring). This is the one place a small entrance animation is appropriate, because auth pages are a first-impression / trust moment. Do not repeat this animation on every render — it should fire once per page load, not on every re-render or form validation state change on the right panel.

### 3.5 Loading / splash state (initial app load, before auth state resolves)
- **Asset:** `favicon_dark.png` (the "gs" mark, not the full wordmark — a loading screen is brief, and the full wordmark's text won't be legible at small loading-spinner sizes anyway).
- **Rendered size:** 56px.
- **Background:** the loading screen container background must be set to `#0A0B0E` to match, per the Stage 2 rule — this likely means the loading screen is dark-themed regardless of the user's light/dark app preference, which is acceptable since it's a sub-second transitional state, not a themed page.
- **Animation:** a slow, subtle pulse (opacity 0.6 → 1 → 0.6, 1.6s ease-in-out, infinite) to signal "working" without implying a specific progress percentage. Do not spin or rotate the logo mark itself — spinning a wordmark/icon that contains an airplane graphic reads as a visual pun gone wrong (the plane appearing to spin in place). If a loading indicator beyond the pulse is needed, use a separate neutral spinner element positioned below the mark, not applied to the mark itself.

### 3.6 Admin panel header
- **Asset:** `favicon_light.png` or `favicon_dark.png` (icon mark only, not full wordmark — admin panel is a utility surface, not a marketing surface) matched per Stage 2 rule.
- **Rendered size:** 28px.
- **Animation:** none.

### 3.7 Social share / Open Graph image
This is the image that renders when a GermaniStudy link is shared on WhatsApp, LinkedIn, Twitter/X, etc. Confirmed: `index.html` currently has `og:image` tags pointing at relative paths (e.g. `/assets/branding/logo_light.png`). **This does not work reliably** — most social platforms require a fully-qualified absolute URL to fetch the preview image, and reusing the square logo directly (rather than a purpose-built OG image) also means it gets cropped unpredictably by each platform's own aspect-ratio handling.

**Blocking dependency:** there is no production domain configured anywhere in the project (no `.env`, no config, no `og:url` tag). **This entire step is blocked until Dev provides the live domain.** Do not guess, hardcode a placeholder, or use a Vercel/Netlify preview URL as a stand-in — preview URLs regenerate per-deploy and will silently break social previews later.

Once the domain is provided:

**Command:** Create a dedicated 1200×630px OG image (the standard size — do not reuse `logo_wide_dark.png` directly; its aspect ratio ≈2.1:1 doesn't match the 1.9:1 OG standard and will get awkwardly cropped by social platforms).
- Compose: `logo_dark.png` or `logo_wide_dark.png` centered on a `#0A0B0E` canvas at 1200×630, with adequate margin (don't let the logo touch the edges — minimum 120px margin on all sides).
- Save as `/public/og-image.png`.
- Replace the existing relative-path `og:image` tags in `index.html` with absolute URLs:
```html
<meta property="og:url" content="https://[production-domain]/" />
<meta property="og:image" content="https://[production-domain]/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
```

### 3.8 Mobile nav (hamburger menu open state)
- **Asset:** same as 3.1 (navbar), same size — do not swap to the icon-only mark just because it's mobile. Consistency between collapsed and expanded nav states matters more than saving a few pixels.
- **Animation:** none beyond whatever slide/fade the mobile menu panel itself already uses.

---

## Stage 4 — Explicitly Scoped Out

Do not do the following as part of this brief — these are separate future workstreams:
- Commissioning transparent (alpha-channel) versions of any asset
- A square, unrounded master file for the favicon (confirmed not to exist — future nice-to-have for a marginally crisper apple-touch-icon, not worth commissioning solely for this)
- Animated logo lockup (e.g., an SVG-animated plane) for marketing/landing sections
- Any print or PDF-export use of these assets (e.g., a generated certificate or report — different resolution requirements apply)

---

## Stage 5 — QA / Sign-off Checklist

Before marking this complete, verify in an actual browser (not just code review):

- [ ] Every placement in Stage 3 has a container background that exactly matches its logo asset's background — no visible box/seam at any placement, checked in both light and dark app theme
- [ ] Auth page left panel background is confirmed changed from `#13151A` to `#0A0B0E`, and the logo shows no seam against it
- [ ] Navbar logo does not distort, stretch, or blur at any viewport width from 320px to 1920px
- [ ] Favicon renders correctly in an actual browser tab (not just `/favicon.ico` existing on disk — confirm it visibly shows), and is under 15 KB
- [ ] Favicon renders correctly as an iOS "Add to Home Screen" icon (physically test on a device or simulator if available)
- [ ] Loading screen pulse animation runs smoothly, no jank, and does not block or delay the actual app-ready transition
- [ ] Auth page fade-in fires once on load, does not re-fire on unrelated re-renders (test by triggering a form validation error and confirming the logo doesn't re-animate)
- [ ] OG image displays correctly when a site link is pasted into WhatsApp and one other platform (LinkedIn or Twitter/X) — actually test the share preview, don't just trust the meta tags
- [ ] `main_logo.jpeg` is not referenced anywhere in the live codebase (grep for it before sign-off)
- [ ] `logo_dark_2.png` usage has been reported back to Dev and resolved — not left ambiguous
- [ ] No console errors/404s related to any brand asset path

---

## Open Questions — remaining

- **Production domain for OG meta tag: still needed.** This is the one hard blocker in this brief — Stage 3.7 cannot ship without it. Everything else is resolved and ready to execute.
- `logo_dark_2.png`: purpose unknown, resolved as a stop-and-confirm checkpoint in section 1a — Antigravity to report findings back to Dev before Stage 1 completes.
