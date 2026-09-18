import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie Policy for ${SITE_NAME}.`,
  alternates: { canonical: "/cookie-policy" },
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Cookie Policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        <p>Last updated: 18 September 2026</p>
        <p>
          This Cookie Policy explains how {SITE_NAME} uses cookies and similar technologies on
          this website.
        </p>

        <h2>What are cookies?</h2>
        <p>
          Cookies are small text files stored on your device when you visit a website. They can
          help a site function, remember a choice, or measure usage. Similar technologies include
          local storage in the browser.
        </p>

        <h2>How we use cookies</h2>
        <ul>
          <li>
            <strong className="text-foreground">Essential</strong> — only what is needed for the
            site to work. We do not run an account system or admin panel on this website, so we
            do not set session cookies for sign-in.
          </li>
          <li>
            <strong className="text-foreground">Security / anti-spam</strong> — Google reCAPTCHA
            may set cookies when you use the contact form, to reduce automated abuse.
          </li>
          <li>
            <strong className="text-foreground">Consent preference</strong> — your Accept or
            Decline choice is stored in local storage on your device, not as a tracking cookie.
          </li>
        </ul>
        <p>
          We do not use advertising, analytics, or social-media tracking cookies, and we do not
          sell browsing data.
        </p>

        <h2>Managing cookies</h2>
        <p>
          Most browsers let you block or delete cookies. Blocking essential or security cookies
          may affect the contact form. For Google technologies, see Google’s published
          explanations of cookies used by their services.
        </p>
        <p>
          Personal data from the contact form is described in our{" "}
          <Link href="/privacy-policy" className="font-semibold text-accent hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <h2>Updates</h2>
        <p>We may update this policy if the website’s features change.</p>
      </div>
    </div>
  );
}
