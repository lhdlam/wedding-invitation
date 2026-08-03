# AlbumSection + PhotoLightbox Specification

## Overview
- **Target files:** `src/components/AlbumSection.tsx`, `src/components/PhotoLightbox.tsx`
- **Screenshot:** `docs/design-references/desktop-section-08.png`
- **Interaction model:** static grid + scroll-triggered reveals; every photo is a click-to-zoom button

---

## Structure

Three stacked parts inside one `<section class="px-4 pt-16 mobileL:px-6 mobileL:pt-20 bg-white/60 pb-16">`:

1. A 3-photo header stack
2. A centred title block
3. An 11-photo, 12-column mosaic

Every photo is wrapped in:

```html
<button type="button" class="block w-full p-0 border-0 bg-transparent cursor-zoom-in focus:outline-none"
        aria-label="Xem ảnh: Ảnh album">
  <img src="…" alt="Ảnh album" class="…">
</button>
```

---

## Part 1 — header stack (verbatim)

```html
<div class="space-y-2">
  <div class="overflow-hidden rounded-sm">
    <!-- button -->
    <img src="/images/album/4N2A8362.webp" alt="Ảnh album"
         class="h-[300px] w-full object-cover object-[center_calc(50%+40px)]">
  </div>
  <div class="grid grid-cols-2 gap-2">
    <!-- button --><img src="/images/album/4N2A6242.webp" alt="Ảnh album"
         class="h-[165px] w-full rounded-sm object-cover object-[center_calc(50%-15px)]">
    <!-- button --><img src="/images/album/4N2A8060.webp" alt="Ảnh album"
         class="h-[165px] w-full rounded-sm object-cover object-[center_calc(50%+10px)]">
  </div>
</div>
```

## Part 2 — title block (verbatim)

```html
<div class="relative overflow-hidden py-14 text-center">
  <p class="mb-3 text-[16px] mobileL:text-[18px] uppercase tracking-[4px] text-[#b07b73] font-bold">Album Ảnh</p>
  <h2 class="text-[30px] mobileM:text-[32px] mobileL:text-[36px] sm:text-[40px] font-light uppercase tracking-[5px] text-[#2d2b2b]">Khoảnh Khắc</h2>
  <p class="mt-1 text-[45px] mobileM:text-[50px] leading-none text-[#b56e67] font-anisa">Của Chúng Tôi</p>

  <div class="my-4 flex items-center justify-center gap-3">
    <div class="h-px w-10 bg-[#d8c4bb]"></div>
    <span class="text-[#b56e67]">♥</span>
    <div class="h-px w-10 bg-[#d8c4bb]"></div>
  </div>

  <p class="text-[12px] uppercase tracking-[1px] sm:tracking-[2px] text-[#67615d] font-bold">Lưu giữ những điều đẹp nhất của chúng ta</p>
</div>
```

### Reveals for the title block (exact starting transforms)
| Element | Starts at | `Reveal` |
|---|---|---|
| `Khoảnh Khắc` | `translateX(-50px)` | `from="right"`, custom 50 px |
| `Của Chúng Tôi` | `translateX(50px)` | `from="left"`, custom 50 px |
| left ♥ rule | `translateX(-15px)` | `from="right"`, custom 15 px |
| `♥` | `translateY(-20px)` | `from="down"`, custom 20 px |
| right ♥ rule | `translateX(15px)` | `from="left"`, custom 15 px |
| caption | `translateY(-2.3px)` (sampled mid-flight) | `from="down"` |

`Reveal` only ships ±30 px offsets. For the 50 px / 15 px / 20 px cases either
extend `Reveal` with an optional `distance` prop **(preferred — keep it
backwards compatible, default 30)** or apply an inline style. Do not silently
substitute 30 px.

## Part 3 — the 12-column mosaic (verbatim)

