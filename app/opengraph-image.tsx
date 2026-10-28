import { ImageResponse } from "next/og";

export const alt = "Nowline: your day, handled.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ROWS = [[0, 1], [0, 1, 2], [1, 2, 3], [2, 3, 4], [3, 4, 5], [2, 3, 4], [1, 2, 3], [0, 1, 2], [0, 1]];

export default function OG() {
  const cell = 9;
  const pitch = 10;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 90px",
          background: "#F4F5F1",
          backgroundImage:
            "radial-gradient(circle at 78% 30%, rgba(127,227,200,0.55), transparent 45%), radial-gradient(circle at 90% 85%, rgba(169,155,255,0.45), transparent 45%), radial-gradient(circle at 10% 100%, rgba(255,196,160,0.4), transparent 40%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: "#16130F", position: "relative", display: "flex" }}>
              {ROWS.flatMap((cols, r) =>
                cols.map((c) => (
                  <div key={`${r}-${c}`} style={{ position: "absolute", left: 13 + c * pitch * 0.42, top: 13 + r * pitch * 0.42, width: cell * 0.42, height: cell * 0.42, background: "#F7EEDC" }} />
                ))
              )}
              {[4, 5, 6, 7, 8].flatMap((r) =>
                [0, 1].map((c) => (
                  <div key={`b${r}-${c}`} style={{ position: "absolute", left: 13 + (7.5 + c) * pitch * 0.42, top: 13 + r * pitch * 0.42, width: cell * 0.42, height: cell * 0.42, background: "#F7EEDC" }} />
                ))
              )}
            </div>
            <span style={{ fontSize: 40, fontWeight: 700, color: "#111417", letterSpacing: -1 }}>Nowline</span>
          </div>
          <div style={{ fontSize: 96, fontWeight: 800, color: "#111417", letterSpacing: -4, lineHeight: 1 }}>Your day,</div>
          <div style={{ fontSize: 96, fontWeight: 800, color: "#0F7A66", letterSpacing: -4, lineHeight: 1, marginTop: -24 }}>handled.</div>
          <div style={{ fontSize: 30, color: "#4B5560" }}>The voice-first AI planner for students · nowline.org</div>
        </div>
        <div
          style={{
            width: 270,
            height: 540,
            borderRadius: 52,
            background: "#1d1f22",
            padding: 10,
            display: "flex",
            boxShadow: "0 40px 90px rgba(40,50,80,0.25)",
            transform: "rotate(6deg)",
          }}
        >
          <div style={{ flex: 1, borderRadius: 42, background: "#F7F8F5", display: "flex", flexDirection: "column", padding: "52px 18px 18px", gap: 10 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#111417" }}>Today</div>
            <div style={{ alignSelf: "flex-start", fontSize: 15, fontWeight: 600, color: "#0F7A66", background: "#DDF6EE", borderRadius: 99, padding: "4px 12px" }}>On track</div>
            {[["#EEEAFF", "#8B7CF0", "CSE 340 Lecture"], ["#E3F7F0", "#2FB596", "Capstone report"], ["#FFF0E6", "#F29A62", "Lunch"], ["#E6F0FF", "#5B8DEF", "OS Homework 4"], ["#F7F1E3", "#C9A55B", "Gym"]].map(([bg, edge, t]) => (
              <div key={t} style={{ display: "flex", background: bg, borderLeft: `4px solid ${edge}`, borderRadius: 12, padding: "12px 12px", fontSize: 16, fontWeight: 600, color: "#111417" }}>{t}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
