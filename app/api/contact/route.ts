import { NextResponse } from "next/server";
import {
  clientIp,
  contactRecipients,
  isHoneypotTripped,
  isRateLimited,
  isValidEmail,
} from "@/lib/form-spam-guard";
import { checkRecaptchaSubmission } from "@/lib/recaptcha";
import { sendMail } from "@/lib/mailer";
import {
  CONTACT_MESSAGE_MAX_LENGTH,
  CONTACT_MESSAGE_MIN_LENGTH,
} from "@/lib/site";

const GENERIC_OK = { success: true as const };
const GENERIC_ERR = "Something went wrong. Please try again later.";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const ip = clientIp(request);

    if (isHoneypotTripped(body)) {
      return NextResponse.json(GENERIC_OK);
    }

    const recaptcha = await checkRecaptchaSubmission(body, "contact", ip);
    if (recaptcha === "spam") {
      return NextResponse.json(GENERIC_OK);
    }
    if (recaptcha === "missing") {
      return NextResponse.json(
        { error: "Security check failed. Please refresh the page and try again." },
        { status: 400 }
      );
    }

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone =
      typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const privacyConsent = body.privacyConsent === true;

    if (!fullName || fullName.length > 150) {
      return NextResponse.json({ error: "Please enter your full name." }, { status: 400 });
    }
    if (!email || !isValidEmail(email) || email.length > 255) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone && phone.length > 50) {
      return NextResponse.json({ error: "Telephone number is too long." }, { status: 400 });
    }
    if (
      message.length < CONTACT_MESSAGE_MIN_LENGTH ||
      message.length > CONTACT_MESSAGE_MAX_LENGTH
    ) {
      return NextResponse.json(
        {
          error: `Message must be between ${CONTACT_MESSAGE_MIN_LENGTH} and ${CONTACT_MESSAGE_MAX_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }
    if (!privacyConsent) {
      return NextResponse.json(
        { error: "Please agree to the Privacy Policy." },
        { status: 400 }
      );
    }

    const toList = contactRecipients();
    if (toList.length === 0) {
      console.error("[contact] CONTACT_RECIPIENT_EMAIL is not configured.");
      return NextResponse.json({ error: GENERIC_ERR }, { status: 500 });
    }

    const text = [
      "New contact form message from h3studios.ba",
      "",
      `Full name: ${fullName}`,
      `Email: ${email}`,
      phone ? `Telephone: ${phone}` : "Telephone: (not provided)",
      "",
      "Message:",
      message,
    ].join("\n");

    const sent = await sendMail({
      to: toList,
      subject: "H3 Studios website: Contact message",
      text,
      replyTo: email,
    });
    if (!sent.ok) {
      console.error("[contact] mail", sent.error);
      return NextResponse.json({ error: GENERIC_ERR }, { status: 502 });
    }

    return NextResponse.json(GENERIC_OK);
  } catch (e) {
    console.error("[contact]", e);
    return NextResponse.json({ error: GENERIC_ERR }, { status: 500 });
  }
}
