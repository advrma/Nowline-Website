"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "../Logo";
import { Check } from "../icons";
import { SCENES } from "../Diagrams";
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
const MORPH_AT = 1500;
const NEXT_AT = 7000;

export function Statement() {
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState(0);
  const [now, setNow] = useState(false);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);

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

  // Only run the show while the card is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);

  // Each scenario opens on the typical planner, then morphs into Nowline.
  useEffect(() => {
    if (!seen) return;
    if (prefersReduced()) {
      setNow(true);
      return;
    }
    const timers: number[] = [];
    if (auto) {
      setNow(false);
      timers.push(window.setTimeout(() => setNow(true), MORPH_AT));
      timers.push(window.setTimeout(() => setTab((t) => (t + 1) % SCENES.length), NEXT_AT));
    }
    return () => timers.forEach(clearTimeout);
  }, [tab, auto, seen]);

  const pick = (i: number) => {
    setAuto(false);
    setTab(i);
    setNow(false);
    if (!prefersReduced()) window.setTimeout(() => setNow(true), 700);
    else setNow(true);
  };

  const Scene = SCENES[tab];

  return (
    <section className="st" id="compare" ref={root}>
      <p className="eyebrow st__eye" data-reveal>Why it&apos;s different</p>
      <p className="st__line">
        <span className="st__a">{LINE_A.map((w, i) => <span key={i} className="sw">{w} </span>)}</span>
        <br />
        <span className="st__b">{LINE_B.map((w, i) => <span key={i} className="sw">{w} </span>)}</span>
      </p>

      <div className="cx" ref={box} data-reveal>
        <ol className="cx__list" aria-label="Typical planners compared with Nowline">
          {ROWS.map(([k, a, b], i) => (
            <li key={k} className={`cx__item ${tab === i ? "is-on" : ""}`}>
              <button type="button" aria-pressed={tab === i} onClick={() => pick(i)}>
                <span className="cx__n mono">0{i + 1}</span>
                <span className="cx__k">{k}</span>
              </button>
              <div className="cx__detail">
                <div>
                  <p className="cx__old"><span className="mono">Typical</span> <s>{a}</s><span className="sr-only">.</span></p>
                  <p className="cx__new"><span className="cx__tick"><Check size={11} /></span> <span className="sr-only">Nowline:</span> {b}</p>
                </div>
              </div>
              {tab === i && auto && seen && <i className="cx__timer" />}
            </li>
          ))}
        </ol>

        <div className={`cx__stage gl gl--refract ${now ? "is-now" : ""}`}>
          <div className="cx__bar">
            <span className="cx__step mono">0{tab + 1} / 05</span>
            <div className="cx__seg" role="group" aria-label="Show">
              <button type="button" className={!now ? "is-on" : ""} onClick={() => { setAuto(false); setNow(false); }}>Typical planner</button>
              <button type="button" className={now ? "is-on" : ""} onClick={() => { setAuto(false); setNow(true); }}><LogoMark size={14} glow={false} /> Nowline</button>
              <i className="cx__seg-pill" aria-hidden="true" />
            </div>
          </div>
          <div className="cx__viz" key={tab} aria-hidden="true">
            <Scene />
          </div>
          <p className="cx__cap">
            <span className="cx__cap-a">{ROWS[tab][1]}</span>
            <span className="cx__cap-b"><Check size={13} /> {ROWS[tab][2]}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
