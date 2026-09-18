/** Server-side Google reCAPTCHA v3 verification. */

export type RecaptchaAction = "contact";

type VerifyResult =
  | { ok: true; score: number }
  | { ok: false; reason: "missing" | "invalid" | "low_score" | "action" };

export function isRecaptchaConfigured(): boolean {
  const siteKey = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
  const secret = (process.env.RECAPTCHA_SECRET_KEY ?? "").trim();
  return siteKey.length > 0 && secret.length > 0;
}

function recaptchaMinScore(): number {
  const raw = (process.env.RECAPTCHA_MIN_SCORE ?? "0.5").trim();
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0.5;
}

export async function verifyRecaptcha(params: {
  token: string | undefined | null;
  action: RecaptchaAction;
  remoteIp?: string | null;
}): Promise<VerifyResult> {
  if (!isRecaptchaConfigured()) {
    return { ok: true, score: 1 };
  }

  const token = params.token?.trim();
  if (!token) {
    return { ok: false, reason: "missing" };
  }

  const secret = (process.env.RECAPTCHA_SECRET_KEY ?? "").trim();
  const body = new URLSearchParams({ secret, response: token });
  if (params.remoteIp) {
    body.set("remoteip", params.remoteIp);
  }

  let data: {
    success?: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    data = (await res.json()) as typeof data;
  } catch (e) {
    console.error("[recaptcha] siteverify", e);
    return { ok: false, reason: "invalid" };
  }

  if (!data.success) {
    return { ok: false, reason: "invalid" };
  }
  if (data.action !== params.action) {
    return { ok: false, reason: "action" };
  }
  if ((data.score ?? 0) < recaptchaMinScore()) {
    return { ok: false, reason: "low_score" };
  }

  return { ok: true, score: data.score ?? 0 };
}

/** ok = proceed; spam = silent bot block; missing = show retry to real users */
export async function checkRecaptchaSubmission(
  body: Record<string, unknown>,
  action: RecaptchaAction,
  remoteIp?: string | null
): Promise<"ok" | "spam" | "missing"> {
  const token = typeof body.recaptchaToken === "string" ? body.recaptchaToken : null;
  const result = await verifyRecaptcha({ token, action, remoteIp });
  if (result.ok) return "ok";
  if (result.reason === "missing" && isRecaptchaConfigured()) return "missing";
  return "spam";
}
