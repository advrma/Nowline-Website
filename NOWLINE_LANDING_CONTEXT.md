# Nowline — Landing Page Context

> Everything needed to design and build the marketing landing page at **nowline.org**.
> Read this fully before writing code. Last updated: Oct 28, 2026.

---

## 1. The goal of the page

One job: **get visitors to join the waitlist.**

Everything on the page should make a student think "I want this" and then hand them an easy way to sign up. The page should feel like an Apple product launch page: light, calm, premium, with beautiful 3D and glass elements that make people curious to try the app.

- **Primary action:** Join the waitlist (email sign-up).
- **Offer:** everyone on the waitlist gets **1 month free** and **early access** before the public launch.
- **Status:** Coming soon to the App Store (iPhone first), launching in the next couple of weeks.
- **Traffic sources:** a QR code shown in a class presentation (mostly people on phones, scanning from their seats), plus links shared in student group chats. **Design mobile-first.** The waitlist form must be reachable within one scroll on a phone.

---

## 2. The product

### One-liner
**Nowline is a voice-first AI assistant that plans your day, keeps you on pace, and re-plans the moment your day changes. Built for students.**

### Names
- **Nowline** is the app.
- **Nowie** is the AI assistant inside it ("Nowline, with Nowie").
- Always write "Nowline" (capital N). The logo wordmark may be lowercase.

### Tagline options
- **Your day, handled. Just say it.** (primary)
- Other planners show your day. Nowline runs it with you.
- You had a plan. Then the day happened.

### The problem it solves
- Planners assume your day goes to plan. Student days never do: late nights, a class that runs long, surprise group meetings, work shifts.
- Deadlines live in Canvas, so planners never find out when a professor moves a due date.
- Once you fall behind, most planners make you feel guilty, so you stop opening them right when you need them.

### How it works (3 steps)
1. **Dump it.** At night, tell Nowie everything on your mind, by voice or text.
2. **Nowline plans it.** It fits everything around your classes, shifts, and sleep, and builds your routine.
3. **Nowie keeps you on it.** It nudges you through the day and re-plans the moment things change. You never drag tasks around yourself.

### Key features (student-first)
| Feature | What it means for the user |
| --- | --- |
| **Voice-first replies** | Every notification is a conversation. Reply "I need 30 more minutes" and the rest of your day re-plans itself. One tap to undo. |
| **Wake-up rebuilds** | Woke up at 2 PM? Say so and the day rebuilds. Classes and shifts stay locked; Nowline flags anything you missed; everything else fits into the time you have left. |
| **Canvas sync** | Connect Canvas once and every assignment appears with its due date. When a professor moves a due date, Nowline catches it and re-spreads your work. Tap a block to open the assignment. |
| **Deadlines → daily hours** | Give a big deadline and a rough hour estimate; Nowline works backward and spreads work by how free each day is (busy days get less, free days get more). |
| **Live pace tracking** | Always shows whether you're ahead, on track, or behind. When you're behind, it hands you a concrete fix ("shorten lunch, move reading to tomorrow") you apply with one tap. |
| **Bad-day mode** | Say "rough day" and the plan shrinks to the 2–3 true must-dos; the rest moves without guilt. No red badges. |
| **Handles the small stuff** | Nowie drafts texts ("tell the group I'm running late"), adds calendar events, sets reminders, and works with Siri. It never sends anything without your tap. |
| **Undo everything** | Every change Nowie makes can be undone with one tap. |

### Under the hood (for an optional "how it's built" line, not a main section)
Native iPhone app (SwiftUI). A deterministic scheduling engine on the phone makes every planning decision, so re-plans are instant. Simple replies ("done", "+15 min") are handled on-device; Gemini handles harder requests through function calling.

### Comparison (use as a section or table)
| | Typical planners | Nowline |
| --- | --- | --- |
| Who builds your day | You drag every task | Nowie plans it for you |
| You fall behind | You notice later | A catch-up plan, right away |
| A due date moves | You find out too late | Your plan updates itself |
| You wake up late | Rebuild it by hand | Rebuilt automatically |
| Talking to it | Tap and type in the app | Reply to any notification by voice |

Do **not** name competitors (e.g. Structured, Motion) on the page.

---

## 3. Brand and design direction

### Overall feel
- **Apple keynote / product page aesthetic.** Light theme, minimal, lots of whitespace, big confident headlines, one idea per section.
- **Liquid glass.** Frosted, translucent white cards with soft blur, a bright 1px edge, and soft shadows, floating over pastel glows.
- **3D elements.** Realistic floating iPhone(s) showing the app, with UI cards (notifications, Nowie replies, pace pills) popping **out of the screen** into 3D space. Subtle parallax and scroll-driven motion.
- **Calm, not loud.** Soft pastel gradients (mint, lavender, peach) on an off-white base. No neon, no dark mode as the default.
- **Real, not gimmicky.** iPhone mockups should look like a real current iPhone: thin titanium edge, black bezel, Dynamic Island, real status bar (time, signal, Wi-Fi, battery), home indicator, side buttons. Screens are light-mode iOS UI.

