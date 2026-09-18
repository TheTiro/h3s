import { SITE_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-6 text-sm leading-relaxed text-muted">
        {SITE_NAME} uses the contact form to receive enquiries. We collect the
        name, email, optional telephone number, and message you submit, plus a
        reCAPTCHA token used only to reduce spam. We do not sell this data.
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        Messages are sent to {SITE_EMAIL}. If you want a record removed, write
        to that address.
      </p>
    </div>
  );
}
