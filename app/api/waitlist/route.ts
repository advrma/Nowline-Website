import { NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const SOURCES = new Set(["hero", "final", "sticky"]);

// Best-effort burst protection. Resets on cold start, which is fine for a waitlist.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 60_000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > 8;
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Honeypot: real people never see this field.
  if (typeof body.company === "string" && body.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "That email doesn't look right." }, { status: 422 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many tries. Give it a minute." }, { status: 429 });
  }

  const source = SOURCES.has(String(body.source)) ? String(body.source) : "unknown";
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    // Not connected yet: accept the sign-up so the page can be tested end to end.
    console.info(`[waitlist] (no Supabase configured) ${email} via ${source}`);
    return NextResponse.json({ ok: true, mode: "dev" });
  }

  const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email,
      source,
      referrer: req.headers.get("referer")?.slice(0, 500) ?? null,
      user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    }),
    cache: "no-store",
  });

  if (res.status === 409) {
    return NextResponse.json({ ok: true, already: true });
  }
  if (!res.ok) {
    console.error("[waitlist] supabase error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, error: "Something broke on our side. Try again?" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
