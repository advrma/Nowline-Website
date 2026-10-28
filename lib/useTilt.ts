"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pointer-driven tilt. Writes --rx/--ry (deg) and --tx/--ty (-1..1) on the
 * target with an eased follow, so CSS can compose them with base rotations.
 * On touch devices the tilt follows the element's position in the viewport.
 */
export function useTilt(ref: RefObject<HTMLElement | null>, { max = 10, area }: { max?: number; area?: RefObject<HTMLElement | null> } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = matchMedia("(pointer: fine)").matches;
    const zone = area?.current ?? el;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, running = false;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--ry", `${(cx * max).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-cy * max).toFixed(2)}deg`);
      el.style.setProperty("--tx", cx.toFixed(3));
      el.style.setProperty("--ty", cy.toFixed(3));
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = zone.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      ty = Math.max(-1, Math.min(1, (mid / window.innerHeight) * 2 - 1)) * 0.8;
      tx = ty * -0.35;
      kick();
    };

    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, [ref, area, max]);
}
