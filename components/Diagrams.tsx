import type { CSSProperties, ReactNode } from "react";
import { Check, Lock, Mic, Moon, Undo } from "./icons";
import { NowieDot, Wave } from "./screens";
import { CanvasIcon } from "./brand-icons";

/*
 * One diagram per scenario for "Why it's different". Each draws both states in
 * the same space; the parent's .is-now class morphs it from the typical planner
 * (greyscale, amber problems) to Nowline (pastel, mint), so the change itself
 * is the explanation.
 */

type Tone = "mint" | "lav" | "peach" | "sky" | "sand";
const v = (vars: Record<string, string | number>) => vars as CSSProperties;

function Swap({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <span className="cv-swap">
      <span className="cv-swap__a">{a}</span>
      <span className="cv-swap__b">{b}</span>
    </span>
  );
}

/* 01 · Who builds your day: loose tasks fly into a planned day */
const PLAN: { label: string; time: string; tone: Tone; o: [number, number, number] }[] = [
  { label: "CSE 340 Lecture", time: "9:00", tone: "lav", o: [1, 8, -6] },
  { label: "Capstone report", time: "10:30", tone: "mint", o: [5, 31, 4] },
  { label: "Lunch", time: "12:15", tone: "peach", o: [0, 54, -3] },
  { label: "OS Homework 4", time: "1:00", tone: "sky", o: [4, 77, 5] },
];
export function ScenePlan() {
  return (
    <div className="cv cv-plan">
      {PLAN.map((p, i) => (
        <span key={p.time} className="cv-slot" style={v({ "--i": i })}><em>{p.time}</em></span>
      ))}
      {PLAN.map((p, i) => (
        <span
          key={p.label}
          className={`cv-blk t-${p.tone}`}
          style={v({ "--i": i, "--ox": `${p.o[0]}%`, "--oy": `${p.o[1]}%`, "--or": `${p.o[2]}deg` })}
        >
          {p.label}
          {i === 0 && <Lock size={11} />}
        </span>
      ))}
      <span className="cv-tag cv-tag--now cv-plan__tag"><NowieDot size={14} /> Planned by Nowie</span>
    </div>
  );
}

/* 02 · You fall behind: the drift becomes a recovery */
export function ScenePace() {
  return (
    <div className="cv cv-pace">
      <div className="cv-chart">
        <svg viewBox="0 0 400 230" aria-hidden="true">
          {[60, 110, 160, 210].map((y) => <line key={y} x1="10" x2="390" y1={y} y2={y} className="cv-grid" />)}
          <path d="M20 205 L380 35" className="cv-plan-line" />
          <path d="M20 205 C150 180 260 166 380 156" pathLength={1} className="cv-line cv-line--old" />
          <path d="M20 205 C100 192 150 180 190 172 C260 156 320 64 380 35" pathLength={1} className="cv-line cv-line--now" />
          <circle cx="380" cy="156" r="6" className="cv-dot cv-dot--old" />
          <circle cx="190" cy="172" r="5.5" className="cv-dot cv-dot--warn" />
          <circle cx="380" cy="35" r="6" className="cv-dot cv-dot--ok" />
        </svg>
        <span className="cv-legend"><i /> Plan</span>
        <span className="cv-tag cv-tag--old cv-at" style={{ right: "2%", top: "76%" }}>Noticed at night</span>
        <span className="cv-tag cv-tag--warn cv-at cv-at--now" style={{ left: "38%", top: "84%" }}>20 min behind</span>
        <span className="cv-tag cv-tag--now cv-at cv-at--now cv-at--late" style={{ left: "50%", top: "40%" }}><Check size={11} /> Lunch −15 min · reading → tomorrow</span>
        <span className="cv-tag cv-tag--ok cv-at cv-at--now cv-at--last" style={{ right: "0%", top: "0%" }}><Check size={11} /> On track</span>
      </div>
    </div>
  );
}

