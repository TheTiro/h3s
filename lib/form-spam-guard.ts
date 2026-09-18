/** Shared helpers for public contact form spam controls. */

const HONEYPOT_KEYS = ["website", "company", "url"] as const;

const hitsByIp = new Map<string, number[]>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;

export function clientIp(request: Request): string | null {
  const xf = request.headers.get("x-forwarded-for");
  if (xf) {
    const first = xf.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  return real?.trim() || null;
}

export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  for (const key of HONEYPOT_KEYS) {
    const v = body[key];
    if (typeof v === "string" && v.trim().length > 0) return true;
  }
  return false;
}

export function isRateLimited(ip: string | null): boolean {
  const key = ip || "unknown";
  const now = Date.now();
  const prev = (hitsByIp.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (prev.length >= MAX_HITS) {
    hitsByIp.set(key, prev);
    return true;
  }
  prev.push(now);
  hitsByIp.set(key, prev);
  return false;
}

export function contactRecipients(): string[] {
  const raw = (process.env.CONTACT_RECIPIENT_EMAIL ?? "").trim();
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const list = raw
    .split(/[,;]+/)
    .map((s) => s.trim().replace(/^["']+|["']+$/g, ""))
    .filter((s) => emailRe.test(s));
  return list;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
