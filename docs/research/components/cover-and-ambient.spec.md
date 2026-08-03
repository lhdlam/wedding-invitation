# CoverOverlay + PetalField + MusicToggle Specification

## Overview
- **Target files:** `src/components/CoverOverlay.tsx`, `src/components/PetalField.tsx`, `src/components/MusicToggle.tsx`
- **Screenshot:** `docs/design-references/00-initial-desktop.png`
- **Interaction model:** CoverOverlay = click-driven (one-shot); PetalField = continuous CSS animation; MusicToggle = click-driven

---

## A. `CoverOverlay`

The closed envelope that gates the invitation. Scroll is locked until the wax
seal is clicked.

### Verbatim DOM (from the live site, pre-click)

```html
<div class="pointer-events-none fixed inset-0 z-[200] flex justify-center">
  <div class="pointer-events-auto relative h-[100dvh] w-full max-w-[480px]">
    <div class="absolute inset-0 z-[100] isolate">
      <div class="absolute inset-0 z-0 flex w-full" aria-hidden="true">
        <!-- LEFT FLAP -->
        <div class="relative z-0 h-full min-h-0 flex-[8] origin-left bg-gradient-to-br from-[#f7f0e3] via-[#eadfca] to-[#d8c7a3] shadow-[inset_-10px_0_24px_rgba(0,0,0,0.08)] pt-16">
          <p class="font-silenter text-[80px] text-primary font-medium text-center leading-none">Save</p>
          <p class="font-lora text-[40px] text-primary text-center uppercase leading-1">The Date</p>
          <p class="font-lora text-[18px] text-primary uppercase mt-4 ml-[60px]">Thân mời:</p>
          <div class="mt-5 ml-[20px] mr-[20px]">
            <p class="font-anisa italic text-[50px] text-primary text-center leading-[34px] mb-2 relative">Bạn</p>
            <p class="border-t border-primary w-[200px] mx-auto"></p>
          </div>
        </div>
        <!-- RIGHT FLAP -->
        <div class="relative z-0 h-full min-h-0 flex-[4] origin-right bg-gradient-to-bl from-[#f6eedf] via-[#e6d7b8] to-[#d3bb8a] shadow-[inset_12px_0_32px_rgba(0,0,0,0.1)]"></div>
      </div>
      <!-- SEAL CLUSTER -->
      <div class="absolute left-[65%] top-1/2 z-10 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2">
        <img src="/images/flower-wax-seal.png" alt="" aria-hidden="true"
             class="pointer-events-none absolute left-[65%] top-[35%] z-0 w-[240px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain rotate-[40deg]">
        <button type="button" class="absolute left-[33%] top-[33%] z-10 cursor-pointer -translate-x-1/2 -translate-y-1/2">
          <img src="/images/wax-seal.webp" alt="Open invitation" class="w-[100px] object-contain">
        </button>
        <button type="button" class="absolute left-[48%] top-[43%] z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
          <img src="/images/cursor.webp" alt="Open invitation" class="w-[80px] object-contain">
        </button>
      </div>
    </div>
  </div>
</div>
```

### States & Behaviours

**Idle (before click)**
- The wax-seal button breathes continuously. Sampled live value:
  `transform: scale(1.0525) rotate(43.9377deg)`. Implement as an infinite
  ease-in-out loop oscillating roughly `scale(1) rotate(42deg)` ⇄
  `scale(1.06) rotate(46deg)`, period ≈ 2.5 s.
- The cursor-hint button sits at `opacity: 0.8` and taps: a small
  `translateY` / `scale` pulse, period ≈ 1.5 s.

**Open (on seal click)** — trigger: click the wax-seal button.
- Left flap: `rotateY(0deg) → -170deg` about `origin-left`.
- Right flap: `rotateY(0deg) → 170deg` about `origin-right`.
- Both over ≈ 1.1 s with `cubic-bezier(0.16, 1, 0.3, 1)`; add
  `perspective: 1600px` on the flap container so the flip reads in 3D.
- The seal cluster fades out (`opacity → 0`, ≈ 0.3 s) as the flaps start.
- After the animation the overlay unmounts entirely.
- The component must call an `onOpen()` prop at click time so the page can
  unlock scroll and start the audio.

### Props
```ts
interface CoverOverlayProps {
  guestName: string;   // "Bạn"
  onOpen: () => void;
}
```

### Notes
- `100dvh`, not `100vh`.
- Text content verbatim: `Save`, `The Date`, `Thân mời:`, `Bạn`.
- Respect `prefers-reduced-motion`: skip the flip, just unmount.

---

## B. `PetalField`

30 SVG petals falling continuously behind `main`.

```html
<div class="pointer-events-none fixed inset-0 overflow-hidden z-0">
  <div class="absolute animate-petal"
       style="left: 62.8629%; top: 0px; animation-delay: 1.17646s; animation-duration: 15.7701s;">
    <svg width="13.98" height="18.17" viewBox="0 0 20 26" style="opacity: 0.54127;">
      <path d="M10 0 C 4 6, 0 14, 10 26 C 20 14, 16 6, 10 0 Z" fill="hsl(340 70% 80%)"></path>
    </svg>
  </div>
  <!-- ×30 -->
</div>
```

- Count: **30**.
- Per-petal randomisation ranges observed:
  `left` 0–100 %, `animation-delay` 0–8 s, `animation-duration` 12–19 s,
  `opacity` 0.40–0.73, width 9–20 px (height = width × 26/20).
- `animate-petal` and the `petal-fall` keyframes already exist in `globals.css`.
- Use `PetalIcon` from `@/components/icons`.
- **Hydration:** randomised values must not differ between server and client.
  Generate them with a small seeded PRNG (deterministic), *or* generate in a
  `useEffect` after mount. Do not call bare `Math.random()` during render.

---

## C. `MusicToggle`

```html
<button aria-label="Toggle music"
        class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-petal border border-blush-200 flex items-center justify-center hover:scale-110 transition-transform">
  <svg class="lucide lucide-volume2 w-5 h-5 text-primary animate-pulse">…</svg>
</button>
```

- Icon: `Volume2Icon` when playing, `VolumeOffIcon` when muted — both already in
  `@/components/icons`. The `animate-pulse` class applies only while playing.
- Controls a single `<audio loop>` element with
  `src="/audio/wedding-song.mp3"`.
- Accepts a `playing: boolean` and `onToggle: () => void` — the page owns the
  `<audio>` element and playback state, since playback also starts from the
  cover.
- Browsers block autoplay without a gesture; starting playback inside the seal
  click handler satisfies that.

---

## Responsive Behaviour
- Cover column is `max-w-[480px]`, centred, full `100dvh` — identical at every
  viewport; below 480 px it simply fills the width.
- Petal field and music toggle are viewport-fixed and unchanged across
  breakpoints.

## Assets
- `/images/flower-wax-seal.png`, `/images/wax-seal.webp`, `/images/cursor.webp`
- `/audio/wedding-song.mp3`
- Icons: `PetalIcon`, `Volume2Icon`, `VolumeOffIcon` from `@/components/icons`