/* 03 · A due date moves: crowded days even out */
const DAYS: [string, number, number][] = [["Mon", 8, 46], ["Tue", 8, 46], ["Wed", 88, 46], ["Thu", 88, 46], ["Fri", 8, 8]];
export function SceneDue() {
  return (
    <div className="cv cv-due">
      <div className="cv-due__chip">
        <CanvasIcon size={18} />
        <b>OS Homework 5</b>
        <span className="cv-due__date">due <Swap a="Nov 4" b="Nov 6" /></span>
        <span className="cv-due__state"><Swap a={<><i className="cv-pip cv-pip--old" /> outdated</>} b={<><i className="cv-pip cv-pip--now" /> synced</>} /></span>
      </div>
      <div className="cv-bars">
        {DAYS.map(([d, a, b], i) => (
          <div key={d} className="cv-bar" style={v({ "--ho": `${a}%`, "--hn": `${b}%`, "--i": i })}>
            <span><i /></span>
            <small>{d}</small>
          </div>
        ))}
      </div>
      <p className="cv-due__load"><Swap a="3 h crammed into two days" b="45 min a day, all week" /></p>
    </div>
  );
}

/* 04 · You wake up late: a struck-out day re-forms around the time you woke */
const DAY: { label: string; tone: Tone; o: [string, number]; n: [string, number]; lock?: boolean; flag?: boolean; tmrw?: boolean }[] = [
  { label: "CSE 340 Lecture", tone: "lav", o: ["10:30", 18], n: ["10:30", 2], flag: true },
  { label: "Lunch", tone: "peach", o: ["12:15", 34], n: ["2:30", 34] },
  { label: "Capstone report", tone: "mint", o: ["1:00", 50], n: ["3:20", 50] },
  { label: "Work shift", tone: "lav", o: ["6:00", 66], n: ["6:00", 66], lock: true },
  { label: "Gym", tone: "sand", o: ["7:30", 82], n: ["", 84], tmrw: true },
];
export function SceneWake() {
  return (
    <div className="cv cv-wake">
      <span className="cv-tag cv-tag--old cv-wake__alarm"><Moon size={11} /> 8:00 alarm · slept through</span>
      <span className="cv-wake__line"><span><i /> Woke up 2:00 PM</span></span>
      {DAY.map((r, i) => (
        <span
          key={r.label}
          className={`cv-row t-${r.tone} ${r.flag ? "is-flag" : ""} ${r.tmrw ? "is-tmrw" : ""}`}
          style={v({ "--i": i, "--oy": `${r.o[1]}%`, "--ny": `${r.n[1]}%` })}
        >
          <em><Swap a={r.o[0]} b={r.tmrw ? "→" : r.n[0]} /></em>
          {r.label}
          {r.lock && <Lock size={11} />}
          {r.flag && <small className="cv-row__note">flagged</small>}
          {r.tmrw && <small className="cv-row__note">tomorrow</small>}
        </span>
      ))}
    </div>
  );
}

/* 05 · Talking to it: five steps become one sentence */
const STEPS: [string, string][] = [
  ["Open", "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"],
  ["Find", "M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM20 20l-4.6-4.6"],
  ["Edit", "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4"],
  ["Type", "M3 7h18v10H3zM6 10h1M9 10h1M12 10h1M15 10h1M7 14h10"],
  ["Save", "M5 12.5l4.2 4.2L19 7"],
];
export function SceneTalk() {
  return (
    <div className="cv cv-talk">
      <div className="cv-talk__old">
        {STEPS.map(([l, d], i) => (
          <div key={l} className="cv-step" style={v({ "--i": i })}>
            <span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg></span>
            <small>{l}</small>
          </div>
        ))}
      </div>
      <div className="cv-talk__now">
        <div className="cv-card" style={v({ "--i": 0 })}>
          <span className="cv-card__app"><Mic size={11} /></span>
          <div><b>Nowline</b><span>Time for OS homework</span></div>
        </div>
        <div className="cv-voice" style={v({ "--i": 1 })}><span className="cv-voice__mic"><Mic size={12} /></span><Wave bars={5} /> “I need 30 more minutes.”</div>
        <div className="cv-card cv-card--done" style={v({ "--i": 2 })}>
          <NowieDot size={18} />
          <div><b>Done</b><span>Gym → 6:30 · Reading → tomorrow</span></div>
          <span className="cv-undo"><Undo size={10} /> Undo</span>
        </div>
      </div>
    </div>
  );
}

export const SCENES = [ScenePlan, ScenePace, SceneDue, SceneWake, SceneTalk] as const;
