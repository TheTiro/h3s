import type { Metadata } from "next";
import Link from "next/link";
import { SITE_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}.`,
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        <p>Last updated: 18 September 2026</p>
        <p>
          This Privacy Policy explains how {SITE_NAME} (“we”, “us”) handles personal information
          when you visit this website or send a message through the contact form.
        </p>

        <h2>Information you may provide</h2>
        <p>
          If you use the contact form, we collect the name, email address, optional telephone
          number, and message you submit. We use this only to reply to your enquiry. We do not
          sell this data.
        </p>
        <p>
          Messages are sent to {SITE_EMAIL}. If you want a record removed, write to that address
          or use the contact form.
        </p>

        <h2>Security and spam protection</h2>
        <p>
          The contact form is protected by Google reCAPTCHA. Google may process a security token
          and limited technical data to tell automated traffic apart from real visitors. That
          processing is subject to Google’s own privacy terms.
        </p>
        <p>
          Our hosting or security providers may also process limited technical request metadata
          (for example an IP address) to keep the site available and to prevent abuse.
        </p>

        <h2>Cookies</h2>
        <p>
          We use essential cookies so the site can work, including spam protection on the contact
          form. We do not use advertising or analytics cookies. Details are in our{" "}
          <Link href="/cookie-policy" className="font-semibold text-accent hover:underline">
            Cookie Policy
          </Link>
          .
        </p>

        <h2>How we use information</h2>
        <ul>
          <li>To respond to studio and project enquiries sent through the contact form.</li>
          <li>To operate and secure the website.</li>
          <li>To comply with legal obligations where applicable.</li>
        </ul>
      </div>
    </div>
  );
}
