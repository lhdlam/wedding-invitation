# Tech Stack Analysis — tuannhu-savewithlove.io.vn/invitation/groom

## What the target uses

| Concern | Target | Evidence |
|---|---|---|
| Framework | **React 18 + Vite** (SPA, client-rendered) | `/assets/index-*.js` + `index-*.css` hashed bundle naming; no `__NEXT_DATA__`; initial HTML is an 801-byte shell |
| Routing | Client-side (`/invitation/groom` vs `/invitation/bride`) | Same bundle serves both; `groom`/`bride` toggles the guest-of default |
| CSS | **Tailwind CSS 3** + shadcn/ui token convention | Utility classes intact in the DOM; `:root` holds bare-HSL shadcn tokens; `--swiper-theme-color` present |
| Components | **shadcn/ui** (Radix primitives) | `data-radix-collection-item`, `role="radiogroup"`, `data-state="checked"` on the RSVP radios; shadcn's exact Button/Input/Label/Textarea class strings |
| Animation | **framer-motion** | Inline `style="opacity: 0; transform: translateX(30px)"` cleared on scroll; non-round mid-flight values (`translateX(-4.60642px)`) indicate spring/tween interpolation, i.e. `whileInView` |
| Icons | **lucide-react** | `class="lucide lucide-clock"`, `lucide-map-pin`, `lucide-circle`, `lucide-volume2` |
| Carousel | **Swiper** (loaded, unused on this route) | `--swiper-theme-color` and `@keyframes swiper-preloader-spin` in the CSS, but no swiper markup in the DOM |
| Toasts | **sonner** | Fixed `<ol class="fixed top-0 z-[100]">` toast rail, empty at rest |
| Images | **S3 + CloudFront-style origin**, pre-resized WebP | `wedding-images-…s3.ap-southeast-1.amazonaws.com/resize/{album,couple,holding-invitation}/*.webp` |
| Fonts | **Self-hosted** OTF/TTF/WOFF2, `font-display: block` | 7 `@font-face` rules in the bundle CSS |
| Audio | External MP3, randomised per load | `<audio loop>` pointed at `camcui.vn/bai8.mp3` on one load and `bai61.mp3` on another |
| Maps | Google Maps `<iframe>` embed | `maps?q=16.888118,107.011207&output=embed` |
| Backend | Presumably present for RSVP | Not exercised; out of scope for the clone |

## What the clone uses

| Concern | Clone | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router) + React 19** | Pre-scaffolded by this template. Renders the same DOM; the target's client-only rendering is not a visual feature worth reproducing. |
| CSS | **Tailwind CSS v4** | Template default. Tokens ported 1:1; `@theme inline` replaces `tailwind.config.js`. Custom breakpoints re-declared as `--breakpoint-mobilem/mobilel`. |
| Components | **Hand-written** | Only `button.tsx` was scaffolded and Radix is not installed. The RSVP radio group is hand-rolled with the same ARIA contract (`role="radiogroup"`/`role="radio"`/`aria-checked` + arrow-key navigation). |
| Animation | **`Reveal` + IntersectionObserver** (`src/components/Reveal.tsx`) | Avoids adding framer-motion for what is a single scroll-reveal pattern. Uses the target's own `--transition-silk` easing, fires once, and honours `prefers-reduced-motion` (which the target does not). |
| Icons | **Inlined SVG** (`src/components/icons.tsx`) | The four lucide icons actually used are inlined verbatim, so `lucide-react` is not a runtime dependency. |
| Carousel | **None** | Swiper is loaded but unused on this route — nothing to reproduce. |
| Toasts | **None** | The toast rail is empty at rest and no toast was observed firing. |
| Images | **Local `public/images/`** | All 20 photos + 8 graphics mirrored by `scripts/download-assets.mjs`. No hotlinking to the couple's S3 bucket. |
| Fonts | **`next/font/local`** | Same 7 files, self-hosted from `public/fonts/`, `display: block` to match. |
| Audio | **Local `public/audio/wedding-song.mp3`** | One of the randomised tracks pinned. |
| Maps | **Same Google embed** | Identical iframe URL and the same click-shield pattern. |
| Backend | **None** | Explicitly out of scope. The RSVP form validates and shows an inline success state without posting. |

## Notable divergences (and why)

1. **CSR → SSR.** The target ships an empty shell and paints in JS; the clone
   server-renders. Visually identical once loaded, and strictly better for LCP.
   The one place this bites is the countdown and the petal randomisation, both
   of which are handled explicitly to avoid hydration mismatch.

2. **framer-motion → IntersectionObserver.** The reveal offsets, easing, and
   one-shot behaviour are reproduced; the underlying spring physics are
   approximated with the site's own cubic-bezier. Indistinguishable at normal
   scroll speeds.

3. **Radix → hand-rolled radio group.** Same roles, same `aria-checked`, same
   keyboard behaviour, without pulling in the dependency.

4. **`mobileM`/`mobileL` → `mobilem`/`mobilel`.** Purely a Tailwind v4 naming
   constraint; the breakpoint *values* (375 px / 425 px) are unchanged.

5. **No lightbox reference.** The target's photo viewer mounts outside the
   captured DOM and could not be sampled, so `PhotoLightbox` is a faithful but
   conventional implementation (backdrop, Escape, scroll lock). This is the one
   component built from inference rather than extraction.

6. **No `prefers-reduced-motion` on the target.** The clone adds it. A
   deliberate, non-visual improvement.

## Not reproduced (out of scope per the clone brief)

- Real RSVP persistence / database
- The gift modal's bank details (not sampled; not invented)
- The `bride` route variant
- Any authentication or per-guest personalisation (the live page renders the
  generic `Bạn` when no guest token is supplied — which is what was captured)
