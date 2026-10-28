import type { Tone } from "@/components/screens";

const DAY_END = 23 * 60;
const GAP = 10;

export type PlanItem = { id: string; title: string; start: number; end: number; tone: Tone; kind: "locked" | "task" | "missed" };

const LOCKED = [
  { id: "lec", title: "CSE 340 Lecture", start: 10 * 60 + 30, end: 11 * 60 + 45, tone: "lav" as Tone, what: "Class" },
  { id: "shift", title: "Work shift", start: 18 * 60, end: 21 * 60, tone: "lav" as Tone, what: "Shift" },
];
const TASKS = [
  { id: "lunch", title: "Lunch", dur: 40, tone: "peach" as Tone, earliest: 11 * 60 + 45 },
  { id: "cap", title: "Capstone report", dur: 90, tone: "mint" as Tone },
  { id: "os", title: "OS Homework 4", dur: 90, tone: "sky" as Tone },
  { id: "read", title: "Read ch. 5", dur: 45, tone: "sand" as Tone },
  { id: "gym", title: "Gym", dur: 60, tone: "peach" as Tone },
  { id: "viz", title: "Data Viz project", dur: 60, tone: "mint" as Tone },
];

/** Every block the rebuild can show, so rows can animate between plans. */
export const PLAN_BLOCKS = [
  ...LOCKED.map((l) => ({ id: l.id, title: l.title, tone: l.tone, what: l.what })),
  ...TASKS.map((t) => ({ id: t.id, title: t.title, tone: t.tone, what: "" })),
];

/** A tiny version of the idea: locked blocks stay, missed ones are flagged, the rest is re-fit by priority. */
export function plan(wake: number) {
  const start = wake + 30;
  const items: PlanItem[] = [];
  const locked = LOCKED.filter((l) => {
    if (l.start < start) {
      items.push({ ...l, kind: "missed" });
      return false;
    }
    items.push({ ...l, kind: "locked" });
    return true;
  });
  const left = [...TASKS];
  let cur = start;
  while (cur < DAY_END && left.length) {
    const next = locked.find((l) => l.end > cur);
    if (next && cur >= next.start) {
      cur = next.end + 15;
      continue;
    }
    const limit = next ? next.start - GAP : DAY_END;
    const i = left.findIndex((t) => Math.max(cur, t.earliest ?? 0) + t.dur <= limit);
    if (i === -1) {
      cur = next ? next.end + 15 : DAY_END;
      continue;
    }
    const t = left.splice(i, 1)[0];
    const s = Math.max(cur, t.earliest ?? 0);
    items.push({ id: t.id, title: t.title, start: s, end: s + t.dur, tone: t.tone, kind: "task" });
    cur = s + t.dur + GAP;
  }
  items.sort((a, b) => a.start - b.start);
  return { items, tomorrow: left.map((t) => t.title) };
}

export const clock = (m: number) => {
  const h = Math.floor(m / 60);
  return `${((h + 11) % 12) + 1}:${String(m % 60).padStart(2, "0")}`;
};
export const clock12 = (m: number) => `${clock(m)} ${m < 12 * 60 ? "AM" : "PM"}`;
export const dur = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ""}` : `${m} min`);
