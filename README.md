# nowline.org

Landing page + waitlist for Nowline. Next.js 15 (App Router), GSAP + ScrollTrigger, Lenis, plain CSS.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

## Connect the waitlist to Supabase

Until this is set up, sign-ups are accepted and only logged to the server console, so the page can be tested end to end.

1. Create a Supabase project.
2. Open **SQL Editor**, paste [`supabase/schema.sql`](supabase/schema.sql), and run it. That creates the `waitlist` table with a case-insensitive unique email and RLS turned on.
3. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API).
4. On Vercel, add the same two variables under Project → Settings → Environment Variables.

The service role key is only used in [`app/api/waitlist/route.ts`](app/api/waitlist/route.ts), on the server. Duplicate emails come back as "already on the list" instead of an error. The route also has a honeypot field and a light per-IP rate limit.

Export sign-ups from the Supabase table editor (CSV) or with:

```sql
select email, source, created_at from public.waitlist order by created_at;
```

## Where things live

| Path | What |
| --- | --- |
| `components/Phone.tsx` | The CSS-3D iPhone (edge slabs, buttons, Dynamic Island) and `Pop` cards that float in front of the glass |
| `components/screens.tsx` | Today, Lock screen and Deadlines screens |
| `components/Motion.tsx` | Lenis + ScrollTrigger setup, reveal observer, section tone morphing, liquid-glass SVG filter |
| `components/sections/Story.tsx` | The sticky hero + four-chapter story: one phone that glides left/right as you scroll |
| `components/WaveField.tsx` | WebGL light-wave background (half-res, ~30fps, pauses when hidden) |
| `components/GlassFilters.tsx` | `#chroma` SVG filter: glass refraction with per-channel (chromatic) displacement, Chromium only |
| `components/sections/*` | One file per section |
| `lib/waitlist.ts` | Client submit + shared "joined" state across all forms |
| `app/privacy/page.tsx` | Privacy policy (review before launch) |

Everything respects `prefers-reduced-motion`. Liquid-glass refraction only renders in Chromium. Other browsers get the frosted blur.
