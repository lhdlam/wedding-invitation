# Page Topology — tuannhu-savewithlove.io.vn/invitation/groom

Target: single-page Vietnamese wedding invitation (React + Vite + Tailwind + framer-motion).
Captured 2026-07-29 via Playwright/Chrome at 1440×900, 768×1024, 390×844.

## Global shell

```
html
└ body                                    (overflow-x: clip)
  └ div.relative.bg-background.min-h-screen.overflow-x-clip
    ├ main.relative.max-w-[480px].mx-auto.min-h-screen.shadow-petal.bg-top.bg-repeat
    │   background-image: images/background-white.png   ← paper texture, repeating
    │   └ 13 content blocks (below)
    ├ div.pointer-events-none.fixed.inset-0.overflow-hidden.z-0   ← PetalField (30 SVG petals)
    ├ audio[loop]                                                  ← background music
    └ button.fixed.bottom-6.right-6.z-50                           ← MusicToggle
```

**Key architectural fact:** the whole invitation is a **480 px-wide phone-shaped
column centred on the viewport**. On desktop the surrounding area is the page
background (`hsl(30 40% 97%)`) with falling petals; the column carries
`shadow-petal`. There is no desktop-specific layout — the design is mobile-only
and simply centres itself. Responsive changes happen *within* the 480 px column
at the custom `mobileM` (375 px) and `mobileL` (425 px) breakpoints.

## The cover gate (renders above everything, before entry)

```
div.pointer-events-none.fixed.inset-0.z-[200].flex.justify-center
└ div.pointer-events-auto.relative.h-[100dvh].w-full.max-w-[480px]
  └ div.absolute.inset-0.z-[100].isolate
    ├ div.absolute.inset-0.z-0.flex        ← two envelope flaps
    │ ├ div.flex-[8].origin-left    gradient #f7f0e3 → #eadfca → #d8c7a3, inset shadow right
    │ │   "Save" (Silenter 80px) / "The Date" (Lora 40px) / "Thân mời:" / "Bạn" (Anisa 50px) + rule
    │ └ div.flex-[4].origin-right   gradient #f6eedf → #e6d7b8 → #d3bb8a, inset shadow left
    └ div.absolute.left-[65%].top-1/2.z-10.h-[240px].w-[240px]
      ├ img flower-wax-seal.png  (rotate-[40deg], w-240)
      ├ button > img wax-seal.webp (w-100)   ← OPENS THE INVITATION
      └ button > img cursor.webp   (w-80)    ← animated tap hint
```

Until the seal is clicked the page is scroll-locked. Clicking it removes the
overlay, starts the audio, and reveals the 9 750 px scrollable document.

## Content blocks (in `main`, top → bottom)

| # | Component | Offset | Height | Notes |
|---|-----------|--------|--------|-------|
| 1 | `HeroSection` | 0 | 900 (`100svh`) | Full-bleed couple photo, dual gradient scrim, "Wedding day", names with `icon-and.png` overlay, date in a `border-y` rule |
| 2 | `SaveTheDateSection` | 900 | 1225 | `bg-white/60`; TN monogram, divider, italic copy, gold rule, "SAVE the DATE", date, then a **3-layer tilted polaroid** (brown slab −5°, white frame +9°, floral-frame overlay) |
| 3 | `PhotoBreak` | 2125 | 370 | `bg-white/60`; single full-width 330 px photo, `object-[center_calc(50%-80px)]` |
| 4 | `FamiliesSection` | 2507 | 906 | Two `floral-corner.png` overlays (top-right −12°, bottom-left 180° + flip); Nhà trai / Nhà gái columns split by a 100 px vertical rule; names in Lora 38–40 px; `and` in Flavinda 80 px gold; ceremony line; day block (tháng 07 / 25 / năm 2026) |
| 5 | `InvitationSection` | 3412 | 474 | `bg-white/60`; "Thiệp mời"; guest name "Bạn" (Anisa 50 px) over a 200 px rule; reception line; same day block |
| 6 | `VenueSection` | 3886 | 469 | `bg-white/60`; map-pin + address; Google Maps `<iframe>` in a `rounded-2xl` white-bordered card behind a `bg-black/35` "Chạm để xem bản đồ" button |
| 7 | `CountdownSection` | 4354 | 394 | **Time-driven.** "Countdown" (Flavinda 48 px); 4 cards (Ngày/Giờ/Phút/Giây) separated by gold colons; whole row scales 0.7 → 1 across breakpoints |
| 8 | `LoveStorySection` | 4748 | 785 | `bg-white/60`; "The love story" + `and`; intro paragraph; 2-up 3:4 portrait cards (Chú rể / Cô dâu) with name + birth date |
| 9 | `TimelineSection` | 5533 | 1015 | 6 cards, each a clock circle (blush gradient) + time + label; `max-w-xs` rail |
| 10 | `AlbumSection` | 6548 | 1790 | `bg-white/60`; 3-photo header stack, centred title block, then an 11-photo **12-column mosaic**; every photo is a `cursor-zoom-in` button |
| 11 | `RsvpSection` | 8338 | 898 | Form: name input, Yes/No radio group, 4-way party-size selector, 2-way guest-of selector, textarea, submit |
| 12 | `GiftSection` | 9236 | 130 | Single outlined full-width button "Gửi quà mừng cưới" |
| 13 | `ThankYouSection` | 9366 | 384 | `bg-white/60`; "Thank you" (Flavinda 60 px), divider, closing copy |

Total document height: **9 750 px** at 1440×900 after entry.

## Z-index layers

| z | Element |
|---|---------|
| 200 | Cover gate (pre-entry only) |
| 100 | Cover inner stack; toast rail |
| 50 | Music toggle (fixed, bottom-right) |
| 10 | Venue map click-shield; cover seal buttons |
| 0 | Petal field (fixed, behind `main`) |

## Section background rhythm

Blocks alternate between the bare paper texture and a `bg-white/60` wash:

`hero(none) → 2(white/60) → 3(white/60) → 4(none) → 5(white/60) → 6(white/60) →
7(none) → 8(white/60) → 9(none) → 10(white/60) → 11(none) → 12(none) → 13(white/60)`
