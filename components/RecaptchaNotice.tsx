"use client";

import { isRecaptchaEnabled } from "@/hooks/useRecaptcha";

export function RecaptchaNotice({ className = "" }: { className?: string }) {
  if (!isRecaptchaEnabled()) return null;

  return (
    <p className={`text-xs text-muted ${className}`.trim()}>
      This site is protected by reCAPTCHA and the Google{" "}
      <a
        href="https://policies.google.com/privacy"
        className="font-semibold text-accent hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>{" "}
      and{" "}
      <a
        href="https://policies.google.com/terms"
        className="font-semibold text-accent hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        Terms of Service
      </a>{" "}
      apply.
    </p>
  );
}
