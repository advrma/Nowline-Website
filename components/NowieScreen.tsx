"use client";

import { useEffect, useState } from "react";
import { Orb } from "./Orb";
import { Mic } from "./icons";
import { prefersReduced } from "@/lib/gsap";

const SAID = "Plan my day around my 2 PM lab.";
const LABELS = ["Nowie", "Listening", "Thinking", "Nowie"];

/**
 * Nowie's voice screen, kept to the essentials: the orb, one line that cycles
 * (question → what you said → Nowie's answer), and the mic. `active` pauses it while hidden.
 */
export function NowieScreen({ active }: { active: boolean }) {
  const [phase, setPhase] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!active) return;
    if (prefersReduced()) {
      setPhase(3);
      setTyped(SAID);
      return;
    }
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const run = () => {
      setPhase(0);
      setTyped("");
      at(2200, () => {
        setPhase(1);
        let i = 0;
        const next = () => {
          i++;
          setTyped(SAID.slice(0, i));
          if (i < SAID.length) at(60, next);
        };
        next();
      });
      at(5200, () => setPhase(2));
      at(6600, () => setPhase(3));
      at(11600, run);
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [active]);

  return (
    <div className={`scr scr--nowie is-p${phase}`}>
      <div className="nw__halo" aria-hidden="true" />
      <Orb className="nw__orb" size="17em" energy={0.35} active={active} />

      <div className="nw__label">
        {LABELS.map((l, i) => <span key={i} className={phase === i ? "is-on" : ""}>{l}</span>)}
      </div>

      <div className="nw__lines">
        <p className="nw__line nw__line--q">What&apos;s on your mind?</p>
        <p className="nw__line nw__line--said">“{typed}”</p>
        <p className="nw__line nw__line--reply">Done. Five blocks, and your lab <span>stays locked at 2.</span></p>
      </div>

      <div className="nw__plan" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>

      <div className="nw__mic">
        <i /><i />
        <span><Mic size={14} /></span>
      </div>
    </div>
  );
}
