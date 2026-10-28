"use client";

import { useEffect } from "react";
import { prefersReduced } from "@/lib/gsap";

/** Superellipse displacement map: pixels near the rim are pushed inward, like the edge of thick glass. */
function glassMap(size = 256, inner = 0.6) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x / (size - 1)) * 2 - 1;
      const v = (y / (size - 1)) * 2 - 1;
      const r = Math.pow(Math.pow(Math.abs(u), 4) + Math.pow(Math.abs(v), 4), 0.25);
      const edge = Math.min(1, Math.max(0, (r - inner) / (1 - inner)));
      const k = edge * edge * (3 - 2 * edge);
      const i = (y * size + x) * 4;
      img.data[i] = 128 - u * k * 127;
      img.data[i + 1] = 128 - v * k * 127;
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

const R = "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0";
const G = "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0";
const B = "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0";

/**
 * Refraction with chromatic aberration for glass cards: the backdrop is bent at the rim,
 * once per colour channel at slightly different strengths, so edges fringe red and blue.
 * Only Chromium renders SVG backdrop filters, so the class is added there alone;
 * other browsers keep the frosted blur and the CSS rim fringe.
 */
export function GlassFilters() {
  useEffect(() => {
    const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands;
    if (!brands?.some((b) => /Chromium/.test(b.brand)) || prefersReduced()) return;
    const map = glassMap();
    document.querySelectorAll<SVGFEImageElement>("[data-glass-map]").forEach((el) => el.setAttribute("href", map));
    document.documentElement.classList.add("chroma-on");
  }, []);

  return (
    <svg className="sr-only" aria-hidden="true" focusable="false">
      <filter id="chroma" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" colorInterpolationFilters="sRGB">
        <feImage data-glass-map="" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="0.05" xChannelSelector="R" yChannelSelector="G" result="dr" />
        <feColorMatrix in="dr" type="matrix" values={R} result="r" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="0.07" xChannelSelector="R" yChannelSelector="G" result="dg" />
        <feColorMatrix in="dg" type="matrix" values={G} result="g" />
        <feDisplacementMap in="SourceGraphic" in2="map" scale="0.09" xChannelSelector="R" yChannelSelector="G" result="db" />
        <feColorMatrix in="db" type="matrix" values={B} result="b" />
        <feBlend in="r" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="b" mode="screen" />
      </filter>
    </svg>
  );
}
