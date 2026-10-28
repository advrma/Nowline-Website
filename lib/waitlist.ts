"use client";

import { useEffect, useState } from "react";

const KEY = "nowline:joined";
const EVT = "nowline:joined";

export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

export type Source = "hero" | "final" | "sticky";

export async function joinWaitlist(email: string, source: Source, company = "") {
  const res = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source, company }),
  });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; already?: boolean; error?: string };
  if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Try again?");
  try {
    localStorage.setItem(KEY, email);
  } catch {}
  window.dispatchEvent(new CustomEvent(EVT, { detail: email }));
  return { already: !!data.already };
}

/** The email this browser signed up with, shared across every form on the page. */
export function useJoined() {
  const [joined, setJoined] = useState<string | null>(null);
  useEffect(() => {
    try {
      setJoined(localStorage.getItem(KEY));
    } catch {}
    const on = (e: Event) => setJoined((e as CustomEvent<string>).detail);
    window.addEventListener(EVT, on);
    return () => window.removeEventListener(EVT, on);
  }, []);
  return joined;
}

export async function shareNowline() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
  const text = "Nowline plans your day and re-plans it when you wake up late. Waitlist gets a free month:";
  if (navigator.share) {
    try {
      await navigator.share({ title: "Nowline", text, url });
      return "shared";
    } catch {
      return "cancelled";
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
