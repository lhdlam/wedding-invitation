# Visual QA Report

Method: the clone (`next start`, production build) and the live target were
driven side by side with Playwright/Chrome. For each of the 13 top-level blocks
in `main` the page was scroll-swept (so one-shot reveals fired), the block was
scrolled into view, given 3 s to settle, and screenshotted; the pairs were then
compared with `pixelmatch` at `threshold: 0.12`.

The two non-deterministic ambient layers — the randomly-seeded falling petals
and the live Google Maps iframe, whose tiles differ between loads — are hidden
during the comparison so the diff measures layout and typography only.

## Final result

| Block | Component | 1440 px | 390 px |
|---|---|---|---|
| 1 | HeroSection | **0.00 %** | **0.00 %** |
| 2 | SaveTheDateSection | 0.07 % | 0.09 % |
| 3 | PhotoBreak | **0.00 %** | **0.00 %** |
| 4 | FamiliesSection | 0.02 % | 0.13 % |
| 5 | InvitationSection | 0.07 % | 0.25 % |
| 6 | VenueSection | **0.00 %** | **0.00 %** |
| 7 | CountdownSection | **0.00 %** | **0.00 %** |
| 8 | LoveStorySection | **0.00 %** | **0.00 %** |
| 9 | TimelineSection | **0.00 %** | 0.01 % |
| 10 | AlbumSection | **0.00 %** (3 px) | **0.00 %** (2 px) |
| 11 | RsvpSection | **0.00 %** | **0.00 %** |
| 12 | GiftSection | **0.00 %** | **0.00 %** |
| 13 | ThankYouSection | **0.00 %** | **0.00 %** |
| | **mean** | **0.01 %** | **0.04 %** |

Every block's rendered width and height matches the target exactly at both
viewports, and the total document height is identical (**9 750 px** at 1440×900).

The sub-0.1 % residuals are confined to the four blocks containing
**re-triggering** reveals, where `will-change` legitimately stays set (those
elements really do re-animate), which shifts subpixel text antialiasing.

## Structural parity

Block offsets and heights, original → clone, at 1440×900 — all 13 identical:

```
1  [0…900]      2  [900…2125]   3  [2125…2495]  4  [2507…3413]
5  [3413…3886]  6  [3886…4355]  7  [4355…4748]  8  [4748…5533]
9  [5533…6548] 10  [6548…8338] 11  [8338…9236] 12  [9236…9366]
13 [9366…9750]
```

A text-keyed computed-style diff (each text node matched by its content, then
compared on position, size, font, weight, tracking, colour and transform)
reports **99 nodes matching exactly**. The only reported differences are
representational, not visual:

- Tailwind v4 emits `oklab(…)` for alpha-modified colours where the target
  emits `rgba(…)` — the same rendered colour.
- Image keys differ because the target serves content-hashed filenames
  (`icon-and-CRbyywXf.png`) and the clone serves clean ones.
- Whitespace normalisation around inline `<span>`s (`"9:00 , Thứ Bảy"` vs
  `"9:00, Thứ Bảy"`).

## Functional checks (390 × 844) — 19/19 pass, zero console errors

Scroll locked behind the cover · cover present · cover unmounts on open ·
scroll unlocks · document scrollable · music toggle present · playback toggles ·
countdown renders 4 units · countdown clamps at `00` · map shield present ·
map activates on click · lightbox opens · lightbox locks body scroll ·
closes on Escape · body scroll restored · party-size chip selects ·
radio switches · submit blocked when name empty · submit succeeds with a name.

## Defects found and fixed during QA

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 1 | "THE DATE" on the cover sat 40 px too high | `leading-1` is inert in Tailwind 3 (line-height stayed 60 px) but resolves to the **4 px** spacing step in v4 | Pinned `leading-[60px]` |
| 2 | Every element without an explicit font class used the wrong face | Target's `body` inherits **Ergisa**; the scaffold defaulted to Lora | Set the body stack to Ergisa |
| 3 | All `h2` headings lacked the target's 0.02em tracking; the album heading used the wrong family | Missed the target's global `h1,h2,h3,h4 { font-family: Lora; font-weight: 400; letter-spacing: .02em }` | Added the rule verbatim |
| 4 | The ♥ glyph rendered 10.5 px wide instead of 15.1 px | `next/font/local` injects a metric-adjusted `"ergisa Fallback"` into the stack, so glyphs missing from Ergisa fell to it rather than `system-ui` | `adjustFontFallback: false` on all seven faces |
| 5 | Wax seal and cursor hint sat ~50 px up-left of the target | The target's framer-motion writes an inline `transform`, which **overrides** the Tailwind `-translate-x-1/2 -translate-y-1/2` | Removed those utilities on both buttons |
| 6 | Photo blocks differed by up to 8.5 % of pixels | `next/image` re-encoded assets that the target already serves pre-resized and optimised | `unoptimized` on those images |
| 7 | Floral overlay rendered 360 px wide instead of 320 px | A builder added `max-w-none`, defeating preflight's `img { max-width: 100% }` which caps it to the 320 px container | Removed `max-w-none` |
| 8 | Family columns sat 48 px low; every line shifted 2 px | In Tailwind 3 the parent's `space-y-1` (4 px) outranked the address's `mt-2`; **v4 flips that precedence** so `mt-2` (8 px) won, making the column 4 px taller | Dropped the inert `mt-2` |
| 9 | First address line in Venue was horizontally offset | JSX strips the newline between `<MapPinIcon />` and `<span>`; the target has a literal space | Added `{" "}` |
| 10 | Reveals never replayed | The target uses a bare `whileInView` (re-triggering) for ~14 elements and `once: true` for the rest | Added `once` to `Reveal`; set `once={false}` where verified |
| 11 | ~1 500 px/section of text antialiasing noise | `will-change` left set permanently promoted elements to their own compositing layer | Applied only while animation is pending |

## Known limitations

- **`PhotoLightbox` is inferred, not extracted.** The target's viewer mounts
  outside the captured DOM, so it is a faithful-but-conventional implementation
  (backdrop, Escape, scroll lock). It is the one component not built from
  measured values.
- **The gift modal is not implemented.** `GiftSection` renders the button and
  accepts an `onClick`; the target's bank-details modal could not be sampled and
  was not invented.
- **No RSVP backend** — out of scope per the clone brief. The form validates and
  shows an inline success state without posting.
- **The audio track is randomised per load on the target** (`bai8.mp3`,
  `bai61.mp3`, …). One track is pinned in the clone.
- **Petal positions never match** — they are randomly seeded on both sides.
- **The `/invitation/bride` variant was not cloned**; only the requested
  `groom` route.
