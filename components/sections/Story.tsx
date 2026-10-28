"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Phone } from "../Phone";
import { DeadlinesScreen, LockScreen, NowieDot, PacePill, PaceScreen, RebuildScreen, Wave } from "../screens";
import { WaitlistForm } from "../WaitlistForm";
import { NowieScreen } from "../NowieScreen";
import { LogoMark } from "../Logo";
import { Words } from "../Motion";
import { Check, Lock, Mic, Moon, Undo } from "../icons";
import { CanvasIcon } from "../brand-icons";
import { useTilt } from "@/lib/useTilt";
import { gsap, useGSAP, prefersReduced } from "@/lib/gsap";
import { clock12, plan } from "@/lib/plan";

const REPLY = "Done. Gym moved to 6:30, reading to tomorrow.";
const WAKES = [8 * 60, 11 * 60, 14 * 60];

// Scroll progress (0..1 across the story) where each chapter takes over,
// where the phone starts each glide, and which side it glides to.
const CH_AT = [0, 0.1, 0.34, 0.56, 0.78];
const MOVE_AT = [0.03, 0.27, 0.49, 0.71];
const SIDE = [1, -1, 1, -1];
// A different full turn on each glide: spin, front flip, reverse spin, corkscrew.
// Values are absolute so scrubbing back unwinds them exactly.
const SPINS: Record<string, string>[] = [
  { "--sy": "360deg" },
  { "--sx": "360deg" },
  { "--sy": "0deg" },
  { "--sy": "360deg", "--sz": "-360deg" },
];
const STATUS = ["9:41", "12:58", "2:04", "4:12", "3:20"];

const CHAPTERS = [
  {
    tag: "Voice-first replies",
    ghost: "say it",
    title: "Just reply.",
    body: "Every notification is a conversation. Say “I need 30 more minutes” and the rest of your day re-plans itself. One tap to undo.",
  },
  {
    tag: "Wake-up rebuilds",
    ghost: "rebuilt",
    title: "Slept in? Your day rebuilds itself.",
    body: "Classes and shifts stay locked. Anything you missed gets flagged. Everything else fits into the time you have left.",
  },
  {
    tag: "Canvas sync",
    ghost: "synced",
    title: "Due date moved? So did your plan.",
    body: "Connect Canvas once. When a professor moves a deadline, Nowline catches it and re-spreads the work across your week.",
  },
  {
    tag: "Live pace",
    ghost: "on pace",
    title: "Behind? Here’s the fix.",
    body: "Always know if you’re ahead, on track or behind. When you slip, Nowie hands you a concrete fix you apply with one tap.",
  },
];

/** A card that starts small at the middle of the screen and flies out to (x%, y%) of the phone. */
function Lift({ on, x, y, d = 0, className = "", children }: { on: boolean; x: number; y: number; d?: number; className?: string; children: ReactNode }) {
  return (
    <div
      className={`lift ${on ? "is-on" : ""} ${className}`}
      style={{ left: `${x}%`, top: `${y}%`, ["--lx" as string]: x, ["--ly" as string]: y, ["--pd" as string]: `${d}s` }}
      aria-hidden={!on}
    >
      <div className="lift__f">{children}</div>
    </div>
  );
}

function Layers() {
  return (
    <svg className="hc__glyph" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      {[0, 7, 14, 21].map((d) => (
        <path key={d} d={`M32 ${10 + d}L56 ${22 + d}L32 ${34 + d}L8 ${22 + d}Z`} opacity={1 - d / 40} />
      ))}
    </svg>
  );
}

