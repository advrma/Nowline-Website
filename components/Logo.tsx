// Traced from "Nowline logo.png" (1024 grid): a 9-row pixel ">" that is 3 cells
// thick through the diagonal, plus a 2-cell-wide prompt bar on the lower five rows.
const P = 60; // cell pitch
const S = 54; // cell size
const X0 = 238;
const Y0 = 238;

const CHEVRON_ROWS: number[][] = [
  [0, 1],
  [0, 1, 2],
  [1, 2, 3],
  [2, 3, 4],
  [3, 4, 5],
  [2, 3, 4],
  [1, 2, 3],
  [0, 1, 2],
  [0, 1],
];

export const CELLS: { x: number; y: number; bar: boolean }[] = [
  ...CHEVRON_ROWS.flatMap((cols, r) => cols.map((c) => ({ x: X0 + c * P, y: Y0 + r * P, bar: false }))),
  ...[4, 5, 6, 7, 8].flatMap((r) => [688, 748].map((x) => ({ x, y: Y0 + r * P, bar: true }))),
];

export function LogoMark({ size = 32, animated = false, glow = true, className = "" }: { size?: number; animated?: boolean; glow?: boolean; className?: string }) {
  const id = `lm${size}${animated ? "a" : ""}`;
  return (
    <svg
      className={`logo-mark ${animated ? "logo-mark--anim" : ""} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      aria-hidden="true"
    >
      <defs>
        <pattern id={`${id}-scan`} width="8" height="9" patternUnits="userSpaceOnUse">
          <rect width="8" height="9" fill="#F7EEDC" />
          <rect y="6" width="8" height="3" fill="#E6D9BE" />
        </pattern>
        <pattern id={`${id}-dots`} width="60" height="60" x="28" y="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="2" fill="#2A2620" />
        </pattern>
        {glow && (
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" result="b" />
            <feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 .93 0 0 0  0 0 .8 0 0  0 0 0 .75 0" result="g" />
            <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        )}
      </defs>
      <rect width="1024" height="1024" rx="228" fill="#16130F" />
      <rect width="1024" height="1024" rx="228" fill={`url(#${id}-dots)`} opacity="0.7" />
      <g filter={glow ? `url(#${id}-glow)` : undefined}>
        {CELLS.map((c, i) => (
          <rect
            key={i}
            className={c.bar ? "logo-cell logo-cell--bar" : "logo-cell"}
            style={{ ["--i" as string]: i }}
            x={c.x}
            y={c.y}
            width={S}
            height={S}
            rx="2"
            fill={`url(#${id}-scan)`}
          />
        ))}
      </g>
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} glow={size >= 40} />
      <span className="logo__word">Nowline</span>
    </span>
  );
}
