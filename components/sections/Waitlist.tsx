"use client";

import { useRef, useState } from "react";
import { WaitlistForm } from "../WaitlistForm";
import { CELLS, LogoMark } from "../Logo";
import { Words } from "../Motion";
import { Check, Sparkle } from "../icons";
import { useJoined } from "@/lib/waitlist";
import { useTilt } from "@/lib/useTilt";

export function Waitlist() {
  const [typed, setTyped] = useState("");
  const joined = useJoined();
  const root = useRef<HTMLElement>(null);
  const pass = useRef<HTMLDivElement>(null);
  useTilt(pass, { max: 14, area: root });
  const holder = joined || typed.trim() || "you@school.edu";

  return (
    <section className="wlx" id="waitlist" ref={root}>
      <div className="wlx__inner">
        <div className="wlx__copy gl gl--refract" data-reveal>
          <p className="eyebrow">Waitlist · iPhone first</p>
          <h2 className="h2 chroma"><Words text="Get it first." /></h2>
          <p className="lead">Nowline lands on the App Store in the next couple of weeks. Get on the list and you&apos;re in before everyone else.</p>
          <ul className="perks">
            <li>
              <span className="perks__ic"><Sparkle size={18} /></span>
              <div><b>1 month free</b><span>Your first month of Nowline is on us.</span></div>
            </li>
            <li>
              <span className="perks__ic"><Check size={18} /></span>
              <div><b>Early access</b><span>Get it before the public launch.</span></div>
            </li>
          </ul>
          <WaitlistForm source="final" size="lg" inputId="final-email" onEmail={setTyped} />
          <span className="appstore" aria-label="Coming soon on the App Store">
            <small>Coming soon on the</small>
            <b>App Store</b>
          </span>
        </div>

        <div className="wlx__pass-wrap" data-reveal>
          <div className={`pass ${joined ? "is-flipped" : ""}`} ref={pass}>
            <div className="pass__face pass__front">
              <div className="pass__holo" aria-hidden="true" />
              <div className="pass__top">
                <LogoMark size={44} />
                <span className="pass__kind">Early Access<br />Pass</span>
              </div>
              <div className="pass__hero">
                <span className="pass__big">1 month</span>
                <span className="pass__big pass__big--b">free.</span>
              </div>
              <dl className="pass__fields">
                <div className="pass__holder"><dt>Holder</dt><dd className={!joined && !typed ? "is-ph" : ""}>{holder}</dd></div>
                <div><dt>Access</dt><dd>Before launch</dd></div>
                <div><dt>Device</dt><dd>iPhone</dd></div>
              </dl>
              <div className="pass__code" aria-hidden="true">
                {CELLS.concat(CELLS.slice(0, 13)).map((c, i) => <i key={i} style={{ ["--o" as string]: (c.x * 7 + c.y * 3 + i) % 5 < 2 ? 1 : 0.28 }} />)}
              </div>
            </div>
            <div className="pass__face pass__back" aria-hidden={!joined}>
              <div className="pass__holo" aria-hidden="true" />
              <LogoMark size={72} />
              <b>You&apos;re in.</b>
              <p>Your free month is saved to<br /><span>{holder}</span></p>
              <span className="pass__stamp">See you on launch day</span>
            </div>
          </div>
          <div className="pass__shadow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
