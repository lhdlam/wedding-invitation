"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { CircleIcon } from "@/components/icons";
import type { RsvpAttendance, RsvpFormState } from "@/types/invitation";
import { cn } from "@/lib/utils";

const PARTY_SIZES = ["1 người", "2 người", "3 người", "4 người"] as const;

const GUEST_OF = ["Khách mời cô dâu", "Khách mời chú rể"] as const;

const ATTENDANCE_OPTIONS: readonly {
  value: RsvpAttendance;
  label: string;
}[] = [
  { value: "yes", label: "Mình chắc chắn sẽ đến" },
  { value: "no", label: "Xin lỗi mình bận rồi!" },
];

const INITIAL_STATE: RsvpFormState = {
  name: "",
  attendance: "yes",
  partySize: PARTY_SIZES[0],
  guestOf: GUEST_OF[0],
  message: "",
};

/** Shared base for every selectable chip in the form. */
const CHIP_BASE = "py-3 rounded-lg border transition-all font-lora";
const CHIP_SELECTED =
  "bg-primary text-primary-foreground border-primary shadow-soft";
const CHIP_UNSELECTED =
  "bg-[#fbf8f1]/65 border-blush-200 hover:border-primary/50";

const FIELD_LABEL =
  "font-lora font-medium text-xs uppercase tracking-widest text-muted-foreground";

/** Apps Script web-app URL — see docs/GOOGLE_SHEET_SETUP.md. */
const WEBHOOK_URL = process.env.NEXT_PUBLIC_RSVP_WEBHOOK_URL;

/**
 * RSVP form: name, attendance radio group, party size, guest-of and a message.
 * On submit the answers are POSTed to a Google Apps Script web app that appends
 * them to a Sheet; without a configured URL the form still confirms locally.
 */
export function RsvpSection() {
  const [form, setForm] = useState<RsvpFormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form.name.trim() === "" || sending) return;

    if (!WEBHOOK_URL) {
      setSubmitted(true);
      return;
    }

    setSending(true);
    setError(false);
    try {
      // Apps Script redirects to a googleusercontent.com origin that sends no
      // CORS headers, so the response is opaque — a resolved fetch is our only
      // success signal. text/plain keeps the request preflight-free.
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ ...form, name: form.name.trim() }),
      });
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  function handleRadioKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown";
    const backward = e.key === "ArrowLeft" || e.key === "ArrowUp";
    if (!forward && !backward) return;
    e.preventDefault();
    const next =
      (index + (forward ? 1 : -1) + ATTENDANCE_OPTIONS.length) %
      ATTENDANCE_OPTIONS.length;
    setForm((prev) => ({ ...prev, attendance: ATTENDANCE_OPTIONS[next].value }));
    radioRefs.current[next]?.focus();
  }

  return (
    <section className="relative px-4 pt-10 pb-4 mobilem:px-5 mobilel:px-6 mobilel:pt-12">
      <div className="text-center mb-10">
        <p className="mb-3 text-[16px] mobilel:text-[18px] uppercase tracking-[4px] text-wine font-bold">
          Gửi lời nhắn &amp; xác nhận
        </p>
        <p className="text-muted-foreground font-lora text-[17px] mt-2">
          Hãy xác nhận sự có mặt của bạn để chúng mình chuẩn bị đón tiếp một cách
          chu đáo nhất.
        </p>
      </div>

      {submitted ? (
        <p className="max-w-md mx-auto text-center font-lora text-[17px] text-foreground/80">
          Cảm ơn {form.name.trim()}! Chúng mình đã nhận được xác nhận của bạn.
        </p>
      ) : (
        <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit} noValidate>
          <div>
            <label className={FIELD_LABEL} htmlFor="name">
              Tên của bạn <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              maxLength={80}
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
              className="flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-lora mt-2 border-blush-200 focus:border-primary bg-[#fbf8f1]"
            />
          </div>

          <div>
            <label className={FIELD_LABEL}>Bạn sẽ đến chứ?</label>
            <div
              role="radiogroup"
              aria-label="Bạn sẽ đến chứ?"
              className="grid gap-2 mt-3 space-y-2"
            >
              {ATTENDANCE_OPTIONS.map((option, index) => {
                const checked = form.attendance === option.value;
                return (
                  <div
                    key={option.value}
                    className="flex items-center px-3 rounded-lg bg-[#fbf8f1]/65 border border-blush-200"
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={checked}
                      data-state={checked ? "checked" : "unchecked"}
                      value={option.value}
                      id={option.value}
                      tabIndex={checked ? 0 : -1}
                      ref={(node) => {
                        radioRefs.current[index] = node;
                      }}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, attendance: option.value }))
                      }
                      onKeyDown={(e) => handleRadioKeyDown(e, index)}
                      className="aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {checked ? (
                        <span className="flex items-center justify-center">
                          <CircleIcon className="h-2.5 w-2.5 fill-current text-current" />
                        </span>
                      ) : null}
                    </button>
                    <label
                      className="text-sm leading-none font-lora cursor-pointer font-normal p-3 flex-grow"
                      htmlFor={option.value}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, attendance: option.value }))
                      }
                    >
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL}>Bạn tham dự cùng ai?</label>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {PARTY_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={form.partySize === size}
                  onClick={() => setForm((prev) => ({ ...prev, partySize: size }))}
                  className={cn(
                    CHIP_BASE,
                    form.partySize === size ? CHIP_SELECTED : CHIP_UNSELECTED,
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL}>Bạn là khách mời của ai?</label>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {GUEST_OF.map((who) => (
                <button
                  key={who}
                  type="button"
                  aria-pressed={form.guestOf === who}
                  onClick={() => setForm((prev) => ({ ...prev, guestOf: who }))}
                  className={cn(
                    "font-lora py-3 rounded-lg border transition-all text-sm",
                    form.guestOf === who ? CHIP_SELECTED : CHIP_UNSELECTED,
                  )}
                >
                  {who}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={FIELD_LABEL} htmlFor="msg">
              Lời nhắn gửi cô dâu chú rể
            </label>
            <textarea
              id="msg"
              name="message"
              maxLength={500}
              placeholder="Chúc mừng hai bạn..."
              value={form.message}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, message: e.target.value }))
              }
              className="flex w-full rounded-md border px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 font-lora mt-2 bg-[#fbf8f1]/80 border-blush-200 focus:border-primary min-h-[100px]"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 font-lora w-full bg-wine hover:bg-wine/90 text-white tracking-widest uppercase text-sm py-6 shadow-soft"
          >
            {sending ? "Đang gửi..." : "Gửi xác nhận"}
          </button>

          {error ? (
            <p
              role="alert"
              className="text-center font-lora text-sm text-red-600"
            >
              Gửi không thành công, bạn thử lại giúp mình nhé.
            </p>
          ) : null}
        </form>
      )}
    </section>
  );
}
