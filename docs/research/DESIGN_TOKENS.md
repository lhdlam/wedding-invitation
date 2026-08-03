# Design Tokens — tuannhu-savewithlove.io.vn/invitation/groom

All values lifted verbatim from the target's compiled stylesheet
(`/assets/index-s896bNpd.css`) and from `getComputedStyle()` sampling.
Mirrored into `src/app/globals.css`.

## Colour

The target stores colours as **bare HSL triplets** and wraps them in `hsl()` at
use site (the shadcn/ui convention). Kept identical in the clone.

| Token | HSL | Approx. hex | Used for |
|---|---|---|---|
| `--background` | `30 40% 97%` | `#faf7f4` | Page + section background |
| `--foreground` | `25 25% 20%` | `#403126` | Body text |
| `--card` | `0 0% 100%` | `#ffffff` | Cards |
| `--primary` | `33 59% 35%` | `#8e5f25` | Headings, names, borders — the bronze |
| `--primary-foreground` | `30 40% 98%` | `#fcfaf8` | Text on bronze |
| `--secondary` | `350 60% 94%` | `#fae8ec` | Soft pink fills |
| `--secondary-foreground` | `340 40% 35%` | `#7d3654` | Text on pink |
| `--muted` | `30 25% 93%` | `#f0ebe6` | Muted fills |
| `--muted-foreground` | `25 15% 45%` | `#847062` | Secondary copy |
| `--accent` | `280 30% 75%` | `#c1a8cf` | Accent (barely used) |
| `--destructive` | `0 70% 55%` | `#d93b3b` | Required-field asterisk |
| `--border` | `340 25% 88%` | `#e8d9de` | Default borders (most common colour on the page) |
| `--input` | `340 25% 90%` | `#ecdfe3` | Input borders |
| `--ring` | `33 59% 35%` | `#8e5f25` | Focus rings |
| `--gold` | `38 45% 55%` | `#c09a59` | Dividers, "and", ornaments |
| `--gold-light` | `42 55% 75%` | `#e3ca94` | Gradient top stop |
| `--blush-50` | `350 80% 98%` | `#fef7f8` | — |
| `--blush-100` | `350 70% 95%` | `#fce9ec` | — |
| `--blush-200` | `350 60% 90%` | `#f5d6db` | Card borders, chip borders |
| `--blush-300` | `340 55% 82%` | `#eab8c9` | Clock-circle gradient end |

### Literal hex values used inline (not tokenised on the target)

| Hex | Where |
|---|---|
| `#b07b73` | Every section eyebrow ("Thiệp mời", "Timeline of", …) |
| `#9a6a2d` | Countdown digits |
| `#2d2b2b` | Album heading "Khoảnh Khắc" |
| `#b56e67` | Album subtitle "Của Chúng Tôi" + ♥ |
| `#d8c4bb` | Album ♥ divider rules |
| `#67615d` | Album caption |
| `#8b5e20` | Save-the-date brown slab + photo backing |
| `#f7f0e3` `#eadfca` `#d8c7a3` | Cover left-flap gradient |
| `#f6eedf` `#e6d7b8` `#d3bb8a` | Cover right-flap gradient |

### Gradients

```
--gradient-romance: linear-gradient(135deg, hsl(350 80% 98%) 0%, hsl(340 60% 92%) 50%, hsl(280 40% 90%) 100%)
--gradient-veil:    linear-gradient(180deg, hsl(0 0% 100% / 0) 0%, hsl(350 70% 95% / .4) 60%, hsl(350 70% 95%) 100%)
--gradient-gold:    linear-gradient(135deg, hsl(42 55% 75%) 0%, hsl(38 45% 55%) 100%)
```

Plus two used inline: the hero scrim
`linear-gradient(to bottom, rgba(0,0,0,.2), transparent, rgba(0,0,0,.8))` and
the divider rules `linear-gradient(to right|left, transparent, rgba(192,154,89,.6))`.

## Typography

