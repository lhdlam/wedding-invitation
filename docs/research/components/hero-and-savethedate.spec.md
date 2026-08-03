# HeroSection + SaveTheDateSection + PhotoBreak Specification

## Overview
- **Target files:** `src/components/HeroSection.tsx`, `src/components/SaveTheDateSection.tsx`, `src/components/PhotoBreak.tsx`
- **Screenshots:** `docs/design-references/01-opened-desktop.png` (hero), `docs/design-references/desktop-section-02.png` (save the date)
- **Interaction model:** static + scroll-triggered reveals

---

## A. `HeroSection` — verbatim DOM

```html
<section class="px-4 pt-16 mobileL:px-6 mobileL:pt-20 relative h-[100svh] w-full overflow-x-hidden overflow-y-visible bg-background">
  <img src="/images/couple/4N2A6880.webp" alt="Đức Tuấn & Quỳnh Như" width="1024" height="1280"
       class="absolute inset-0 w-full h-full object-cover object-[35%_center] mobileM:object-[40%_center] mobileL:object-[50%_center]">
  <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>

  <div class="absolute top-8 left-0 right-0 text-center px-4 mobileM:px-5 mobileL:px-6">
    <p class="font-flavinda text-5xl mobileM:text-6xl mobileL:text-7xl text-white/80 drop-shadow-lg font-medium">Wedding day</p>
  </div>

  <div class="absolute inset-0 flex flex-col items-center justify-end text-center px-4 pb-10 mobileM:px-5 mobileL:px-6">
    <div class="relative">
      <p class="font-ergisa text-5xl sm:text-6xl text-white tracking-wide drop-shadow-2xl mb-4">Đức Tuấn</p>
      <img src="/images/icon-and.png" alt="" width="130"
           class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-70">
      <p class="font-ergisa text-5xl sm:text-6xl text-white tracking-wide drop-shadow-2xl">Quỳnh Như</p>
    </div>
    <div class="mt-8 px-6 py-2 border-y border-white/40">
      <p class="text-white tracking-[0.3em] text-sm">25.07.2026</p>
    </div>
  </div>
</section>
```

### Notes
- `h-[100svh]` (small viewport height), not `100vh`.
- The `icon-and.png` ampersand is an **overlay centred between the two names**,
  not a separate line. It must sit above the names (`opacity-70`) inside the
  `relative` wrapper.
- Use `next/image` with `priority` for the couple photo (it is LCP), `fill`, and
  the object-position classes above.
- Reveals on load: "Wedding day", each name, and the date block fade up in
  sequence (delays ≈ 0 / 0.15 / 0.3 / 0.45 s). Use `Reveal` with `from="up"`.

---

## B. `SaveTheDateSection` — verbatim DOM

