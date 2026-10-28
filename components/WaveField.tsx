"use client";

import { useEffect, useRef } from "react";

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

// Slow silk-like light bands. Domain-warped sines blend mint, lavender and a
// peach→sky stop over the off-white base, with thin bright ridges for sheen.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_t;
uniform float u_scroll;
out vec4 o;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float t = u_t * 0.045;
  p.y += u_scroll * 1.6;
  p.x += u_scroll * 0.25;

  vec2 q = p;
  q += 0.32 * vec2(sin(q.y * 1.6 + t * 3.1), cos(q.x * 1.25 - t * 2.3));
  q += 0.17 * vec2(sin(q.y * 3.0 - t * 1.7 + 1.3), cos(q.x * 2.6 + t * 1.9));

  float w1 = sin(q.x * 2.1 + q.y * 1.3 + t * 2.0);
  float w2 = sin(-q.x * 1.25 + q.y * 2.5 - t * 1.6 + 2.0);
  float w3 = sin(length(q - vec2(0.55, -0.35)) * 3.1 - t * 2.4);

  vec3 base  = vec3(0.957, 0.961, 0.945);
  vec3 mint  = vec3(0.70, 0.93, 0.855);
  vec3 lav   = vec3(0.835, 0.815, 1.0);
  vec3 peach = vec3(1.0, 0.86, 0.775);
  vec3 sky   = vec3(0.79, 0.88, 1.0);
  float mood = 0.5 + 0.5 * sin(u_scroll * 6.2831 * 0.9);

  vec3 c = base;
  c = mix(c, mint, smoothstep(-0.15, 1.0, w1) * 0.62);
  c = mix(c, lav, smoothstep(-0.05, 1.0, w2) * 0.5);
  c = mix(c, mix(peach, sky, mood), smoothstep(0.15, 1.0, w3) * 0.48);

  float ridge = pow(1.0 - abs(sin((q.x * 1.5 + q.y * 2.1) * 2.0 + t * 2.6 + w2 * 0.8)), 12.0);
  c += ridge * 0.16;
  float shade = pow(1.0 - abs(sin((q.x * 1.05 - q.y * 1.85) * 1.6 - t * 1.8 + w1)), 7.0);
  c -= shade * 0.03;

  c = mix(c, base, smoothstep(0.35, 1.25, uv.y) * 0.35);
  c += (hash(gl_FragCoord.xy + fract(u_t * 7.0)) - 0.5) * 0.014;
  o = vec4(c, 1.0);
}`;

/** Fixed full-screen light field behind everything. Renders at half resolution, ~30fps, and only while the tab is visible. */
export function WaveField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const gl = cv.getContext("webgl2", { antialias: false, alpha: false, depth: false, powerPreference: "low-power" });
    if (!gl) return;

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");

    const scale = 0.5;
    const resize = () => {
      cv.width = Math.max(1, Math.round(window.innerWidth * scale));
      cv.height = Math.max(1, Math.round(window.innerHeight * scale));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uRes, cv.width, cv.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t0 = performance.now();
    let raf = 0;
    let last = -1e9;
    let scroll = 0;
    const draw = (now: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? window.scrollY / max : 0;
      scroll += (target - scroll) * 0.08;
      gl.uniform1f(uT, reduce ? 12 : (now - t0) / 1000);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 33) return;
      last = now;
      draw(now);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start());

    draw(performance.now());
    cv.dataset.on = "";
    start();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div className="wf" aria-hidden="true">
      <canvas ref={ref} />
    </div>
  );
}
