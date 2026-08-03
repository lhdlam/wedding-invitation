# RsvpSection + GiftSection + ThankYouSection Specification

## Overview
- **Target files:** `src/components/RsvpSection.tsx`, `src/components/GiftSection.tsx`, `src/components/ThankYouSection.tsx`
- **Screenshots:** `docs/design-references/desktop-section-09.png`, `desktop-section-10.png`, `desktop-section-11.png`
- **Interaction model:** RsvpSection = click-driven form state; the other two static

---

## A. `RsvpSection` — verbatim DOM

```html
<section class="relative px-4 pt-16 pb-4 mobileM:px-5 mobileL:px-6 mobileL:pt-20">
  <div class="text-center mb-10">
    <p class="mb-3 text-[16px] mobileL:text-[18px] uppercase tracking-[4px] text-[#b07b73] font-bold">Gửi lời nhắn &amp; xác nhận</p>
    <p class="text-muted-foreground font-lora text-[17px] mt-2">Hãy xác nhận sự có mặt của bạn để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất.</p>
  </div>

  <form class="space-y-6 max-w-md mx-auto">

    <!-- 1. NAME -->
    <div>
      <label class="font-lora font-medium text-xs uppercase tracking-widest text-muted-foreground" for="name">
        Tên của bạn <span class="text-red-500">*</span>
      </label>
      <input id="name" maxlength="80"
             class="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-lora mt-2 border-blush-200 focus:border-primary bg-white">
    </div>

    <!-- 2. ATTENDANCE (radio group, default = yes) -->
    <div>
      <label class="font-lora font-medium text-xs uppercase tracking-widest text-muted-foreground">Bạn sẽ đến chứ?</label>
      <div role="radiogroup" class="grid gap-2 mt-3 space-y-2">
        <div class="flex items-center px-3 rounded-lg bg-white/60 border border-blush-200">
          <button role="radio" aria-checked="true" data-state="checked" value="yes" id="yes"
                  class="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <span class="flex items-center justify-center">
              <svg class="lucide lucide-circle h-2.5 w-2.5 fill-current text-current"><circle cx="12" cy="12" r="10"/></svg>
            </span>
          </button>
          <label class="text-sm leading-none font-lora cursor-pointer font-normal p-3 flex-grow" for="yes">Mình chắc chắn sẽ đến</label>
        </div>
        <!-- second row: value="no", id="no", label "Xin lỗi mình bận rồi!" -->
      </div>
    </div>

    <!-- 3. PARTY SIZE (4-up, default = "1 người") -->
    <div>
      <label class="font-lora font-medium text-xs uppercase tracking-widest text-muted-foreground">Bạn tham dự cùng ai?</label>
      <div class="mt-3 grid grid-cols-4 gap-2">
        <button type="button" class="py-3 rounded-lg border transition-all font-lora bg-primary text-primary-foreground border-primary shadow-soft">1 người</button>
        <button type="button" class="py-3 rounded-lg border transition-all font-lora bg-white/60 border-blush-200 hover:border-primary/50">2 người</button>
        <!-- 3 người, 4 người -->
      </div>
    </div>

    <!-- 4. GUEST OF (2-up, default = "Khách mời cô dâu") -->
    <div>
      <label class="font-lora font-medium text-xs uppercase tracking-widest text-muted-foreground">Bạn là khách mời của ai?</label>
      <div class="mt-3 grid grid-cols-2 gap-2">
        <button type="button" class="font-lora py-3 rounded-lg border transition-all text-sm bg-primary text-primary-foreground border-primary shadow-soft">Khách mời cô dâu</button>
        <button type="button" class="font-lora py-3 rounded-lg border transition-all text-sm bg-white/60 border-blush-200 hover:border-primary/50">Khách mời chú rể</button>
      </div>
    </div>

    <!-- 5. MESSAGE -->
    <div>
      <label class="font-lora font-medium text-xs uppercase tracking-widest text-muted-foreground" for="msg">Lời nhắn gửi cô dâu chú rể</label>
      <textarea id="msg" maxlength="500" placeholder="Chúc mừng hai bạn..."
                class="flex w-full rounded-md border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 font-lora mt-2 bg-white/70 border-blush-200 focus:border-primary min-h-[100px]"></textarea>
    </div>

    <!-- 6. SUBMIT -->
    <button type="submit"
            class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 font-lora w-full bg-primary hover:bg-primary/90 text-primary-foreground tracking-widest uppercase text-sm py-6 shadow-soft">
      Gửi xác nhận
    </button>
  </form>
</section>
```