```html
<section class="mobileL:pt-20 relative px-4 pt-16 pb-0 text-center bg-white/60 mobileM:px-5 mobileL:px-6 mobileM:pb-5 mobileL:pb-11 sm:pt-20 sm:pb-20">
  <img src="/images/logo-tn.png" alt="" width="180" class="mx-auto">

  <!-- divider: use <SectionDivider /> from @/components/icons -->
  <div class="flex items-center justify-center gap-4 my-8">
    <span class="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/60"></span>
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" class="text-gold">
      <circle cx="20" cy="10" r="3" fill="currentColor" opacity="0.4"></circle>
      <circle cx="8"  cy="10" r="1.5" fill="currentColor" opacity="0.6"></circle>
      <circle cx="32" cy="10" r="1.5" fill="currentColor" opacity="0.6"></circle>
    </svg>
    <span class="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/60"></span>
  </div>

  <p class="text-muted-foreground italic leading-loose font-lora text-lg">
    We've been writing<br>our love story for years...<br>and the next chapter begins in
  </p>

  <div class="flex items-center justify-center">
    <span class="h-[50px] w-[2px] bg-gold my-6"></span>
  </div>

  <div class="flex items-center justify-center gap-2 font-bold">
    <p class="font-lora text-4xl text-primary uppercase">save</p>
    <p class="font-flavinda text-4xl text-primary ml-4 mr-3">the</p>
    <p class="font-lora text-4xl text-primary uppercase">date</p>
  </div>
  <p class="font-lora text-2xl text-primary tracking-widest mt-2">25.07.2026</p>

  <!-- THREE-LAYER POLAROID -->
  <div class="relative w-[320px] mx-auto
              mt-0
              scale-[0.7] -translate-x-[20px]
              mobileM:scale-[0.8] mobileM:-translate-x-[12px] mobileM:mt-8
              mobileL:scale-[0.9] mobileL:-translate-x-[10px] mobileL:mt-14
              sm:scale-[1] sm:-translate-x-[6px] sm:mt-16">
    <!-- layer 1: brown slab -->
    <div class="absolute left-[-30px] top-[40px] w-[220px] h-[420px] bg-[#8b5e20]"
         style="transform: rotate(-5deg);"></div>
    <!-- layer 2: white polaroid frame -->
    <div class="relative bg-white p-4 pb-16 shadow-xl"
         style="box-shadow: rgb(0,0,0) -2px 14px 12px -17px; transform-origin: right bottom; transform: rotate(9deg);">
      <div class="relative overflow-hidden">
        <img src="/images/holding-invitation/4N2A7591.webp" alt=""
             class="w-full h-[380px] object-cover bg-[#8b5e20] object-[center_calc(50%+25px)]">
      </div>
    </div>
    <!-- layer 3: floral overlay -->
    <div>
      <img src="/images/floral-frame.png" alt=""
           class="absolute right-[-80px] bottom-[-40px] w-[360px] pointer-events-none">
    </div>
  </div>
</section>
```

### Reveals
- "SAVE the DATE" row: `from="left"` (starts at `translateX(-20px)`).
- "25.07.2026": `from="right"` (starts at `translateX(40px)`) — note the
  asymmetry, it is 40 px not 30 px.
- The gold vertical rule and the polaroid layers fade in (`from="none"`).

### Critical
The polaroid is **three stacked layers** — a rotated brown slab behind, the
white photo frame rotated the other way, and a floral PNG overlapping the
bottom-right. Missing any layer breaks the composition.

---

## C. `PhotoBreak` — verbatim DOM

```html
<div class="relative px-0 pt-10 mb-3 text-center bg-white/60">
  <img src="/images/couple/4N2A6981.webp" alt=""
       class="w-full h-[330px] object-cover object-[center_calc(50%-80px)]">
</div>
```

Full-bleed within the 480 px column. Note the negative object-position offset.

---

## Responsive Behaviour
- **390 px:** `mobileM` active — hero focal `40% center`, title `text-6xl`, polaroid `scale-[0.8] mt-8`
- **≥ 425 px:** `mobileL` — hero focal `50% center`, title `text-7xl`, polaroid `scale-[0.9] mt-14`
- **≥ 640 px:** `sm` — names `text-6xl`, polaroid `scale-[1] mt-16`, section `pt-20 pb-20`
- Column is capped at 480 px, so 768 px and 1440 px render identically.

## Assets
- `/images/couple/4N2A6880.webp` (hero), `/images/couple/4N2A6981.webp` (break)
- `/images/holding-invitation/4N2A7591.webp` (polaroid)
- `/images/icon-and.png`, `/images/logo-tn.png`, `/images/floral-frame.png`
- `SectionDivider` from `@/components/icons`; `Reveal` from `@/components/Reveal`

## Text Content (verbatim)
- `Wedding day` / `Đức Tuấn` / `Quỳnh Như` / `25.07.2026`
- `We've been writing` / `our love story for years...` / `and the next chapter begins in`
- `save` `the` `date` / `25.07.2026`
