# Behaviour Bible — tuannhu-savewithlove.io.vn/invitation/groom

Everything on this page that moves, changes, or reacts. Captured via Playwright
on 2026-07-29.

## 1. The entry gate (the single most important behaviour)

**Interaction model: click-driven, one-shot.**

On load the document is scroll-locked (`overflow: clip` on `html` and `body`;
`document.documentElement.scrollHeight === innerHeight`). A fixed `z-[200]`
overlay shows a closed envelope.

- **Trigger:** click the wax-seal `<button>` inside the overlay.
- **Effects, all at once:**
  1. The overlay unmounts (the two flaps animate open first — `origin-left` and
     `origin-right` imply a `rotateY` flip; the left flap is `flex-[8]`, the
     right `flex-[4]`).
  2. Scroll unlocks — document height becomes **9 750 px**.
  3. `<audio loop>` begins playing.
- **Idle hint:** the `cursor.webp` button pulses/taps continuously to invite the
  click. The wax seal itself carries a live transform
  (`scale(1.0525) rotate(43.9377deg)` when sampled) — it breathes via a
  continuous spring, i.e. a subtle scale+rotate loop.

## 2. Scroll-triggered reveals (used by nearly every section)

**Interaction model: scroll-driven, `IntersectionObserver` (framer-motion
`whileInView`), fires once.**

Proof: elements below the fold carry inline `style="opacity: 0; transform:
translateX(30px)"` and are cleared to `opacity: 1; transform: none` once
scrolled into view. Mid-flight values were captured (e.g.
`translateX(-4.60642px)`, `translateY(-2.34814px)`) confirming a spring/eased
tween rather than a discrete class swap.

Offsets observed, by element:

| Offset from | Used by |
|---|---|
| `translateY(30px)` | generic section content (fade-up, the default) |
| `translateY(-30px)` | the big day numeral "25" |
| `translateX(30px)` | "tháng 07" (left chip), album subtitle |
| `translateX(-30px)` | "năm 2026" (right chip) |
| `translateX(-50px)` | album heading "Khoảnh Khắc" |
| `translateX(50px)` | album subtitle "Của Chúng Tôi" |
| `translateX(-20px)` | "SAVE the DATE" row |
| `translateX(40px)` | the date "25.07.2026" |
| `translateY(-20px)` | guest name "Bạn" |
| `scaleX(0)` | the rule under the guest name (draws outward) |
| `translateX(±15px)` | the two ♥ divider rules |

Timeline cards stagger: sampled mid-scroll the 5th card was at
`translateX(-4.6px)` while the 6th was at `translateX(-29.3px)` — a per-index
delay of roughly 0.1 s.

