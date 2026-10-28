/* Small full-colour marks for the apps Nowline works with. Drawn inline so they cost no requests. */

type P = { size?: number };
const box = (size = 32) => ({ width: size, height: size, viewBox: "0 0 32 32", "aria-hidden": true as const });

export const CanvasIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <circle cx="16" cy="16" r="6.2" fill="none" stroke="#E0302E" strokeWidth="3.4" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return <circle key={i} cx={16 + Math.cos(a) * 12.2} cy={16 + Math.sin(a) * 12.2} r="2.35" fill="#E0302E" />;
    })}
  </svg>
);

export const CalendarIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <rect x="1" y="1" width="30" height="30" rx="7.5" fill="#fff" />
    <rect x="1" y="1" width="30" height="30" rx="7.5" fill="none" stroke="rgba(0,0,0,.08)" />
    <text x="16" y="10.6" textAnchor="middle" fontSize="6.4" fontWeight="700" fill="#FF3B30" fontFamily="system-ui, sans-serif" letterSpacing=".3">TUE</text>
    <text x="16" y="25.6" textAnchor="middle" fontSize="15" fontWeight="400" fill="#111" fontFamily="system-ui, sans-serif">28</text>
  </svg>
);

export const RemindersIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <rect x="1" y="1" width="30" height="30" rx="7.5" fill="#fff" />
    <rect x="1" y="1" width="30" height="30" rx="7.5" fill="none" stroke="rgba(0,0,0,.08)" />
    {[["#0A84FF", 9], ["#FF3B30", 16], ["#FF9F0A", 23]].map(([c, y]) => (
      <g key={c as string}>
        <circle cx="9" cy={y as number} r="2.6" fill={c as string} />
        <rect x="14" y={(y as number) - 0.8} width="11" height="1.6" rx=".8" fill="#D1D1D6" />
      </g>
    ))}
  </svg>
);

export const MessagesIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <defs>
      <linearGradient id="bi-msg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#67F07F" />
        <stop offset="1" stopColor="#0BBA2D" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="30" height="30" rx="7.5" fill="url(#bi-msg)" />
    <path d="M16 7.2c-5.3 0-9.4 3.4-9.4 7.7 0 2.5 1.4 4.6 3.6 6-.2 1.5-.9 2.8-2 3.8 2.1.1 4-.6 5.3-1.8.8.2 1.6.3 2.5.3 5.3 0 9.4-3.5 9.4-8.3S21.3 7.2 16 7.2z" fill="#fff" />
  </svg>
);

export const SiriIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <defs>
      <radialGradient id="bi-siri" cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#1c1f3a" />
        <stop offset="1" stopColor="#05060d" />
      </radialGradient>
      <filter id="bi-siri-b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1" /></filter>
      <clipPath id="bi-siri-c"><circle cx="16" cy="16" r="14" /></clipPath>
    </defs>
    <circle cx="16" cy="16" r="14" fill="url(#bi-siri)" />
    <g clipPath="url(#bi-siri-c)" filter="url(#bi-siri-b)" style={{ mixBlendMode: "screen" }}>
      <ellipse cx="13" cy="15" rx="9" ry="4.2" fill="#FF2D78" opacity=".9" transform="rotate(-28 13 15)" />
      <ellipse cx="18" cy="17" rx="9" ry="4" fill="#2E9BFF" opacity=".9" transform="rotate(32 18 17)" />
      <ellipse cx="16" cy="13" rx="7" ry="3.2" fill="#8E5BFF" opacity=".85" transform="rotate(4 16 13)" />
      <ellipse cx="16" cy="18" rx="5" ry="2.4" fill="#3CF0D0" opacity=".7" />
    </g>
    <circle cx="16" cy="16" r="13.5" fill="none" stroke="rgba(255,255,255,.18)" />
  </svg>
);

export const NotifyIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <defs>
      <linearGradient id="bi-ntf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FF6A5C" />
        <stop offset="1" stopColor="#F2271E" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="30" height="30" rx="7.5" fill="url(#bi-ntf)" />
    <path d="M16 8.2a5.4 5.4 0 0 0-5.4 5.4v3.3l-1.7 2.6c-.3.5 0 1.1.6 1.1h13c.6 0 .9-.6.6-1.1l-1.7-2.6v-3.3A5.4 5.4 0 0 0 16 8.2z" fill="#fff" />
    <path d="M13.8 22.2a2.3 2.3 0 0 0 4.4 0z" fill="#fff" />
  </svg>
);

export const GeminiIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <defs>
      <linearGradient id="bi-gem" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor="#1C7DFF" />
        <stop offset=".55" stopColor="#8C6CF0" />
        <stop offset="1" stopColor="#E7758A" />
      </linearGradient>
    </defs>
    <path d="M16 2.5c.9 7.3 6.2 12.6 13.5 13.5-7.3.9-12.6 6.2-13.5 13.5C15.1 22.2 9.8 16.9 2.5 16 9.8 15.1 15.1 9.8 16 2.5z" fill="url(#bi-gem)" />
  </svg>
);

export const SwiftIcon = ({ size }: P) => (
  <svg {...box(size)}>
    <defs>
      <linearGradient id="bi-sw" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#FA9A3B" />
        <stop offset="1" stopColor="#F2413A" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="30" height="30" rx="7.5" fill="url(#bi-sw)" />
    <path
      d="M19.6 7.4c3.3 2.3 5 6 4.1 9.2.9 1.1 1.4 2.4 1.2 3.4-.5-.9-1.4-1.3-2.2-1.1-2.6 2.4-7.7 2.6-12.3-.6-1.3-.9-2.4-2-3.2-3.1 2.4 1.7 5.6 2.9 8.7 2.2C12.5 15.5 9.6 12.6 7.6 10c2.6 2.2 5.6 4.1 7.4 5-2.2-2-4.3-4.4-5.6-6.4 2.8 2.6 6.5 5.3 8.6 6.5.9-2.3.4-5.4-1.4-7.7z"
      fill="#fff"
    />
  </svg>
);
