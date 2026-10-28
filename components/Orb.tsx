"use client";

import { useEffect, useRef } from "react";

// Adapted from the liquid gooey orb shader: a deforming glass blob with
// swirling liquid inside and a glow that stays outside the silhouette.
// Reworked to output real alpha so it composites on light backgrounds.
const VERT = `#version 300 es
layout(location=0) in vec2 a;
out vec2 uv;
void main(){ uv = a*0.5+0.5; gl_Position = vec4(a,0.,1.); }`;

const FRAG = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 o;
uniform float T;
uniform float E;      // energy: 0 idle, 1 listening
uniform vec2 R;
const vec3 MINT = vec3(0.498,0.890,0.784);
const vec3 MINTD = vec3(0.184,0.710,0.588);
const vec3 LAV = vec3(0.663,0.608,1.0);
const vec3 PEACH = vec3(1.0,0.769,0.627);

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
float field(vec3 p){
  float t = T*.38, f = 1.7;
  float d = sin(p.x*2.6*f+t) + sin(p.y*2.9*f-t*.8+1.3) + sin(p.z*3.2*f+t*1.2+2.7)
          + sin((p.x+p.z)*2.2*f-t*.9+4.1) + sin((p.y-p.x)*2.4*f+t*.7+.6);
  return d*.2;
}
float map(vec3 p){
  float t = T*.07;
  p.xy *= rot(t*.7); p.yz *= rot(t*.5);
  return length(p) - (.52 + (.10+E*.07)*field(p));
}
vec3 nrm(vec3 p){
  vec2 e = vec2(.002,0.);
  return normalize(vec3(map(p+e.xyy)-map(p-e.xyy), map(p+e.yxy)-map(p-e.yxy), map(p+e.yyx)-map(p-e.yyx)));
}
float h13(vec3 p){ p=fract(p*.1031); p+=dot(p,p.zyx+31.32); return fract((p.x+p.y)*p.z); }
float vn(vec3 p){
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h13(i),h13(i+vec3(1,0,0)),f.x), mix(h13(i+vec3(0,1,0)),h13(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h13(i+vec3(0,0,1)),h13(i+vec3(1,0,1)),f.x), mix(h13(i+vec3(0,1,1)),h13(i+vec3(1,1,1)),f.x),f.y), f.z);
}
float fbm(vec3 p){ float v=0., a=.5; for(int i=0;i<3;i++){ v+=a*vn(p); p*=2.03; a*=.5; } return v; }
float liquid(vec3 p){
  float t = T*.22; p *= 2.2;
  p.xy *= rot(t*.15); p.yz *= rot(t*.1);
  vec3 w = vec3(fbm(p+t*.2), fbm(p+vec3(4.3,1.2,-t*.15)), fbm(p.zxy+vec3(7.7,2.3,t*.1)));
  return fbm(p+1.8*w);
}
void main(){
  vec2 p = uv*2.-1.;
  p.x *= R.x/R.y;
  vec3 ro = vec3(0,0,3.), rd = normalize(vec3(p,-2.6));
  float t = 0., md = 1e3; bool hit = false; vec3 pos = ro;
  for(int i=0;i<90;i++){
    pos = ro+rd*t; float d = map(pos); md = min(md,d);
    if(d<.0015){ hit=true; break; }
    t += d*.55; if(t>6.) break;
  }
  if(hit){
    vec3 n = nrm(pos), v = -rd;
    float fr = pow(1.-max(dot(n,v),0.),2.5);
    // pastel glass body, mint at the bottom-left, lavender top-right
    vec3 body = mix(MINT, LAV, clamp(.5+.55*(n.y*.6+n.x*.5),0.,1.));
    body = mix(body, PEACH, smoothstep(.55,1.,-n.y)*.35);
    // liquid swirl inside
    vec3 rp = pos+rd*.04; float tr = 1.; vec3 inner = vec3(0);
    for(int k=0;k<6;k++){
      float raw = liquid(rp);
      float fil = pow(1.-abs(2.*raw-1.),5.);
      vec3 c = mix(MINTD, LAV*.9, .5+.5*sin(raw*6.+T*.15+rp.y*2.5));
      inner += tr*(c*smoothstep(.3,.7,raw)*.5 + vec3(1)*pow(fil,2.)*.9)*.22;
      tr *= .8; rp += rd*.13;
    }
    vec3 col = body*.78 + inner*(1.-fr*.5);
    col = mix(col, vec3(1.), fr*.55);
    vec3 l1 = normalize(vec3(-.5,.8,.6)), l2 = normalize(vec3(.7,-.2,.5));
    col += pow(max(dot(n,normalize(l1+v)),0.),90.)*.9;
    col += pow(max(dot(n,normalize(l2+v)),0.),40.)*.25;
    o = vec4(clamp(col,0.,1.),1.);
  } else {
    float g = exp(-md*7.)*(.55+E*.35);
    float ang = atan(rd.y,rd.x);
    vec3 gc = mix(MINT, LAV, .5+.5*sin(ang*2.+T*.25));
    o = vec4(gc*g, g); // premultiplied
  }
}`;

/** `active` pauses rendering without tearing down the context, e.g. while its screen is hidden. */
export function Orb({ size = 220, energy = 0, active = true, className = "", label }: { size?: number | string; energy?: number; active?: boolean; className?: string; label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const energyRef = useRef(energy);
  energyRef.current = energy;
  const activeRef = useRef(active);
  activeRef.current = active;
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: false });
    if (!gl) {
      wrap.classList.add("orb--fallback");
      return;
    }
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      wrap.classList.add("orb--fallback");
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(prog, "T");
    const uE = gl.getUniformLocation(prog, "E");
    const uR = gl.getUniformLocation(prog, "R");

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let visible = false;
    let e = energyRef.current;
    const t0 = performance.now() - Math.random() * 20000;
    const draw = (now: number) => {
      e += (energyRef.current - e) * 0.06;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, (now - t0) / 1000);
      gl.uniform1f(uE, e);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (visible && activeRef.current && !reduce) raf = requestAnimationFrame(draw);
    };
    kickRef.current = () => {
      cancelAnimationFrame(raf);
      if (visible && activeRef.current) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && activeRef.current) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);
    requestAnimationFrame(draw);
    wrap.classList.add("orb--live");

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  useEffect(() => {
    kickRef.current();
  }, [active]);

  return (
    <div
      ref={wrapRef}
      className={`orb ${className}`}
      style={{ width: size, height: size }}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <span className="orb__css" />
      <canvas ref={canvasRef} />
    </div>
  );
}
