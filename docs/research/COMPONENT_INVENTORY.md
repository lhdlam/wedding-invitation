# Component Inventory

Every component built for the clone, its source section on the target, and its
spec file.

## Foundation (built directly, not delegated)

| Component | File | Purpose |
|---|---|---|
| `Reveal` | `src/components/Reveal.tsx` | Scroll-triggered entrance. IntersectionObserver at `threshold: 0.15`, `rootMargin: "0px 0px -40px 0px"`, one-shot, `--transition-silk` easing, honours `prefers-reduced-motion`. Directions: `up`/`down`/`left`/`right`/`none` (±30 px). |
| `SectionDivider` | `src/components/icons.tsx` | Gradient rule — 3 gold dots — gradient rule. Used by SaveTheDate, Timeline, ThankYou. |
| `DotsOrnamentIcon` | `src/components/icons.tsx` | The 3-dot SVG on its own. |
| `PetalIcon` | `src/components/icons.tsx` | Falling-petal shape, 20×26 viewBox, `hsl(340 70% 80%)`. |
| `ClockIcon` `MapPinIcon` `CircleIcon` `Volume2Icon` `VolumeOffIcon` | `src/components/icons.tsx` | The lucide icons the target uses, inlined so `lucide-react` is not a runtime dep. |

## Shell / ambient

| Component | Spec | Interaction model |
|---|---|---|
| `CoverOverlay` | `cover-and-ambient.spec.md` | **Click-driven, one-shot.** Envelope gate at `z-[200]`; two gradient flaps that rotateY open; breathing wax seal; tapping cursor hint. Calls `onOpen()` → unlocks scroll + starts audio. |
| `PetalField` | `cover-and-ambient.spec.md` | **Continuous CSS.** 30 seeded-random SVG petals, `petal-fall` 12–19 s. Fixed, `z-0`, behind `main`. |
| `MusicToggle` | `cover-and-ambient.spec.md` | **Click-driven.** Fixed bottom-right, `hover:scale-110`, icon swaps on mute. |

## Content sections (top → bottom)

| # | Component | Spec | Interaction model | Notes |
|---|---|---|---|---|
| 1 | `HeroSection` | `hero-and-savethedate.spec.md` | Static + load reveals | `100svh`, full-bleed photo, dual scrim, `icon-and.png` overlaid *between* the two names |
| 2 | `SaveTheDateSection` | `hero-and-savethedate.spec.md` | Scroll reveals | 3-layer tilted polaroid: brown slab −5°, white frame +9°, floral overlay |
| 3 | `PhotoBreak` | `hero-and-savethedate.spec.md` | Static | Single 330 px full-bleed photo |
| 4 | `FamiliesSection` | `families-and-invitation.spec.md` | Scroll reveals | Two mirrored floral corners; Nhà trai / Nhà gái split by a 100 px rule; `<div>` not `<section>` |
| 5 | `WeddingDayBlock` | `families-and-invitation.spec.md` | Scroll reveals | **Shared** by sections 4 and 5. Three directional reveals (X+30 / Y−30 / X−30) |
| 6 | `InvitationSection` | `families-and-invitation.spec.md` | Scroll reveals | Guest name in Anisa 50 px over a `scaleX(0→1)` rule |
| 7 | `VenueSection` | `venue-and-countdown.spec.md` | **Click-driven** | Google Maps iframe behind a `bg-black/35` click-shield; iframe inert until activated |
| 8 | `CountdownSection` | `venue-and-countdown.spec.md` | **Time-driven** | Ticks to `2026-07-25T09:00:00+07:00`, clamps at zero, hydration-safe (renders `00` on server) |
| 9 | `LoveStorySection` | `lovestory-and-timeline.spec.md` | Static + lightbox | 2-up 3:4 portraits; heading is the literal word "and" in Flavinda |
| 10 | `TimelineSection` | `lovestory-and-timeline.spec.md` | Scroll reveals, staggered | 6 cards, `delay = index × 0.1 s` |
| 11 | `AlbumSection` | `album.spec.md` | Scroll reveals + lightbox | 3-photo header stack, title block with 50/20/15 px reveals, 11-photo 12-col mosaic with per-photo art-directed `object-position` |
| 12 | `PhotoLightbox` | `album.spec.md` | **Click-driven** | Shared viewer; Escape / backdrop / button close, body-scroll lock. *The one component inferred rather than extracted.* |
| 13 | `RsvpSection` | `rsvp-gift-thankyou.spec.md` | **Click-driven form** | Name, Yes/No radio group, 4-way party size, 2-way guest-of, message. No backend — inline success state. |
| 14 | `GiftSection` | `rsvp-gift-thankyou.spec.md` | Click-driven | Outlined full-width button; modal not sampled, `onClick` left as a prop |
| 15 | `ThankYouSection` | `rsvp-gift-thankyou.spec.md` | Static | Flavinda 60 px + divider + closing copy |

## Recurring patterns

- **Section eyebrow** — `mb-3 text-[16px] mobilel:text-[18px] uppercase tracking-[4px] text-[#b07b73] font-bold`.
  Appears on sections 4, 6, 7, 9, 10, 11, 13. Not extracted into a component
  because the target repeats it inline; kept inline for 1:1 fidelity.
- **Section background alternation** — `bg-white/60` on 2, 3, 6, 7, 9, 11, 15;
  bare paper texture on 1, 4, 10, 13, 14.
- **Section padding rhythm** — `px-4 mobilem:px-5 mobilel:px-6` and
  `py-16 mobilel:py-20`.
- **Photo buttons** — every clickable photo is
  `block w-full p-0 border-0 bg-transparent cursor-zoom-in focus:outline-none`.

## States captured

| Component | States |
|---|---|
| `CoverOverlay` | closed (idle, breathing seal) → opening (flaps rotate) → unmounted |
| `MusicToggle` | playing (pulsing Volume2) / muted (VolumeOff) |
| `VenueSection` | shielded (map inert) / active (map interactive) |
| `CountdownSection` | server `00` → live ticking → clamped `00` after the date |
| `RsvpSection` | per-field selection states (chip selected/unselected, radio checked/unchecked), invalid-empty-name, submitted |
| `PhotoLightbox` | closed (`null`) / open |
| All reveal-wrapped elements | pre-reveal (offset + `opacity: 0`) / revealed (`none` + `opacity: 1`) |
