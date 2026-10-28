"use client";

import { Fragment, useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReduced } from "@/lib/gsap";

export function Motion() {
  useEffect(() => {
    const reduce = prefersReduced();
    const fine = matchMedia("(pointer: fine)").matches;

    // Smooth scroll on pointer devices; touch keeps native momentum.
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    }

    // In-page anchors go through Lenis so the motion stays continuous.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!el) return;
      e.preventDefault();
      const focusTarget = el.querySelector<HTMLInputElement>("input[type=email]");
      if (lenis) lenis.scrollTo(el, { offset: id === "#top" ? 0 : -10, onComplete: () => focusTarget?.focus({ preventScroll: true }) });
      else {
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        focusTarget?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick);

    // One observer handles every soft reveal on the page.
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            (en.target as HTMLElement).dataset.in = "";
            io.unobserve(en.target);
          }
        }
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0.01 }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // Pointer details: a specular spot on glass, magnetic buttons, and a
    // faint chromatic offset on headlines that leans away from the cursor.
    let raf = 0;
    let px = 0;
    let py = 0;
    let target: Element | null = null;
    const chroma = Array.from(document.querySelectorAll<HTMLElement>(".chroma"));
    const frame = () => {
      raf = 0;
      const cx = (px / window.innerWidth) * 2 - 1;
      const cy = (py / window.innerHeight) * 2 - 1;
      chroma.forEach((el) => {
        el.style.setProperty("--cx", cx.toFixed(3));
        el.style.setProperty("--cy", cy.toFixed(3));
      });
      const spot = target?.closest<HTMLElement>(".gl, .spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${(((px - r.left) / r.width) * 100).toFixed(1)}%`);
        spot.style.setProperty("--my", `${(((py - r.top) / r.height) * 100).toFixed(1)}%`);
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      target = e.target as Element;
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const mags = Array.from(document.querySelectorAll<HTMLElement>(".mag"));
    const magMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.translate = `${(dx * 8).toFixed(1)}px ${(dy * 6).toFixed(1)}px`;
    };
    const magLeave = (e: PointerEvent) => {
      (e.currentTarget as HTMLElement).style.translate = "";
    };

    if (fine && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      mags.forEach((m) => {
        m.addEventListener("pointermove", magMove);
        m.addEventListener("pointerleave", magLeave);
      });
    }

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", refresh);
      window.removeEventListener("pointermove", onMove);
      mags.forEach((m) => {
        m.removeEventListener("pointermove", magMove);
        m.removeEventListener("pointerleave", magLeave);
      });
      cancelAnimationFrame(raf);
      io.disconnect();
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}

/** Splits a line into masked words that rise in once an ancestor gets [data-in] or .is-on. */
export function Words({ text, className = "", start = 0 }: { text: string; className?: string; start?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w">
            <span className="w__i" style={{ ["--i" as string]: start + i }}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
