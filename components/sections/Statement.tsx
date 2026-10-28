"use client";

import { useRef } from "react";
import { LogoMark } from "../Logo";
import { Check } from "../icons";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";

const ROWS = [
  ["Who builds your day", "You drag every task", "Nowie plans it for you"],
  ["You fall behind", "You notice later", "A catch-up plan, right away"],
  ["A due date moves", "You find out too late", "Your plan updates itself"],
  ["You wake up late", "Rebuild it by hand", "Rebuilt automatically"],
  ["Talking to it", "Tap and type in the app", "Reply to any notification by voice"],
];

const LINE_A = "Other planners show your day.".split(" ");
const LINE_B = "Nowline runs it with you.".split(" ");

export function Statement() {
  const root = useRef<HTMLElement>(null);

  // The line lights up word by word as you read down into it.
  useGSAP(
    () => {
      if (prefersReduced()) return;
      gsap.fromTo(
        ".sw",
        { opacity: 0.12, filter: "blur(6px)", y: 8 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          stagger: 0.12,
          ease: "none",
          scrollTrigger: { trigger: ".st__line", start: "top 85%", end: "bottom 45%", scrub: 0.6 },
        }
      );
    },
    { scope: root }
  );

  return (
    <section className="st" id="compare" ref={root}>
      <p className="eyebrow st__eye" data-reveal>Why it&apos;s different</p>
      <p className="st__line">
        <span className="st__a">{LINE_A.map((w, i) => <span key={i} className="sw">{w} </span>)}</span>
        <br />
        <span className="st__b">{LINE_B.map((w, i) => <span key={i} className="sw">{w} </span>)}</span>
      </p>

      <div className="cmp gl gl--refract" data-reveal>
        <div className="cmp__row cmp__row--head" aria-hidden="true">
          <span />
          <span className="cmp__old">Typical planners</span>
          <span className="cmp__new"><LogoMark size={22} glow={false} /> Nowline</span>
        </div>
        <table className="sr-only">
          <caption>Typical planners compared with Nowline</caption>
          <thead><tr><th scope="col" /><th scope="col">Typical planners</th><th scope="col">Nowline</th></tr></thead>
          <tbody>{ROWS.map(([k, a, b]) => <tr key={k}><th scope="row">{k}</th><td>{a}</td><td>{b}</td></tr>)}</tbody>
        </table>
        {ROWS.map(([k, a, b], i) => (
          <div key={k} className="cmp__row" style={{ ["--i" as string]: i }} aria-hidden="true">
            <span className="cmp__k">{k}</span>
            <span className="cmp__old"><s>{a}</s></span>
            <span className="cmp__new"><i className="cmp__tick"><Check size={12} /></i>{b}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
