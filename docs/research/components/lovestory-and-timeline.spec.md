# LoveStorySection + TimelineSection Specification

## Overview
- **Target files:** `src/components/LoveStorySection.tsx`, `src/components/TimelineSection.tsx`
- **Screenshots:** `docs/design-references/desktop-section-06.png`, `desktop-section-07.png`
- **Interaction model:** static + scroll-triggered reveals; portraits open a lightbox

---

## A. `LoveStorySection` — verbatim DOM

```html
<section class="relative px-4 py-16 mobileM:px-5 mobileL:px-6 mobileL:py-20 bg-white/60">
  <div class="text-center">
    <p class="mb-3 text-[16px] mobileL:text-[18px] uppercase tracking-[4px] text-[#b07b73] font-bold">The love story</p>
    <h2 class="font-flavinda text-[60px] text-primary mt-1">and</h2>
  </div>

  <p class="font-lora text-[18px] text-foreground/75 leading-7 italic text-center mt-2 px-2">
    Tình yêu của anh và em là một hành trình kỳ diệu, vượt qua bao thử thách để cùng nhau bước đến ngày hôm nay - đám cưới của chúng mình.
  </p>

  <div class="grid grid-cols-2 gap-4 mt-10">

    <!-- GROOM -->
    <div class="text-center">
      <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-card">
        <button type="button"
                class="block w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ring-offset-background"
                aria-label="Xem ảnh Chú rể lớn">
          <img src="/images/couple/4N2A7808.webp" alt="Chú rể" loading="lazy" decoding="async" class="w-full h-full object-cover">
        </button>
      </div>
      <div>
        <p class="text-[12px] uppercase tracking-[0.1em] text-gold font-bold mt-4">Chú rể</p>
        <p class="font-ergisa text-primary font-bold text-[18px] mobileM:text-[19px] mobileL:text-[20px]">Đức Tuấn</p>
        <p class="font-lora text-foreground/75 text-[13px] mobileM:text-[14px] mobileL:text-[15px]">08.10.1997</p>
      </div>
    </div>

    <!-- BRIDE — identical, with: -->
    <!-- aria-label="Xem ảnh Cô dâu lớn", src="/images/couple/4N2A8462.webp", alt="Cô dâu" -->
    <!-- "Cô dâu" / "Quỳnh Như" / "02.12.1997" -->
  </div>
</section>
```

### Notes
- The heading is literally the word `and` in Flavinda 60 px — it is **not** an
  ampersand glyph and not the `icon-and.png` image.
- Portraits are `aspect-[3/4]`, `rounded-2xl`, `shadow-card`, and each is a
  focusable button that opens the shared lightbox.
- The intro paragraph is italic Lora 18 px with `leading-7`.
- Reveal: name/date blocks fade up under each portrait.

### Lightbox contract
Both this section and `AlbumSection` open the same viewer. Expose the click via
a prop so the page can own one lightbox instance:

```ts
interface LoveStorySectionProps {
  onPhotoClick?: (src: string, alt: string) => void;
}
```
If `onPhotoClick` is not supplied the buttons should still render and be
focusable (no-op). Do **not** build a second lightbox here.

---

## B. `TimelineSection` — verbatim DOM

```html
<section class="relative px-4 py-16 mobileM:px-5 mobileL:px-6 mobileL:py-20 text-center">
  <p class="mb-3 text-[16px] mobileL:text-[18px] uppercase tracking-[4px] text-[#b07b73] font-bold">Timeline of</p>
  <h2 class="font-flavinda text-5xl text-primary mt-2 mb-3">Wedding</h2>

  <!-- <SectionDivider /> -->
  <div class="flex items-center justify-center gap-4 my-8">
    <span class="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/60"></span>
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" class="text-gold">…</svg>
    <span class="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/60"></span>
  </div>

  <div class="space-y-6 mt-8 text-left max-w-xs mx-auto">

    <!-- one card per entry, ×6 -->
    <div class="flex items-center gap-4 p-4 rounded-xl bg-white/60 shadow-card border border-blush-200">
      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blush-200 to-blush-300 flex items-center justify-center shrink-0">
        <svg class="lucide lucide-clock w-5 h-5 text-primary">…</svg>
      </div>
      <div>
        <p class="font-lora text-xl text-primary">09:00</p>
        <p class="font-lora text-muted-foreground">Tổ chức hôn lễ</p>
      </div>
    </div>
  </div>
</section>
```

### The six entries (verbatim, in order)

| Time | Label |
|---|---|
| `09:00` | `Tổ chức hôn lễ` |
| `09:30` | `Chụp ảnh cùng gia đình` |
| `10:30` | `Đón tiếp khách mời & chụp ảnh` |
| `11:00` | `Nghi thức lễ cưới` |
| `11:15` | `Khai tiệc` |
| `11:20` | `Chương trình âm nhạc & dùng tiệc` |

Drive from a `TimelineEntry[]` (already in `@/types/invitation`).

### Reveal — staggered
Cards enter from the left with a per-index delay. Evidence: sampled mid-scroll,
card 5 was at `translateX(-4.6px)` while card 6 was at `translateX(-29.3px)`.

Use `Reveal from="right"` (i.e. starting at `translateX(-30px)`) with
`delay={index * 0.1}`.

### Notes
- The rail is `max-w-xs` (320 px) and **left-aligned text** inside a
  `text-center` section — keep `text-left` on the rail.
- Clock circle: `w-12 h-12 rounded-full bg-gradient-to-br from-blush-200
  to-blush-300`, icon `ClockIcon` `w-5 h-5 text-primary`.
- Section has **no** `bg-white/60` — paper texture shows through.

---

## Responsive Behaviour
- **< 375 px:** portrait names `text-[18px]`, dates `text-[13px]`, eyebrow `text-[16px]`, padding `px-4`
- **≥ 375 px (`mobileM`):** names `text-[19px]`, dates `text-[14px]`, padding `px-5`
- **≥ 425 px (`mobileL`):** names `text-[20px]`, dates `text-[15px]`, eyebrow `text-[18px]`, padding `px-6`, sections `py-20`
- **≥ 640 px (`sm`):** divider rules widen `w-16 → w-24`
- Column capped at 480 px — identical at 768 px and 1440 px.

## Assets
- `/images/couple/4N2A7808.webp` (groom), `/images/couple/4N2A8462.webp` (bride)
- `SectionDivider`, `ClockIcon` from `@/components/icons`
- `Reveal` from `@/components/Reveal`

## Text Content (verbatim)
- `The love story` · `and`
- `Tình yêu của anh và em là một hành trình kỳ diệu, vượt qua bao thử thách để cùng nhau bước đến ngày hôm nay - đám cưới của chúng mình.`
- `Chú rể` · `Đức Tuấn` · `08.10.1997`
- `Cô dâu` · `Quỳnh Như` · `02.12.1997`
- `Timeline of` · `Wedding` + the six rows above