**Reproduced in `src/components/Reveal.tsx`** — `IntersectionObserver` at
`threshold: 0.15`, `rootMargin: "0px 0px -40px 0px"`, transition
`0.7s cubic-bezier(0.16, 1, 0.3, 1)` (the site's `--transition-silk`), and
respects `prefers-reduced-motion`. Props: `from`, `distance` (default 30),
`delay`, `duration`, `once`.

### Fire-once vs. re-triggering — the target does BOTH

Verified empirically: scroll the whole page, return to the top, then read every
element's computed `opacity`/`transform`. Elements that reset to their offset
state use a bare framer-motion `whileInView`; the rest use
`viewport={{ once: true }}`.

| Re-triggers (`once={false}`) | Fires once (`once` default) |
|---|---|
| SaveTheDate "SAVE the DATE" (X −20) and "25.07.2026" (X +40) | Hero (all) |
| Both `WeddingDayBlock`s — "tháng 07" (X +30), "25" (Y −30), "năm 2026" (X −30) | Families columns |
| Invitation "Bạn" (Y −20) and its `scaleX(0→1)` rule | LoveStory portraits + captions |
| Album title block — "Khoảnh Khắc" (X −50), "Của Chúng Tôi" (X +50), ♥ (Y −20), the two ♥ rules (X ∓15) | Timeline cards (staggered 0.1 s) |
| | Album caption "Lưu giữ…" |

Getting this wrong is invisible on a first downward scroll and only shows when
the user scrolls back up and down again.

**Note on `will-change`:** it is applied only while an element still has
animation work pending. Leaving it set permanently promotes the element to its
own compositing layer, which changes subpixel text antialiasing and was worth
~1 500 differing pixels per section in the QA diff.

## 3. Ambient / continuous animations

| Name | Where | Definition |
|---|---|---|
| `petal-fall` | 30 fixed SVG petals behind `main` | `translateY(-10vh)→110vh`, `translateX(0)→50px`, `rotate(0→360deg)`, opacity `0→.8→.8→0` at 0/10/90/100 %. Each petal gets a random `left: %`, `animation-delay: 0–8 s`, `animation-duration: 12–19 s`, `opacity: .4–.73`, and size scaled from a 20×26 viewBox (≈9–20 px wide). Colour `hsl(340 70% 80%)`. |
| `float` | decorative florals | `translateY(0→-15px)` + `rotate(0→2deg)`, 6 s ease-in-out infinite |
| `fade-in` | generic | opacity 0→1, 1.5 s ease both |
| `fade-up` | generic | opacity 0→1 + `translateY(30px)→0`, 1 s `--transition-silk` both |
| `shimmer` | gold gradient text | `background-position: -200% → 200% center` |
| `pulse` | music-toggle icon | Tailwind default, 2 s |

## 4. The countdown

**Interaction model: time-driven**, ticking once per second toward
`2026-07-25T09:00:00+07:00`.

At capture time (2026-07-29, i.e. *after* the wedding) every unit read `00` —
the timer clamps at zero rather than going negative. A correct clone must clamp
the same way.

Each unit is `bg-white/80 backdrop-blur shadow-card border border-primary`,
`aspect-[16/17]`, with the digits in `font-serif text-[40px] text-[#9a6a2d]
tabular-nums min-w-[68px]`, and the label below in
`text-[14px] uppercase tracking-[0.1em] text-primary`.

## 5. Click / hover interactions

| Element | Behaviour |
|---|---|
| Wax seal (cover) | Opens the invitation. One-shot. |
| Music toggle | Toggles `<audio>` play/pause. `hover:scale-110` with `transition-transform`. Icon swaps Volume2 ⇄ muted. |
| Venue map | A `bg-black/35` shield sits over the `<iframe>` (which has `pointer-events: none`). Clicking the shield is what enables/opens the map — the iframe is inert until then. |
| Album photos | Every photo is a `cursor-zoom-in` button with `aria-label="Xem ảnh: Ảnh album"` → opens a lightbox. |
| Couple portraits (love story) | Buttons labelled `Xem ảnh Chú rể lớn` / `Xem ảnh Cô dâu lớn` → lightbox. |
| RSVP party-size / guest-of chips | Selected: `bg-primary text-primary-foreground border-primary shadow-soft`. Unselected: `bg-white/60 border-blush-200 hover:border-primary/50`. `transition-all`. |
| RSVP radio group | Radix radio group; default selection is **yes**. |
| Buttons (gift / submit) | `transition-colors`; gift is outlined (`bg-white hover:bg-primary/20`), submit is solid (`bg-primary hover:bg-primary/90`). |

## 6. Responsive behaviour

The layout is a fixed **480 px max-width column**, so "responsive" means what
happens *inside* that column. Custom breakpoints (from the target's Tailwind
config, confirmed in the compiled CSS):

- `mobileM` = **375 px**
- `mobileL` = **425 px**
- `sm` = 640 px, `md` = 768 px (Tailwind defaults)

| Viewport | Column width | What changes |
|---|---|---|
| 390 px | 390 px (fills) | `mobileM` active. Base paddings `px-4`; countdown row `scale-[0.8]`; polaroid `scale-[0.8]` |
| 768 px | 480 px (capped, centred) | `mobileL` + `sm` active. `px-6`, `pt-20`; countdown `scale-[1]`; polaroid `scale-[1] mt-16` |
| 1440 px | 480 px (capped, centred) | Identical to 768 px inside the column; only the surrounding background area grows |

Per-element responsive steps worth noting:

- Hero photo focal point: `object-[35%_center]` → `mobileM:object-[40%_center]`
  → `mobileL:object-[50%_center]`
- Hero title: `text-5xl mobileM:text-6xl mobileL:text-7xl`
- Family names: `text-[12px] mobileM:text-[13px] mobileL:text-base`
- Album tall photo: `h-[200px] mobileL:h-[288px]`, and its object-position
  changes from `calc(50%-3px) calc(50%+25px)` to `calc(50%-3px) center`
- Album mosaic: `col-span-12 mobileL:col-span-9` / `col-span-12 mobileL:col-span-3`
  — i.e. the last row stacks below 425 px and goes side-by-side above it

## 7. Things that are NOT happening (checked and ruled out)

- **No smooth-scroll library.** No `.lenis`, no Locomotive, no custom scroll
  container. Native scrolling with `scroll-behavior: smooth`.
- **No scroll-snap** anywhere (`scroll-snap-type: none` on every container).
- **No sticky/shrinking header** — there is no header at all.
- **No tabs, accordions, or carousels** in the main flow.
- **No parallax** — no element moves at a rate different from the scroll.
- **No dark mode** — the target ships a single light theme.
