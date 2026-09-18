import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.MAIL_HOST ?? process.env.SMTP_HOST;
  const port = Number(process.env.MAIL_PORT ?? process.env.SMTP_PORT ?? "587");
  const user = process.env.MAIL_USERNAME ?? process.env.SMTP_USER;
  const pass = process.env.MAIL_PASSWORD ?? process.env.SMTP_PASS;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export async function sendMail(options: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const from =
    process.env.MAIL_FROM_ADDRESS ?? process.env.MAIL_FROM ?? process.env.MAIL_USERNAME;
  if (!from) {
    return { ok: false, error: "MAIL_FROM_ADDRESS is not set." };
  }
  const transport = getTransport();
  if (!transport) {
    return { ok: false, error: "MAIL_HOST is not set." };
  }
  try {
    await transport.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      ...(options.replyTo ? { replyTo: options.replyTo } : {}),
    });
    return { ok: true };
  } catch (e) {
    console.error("sendMail", e);
    return { ok: false, error: "Failed to send email." };
  }
}