### Color tokens
| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#F4F5F1` | Main page background (toned off-white) |
| `bg-cool` | `#ECEFF7` | Alternate section background |
| `bg-warm` | `#F6F1EE` | Alternate section background (bad-day / emotional) |
| `ink` | `#111417` | Headlines |
| `body` | `#4B5560` | Body text |
| `muted` | `#6B7580` | Captions, labels |
| `mint-deep` | `#0F7A66` | Accent text, links, primary button text on light |
| `mint` | `#2FB596` | Accent fills, lines |
| `mint-soft` | `#7FE3C8` | Glows, gradient stops |
| `violet` | `#5B4BD6` | Secondary accent text |
| `lavender` | `#A99BFF` | Glows, gradient stops |
| `peach` | `#FFC4A0` | Warm glows |
| `amber-text` | `#A0561A` | "Behind" / warning states |
| `logo-dark` | `#121619` | Logo tile |
| `logo-cream` | `#F3EBD8` | Logo pixels |

**Signature gradients**
- Headline gradient: `linear-gradient(100deg, #111417 35%, #0F7A66 100%)` (clip to text).
- Accent gradient (buttons, mic, orb): `linear-gradient(135deg, #7FE3C8 0%, #A99BFF 100%)`.
- Waitlist section background: `linear-gradient(120deg, #CFF5EA 0%, #E3DEFF 55%, #FFE6D6 100%)`.
- Background glows: large soft radial gradients of mint `rgba(127,227,200,0.55)`, lavender `rgba(169,155,255,0.45)`, and peach `rgba(255,196,160,0.4)` fading to transparent.

**Glass card recipe**
```css
background: linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,255,255,0.55));
border: 1px solid rgba(255,255,255,0.95);
box-shadow: 0 30px 80px rgba(40,50,80,0.14), inset 0 1px 0 #fff;
backdrop-filter: blur(20px) saturate(1.8);
border-radius: 32px;
```

### Typography
- **Inter** (Google Fonts), weights 300–800. One family for everything.
- Headlines: 700, tight letter-spacing (about -0.03em to -0.04em), very large on desktop.
- Eyebrow labels: 600, uppercase, letter-spacing about 0.15em, in `mint-deep`.
- Body: 400, comfortable line-height (1.4–1.5).

### Logo
- A dark rounded-square tile (`#121619`) containing a **pixel-style ">" chevron** made of cream (`#F3EBD8`) square cells, plus a **vertical bar** to its right (like a terminal prompt `>|`).
- Chevron: 5 rows of 2-cell-wide pixels stepping right then back left; the bar spans the same 5-row height.
- Wordmark: "nowline" or "Nowline" in Inter 700 next to the tile.
- I'll provide the real logo file if available; otherwise rebuild it as an SVG from this description.

### Assistant visual (Nowie)
- A small glowing orb using the accent gradient (mint → lavender), soft shadow. Used as Nowie's avatar.

### Voice of the copy
- Friendly, calm, a little playful, never guilt-tripping.
- Short sentences. Talk to "you". Student-specific examples (Canvas, OS homework, capstone, group project, shifts, sleeping in).
- **Never invent statistics, user counts, ratings, or testimonials.** The app isn't launched yet.

---

## 4. Suggested page structure

1. **Nav** (sticky glass bar): logo + wordmark, a few anchor links, and a **"Join the waitlist"** button.
2. **Hero**
   - Eyebrow: "Coming soon to iPhone"
   - Headline: "Your day, handled." Subhead: "Nowline is the voice-first AI assistant that plans your day and re-plans it when life happens. Built for students."
   - Primary CTA: email field + "Join the waitlist" (inline in the hero). Small note under it: "1 month free + early access for everyone on the waitlist."
   - Visual: a 3D floating iPhone showing the Today screen, with glass cards popping out ("Nowie · Moved gym to 6:30 so you can finish your capstone · Undo", an "On track ✓" pill, "From Canvas · OS Homework 4 · due Thu").
3. **The problem**: "You had a plan. Then the day happened." Floating chips: "Slept through your alarm", "Canvas moved a due date", "Group meeting at 4 PM", "Work shift at 6 PM", "Quiz you forgot about".
4. **How it works**: the 3 steps as glass cards with big gradient numbers.
5. **Feature: Just reply (voice first)**: lock-screen notification "Time for OS homework" → voice bubble with waveform "I need 30 more minutes." → Nowie: "Done. Gym moved to 6:30, reading to tomorrow. Undo". Ideally animated on scroll.
6. **Feature: Slept in? Your day rebuilds itself**: before/after timeline (plan with 8 AM wake vs. 2 PM wake; locked classes stay, missed lecture flagged, rest re-fit).
7. **Feature: Canvas changes. Your plan keeps up**: phone with a Deadlines screen + popping notification "OS Homework 5 moved to Nov 6. You're now at 45 min a day instead of 1.5 h."
8. **Feature: Big deadlines, broken into today + pace**: daily-hours bar chart (busy days less, free days more) and a "20 min behind → here's the fix → Apply fix" card.
9. **Feature: Bad-day mode**: "Rough day? Just the must-dos." Warm background. "8 things today" → "2 must-dos · the rest moved to tomorrow".
10. **Feature: It handles the small stuff**: floating cards for Messages ("Running 10 min late, start without me!"), Calendar, Siri ("Hey Siri, tell Nowline I'm running late."), Reminders. Note: "Nowie never sends anything without your tap."
11. **Comparison**: the Typical planners vs. Nowline table. Closing line: "Other planners show your day. Nowline runs it with you."
12. **Waitlist (final CTA)**: pastel gradient section. "Get it first." Perks: **1 month free** and **early access**. Email form + "Coming soon on the App Store" badge.
13. **FAQ** (short): When does it launch? (Next couple of weeks, iPhone first.) Is it free? (Waitlist members get the first month free.) Android? (Not yet, iPhone first.) Does it need Canvas? (No, Canvas is optional.) Does Nowie send messages on its own? (Never; you always tap send.)
14. **Footer**: logo, "Made by a student at ASU", privacy policy link, contact email.