Seven self-hosted faces, all `font-display: block`, all mirrored to
`public/fonts/` and loaded via `next/font/local`.

| Family | File | Weight | Role |
|---|---|---|---|
| **Lora** | `lora-regular.ttf` | 400 (300/500/700 synthesised) | Body, names, dates — the workhorse |
| **Ergisa** | `ergisa-regular.otf` | 400 | Hero names, couple names |
| **Flavinda** | `flavinda.otf` | 400 | Script headings — "Wedding day", "Countdown", "and", "Thank you" |
| **Silenter** | `silenter.ttf` | 400 | Cover "Save" only |
| **Anisa** | `anisa.otf` | 400 | Guest name "Bạn", album subtitle |
| **Arcittya** | `arcittya-begatri.otf` | 400 | Declared; not observed in use |
| **Memv** | `memv.woff2` | 400 | Declared; not observed in use |

The address lines under each family deliberately use the **browser serif stack**
(`ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`), not Lora.

### Observed size scale (px)

`10 · 11 · 12 · 13 · 14 · 15 · 15.8 · 16 · 17 · 18 · 20 · 24 · 30 · 32 · 36 ·
38 · 39 · 40 · 45 · 50 · 52 · 60 · 80`

Many are arbitrary values (`text-[15.8px]`, `text-[39px]`) rather than Tailwind
steps — a sign the target was hand-tuned per breakpoint. They are reproduced
as arbitrary values in the clone.

### Letter spacing

`tracking-[0.1em]` (countdown labels) · `tracking-widest` (0.1em) ·
`tracking-[0.3em]` (hero date) · `tracking-[1px]` / `tracking-[2px]` (album caption) ·
`tracking-[4px]` (every section eyebrow) · `tracking-[5px]` (album heading)

## Spacing

Standard Tailwind 4 px scale. Section rhythm is
`py-16` at base → `mobileL:py-20`, with horizontal `px-4` → `mobileM:px-5` →
`mobileL:px-6`.

## Radii

| Token | Value | Used on |
|---|---|---|
| `--radius` | `0.75rem` (12 px) | base |
| `rounded-sm` | 2 px | album photos |
| `rounded-md` | 6 px | inputs, buttons |
| `rounded-lg` | 8 px | countdown cards, RSVP chips |
| `rounded-xl` | 12 px | timeline cards |
| `rounded-2xl` | 16 px | map card, portrait cards |
| `rounded-full` | — | clock circles, music toggle |

## Shadows

```
--shadow-soft:  0 10px 40px -15px hsl(340 35% 55% / .25)   /* buttons */
--shadow-petal: 0 20px 60px -20px hsl(340 50% 60% / .3)    /* the 480px column, music toggle */
--shadow-card:  0 4px 30px -8px  hsl(340 30% 50% / .15)    /* cards, map, portraits */
```

Plus one inline on the polaroid: `rgb(0,0,0) -2px 14px 12px -17px`.

## Motion

```
--transition-silk: cubic-bezier(.16, 1, .3, 1)
```

Keyframes `fade-in` (1.5s ease) · `fade-up` (1s silk) · `float` (6s ease-in-out
infinite) · `shimmer` (3s linear) · `petal-fall` (12–19s linear infinite).
Full definitions in `BEHAVIORS.md` and `globals.css`.

## Breakpoints

| Name | Min-width | Note |
|---|---|---|
| `mobileM` → **`mobilem`** in the clone | 375 px | custom |
| `mobileL` → **`mobilel`** in the clone | 425 px | custom |
| `sm` | 640 px | Tailwind default |
| `md` | 768 px | Tailwind default |

⚠️ The custom names are **lowercased in the clone** (`mobilem:` / `mobilel:`)
because Tailwind v4 derives variant names from case-sensitive CSS custom
properties. Verified generating correctly in the compiled output.

## Layout constant

`main` is `max-w-[480px] mx-auto` — the entire invitation is a fixed 480 px
column. This is the single most important layout fact about the site.
