# VenueSection + CountdownSection Specification

## Overview
- **Target files:** `src/components/VenueSection.tsx`, `src/components/CountdownSection.tsx`
- **Screenshots:** `docs/design-references/desktop-section-04.png`, `desktop-section-05.png`
- **Interaction model:** VenueSection = click-driven (map shield); CountdownSection = **time-driven**

---

## A. `VenueSection` — verbatim DOM

```html
<section class="px-4 mobileL:px-6 relative text-center bg-white/60 pt-0 pb-16 mobileL:pt-0">
  <p class="mb-3 text-[16px] mobileL:text-[18px] uppercase tracking-[4px] text-[#b07b73] font-bold">Tại địa điểm</p>

  <div class="text-muted-foreground">
    <p class="font-lora text-foreground/80 mt-4 inline-block text-[15px] mobileM:text-[15.8px] sm:text-[17px]">
      <svg class="lucide lucide-map-pin w-6 h-6 mb-1 shrink-0 text-gold inline-block">…</svg>
      <span>Trung tâm Học tập Cộng đồng thôn Thiện Thành, xã Cồn Tiên, tỉnh Quảng Trị</span>
    </p>
  </div>

  <div class="relative mt-8 rounded-2xl overflow-hidden shadow-card border-4 border-white">
    <button type="button" class="absolute inset-0 z-10 flex items-center justify-center bg-black/35 text-white text-sm px-4 text-center">
      Chạm để xem bản đồ
    </button>
    <iframe title="Wedding venue map"
            src="https://www.google.com/maps?q=16.888118,107.011207&output=embed"
            class="w-full h-64 border-0" loading="lazy"
            style="pointer-events: none;"></iframe>
  </div>
</section>
```

### Behaviour — the map shield
- **Initial state:** a `bg-black/35` button covers the whole map; the `<iframe>`
  has `pointer-events: none` so it cannot be scrolled or dragged.
- **Trigger:** click the shield.
- **After:** the shield unmounts (or fades to `opacity: 0` and becomes
  `pointer-events-none`) and the iframe's `pointer-events` becomes `auto`, so
  the map is interactive.
- This is a deliberate pattern: it stops the embedded map from hijacking page
  scroll on touch devices. Preserve it.
- Use React state (`const [mapActive, setMapActive] = useState(false)`) rather
  than mutating the DOM.

### Notes
- Icon: `MapPinIcon` from `@/components/icons`, sized `w-6 h-6 mb-1 shrink-0
  text-gold inline-block`. It is **inline with the text**, not above it.
- `pt-0` — this section deliberately butts against the one above.
- Note the oddly precise `mobileM:text-[15.8px]`; keep it.
- Map coordinates: `16.888118,107.011207`.

---

## B. `CountdownSection` — verbatim DOM

```html
<section class="px-4 pt-16 mobileL:px-6 mobileL:pt-20 relative text-center pb-16">
  <h2 class="font-flavinda text-5xl text-primary mb-3 font-bold">Countdown</h2>
  <p class="font-lora text-[17px] text-foreground/80 mt-6 mb-8">Đếm ngược đến ngày hạnh phúc</p>

  <div class="flex items-start justify-center
              scale-[0.7]
              mobileM:scale-[0.8]
              mobileL:scale-[0.9]
              sm:scale-[1]">

    <!-- unit ×4 -->
    <div class="flex flex-col items-center w-full">
      <div class="d-flex items-center rounded-lg bg-white/80 backdrop-blur shadow-card border border-primary py-6 px-2 text-center aspect-[16/17]">
        <span class="font-serif leading-none text-[#9a6a2d] tabular-nums text-[40px] inline-block min-w-[68px]">00</span>
      </div>
      <span class="mt-2 text-[14px] uppercase tracking-[0.1em] text-primary font-serif">Ngày</span>
    </div>

    <!-- separator ×3, between units -->
    <div class="flex items-center justify-center px-3 pt-[29px]">
      <span class="text-3xl leading-none text-gold">:</span>
    </div>
    <!-- … Giờ … Phút … Giây -->
  </div>
</section>
```

### Behaviour — the timer
- **Interaction model: time-driven.** Ticks once per second toward
  **`2026-07-25T09:00:00+07:00`** (ceremony start, Vietnam time, UTC+7).
- Units in order: **Ngày** (days), **Giờ** (hours), **Phút** (minutes),
  **Giây** (seconds).
- Each value is zero-padded to 2 digits (`String(n).padStart(2, "0")`).
- **Clamp at zero.** The target date is in the past as of capture and the live
  site showed `00` for every unit — it must never render negative numbers.
- **Hydration:** the server and client will compute different times. Render
  `00` on the server and start the real countdown in a `useEffect` after mount,
  so server and client markup match.
- Clear the interval on unmount.

### Notes
- `d-flex` is a Bootstrap leftover on the target and does nothing in Tailwind.
  Keep the visual result; you may drop the dead class.
- `aspect-[16/17]` on each card, digits `min-w-[68px]` with `tabular-nums` so
  the width does not jitter as numbers change.
- Digit colour is the literal `#9a6a2d`; the label uses `text-primary`.
- Separator colons sit in their own flex items with `px-3 pt-[29px]` — that top
  padding is what optically centres them against the cards.
- The whole row **scales**, it does not reflow: `0.7 → 0.8 → 0.9 → 1`.

---

## Responsive Behaviour
- **< 375 px:** countdown row `scale-[0.7]`; address `text-[15px]`; eyebrow `text-[16px]`
- **≥ 375 px (`mobileM`):** `scale-[0.8]`; address `text-[15.8px]`
- **≥ 425 px (`mobileL`):** `scale-[0.9]`; eyebrow `text-[18px]`; sections `px-6`, countdown `pt-20`
- **≥ 640 px (`sm`):** `scale-[1]`; address `text-[17px]`
- Column capped at 480 px — identical at 768 px and 1440 px.

## Assets
- `MapPinIcon` from `@/components/icons`
- No images; the map is a Google Maps iframe embed

## Text Content (verbatim)
- `Tại địa điểm`
- `Trung tâm Học tập Cộng đồng thôn Thiện Thành, xã Cồn Tiên, tỉnh Quảng Trị`
- `Chạm để xem bản đồ`
- `Countdown` · `Đếm ngược đến ngày hạnh phúc`
- `Ngày` · `Giờ` · `Phút` · `Giây`
