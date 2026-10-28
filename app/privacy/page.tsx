import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Privacy · Nowline",
  description: "What Nowline collects on its waitlist and how it's used.",
};

export default function Privacy() {
  return (
    <main className="legal">
      <Link href="/" className="legal__home" aria-label="Back to Nowline"><Logo size={28} /></Link>
      <h1 className="h2">Privacy</h1>
      <p className="legal__date">Last updated October 28, 2026</p>

      <h2>What we collect</h2>
      <p>When you join the waitlist we store the email address you enter, which form you used, the time you signed up, and basic technical details your browser sends (the referring page and user agent). That&apos;s it. No passwords, no payment details, no tracking pixels.</p>

      <h2>How we use it</h2>
      <p>Only to tell you when Nowline is available, to give you early access, and to apply your free month. We don&apos;t sell or rent your email, and we don&apos;t share it with advertisers.</p>

      <h2>Where it&apos;s stored</h2>
      <p>Sign-ups are stored in a database hosted by Supabase. Access is limited to the Nowline team.</p>

      <h2>Your choices</h2>
      <p>Want off the list, or want your data deleted? Email <a href="mailto:hello@nowline.org">hello@nowline.org</a> from the address you signed up with and we&apos;ll remove it.</p>

      <h2>Changes</h2>
      <p>If this policy changes in a meaningful way before launch, we&apos;ll update this page and the date above.</p>

      <p className="legal__back"><Link href="/">← Back to Nowline</Link></p>
    </main>
  );
}