---

## 5. Waitlist form

- Fields: **email only** (optionally a "Do you use Canvas?" yes/no or school name, but keep friction minimal).
- Show the form in the hero **and** the final section.
- Success state: a friendly glass confirmation ("You're on the list. Your free month is saved.") plus a share prompt ("Send this to a friend who always wakes up late").
- Validate email client-side; prevent duplicate sign-ups server-side.
- Store sign-ups somewhere I can export (e.g. Supabase table, Resend/Loops audience, or a form service). **Ask me which before building the backend.**
- Never expose secret keys in client code.

---

## 6. 3D and motion

- **Hero phone:** a realistic iPhone that tilts slightly with the cursor (desktop) or scroll (mobile). Options: React Three Fiber with a GLB iPhone model, Spline embed, or a CSS 3D-transformed DOM mockup (lightest and sharpest for text). Prefer a DOM/CSS mockup for the screen UI so text stays crisp; use 3D for the device frame and floating cards.
- **Pop-out cards:** glass cards sit at different depths (translateZ / parallax) in front of the phone and drift slightly on scroll.
- **Scroll storytelling:** sections reveal with soft fade/rise; the voice-reply flow can play as a short sequence when it scrolls into view.
- **Background:** slowly drifting pastel glows (very subtle).
- **Respect `prefers-reduced-motion`**: disable parallax and drifting, keep simple fades.
- **Performance:** lazy-load any 3D scene below the hero, keep the hero fast on mid-range phones (target LCP under 2.5 s), and provide a static image fallback if WebGL isn't available.

---

## 7. Suggested tech stack (adjust if I say otherwise)

- **Next.js (App Router) + TypeScript + Tailwind CSS**
- **Framer Motion** for scroll and reveal animations
- **React Three Fiber + drei** (or Spline) for 3D elements
- Deploy on **Vercel**, connect the domain **nowline.org**
- Waitlist storage: see §5 (ask first)
- Analytics: something privacy-friendly (e.g. Vercel Analytics or Plausible); track waitlist sign-ups as the main conversion.

---

## 8. SEO and sharing

- Title: "Nowline: your day, handled. The voice-first AI planner for students"
- Meta description: "Nowline plans your day, keeps you on pace, and re-plans when life happens. Reply to notifications by voice, sync Canvas deadlines, and join the waitlist for a free month."
- Open Graph image (1200×630): light background, floating iPhone with the Today screen, headline "Your day, handled.", nowline.org.
- Favicon / app icon: the pixel chevron logo tile.

---

## 9. Accessibility

- Text contrast at least 4.5:1 (body) and 3:1 (large headlines), including on glass and pastel backgrounds.
- All interactive elements keyboard-accessible with visible focus states.
- Meaningful `alt` text on mockups; decorative 3D marked as decorative.
- Form has a proper label, error messages, and success announcement for screen readers.

---

## 10. Rules and constraints

- **No made-up numbers, users, ratings, reviews, or testimonials.** The app is pre-launch.
- **App Store badge:** Apple's logo and badges are Apple trademarks. Until the app is live or on pre-order, use a plain "Coming soon on the App Store" text badge (black rounded pill, white text, no Apple logo). Once the app has a pre-order listing, swap in Apple's official "Pre-order on the App Store" badge from Apple's marketing resources.
- **Don't copy other apps' designs** (especially Structured). Keep Nowline's own colors, logo, and layout.
- **Phone screens show light-mode UI** consistent with the app: off-white screens, white cards, pastel time blocks with a colored left edge, mint "On track" pill, white "Ask Nowie anything…" bar with a gradient mic button.
- Use real-sounding but clearly example data (CSE 340 lecture, Capstone report, OS Homework, Data Viz project, Gym, Read ch. 5).
- Include a privacy policy page before collecting emails.

---

## 11. Open questions (ask me before deciding)

- Which waitlist backend/service to use?
- Do we send a confirmation email to new sign-ups? From which address?
- Should there be a referral mechanic (e.g. "move up the list by inviting friends")?
- Do I have a real logo SVG and real app screenshots to use instead of recreated mockups?
- Exact launch date to show, or keep "coming soon"?
