# FamiliesSection + InvitationSection Specification

## Overview
- **Target files:** `src/components/FamiliesSection.tsx`, `src/components/InvitationSection.tsx`, `src/components/WeddingDayBlock.tsx`
- **Screenshots:** `docs/design-references/desktop-section-03.png`
- **Interaction model:** static + scroll-triggered reveals

---

## Shared sub-component: `WeddingDayBlock`

Both sections end with the identical date block, so extract it once.

```html
<div>
  <div class="mt-9 mb-1 flex items-center justify-center gap-4 uppercase">
    <p class="font-lora border-y border-primary px-2 py-2 text-[14px] mobileM:text-[16px] mobileL:text-lg">tháng 07</p>
    <p class="font-lora text-primary text-5xl mobileM:text-[52px] mobileL:text-6xl">25</p>
    <p class="font-lora border-y border-primary px-2 py-2 text-[14px] mobileM:text-[16px] mobileL:text-lg">năm 2026</p>
  </div>
  <div class="mb-12">
    <p class="font-lora text-[15px] text-primary mt-0">(Tức ngày 12 tháng 06 năm Bính Ngọ)</p>
  </div>
</div>
```

**Reveals (exact, from live inline styles):**
- `tháng 07` → starts `translateX(30px)` (`Reveal from="left"`)
- `25` → starts `translateY(-30px)` (`Reveal from="down"`)
- `năm 2026` → starts `translateX(-30px)` (`Reveal from="right"`)

Props: `{ monthLabel, day, yearLabel, lunarNote }` — see
`WeddingDate` in `@/types/invitation`.

---

## A. `FamiliesSection` — verbatim DOM

```html
<div class="relative px-4 py-16 mobileM:px-5 mobileL:px-6 mobileL:py-20">
  <img src="/images/floral-corner.png" alt="" class="absolute top-0 right-0 w-32 opacity-60 -rotate-12" loading="lazy">
  <img src="/images/floral-corner.png" alt="" class="absolute bottom-0 left-0 w-32 opacity-60 rotate-180 scale-x-[-1]" loading="lazy">

  <div class="relative text-center">
    <div class="flex justify-between items-center mt-12 gap-2 sm:gap-4">

      <!-- NHÀ TRAI -->
      <div class="space-y-1">
        <p class="uppercase tracking-widest text-primary font-bold text-xs mobileL:text-sm">Nhà trai</p>
        <p class="font-lora text-primary font-bold text-[12px] mobileM:text-[13px] mobileL:text-base">Ông. Bùi Thanh Đạm</p>
        <p class="font-lora text-primary font-bold text-[12px] mobileM:text-[13px] mobileL:text-base">Bà. Trần Thị Hường</p>
        <p class="text-[10px] mobileM:text-[11px] mobileL:text-xs text-muted-foreground mt-2 font-serif">Thôn Thiện Thành, Xã Cồn Tiên,<br> Tỉnh Quảng Trị</p>
      </div>

      <!-- vertical rule -->
      <div class="flex items-center justify-center">
        <span class="h-[100px] w-[1.4px] bg-primary my-6"></span>
      </div>

      <!-- NHÀ GÁI -->
      <div class="space-y-1">
        <p class="uppercase tracking-widest text-primary font-bold text-xs mobileL:text-sm">Nhà gái</p>
        <p class="font-lora text-primary font-bold text-[12px] mobileM:text-[13px] mobileL:text-base">Ông. Nguyễn Đức Ánh</p>
        <p class="font-lora text-primary font-bold text-[12px] mobileM:text-[13px] mobileL:text-base">Bà. Ngô Thị Mai</p>
        <p class="text-[10px] mobileM:text-[11px] mobileL:text-xs text-muted-foreground mt-2 font-serif">Thôn Vĩnh Tân, Xã Cồn Tiên,<br> Tỉnh Quảng Trị</p>
      </div>
    </div>

    <p class="font-lora text-foreground/80 mt-5 text-[16px] mobileM:text-[17px] mobileL:text-[18px]">
      Trân trọng báo tin<br>Lễ Thành Hôn của chúng tôi!
    </p>

    <div class="mt-8">
      <p class="font-lora text-primary uppercase text-[38px] mobileM:text-[39px] mobileL:text-[40px]">Đức Tuấn</p>
      <p class="font-flavinda text-[80px] text-gold leading-[70px]">and</p>
      <p class="font-lora text-primary uppercase text-[38px] mobileM:text-[39px] mobileL:text-[40px]">Quỳnh Như</p>
    </div>

    <p class="font-lora text-[16px] mobileM:text-[17px] text-primary mt-8 uppercase">
      Hôn lễ được cử hành tại tư gia<br>vào lúc <span class="text-primary font-bold">9:00, Thứ Bảy</span><br>
    </p>

    <!-- <WeddingDayBlock /> -->
  </div>
</div>
```

