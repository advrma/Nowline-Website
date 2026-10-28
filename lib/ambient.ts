/**
 * Ambient motion clock.
 *
 * Glass with the #chroma filter is re-filtered whenever anything behind or
 * inside it changes. The wave background already changes ~30 times a second,
 * so slow ambient loops (breathing dots, wave bars, floating phone and cards)
 * that run at the display rate would make every glass pane re-filter twice as
 * often. Instead they are paused and advanced on the same frames the
 * background draws, so the glass pays for one update per tick.
 */
const SEL = [
  ".cv .nowie-dot", ".cv .wave i",
  ".stage .phone", ".stage .phone__shadow",
  ".lift__f", ".lift .nowie-dot", ".lift .wave i",
  ".hc .wave i", ".hc .nowie-dot",
  ".cx__timer",
].join(",");

type Tracked = { a: Animation; ct0: number; t0: number };
const tracked = new Map<Animation, Tracked>();
let lastScan = -1e9;

function scan(now: number) {
  lastScan = now;
  for (const t of tracked.values()) if (t.a.playState === "idle") tracked.delete(t.a);
  for (const a of document.getAnimations()) {
    if (tracked.has(a) || !(a instanceof CSSAnimation)) continue;
    const el = (a.effect as KeyframeEffect | null)?.target;
    if (!(el instanceof Element) || !el.matches(SEL)) continue;
    const ct0 = Number(a.currentTime) || 0;
    a.pause();
    tracked.set(a, { a, ct0, t0: now });
  }
}

/** Called by the background on each frame it draws. */
export function tickAmbient(now: number) {
  if (now - lastScan > 400) scan(now);
  for (const t of tracked.values()) t.a.currentTime = t.ct0 + (now - t.t0);
}