### Selection states — exact classes

**Selected chip:** `bg-primary text-primary-foreground border-primary shadow-soft`
**Unselected chip:** `bg-white/60 border-blush-200 hover:border-primary/50`
Both always carry `py-3 rounded-lg border transition-all font-lora`
(the guest-of pair adds `text-sm`).

**Defaults on load:** attendance = `yes`, party size = `1 người`,
guest-of = `Khách mời cô dâu`.

### Behaviour
- All state is local React state — type it with `RsvpFormState` from
  `@/types/invitation`.
- Out of scope per the clone brief: there is **no real backend**. `onSubmit`
  must call `e.preventDefault()` and show a simple inline success message
  (e.g. swap the form for a thank-you line). Do not post anywhere.
- The radio group on the target is Radix; a plain accessible custom radio group
  is fine as long as the markup keeps `role="radiogroup"`, `role="radio"` and
  `aria-checked`, and arrow keys move between options.
- Name is the only required field (`*`); block submit when empty.
- `maxlength`: name 80, message 500.

---

## B. `GiftSection` — verbatim DOM

```html
<section class="mobileL:px-6 relative px-6 pt-0 mobileL:pt-0 pb-20 text-center">
  <button type="button"
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 font-lora w-full bg-white hover:bg-primary/20 text-primary border border-primary tracking-widest uppercase text-sm py-6 shadow-soft">
    Gửi quà mừng cưới
  </button>
</section>
```

- Outlined counterpart to the RSVP submit button: white fill,
  `hover:bg-primary/20`, `border border-primary`.
- Note `h-10 … py-6` together — the vertical padding wins, giving a ~62 px tall
  button. Keep both classes.
- The target's click handler opens a gift/bank-details modal that could not be
  sampled. Render the button and wire an optional `onClick` prop; do not invent
  bank details.

---

## C. `ThankYouSection` — verbatim DOM

```html
<section class="mobileL:px-6 mobileL:pt-20 relative px-6 py-24 text-center bg-white/60">
  <h2 class="font-flavinda text-6xl text-primary mb-6 font-bold">Thank you</h2>

  <!-- <SectionDivider /> -->
  <div class="flex items-center justify-center gap-4 my-8">
    <span class="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-gold/60"></span>
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" class="text-gold">…</svg>
    <span class="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-gold/60"></span>
  </div>

  <p class="font-lora text-foreground/75 leading-loose mt-6">
    Cảm ơn bạn đã dành tình cảm cho chúng mình!<br>Sự hiện diện của bạn chính là món quà ý nghĩa nhất.
  </p>
</section>
```

Use `SectionDivider` from `@/components/icons`.

---

## Responsive Behaviour
- **< 375 px:** RSVP `px-4`, eyebrow `text-[16px]`
- **≥ 375 px (`mobileM`):** RSVP `px-5`
- **≥ 425 px (`mobileL`):** `px-6`, RSVP `pt-20`, eyebrow `text-[18px]`
- **≥ 640 px (`sm`):** divider rules widen `w-16 → w-24`
- **≥ 768 px (`md`):** name input font drops to `text-sm`
- Column capped at 480 px — identical at 768 px and 1440 px.

## Assets
- `SectionDivider`, `CircleIcon` from `@/components/icons`
- No images

## Text Content (verbatim)
`Gửi lời nhắn & xác nhận` ·
`Hãy xác nhận sự có mặt của bạn để chúng mình chuẩn bị đón tiếp một cách chu đáo nhất.` ·
`Tên của bạn *` · `Bạn sẽ đến chứ?` · `Mình chắc chắn sẽ đến` · `Xin lỗi mình bận rồi!` ·
`Bạn tham dự cùng ai?` · `1 người` `2 người` `3 người` `4 người` ·
`Bạn là khách mời của ai?` · `Khách mời cô dâu` · `Khách mời chú rể` ·
`Lời nhắn gửi cô dâu chú rể` · placeholder `Chúc mừng hai bạn...` · `Gửi xác nhận` ·
`Gửi quà mừng cưới` · `Thank you` ·
`Cảm ơn bạn đã dành tình cảm cho chúng mình!` / `Sự hiện diện của bạn chính là món quà ý nghĩa nhất.`
