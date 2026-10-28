type P = { className?: string; size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const Check = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12.5l4.2 4.2L19 7" /></svg>
);
export const Lock = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="5" y="11" width="14" height="9" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
);
export const Mic = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></svg>
);
export const Undo = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M9 14L4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></svg>
);
export const Arrow = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Calendar = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
);
export const Bubble = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M20 11.5c0 4.1-3.6 7.5-8 7.5-1.2 0-2.3-.2-3.3-.6L4 20l1.3-3.6C4.5 15 4 13.3 4 11.5 4 7.4 7.6 4 12 4s8 3.4 8 7.5z" /></svg>
);
export const Bell = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16zM10 20.5a2 2 0 0 0 4 0" /></svg>
);
export const ListCheck = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M4 7l1.5 1.5L8 6M4 13l1.5 1.5L8 12M4 19l1.5 1.5L8 18M11 7h9M11 13h9M11 19h9" /></svg>
);
export const Share = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 15V3M7.5 7.5L12 3l4.5 4.5" /><path d="M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12" /></svg>
);
export const Plus = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 5v14M5 12h14" /></svg>
);
export const Moon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></svg>
);
export const Sparkle = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></svg>
);

// iOS status bar glyphs (filled).
export const Signal = () => (
  <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden="true" fill="currentColor">
    <rect x="0" y="7" width="3" height="4" rx="0.8" /><rect x="4.5" y="5" width="3" height="6" rx="0.8" />
    <rect x="9" y="2.5" width="3" height="8.5" rx="0.8" /><rect x="13.5" y="0" width="3" height="11" rx="0.8" />
  </svg>
);
export const Wifi = () => (
  <svg width="15" height="11" viewBox="0 0 15 11" aria-hidden="true" fill="currentColor">
    <path d="M7.5 2.2c2.2 0 4.2.8 5.7 2.2l1.1-1.2A9.9 9.9 0 0 0 7.5.5 9.9 9.9 0 0 0 .7 3.2l1.1 1.2a8.2 8.2 0 0 1 5.7-2.2z" />
    <path d="M7.5 5.6c1.3 0 2.5.5 3.4 1.3l1.1-1.2a6.6 6.6 0 0 0-9 0l1.1 1.2c.9-.8 2.1-1.3 3.4-1.3z" />
    <path d="M7.5 9.1l1.9-2a2.7 2.7 0 0 0-3.8 0z" transform="translate(0 1.4)" />
  </svg>
);
export const Battery = () => (
  <svg width="26" height="12" viewBox="0 0 26 12" aria-hidden="true">
    <rect x="0.5" y="0.5" width="22" height="11" rx="3.4" fill="none" stroke="currentColor" opacity="0.4" />
    <rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor" />
    <path d="M24 4v4c.8-.3 1.3-1.1 1.3-2S24.8 4.3 24 4z" fill="currentColor" opacity="0.45" />
  </svg>
);
