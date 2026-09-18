"use client";

import { useCallback, useEffect } from "react";

const SCRIPT_ID = "recaptcha-v3";
const READY_TIMEOUT_MS = 12_000;

export type RecaptchaFormAction = "contact";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    ___grecaptcha_cfg?: { fns?: Array<() => void> };
  }
}

export function recaptchaSiteKey(): string {
  return (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "").trim();
}

export function isRecaptchaEnabled(): boolean {
  return recaptchaSiteKey().length > 0;
}

function ensureGrecaptchaReadyShim() {
  if (typeof window === "undefined") return;
  if (typeof window.grecaptcha?.ready === "function") return;

  window.grecaptcha = {
    ready(cb: () => void) {
      const cfg = (window.___grecaptcha_cfg = window.___grecaptcha_cfg || {});
      (cfg.fns = cfg.fns || []).push(cb);
    },
    execute() {
      return Promise.reject(new Error("recaptcha unavailable"));
    },
  };
}

function hasRealExecute(): boolean {
  const exec = window.grecaptcha?.execute;
  if (typeof exec !== "function") return false;
  return exec.length >= 1;
}

function waitUntilRecaptchaReady(): Promise<void> {
  return new Promise((resolve, reject) => {
    const started = Date.now();

    const finish = () => {
      if (!hasRealExecute()) {
        reject(new Error("recaptcha unavailable"));
        return;
      }
      resolve();
    };

    const poll = () => {
      if (hasRealExecute()) {
        window.grecaptcha!.ready(finish);
        return;
      }
      if (Date.now() - started > READY_TIMEOUT_MS) {
        reject(new Error("recaptcha unavailable"));
        return;
      }
      window.setTimeout(poll, 40);
    };

    ensureGrecaptchaReadyShim();
    window.grecaptcha!.ready(() => {
      if (hasRealExecute()) {
        finish();
        return;
      }
      poll();
    });
    poll();
  });
}

export function preloadRecaptcha(siteKey = recaptchaSiteKey()): Promise<void> {
  if (!siteKey) {
    return Promise.reject(new Error("recaptcha not configured"));
  }
  if (typeof window === "undefined") {
    return Promise.reject(new Error("recaptcha unavailable"));
  }

  ensureGrecaptchaReadyShim();

  if (hasRealExecute()) {
    return waitUntilRecaptchaReady();
  }

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      const finish = () => waitUntilRecaptchaReady().then(resolve).catch(reject);
      if (existing.dataset.loaded === "true" || hasRealExecute()) {
        finish();
        return;
      }
      existing.addEventListener(
        "load",
        () => {
          existing.dataset.loaded = "true";
          finish();
        },
        { once: true }
      );
      existing.addEventListener("error", () => reject(new Error("recaptcha load failed")), {
        once: true,
      });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      waitUntilRecaptchaReady().then(resolve).catch(reject);
    };
    script.onerror = () => reject(new Error("recaptcha load failed"));
    document.head.appendChild(script);
  });
}

export function useRecaptchaForm(action: RecaptchaFormAction) {
  const siteKey = recaptchaSiteKey();
  const enabled = siteKey.length > 0;

  useEffect(() => {
    if (!siteKey) return;

    document.body.setAttribute("data-recaptcha-form", action);
    void preloadRecaptcha(siteKey).catch((e) => {
      console.warn("[recaptcha] preload failed", e);
    });

    return () => {
      document.body.removeAttribute("data-recaptcha-form");
    };
  }, [siteKey, action]);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!siteKey) return null;
    await preloadRecaptcha(siteKey);
    return window.grecaptcha!.execute(siteKey, { action });
  }, [siteKey, action]);

  return { enabled, getToken };
}