```html
<div class="grid grid-cols-12 gap-2">

  <div class="col-span-7 flex flex-col gap-2">
    <img src="/images/album/4N2A8639.webp" class="h-[330px] w-full rounded-sm object-cover">
  </div>

  <div class="col-span-5 flex flex-col gap-2">
    <img src="/images/album/4N2A6817.webp" class="h-[200px] w-full rounded-sm object-cover object-[center_calc(50%-25px)]">
    <img src="/images/album/4N2A7594.webp" class="h-[120px] w-full rounded-sm object-cover object-[center_calc(50%+20px)]">
  </div>

  <div class="col-span-12 mobileL:col-span-9 flex flex-col gap-2">
    <img src="/images/album/4N2A7290.webp" class="h-[140px] w-full rounded-sm object-cover object-[center_calc(50%+25px)]">
    <div class="grid grid-cols-2 gap-2">
      <img src="/images/album/4N2A6775.webp" class="h-[140px] w-full rounded-sm object-cover object-[center_calc(50%+5px)]">
      <img src="/images/album/4N2A7749.webp" class="h-[140px] w-full rounded-sm object-cover object-[center_calc(50%+25px)]">
    </div>
  </div>

  <div class="col-span-12 mobileL:col-span-3 flex flex-col gap-2">
    <img src="/images/album/4N2A6421.webp"
         class="h-[200px] mobileL:h-[288px] w-full rounded-sm object-cover object-[calc(50%-3px)_calc(50%+25px)] mobileL:object-[calc(50%-3px)_center]">
  </div>

  <div class="col-span-12 flex flex-col gap-2">
    <img src="/images/album/4N2A7168.webp" class="h-[200px] w-full rounded-sm object-cover object-[center_calc(50%+85px)]">
  </div>
</div>
```

### Critical details
- **Every `object-position` is art-directed and different.** They are not
  decorative — copy each one exactly. Getting these wrong crops faces badly.
- The 3rd and 4th mosaic rows change span at `mobileL`: `col-span-12` below
  425 px (stacked), `col-span-9` / `col-span-3` at and above it (side by side).
- The tall photo also changes height (`200px → 288px`) *and* object-position at
  the same breakpoint.
- All 11 photos are individually clickable.

---

## `PhotoLightbox`

A single shared viewer used by both this section and `LoveStorySection`.

Requirements:
- Fixed full-screen overlay, `z-[300]`, backdrop `bg-black/90`.
- Centred image, `max-h-[90vh] max-w-[92vw] object-contain`.
- Close on: close button, backdrop click, and `Escape`.
- Lock body scroll while open; restore on close.
- Fade in/out ≈ 0.25 s.
- Render `null` when closed.

```ts
interface PhotoLightboxProps {
  photo: { src: string; alt: string } | null;
  onClose: () => void;
}
```

The target site's own lightbox could not be fully sampled (it mounts on click
outside the captured DOM), so this is a faithful-but-conventional
implementation. Flag it as the one place with mild interpretation.

---

## Responsive Behaviour
- **< 375 px:** heading `text-[30px]`, subtitle `text-[45px]`, mosaic rows 3 & 4 stacked full width
- **≥ 375 px (`mobileM`):** heading `text-[32px]`, subtitle `text-[50px]`
- **≥ 425 px (`mobileL`):** heading `text-[36px]`, eyebrow `text-[18px]`, section `px-6 pt-20`, mosaic rows 3 & 4 become `col-span-9` + `col-span-3`, tall photo `h-[288px]` and re-centred
- **≥ 640 px (`sm`):** heading `text-[40px]`, caption `tracking-[2px]`
- Column capped at 480 px — identical at 768 px and 1440 px.

## Assets (11 album photos, all in `/images/album/`)
`4N2A8362` · `4N2A6242` · `4N2A8060` · `4N2A8639` · `4N2A6817` · `4N2A7594` ·
`4N2A7290` · `4N2A6775` · `4N2A7749` · `4N2A6421` · `4N2A7168` (all `.webp`)

## Text Content (verbatim)
`Album Ảnh` · `Khoảnh Khắc` · `Của Chúng Tôi` · `♥` ·
`Lưu giữ những điều đẹp nhất của chúng ta` · alt text `Ảnh album` ·
aria-label `Xem ảnh: Ảnh album`