export function Story() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const rig = useRef<HTMLDivElement>(null);
  const phoneInner = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const ghosts = useRef<HTMLDivElement>(null);
  const cards = useRef<HTMLDivElement>(null);
  const chRef = useRef(0);
  const movingRef = useRef(false);

  const [ch, setCh] = useState(0);
  // True while the phone is mid-glide; chapter cards wait for it to land.
  const [moving, setMoving] = useState(false);
  const [run, setRun] = useState(0);
  const [voice, setVoice] = useState(0);
  const [typed, setTyped] = useState("");
  const [wake, setWake] = useState(WAKES[0]);
  const [moved, setMoved] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [rough, setRough] = useState(false);
  const touched = useRef(false);

  useTilt(rig, { max: 7, area: stage });

  // Scroll drives one timeline: the hero breaks apart, then the phone glides
  // side to side while chapters swap on the opposite side.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ wide: "(min-width: 761px)", narrow: "(max-width: 760px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
        const { wide, reduce } = ctx.conditions as { wide: boolean; reduce: boolean };
        const vw = () => window.innerWidth;
        const vh = () => window.innerHeight;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: reduce ? true : 0.9,
            invalidateOnRefresh: true,
            onUpdate: (s) => {
              let n = 0;
              for (let i = CH_AT.length - 1; i > 0; i--) if (s.progress >= CH_AT[i]) { n = i; break; }
              const mv = MOVE_AT.some((a) => s.progress > a && s.progress < a + 0.09);
              if (mv !== movingRef.current) {
                movingRef.current = mv;
                setMoving(mv);
              }
              if (n !== chRef.current) {
                chRef.current = n;
                setCh(n);
              }
            },
          },
        });

        tl.to(".hero__l--a", { x: () => -vw() * 0.14, opacity: 0, filter: "blur(16px)", duration: 0.09 }, 0)
          .to(".hero__l--b", { x: () => vw() * 0.14, opacity: 0, filter: "blur(16px)", duration: 0.09 }, 0)
          .to(".hc", {
            x: (_, el: HTMLElement) => Number(el.dataset.fx) * vw() * 0.12,
            y: (_, el: HTMLElement) => Number(el.dataset.fy) * vh() * 0.18,
            opacity: 0,
            scale: 0.9,
            duration: 0.08,
            stagger: 0.005,
          }, 0)
          .to(".hero__foot, .hero__cue", { y: 30, opacity: 0, duration: 0.05 }, 0);

        const side = wide ? 0.215 : 0.13;
        if (reduce) {
          // No glide: the phone cuts to each side as the chapter changes.
          MOVE_AT.forEach((at, i) => {
            const s = SIDE[i];
            tl.set(phone.current, { x: () => s * side * vw(), y: () => (wide ? 0 : -vh() * 0.145), scale: wide ? 1 : 0.8 }, at + 0.05)
              .set(rig.current, { "--by": `${-s * 24}deg`, "--bx": "5deg", "--bz": "0deg", "--turn": -s * 0.7 }, at + 0.05);
          });
          tl.set({}, {}, 1);
          return;
        }

        MOVE_AT.forEach((at, i) => {
          const s = SIDE[i];
          tl.to(phone.current, { x: () => s * side * vw(), duration: 0.09, ease: "power2.inOut" }, at)
            .to(phone.current, { y: () => (wide ? vh() * 0.035 : -vh() * 0.11), scale: wide ? 0.95 : 0.76, duration: 0.045, ease: "sine.out" }, at)
            .to(phone.current, { y: () => (wide ? 0 : -vh() * 0.145), scale: wide ? 1 : 0.8, duration: 0.045, ease: "sine.in" }, at + 0.045)
            .to(rig.current, { "--by": `${-s * 24}deg`, "--bx": "5deg", "--bz": `${-s * 1.5}deg`, "--turn": -s * 0.7, duration: 0.09, ease: "power2.inOut" }, at)
            .to(rig.current, { ...SPINS[i], duration: 0.09, ease: "power2.inOut" }, at)
            .to(ghosts.current, { x: () => -s * vw() * 0.06, duration: 0.09, ease: "power2.inOut" }, at);
        });
        // The phone holds its last chapter pose and scrolls away with the stage.
        // Keep the timeline 1 long so every move stays aligned with its chapter.
        tl.set({}, {}, 1);
      });
    },
    { scope: root }
  );

  // Motion blur that follows the phone's real on-screen speed: travel and Y spins
  // smear sideways, X flips smear vertically, the corkscrew both. Off at rest.
  useEffect(() => {
    if (prefersReduced()) return;
    const el = phoneInner.current!;
    const fe = blurRef.current!;
    const ph = phone.current!;
    const rg = rig.current!;
    const deg = (k: string) => parseFloat(rg.style.getPropertyValue(k)) || 0;
    let prev: number[] | null = null;
    let bx = 0;
    let by = 0;
    let on = false;
    const tick = () => {
      const now = [Number(gsap.getProperty(ph, "x")) || 0, Number(gsap.getProperty(ph, "y")) || 0, deg("--sx"), deg("--sy"), deg("--sz")];
      if (prev) {
        const [dx, dy, dsx, dsy, dsz] = now.map((n, i) => Math.abs(n - prev![i]));
        const tx = Math.min(12, dx * 0.45 + dsy * 0.32 + dsz * 0.18);
        const ty = Math.min(12, dy * 0.45 + dsx * 0.32 + dsz * 0.18);
        bx += (tx - bx) * 0.35;
        by += (ty - by) * 0.35;
      }
      prev = now;
      if (bx > 0.25 || by > 0.25) {
        fe.setAttribute("stdDeviation", `${bx.toFixed(2)} ${by.toFixed(2)}`);
        if (!on) {
          el.style.filter = "url(#phone-mblur)";
          on = true;
        }
      } else if (on) {
        el.style.filter = "";
        fe.setAttribute("stdDeviation", "0 0");
        on = false;
      }
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      el.style.filter = "";
    };
  }, []);

  // Each chapter plays its little story when it arrives, and resets when it leaves.
  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const quick = prefersReduced();
    if (ch === 1) {
      setVoice(0);
      setTyped("");
      if (quick) {
        setVoice(4);
        setTyped(REPLY);
      } else {
        at(350, () => setVoice(1));
        at(1350, () => setVoice(2));
        at(2650, () => {
          setVoice(3);
          let i = 0;
          const next = () => {
            i++;
            setTyped(REPLY.slice(0, i));
            if (i < REPLY.length) at(26, next);
            else at(260, () => setVoice(4));
          };
          next();
        });
      }
    }
    if (ch === 2) {
      touched.current = false;
      setWake(WAKES[0]);
      at(quick ? 0 : 1100, () => !touched.current && setWake(WAKES[2]));
    }
    if (ch === 3) {
      setMoved(false);
      at(quick ? 0 : 1000, () => setMoved(true));
    }
    if (ch === 4) {
      touched.current = false;
      setFixed(false);
      setRough(false);
      at(quick ? 0 : 2000, () => !touched.current && setFixed(true));
    }
    return () => timers.forEach(clearTimeout);
  }, [ch, run]);

  // The hero cards drift a little against the pointer, each at its own depth.
  useEffect(() => {
    const el = cards.current!;
    if (prefersReduced() || !matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty("--px", cx.toFixed(3));
      el.style.setProperty("--py", cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const r = root.current!;
    const y = r.offsetTop + (CH_AT[i + 1] + 0.1) * (r.offsetHeight - window.innerHeight);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o?: object) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.6 });
    else window.scrollTo({ top: y, behavior: prefersReduced() ? "auto" : "smooth" });
  };

  const tomorrow = plan(wake).tomorrow;
  const late = wake !== WAKES[0];

  const live = (n: number) => (ch === n ? 0 : -1);
  const controls: ReactNode[] = [
    <button key="v" type="button" className="ctl" tabIndex={live(1)} onClick={() => setRun((r) => r + 1)}>
      <Mic size={14} /> Play the reply again
    </button>,
    <div key="w" className="seg-ctl" role="group" aria-label="Woke up at">
      <span className="seg-ctl__lbl mono">Woke up at</span>
      {WAKES.map((w) => (
        <button
          key={w}
          type="button"
          tabIndex={live(2)}
          aria-pressed={wake === w}
          className={wake === w ? "is-on" : ""}
          onClick={() => {
            touched.current = true;
            setWake(w);
          }}
        >
          {clock12(w).replace(":00", "")}
        </button>
      ))}
    </div>,
    <button key="c" type="button" className="ctl" tabIndex={live(3)} onClick={() => setRun((r) => r + 1)}>
      <CanvasIcon size={16} /> Move a due date again
    </button>,
    <div key="p" className="ctl-row">
      <button
        type="button"
        className={`ctl ${fixed ? "is-done" : ""}`}
        tabIndex={live(4)}
        onClick={() => {
          touched.current = true;
          setFixed((f) => !f);
        }}
      >
        {fixed ? <><Undo size={14} /> Undo fix</> : <><Check size={14} /> Apply fix</>}
      </button>
      <button
        type="button"
        role="switch"
        aria-checked={rough}
        className={`switch ${rough ? "is-on" : ""}`}
        tabIndex={live(4)}
        onClick={() => {
          touched.current = true;
          setRough((r) => !r);
        }}
      >
        <span className="switch__track"><span className="switch__knob" /></span> Rough day
      </button>
    </div>,
  ];

  return (
    <section className="story" id="top" ref={root} aria-label="Nowline, your day handled">
      <span className="story__anchor" id="features" style={{ ["--at" as string]: CH_AT[1] + 0.08 }} />
      <div className="stage" ref={stage} data-ch={ch}>
        <div className="ghosts" ref={ghosts} aria-hidden="true">
          {CHAPTERS.map((c, i) => (
            <span key={c.ghost} className={`ghost ${ch === i + 1 ? "is-on" : ""}`}>{c.ghost}</span>
          ))}
        </div>

        <h1 className="hero__h1 chroma">
          <span className="hero__l hero__l--a"><Words text="Your day," /></span>{" "}
          <span className="hero__l hero__l--b"><Words text="handled." start={2} /></span>
        </h1>

        <div className="hcards" ref={cards}>
          <div className="hc hc--feat" data-fx="-1" data-fy="-0.6">
            <div className="hc__p" style={{ ["--depth" as string]: 10 }}>
              <div className="hc__in gl gl--refract" style={{ ["--d" as string]: 0 }}>
                <Layers />
                <p className="hc__eyebrow mono"><span className="live-dot" aria-hidden="true" /> Coming soon to iPhone</p>
                <h2 className="hc__title">Plans your day. Re-plans it when life happens.</h2>
                <p className="hc__body">The voice-first AI assistant, built for students.</p>
              </div>
            </div>
          </div>
          <div className="hc hc--logo" data-fx="0.6" data-fy="-1">
            <div className="hc__p" style={{ ["--depth" as string]: 22 }}>
              <div className="hc__in hc__tile" style={{ ["--d" as string]: 1 }}>
                <LogoMark size={60} glow={false} />
              </div>
            </div>
          </div>
          <div className="hc hc--quote" data-fx="1" data-fy="0.2">
            <div className="hc__p" style={{ ["--depth" as string]: 30 }}>
              <div className="hc__in gl gl--refract gl--dim" style={{ ["--d" as string]: 2 }}>
                <p className="hc__eyebrow hc__eyebrow--light mono"><span className="dot" aria-hidden="true" /> Why Nowline</p>
                <p className="hc__quote">“You had a plan. Then the day happened.”</p>
              </div>
            </div>
          </div>
          <div className="hc hc--pills" data-fx="-1" data-fy="0.8">
            <div className="hc__p" style={{ ["--depth" as string]: 18 }}>
              <div className="hc__in gl gl--refract" style={{ ["--d" as string]: 3 }}>
                <span className="mpill">Voice-first <Wave bars={4} /></span>
                <span className="mpill">Canvas sync <CanvasIcon size={15} /></span>
                <span className="mpill">Undo anything <Undo size={13} /></span>
              </div>
            </div>
          </div>
          <div className="hc hc--offer" data-fx="1" data-fy="1">
            <div className="hc__p" style={{ ["--depth" as string]: 26 }}>
              <a href="#waitlist" className="hc__in hc__offer" style={{ ["--d" as string]: 4 }}>
                <b>1 month free</b>
                <span>for everyone on the waitlist</span>
              </a>
            </div>
          </div>
        </div>

        <div className="st__phone" ref={phone}>
          <svg className="sr-only" aria-hidden="true" focusable="false">
            <filter id="phone-mblur" x="-25%" y="-12%" width="150%" height="124%" colorInterpolationFilters="sRGB">
              <feGaussianBlur ref={blurRef} stdDeviation="0 0" />
            </filter>
          </svg>
          <div className="st__phone-in" ref={phoneInner}>
            <Phone
              rigRef={rig}
              width="var(--stage-pw)"
              statusTime={STATUS[ch]}
              label="Nowline on an iPhone, starting on Nowie, its voice assistant. As you scroll it shows a voice reply, a rebuilt day, a Canvas due date change and a pace fix."
            >
              <div className={`sv ${ch === 0 ? "is-on" : ""}`}><NowieScreen active={ch === 0} /></div>
              <div className={`sv ${ch === 1 ? "is-on" : ""}`}><LockScreen step={voice} reply={typed} /></div>
              <div className={`sv ${ch === 2 ? "is-on" : ""}`}><RebuildScreen wake={wake} /></div>
              <div className={`sv ${ch === 3 ? "is-on" : ""} ${moved ? "is-moved" : ""}`}><DeadlinesScreen /></div>
              <div className={`sv ${ch === 4 ? "is-on" : ""}`}><PaceScreen fixed={fixed} rough={rough} /></div>
            </Phone>
          </div>
          <div className={`lifts ${moving ? "is-held" : ""}`}>
            <Lift className="pop--voice" on={ch === 1 && voice >= 2} x={-62} y={56}>
              <div className="gl gl--refract card-voice">
                <span className="card-voice__mic"><Mic size={12} /></span>
                <Wave bars={9} />
                “I need 30 more minutes.”
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 1 && voice >= 1} x={-42} y={21}>
              <div className="gl gl--refract gl--dim card-dark">
                <span className="card-dark__ic"><Mic size={12} /></span>
                <span><b>Hold to reply</b><small>No app to open</small></span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 1 && voice >= 4} x={38} y={64} d={0.1}>
              <div className="gl gl--refract card-diff">
                <span className="card-diff__h">Re-planned</span>
                <span className="card-diff__r"><span>Gym</span><span><s>5:30</s> <b>6:30</b></span></span>
                <span className="card-diff__r"><span>Read ch. 5</span><b>Tomorrow</b></span>
                <span className="card-diff__r"><span>OS Homework</span><b>+30 min</b></span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 1 && voice >= 4} x={-30} y={82} d={0.35}>
              <div className="gl gl--refract gl--dim card-dark card-dark--pill">
                <span className="card-dark__ic"><Undo size={12} /></span>
                <span><b>Undo</b><small>Always one tap</small></span>
              </div>
            </Lift>
            <Lift className="pop--wake" on={ch === 2} x={50} y={9}>
              <div className="gl gl--refract card-wake">
                <span className="card-wake__ic"><Moon size={14} /></span>
                <div>
                  <b>Woke up at {clock12(wake)}</b>
                  <span>{wake === WAKES[0] ? "Right on time" : "Day rebuilt around it"}</span>
                </div>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 2 && late} x={-50} y={21} d={0.15}>
              <div className="gl gl--refract card-missed">
                <span className="card-missed__tag">Missed · flagged</span>
                <b>CSE 340 Lecture</b>
                <span>10:30 – 11:45 · catch the recording</span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 2} x={-46} y={55} d={0.3}>
              <div className="gl gl--refract gl--dim card-dark">
                <span className="card-dark__ic"><Lock size={12} /></span>
                <span><b>Classes &amp; shifts</b><small>Stay locked, always</small></span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 2 && tomorrow.length > 0} x={44} y={70} d={0.4}>
              <div className="gl gl--refract card-tmrw">
                <span className="card-tmrw__h"><Moon size={11} /> Moved to tomorrow</span>
                <span className="card-tmrw__list">{tomorrow.map((x) => <i key={x}>{x}</i>)}</span>
              </div>
            </Lift>
            <Lift className="pop--canvas" on={ch === 3 && moved} x={-66} y={13}>
              <div className="gl gl--refract card-cv">
                <div className="card-cv__top"><CanvasIcon size={18} /><b>Canvas</b><span>just now</span></div>
                <p><b>OS Homework 5</b> moved to Nov 6.</p>
                <p className="card-cv__mint">You&apos;re now at 45 min a day instead of 1.5 h.</p>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 3 && moved} x={-24} y={45} d={0.2}>
              <div className="gl gl--refract card-date">
                <span className="card-date__m">Nov</span>
                <span className="card-date__d"><s>4</s><b>6</b></span>
                <span className="card-date__l">Due date</span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 3} x={-70} y={78}>
              <div className="gl gl--refract gl--dim card-dark card-dark--pill">
                <span className="card-dark__ic"><Check size={12} /></span>
                <span><b>Synced with Canvas</b><small>Every assignment, every due date</small></span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 3 && moved} x={54} y={70} d={0.4}>
              <div className="gl gl--refract card-big">
                <span>OS Homework 5 · per day</span>
                <b><s>1.5h</s>45m</b>
              </div>
            </Lift>
            <Lift className="pop--fix" on={ch === 4 && !rough} x={46} y={29}>
              <div className={`gl gl--refract card-fix ${fixed ? "is-fixed" : ""}`}>
                <div className="card-fix__head">
                  <NowieDot size={20} />
                  <b>{fixed ? "Back on track" : "Here’s the fix"}</b>
                </div>
                <ul>
                  <li>Shorten lunch by 15 min</li>
                  <li>Move reading to tomorrow</li>
                </ul>
                <span className="card-fix__btn">
                  {fixed ? <><Check size={12} /> Applied</> : "Apply fix"}
                </span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 4} x={-54} y={13} d={0.1}>
              <div className="gl gl--refract card-pace">
                <span className="card-pace__l">Live pace</span>
                <PacePill state={rough ? "easy" : fixed ? "on" : "behind"} />
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 4 && fixed && !rough} x={-56} y={53} d={0.25}>
              <div className="gl gl--refract card-diff card-diff--sm">
                <span className="card-diff__h">Applied</span>
                <span className="card-diff__r"><span>Lunch</span><span><s>45</s> <b>30 min</b></span></span>
                <span className="card-diff__r"><span>Read ch. 5</span><b>Tomorrow</b></span>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 4 && rough} x={46} y={29} d={0.15}>
              <div className="gl gl--refract card-rough">
                <span className="card-dark__ic"><Moon size={12} /></span>
                <b>Rough day mode</b>
                <p>Just the 2 must-dos. Everything else moved to tomorrow. No red badges.</p>
              </div>
            </Lift>
            <Lift className="lift--x" on={ch === 4} x={38} y={83} d={0.45}>
              <div className="gl gl--refract gl--dim card-dark card-dark--pill">
                <NowieDot size={16} />
                <span><b>Nowie</b><small>{rough ? "Take it easy. I’ve got the rest." : fixed ? "Back on track. Nice." : "You’re 20 min behind."}</small></span>
              </div>
            </Lift>
          </div>
        </div>

        <div className="chaps">
          {CHAPTERS.map((c, i) => (
            <article key={c.tag} className={`chap chap--${SIDE[i] > 0 ? "l" : "r"} ${ch === i + 1 ? "is-on" : ""}`}>
              <div className="chap__in">
                <div className="chap__meta mono">
                  <span>0{i + 1}</span>
                  <i className="chap__bar"><b /></i>
                  <span>04</span>
                  <em>{c.tag}</em>
                </div>
                <h2 className="chap__h chroma"><Words text={c.title} /></h2>
                <p className="chap__p">{c.body}</p>
                <div className="chap__ctl">{controls[i]}</div>
              </div>
            </article>
          ))}
        </div>

        <nav className="rail" aria-label="Story chapters">
          {CHAPTERS.map((c, i) => (
            <button key={c.tag} type="button" className={`rail__b ${ch === i + 1 ? "is-on" : ""}`} onClick={() => goTo(i)}>
              <span className="mono">0{i + 1}</span>
              <em>{c.tag}</em>
            </button>
          ))}
        </nav>

        <div className="hero__foot" id="hero-form">
          <div className="hero__foot-in">
            <p className="hero__sub"><span className="live-dot" aria-hidden="true" /> The voice-first AI planner for students. Coming soon to iPhone.</p>
            <WaitlistForm source="hero" inputId="hero-email" />
          </div>
        </div>
        <a href="#features" className="hero__cue">
          <span className="hero__cue-in">
            <span className="hero__cue-line" aria-hidden="true" />
            <span className="mono">Scroll</span>
            <span className="hero__cue-txt">to see a day with Nowie</span>
          </span>
        </a>
      </div>
    </section>
  );
}
