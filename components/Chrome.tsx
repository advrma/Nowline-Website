"use client";

import { useEffect, useState } from "react";
import { Logo, LogoMark } from "./Logo";
import { Arrow } from "./icons";
import { useJoined } from "@/lib/waitlist";

export function Preloader() {
  // Pure CSS timeline; the inline head script adds .pre-skip on repeat visits.
  return (
    <div className="pre" aria-hidden="true">
      <div className="pre__mark">
        <LogoMark size={112} animated />
      </div>
      <div className="pre__word">
        {"nowline".split("").map((c, i) => (
          <span key={i} style={{ ["--i" as string]: i }}>{c}</span>
        ))}
      </div>
    </div>
  );
}

export function Nav() {
  const [compact, setCompact] = useState(false);
  const joined = useJoined();
  useEffect(() => {
    const on = () => setCompact(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header className={`nav ${compact ? "is-compact" : ""}`}>
      <nav className="nav__pill gl" aria-label="Main">
        <a href="#top" className="nav__logo" aria-label="Nowline home"><Logo size={28} /></a>
        <ul className="nav__links">
          <li><a href="#features">Features</a></li>
          <li><a href="#works">Works with</a></li>
          <li><a href="#compare">Compare</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
        <a href="#waitlist" className="btn btn--dark btn--sm nav__cta mag">
          {joined ? "You're on the list" : <>Join the waitlist <Arrow size={14} /></>}
        </a>
      </nav>
    </header>
  );
}

/** Floating CTA for phones: appears once you scroll past the hero, hides near the final form. */
export function MobileCta() {
  const joined = useJoined();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fin = document.getElementById("waitlist");
    if (!fin) return;
    let finIn = false;
    const update = () => setShow(window.scrollY > window.innerHeight * 0.6 && !finIn);
    const io = new IntersectionObserver(([e]) => {
      finIn = e.isIntersecting;
      update();
    });
    io.observe(fin);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);
  if (joined) return null;
  return (
    <a href="#waitlist" className={`mcta gl ${show ? "is-on" : ""}`} aria-hidden={!show} tabIndex={show ? 0 : -1}>
      <span className="mcta__orb" aria-hidden="true" />
      <span className="mcta__txt"><b>Get 1 month free</b><small>Join the waitlist</small></span>
      <span className="mcta__go"><Arrow size={16} /></span>
    </a>
  );
}
