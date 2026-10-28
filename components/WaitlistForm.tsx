"use client";

import { useId, useState, type FormEvent } from "react";
import { Arrow, Check, Share } from "./icons";
import { EMAIL_RE, joinWaitlist, shareNowline, useJoined, type Source } from "@/lib/waitlist";

type Props = {
  source: Source;
  size?: "md" | "lg";
  onEmail?: (v: string) => void;
  inputId?: string;
};

export function WaitlistForm({ source, size = "md", onEmail, inputId }: Props) {
  const joined = useJoined();
  const autoId = useId();
  const id = inputId ?? `email-${autoId}`;
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [already, setAlready] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!EMAIL_RE.test(v)) {
      setState("error");
      setMsg("That email doesn't look right. Mind checking it?");
      return;
    }
    setState("busy");
    setMsg("");
    try {
      const r = await joinWaitlist(v, source, hp);
      setAlready(r.already);
      setState("idle");
    } catch (err) {
      setState("error");
      setMsg((err as Error).message);
    }
  }

  async function share() {
    const r = await shareNowline();
    setShareMsg(r === "copied" ? "Link copied." : r === "failed" ? "Copy the URL from your address bar." : "");
  }

  if (joined) {
    return (
      <div className={`wl-done wl-done--${size}`} role="status" aria-live="polite">
        <span className="wl-done__tick"><Check size={18} /></span>
        <div className="wl-done__copy">
          <strong>{already ? "You were already on the list." : "You're on the list."} Your free month is saved.</strong>
          <span>Send this to a friend who always wakes up late.</span>
        </div>
        <button type="button" className="btn btn--ghost wl-done__share" onClick={share}>
          <Share size={15} /> Share
        </button>
        <span className="sr-only" aria-live="polite">{shareMsg}</span>
        {shareMsg && <span className="wl-done__toast">{shareMsg}</span>}
      </div>
    );
  }

  return (
    <form className={`wl wl--${size} ${state === "error" ? "is-error" : ""}`} onSubmit={submit} noValidate>
      <label htmlFor={id} className="sr-only">Email address</label>
      <div className="wl__field gl">
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@school.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            onEmail?.(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error"}
          aria-describedby={`${id}-msg`}
          required
        />
        <button type="submit" className="btn btn--primary wl__btn mag" disabled={state === "busy"}>
          <span className="btn__shine" aria-hidden="true" />
          {state === "busy" ? <span className="wl__spin" aria-label="Joining" /> : <>Join the waitlist <Arrow size={16} /></>}
        </button>
      </div>
      <input
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        name="company"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        aria-hidden="true"
      />
      <p id={`${id}-msg`} className="wl__msg" aria-live="polite">
        {state === "error" ? msg : <><b>1 month free</b> + early access for everyone on the waitlist.</>}
      </p>
    </form>
  );
}
