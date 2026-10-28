import type { ReactNode } from "react";
import { Check, Lock, Mic, Moon, Undo } from "./icons";
import { PLAN_BLOCKS, clock, clock12, dur, plan } from "@/lib/plan";

export type Tone = "mint" | "lav" | "peach" | "sky" | "sand";

export function Wave({ bars = 5, className = "" }: { bars?: number; className?: string }) {
  return (
    <span className={`wave ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, i) => <i key={i} style={{ ["--i" as string]: i }} />)}
    </span>
  );
}

export function Block({ time, title, meta, tone, locked, className = "" }: {
  time: string; title: string; meta?: ReactNode; tone: Tone; locked?: boolean; className?: string;
}) {
  return (
    <div className={`blk blk--${tone} ${className}`}>
      <span className="blk__time">{time}</span>
      <span className="blk__body">
        <span className="blk__title">{title}</span>
        {meta && <span className="blk__meta">{locked && <Lock size={10} />}{meta}</span>}
      </span>
    </div>
  );
}

export function NowieDot({ size = 22 }: { size?: number }) {
  return <span className="nowie-dot" style={{ width: size, height: size }} aria-hidden="true" />;
}

export function PacePill({ state = "on" }: { state?: "on" | "behind" | "easy" }) {
  return (
    <span className={`pace pace--${state}`}>
      <span className="pace__t pace__t--on"><Check size={11} /> On track</span>
      <span className="pace__t pace__t--behind">20 min behind</span>
      <span className="pace__t pace__t--easy"><Moon size={11} /> Easy day</span>
    </span>
  );
}

export function AskBar() {
  return (
    <div className="ask">
      <span>Ask Nowie anything…</span>
      <span className="ask__mic"><Mic size={14} /></span>
    </div>
  );
}

function Head({ day, title, right }: { day: ReactNode; title: string; right?: ReactNode }) {
  return (
    <div className="today__head">
      <div>
        <div className="today__day">{day}</div>
        <div className="today__title">{title}</div>
      </div>
      {right}
    </div>
  );
}

/** The app's Today screen, as it looks in the hero. */
export function TodayScreen() {
  return (
    <div className="scr scr--today">
      <Head day="Tuesday, Oct 28" title="Today" right={<PacePill />} />
      <div className="today__rail">
        <span style={{ ["--p" as string]: 0.4 }} />
        <em>2 of 5 done</em>
      </div>
      <div className="today__list">
        <Block time="9:00" title="CSE 340 Lecture" meta="Class · locked" tone="lav" locked className="is-done" />
        <Block time="10:30" title="Capstone report" meta="1h 30m · draft section 3" tone="mint" className="is-done" />
        <Block time="12:15" title="Lunch" meta="45 min" tone="peach" />
        <Block time="1:00" title="OS Homework 4" meta="From Canvas · due Thu" tone="sky" />
        <Block time="6:30" title="Gym" meta="Moved by Nowie" tone="sand" />
      </div>
      <div className="toast">
        <NowieDot size={20} />
        <span><b>Nowie</b> Moved gym to 6:30 so you can finish your capstone.</span>
        <span className="toast__undo"><Undo size={11} /> Undo</span>
      </div>
      <AskBar />
    </div>
  );
}

/** Lock screen with Nowline's notification thread. `step` walks through the voice reply. */
export function LockScreen({ step, reply }: { step: number; reply: string }) {
  return (
    <div className="scr scr--lock">
      <div className="lock__wall" aria-hidden="true" />
      <div className="lock__date">Tuesday, October 28</div>
      <div className="lock__time">12:58</div>
      <div className="lock__stack">
        <div className={`ln ${step >= 1 ? "is-in" : ""} ${step >= 2 ? "is-listening" : ""}`}>
          <span className="ln__app"><Mic size={12} /></span>
          <div className="ln__body">
            <div className="ln__top"><b>Nowline</b><span>now</span></div>
            <p>Time for OS homework · 1:00 – 2:30</p>
            <span className="ln__hint">{step >= 2 ? <><Wave bars={4} /> Listening…</> : "Hold to reply by voice"}</span>
          </div>
        </div>
        <div className={`ln ln--nowie ${step >= 3 ? "is-in" : ""}`}>
          <NowieDot size={20} />
          <div className="ln__body">
            <div className="ln__top"><b>Nowie</b><span>now</span></div>
            <p>{reply}<i className={`caret ${step === 3 ? "is-on" : ""}`} /></p>
            <span className={`chip-undo chip-undo--sm ${step >= 4 ? "is-in" : ""}`}><Undo size={10} /> Undo</span>
          </div>
        </div>
      </div>
      <div className="lock__dock" aria-hidden="true"><span /><span /></div>
    </div>
  );
}

/** Today, rebuilt around whenever you actually woke up. Rows slide between plans. */
export function RebuildScreen({ wake }: { wake: number }) {
  const { items, tomorrow } = plan(wake);
  const ROW = 2.95;
  let parked = items.length;
  return (
    <div className="scr scr--rb">
      <Head
        day={<>Woke up at <b className="rb__wake">{clock12(wake)}</b></>}
        title="Today"
        right={<span className="pace pace--on"><Check size={11} /> Rebuilt</span>}
      />
      <div className="rb" style={{ height: `${PLAN_BLOCKS.length * ROW}em` }}>
        {PLAN_BLOCKS.map((b) => {
          const idx = items.findIndex((i) => i.id === b.id);
          const it = items[idx];
          const slot = idx === -1 ? parked++ : idx;
          const meta =
            !it ? "Moved to tomorrow"
            : it.kind === "missed" ? "Missed · flagged for you"
            : it.kind === "locked" ? `${b.what} · locked`
            : dur(it.end - it.start);
          return (
            <div
              key={b.id}
              className={`rb__row ${!it ? "is-gone" : ""} ${it?.kind === "missed" ? "is-missed" : ""}`}
              style={{ transform: `translate3d(${it ? 0 : 0.8}em, ${slot * ROW}em, 0)` }}
            >
              <Block time={it ? clock(it.start) : "—"} title={b.title} meta={meta} tone={b.tone} locked={it?.kind === "locked"} />
            </div>
          );
        })}
      </div>
      <div className={`rb__tmrw ${tomorrow.length ? "is-in" : ""}`}>
        <span>Tomorrow</span> {tomorrow.join(" · ") || "Nothing moved"}
      </div>
    </div>
  );
}

const PACE = [
  { id: "lec", time: "9:00", title: "CSE 340 Lecture", meta: "Class · locked", tone: "lav", must: true, locked: true },
  { id: "cap", time: "10:30", title: "Capstone report", meta: "1h 30m", tone: "mint" },
  { id: "lunch", time: "12:15", title: "Lunch", meta: "45 min", fixed: "30 min · shortened", tone: "peach" },
  { id: "os", time: "1:00", title: "OS Homework 4", meta: "From Canvas · due Thu", tone: "sky", must: true },
  { id: "read", time: "3:00", title: "Read ch. 5", meta: "45 min", fixed: "Moved to tomorrow", tone: "sand" },
  { id: "viz", time: "4:00", title: "Data Viz project", meta: "1h", tone: "mint" },
  { id: "gym", time: "6:30", title: "Gym", meta: "1h", tone: "peach" },
  { id: "ta", time: "8:00", title: "Email the TA", meta: "10 min", tone: "lav" },
] as const;

/** Today with live pace. `fixed` applies Nowie's catch-up plan, `rough` shrinks it to the must-dos. */
export function PaceScreen({ fixed, rough }: { fixed: boolean; rough: boolean }) {
  return (
    <div className={`scr scr--pace ${fixed ? "is-fixed" : ""} ${rough ? "is-rough" : ""}`}>
      <Head
        day={<span className="pc__count"><span>8 things today</span><span>2 must-dos</span></span>}
        title="Today"
        right={<PacePill state={rough ? "easy" : fixed ? "on" : "behind"} />}
      />
      <div className="pc">
        {PACE.map((b) => (
          <div key={b.id} className={`pc__row ${"must" in b ? "is-must" : ""} ${"fixed" in b ? `is-fx is-fx--${b.id}` : ""}`}>
            <div className="pc__in">
              <Block
                time={b.time}
                title={b.title}
                tone={b.tone}
                locked={"locked" in b}
                meta={"fixed" in b ? <span className="pc__flip"><span>{b.meta}</span><span>{b.fixed}</span></span> : b.meta}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="pc__moved"><Moon size={11} /> 6 moved to tomorrow. No guilt.</div>
      <AskBar />
    </div>
  );
}

export function DeadlinesScreen() {
  return (
    <div className="scr scr--dl">
      <Head day="From Canvas · synced" title="Deadlines" />
      <div className="seg"><span className="is-on">This week</span><span>Later</span></div>
      <div className="dl">
        <div className="dl__row">
          <span className="dl__tag dl__tag--sky">CSE 330</span>
          <span className="dl__name">OS Homework 4</span>
          <span className="dl__due">Thu</span>
          <span className="dl__load">1h / day</span>
        </div>
        <div className="dl__row dl__row--moved">
          <span className="dl__tag dl__tag--sky">CSE 330</span>
          <span className="dl__name">OS Homework 5</span>
          <span className="dl__due">
            <span className="dl__flip"><span className="dl__old">Nov 4</span><span className="dl__new">Nov 6</span></span>
          </span>
          <span className="dl__load">
            <span className="dl__flip"><span className="dl__old">1.5h / day</span><span className="dl__new">45m / day</span></span>
          </span>
        </div>
        <div className="dl__row">
          <span className="dl__tag dl__tag--mint">CSE 485</span>
          <span className="dl__name">Capstone report draft</span>
          <span className="dl__due">Nov 10</span>
          <span className="dl__load">50m / day</span>
        </div>
        <div className="dl__row">
          <span className="dl__tag dl__tag--lav">CSE 494</span>
          <span className="dl__name">Data Viz project</span>
          <span className="dl__due">Nov 14</span>
          <span className="dl__load">40m / day</span>
        </div>
        <div className="dl__row">
          <span className="dl__tag dl__tag--peach">ENG 102</span>
          <span className="dl__name">Read ch. 5</span>
          <span className="dl__due">Fri</span>
          <span className="dl__load">25m / day</span>
        </div>
      </div>
      <AskBar />
    </div>
  );
}
