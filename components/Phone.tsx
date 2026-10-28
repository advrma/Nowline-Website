import type { CSSProperties, ReactNode, Ref } from "react";
import { Battery, Signal, Wifi } from "./icons";

const SLABS = 9;

type PhoneProps = {
  children: ReactNode;
  popouts?: ReactNode;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
  label: string;
  statusTime?: string;
  rigRef?: Ref<HTMLDivElement>;
};

/**
 * A CSS-3D iPhone. The rig keeps preserve-3d all the way down so pop-out
 * cards can live at their own translateZ in front of the glass while the
 * text stays DOM-crisp. Rotation comes from --bx/--by/--bz (scripted) plus
 * --rx/--ry (pointer), and --turn (-1..1) steers the metal highlights.
 */
export function Phone({ children, popouts, width = 300, className = "", style, label, statusTime = "9:41", rigRef }: PhoneProps) {
  const w = typeof width === "number" ? `${width}px` : width;
  return (
    <div className={`phone ${className}`} style={{ ["--pw" as string]: w, ...style }} role="img" aria-label={label}>
      <div className="phone__shadow" aria-hidden="true" />
      <div className="phone__rig" ref={rigRef}>
        {Array.from({ length: SLABS }, (_, i) => (
          <div key={i} className="phone__slab" style={{ ["--z" as string]: i + 1 }} aria-hidden="true" />
        ))}
        <div className="phone__btn phone__btn--action" aria-hidden="true" />
        <div className="phone__btn phone__btn--volup" aria-hidden="true" />
        <div className="phone__btn phone__btn--voldn" aria-hidden="true" />
        <div className="phone__btn phone__btn--power" aria-hidden="true" />
        <div className="phone__front">
          <div className="phone__bezel">
            <div className="phone__screen">
              {children}
              <div className="sb" aria-hidden="true">
                <span className="sb__time">{statusTime}</span>
                <span className="sb__icons"><Signal /><Wifi /><Battery /></span>
              </div>
              <div className="phone__island" aria-hidden="true" />
              <div className="phone__home" aria-hidden="true" />
            </div>
          </div>
          <div className="phone__glare" aria-hidden="true" />
        </div>
        {popouts}
      </div>
    </div>
  );
}

/**
 * A card that floats in the phone's 3D space. Position with left/top.
 * With `on`, it rests flat on the glass and lifts out to depth `z` when on is true.
 */
export function Pop({ children, className = "", style, z = 80, on }: { children: ReactNode; className?: string; style?: CSSProperties; z?: number; on?: boolean }) {
  const toggled = on !== undefined;
  return (
    <div
      className={`pop ${toggled ? "pop--t" : ""} ${on ? "is-on" : ""} ${className}`}
      style={{ [toggled ? "--z-on" : "--pz"]: `${z}px`, ...style } as CSSProperties}
      aria-hidden={toggled ? !on : undefined}
    >
      <div className="pop__float">{children}</div>
    </div>
  );
}