### Notes
- Outer element is a `<div>`, **not** a `<section>` — it carries no `bg-white/60`,
  so the paper texture shows through.
- The two floral corners are the *same* PNG, mirrored: top-right `-rotate-12`,
  bottom-left `rotate-180 scale-x-[-1]`. Both `w-32 opacity-60`, absolutely
  positioned against the section.
- The address lines use `font-serif` (the browser serif stack), **not** Lora.
- `and` is Flavinda 80 px in `text-gold` with a tight `leading-[70px]`.
- Family sides fade up individually (`Reveal from="up"`, stagger ≈ 0.1 s).

### Data
Drive from `FamilySide[]` in `@/types/invitation`.

---

## B. `InvitationSection` — verbatim DOM

```html
<section class="mobileL:px-6 mobileL:pt-20 relative px-6 pt-16 pb-2 text-center bg-white/60">
  <p class="mb-3 text-[16px] mobileL:text-[18px] uppercase tracking-[4px] text-[#b07b73] font-bold">Thiệp mời</p>

  <div class="text-center mt-4">
    <p class="font-lora text-[18px] text-primary">Trân trọng kính mời:</p>

    <div class="mt-4 mx-auto max-w-[250px]">
      <p class="font-anisa italic text-[50px] text-primary text-center leading-[34px] mb-2 relative">Bạn</p>
      <p class="border-t border-primary w-[200px] mx-auto"></p>
    </div>

    <p class="font-lora text-foreground/80 mt-8 max-w-[350px] mx-auto text-[16px] mobileM:text-[17px] mobileL:text-[18px]">
      Đến dự buổi tiệc chung vui cùng gia đình chúng tôi vào lúc <span class="text-primary font-bold">11:00, Thứ Bảy</span>
    </p>

    <!-- <WeddingDayBlock /> -->
  </div>
</section>
```

### Reveals (exact)
- `Bạn` → starts `translateY(-20px)` (`Reveal from="down"`, 20 px not 30)
- The rule under it → starts `transform: scaleX(0)` and grows to `scaleX(1)`.
  This is **not** one of `Reveal`'s directions — implement inline with its own
  `IntersectionObserver` or a `scaleX` variant, `transform-origin: center`.

### Notes
- The eyebrow colour `#b07b73` is a literal hex on the target (a dusty rose).
  It appears on **every** section eyebrow — keep it as an arbitrary value.
- `Bạn` is the guest name placeholder; accept it as a prop (`guestName`).

---

## Responsive Behaviour
- **< 375 px:** family names `text-[12px]`, addresses `text-[10px]`, eyebrow `text-xs`, day chips `text-[14px]`, numeral `text-5xl`
- **≥ 375 px (`mobileM`):** names `text-[13px]`, addresses `text-[11px]`, chips `text-[16px]`, numeral `text-[52px]`, section `px-5`
- **≥ 425 px (`mobileL`):** names `text-base`, addresses `text-xs`, eyebrow `text-sm`, chips `text-lg`, numeral `text-6xl`, section `px-6 py-20`
- **≥ 640 px (`sm`):** family column gap `gap-4`
- Column capped at 480 px — identical at 768 px and 1440 px.

## Assets
- `/images/floral-corner.png` (used twice, mirrored)
- `Reveal` from `@/components/Reveal`

## Text Content (verbatim)
`Nhà trai` · `Ông. Bùi Thanh Đạm` · `Bà. Trần Thị Hường` · `Thôn Thiện Thành, Xã Cồn Tiên,` / `Tỉnh Quảng Trị`
`Nhà gái` · `Ông. Nguyễn Đức Ánh` · `Bà. Ngô Thị Mai` · `Thôn Vĩnh Tân, Xã Cồn Tiên,` / `Tỉnh Quảng Trị`
`Trân trọng báo tin` / `Lễ Thành Hôn của chúng tôi!` · `Đức Tuấn` · `and` · `Quỳnh Như`
`Hôn lễ được cử hành tại tư gia` / `vào lúc 9:00, Thứ Bảy`
`Thiệp mời` · `Trân trọng kính mời:` · `Bạn` · `Đến dự buổi tiệc chung vui cùng gia đình chúng tôi vào lúc 11:00, Thứ Bảy`
`tháng 07` · `25` · `năm 2026` · `(Tức ngày 12 tháng 06 năm Bính Ngọ)`
