"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { RecaptchaNotice } from "@/components/RecaptchaNotice";
import { useRecaptchaForm } from "@/hooks/useRecaptcha";
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
} from "@/lib/site";

const inputClass =
  "w-full border border-border bg-surface-soft px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent disabled:opacity-60";

export function ContactForm() {
  const { getToken } = useRecaptchaForm("contact");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const form = e.currentTarget;
    const fd = new FormData(form);

    setPending(true);
    try {
      let recaptchaToken: string | null = null;
      try {
        recaptchaToken = await getToken();
      } catch {
        setError("Security check failed. Please refresh the page and try again.");
        return;
      }

      const payload = {
        fullName: String(fd.get("fullName") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        message: String(fd.get("message") ?? ""),
        privacyConsent: fd.get("privacyConsent") === "on",
        website: String(fd.get("website") ?? ""),
        recaptchaToken,
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again later.");
        return;
      }
      setSuccess(true);
      form.reset();
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative grid gap-5 border border-border bg-surface p-6"
      aria-label="Contact form"
      noValidate
    >
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Field label="Full name" name="fullName" required disabled={pending} />
      <Field label="Email address" name="email" type="email" required disabled={pending} />
      <Field label="Telephone number" name="phone" type="tel" disabled={pending} />

      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="text-xs font-medium uppercase tracking-[0.16em]">
          Message
          <span className="text-error"> *</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={CONTACT_MESSAGE_MIN_LENGTH}
          maxLength={CONTACT_MESSAGE_MAX_LENGTH}
          disabled={pending}
          rows={6}
          className={`${inputClass} resize-y`}
          placeholder={`Minimum ${CONTACT_MESSAGE_MIN_LENGTH} characters`}
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-muted">
        <input
          type="checkbox"
          name="privacyConsent"
          required
          disabled={pending}
          className="mt-1 size-4 shrink-0 accent-[#e8ff3d]"
        />
        <span>
          I agree to the{" "}
          <Link href="/privacy-policy" className="font-semibold text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>

      {error ? (
        <p className="text-sm font-semibold text-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-sm font-semibold text-accent" role="status">
          Thank you — your message has been sent. We will get back to you soon.
        </p>
      ) : null}
      <RecaptchaNotice />
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-[0.16em]">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className={inputClass}
      />
    </div>
  );
}
