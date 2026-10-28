-- Nowline waitlist table.
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

create table if not exists public.waitlist (
  id          bigint generated always as identity primary key,
  email       text        not null,
  source      text        not null default 'unknown',  -- 'hero' | 'final' | 'sticky'
  uses_canvas boolean,                                   -- optional, null if not asked
  referrer    text,
  user_agent  text,
  created_at  timestamptz not null default now(),
  constraint waitlist_email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint waitlist_email_length check (char_length(email) <= 254)
);

-- One row per address, case-insensitive. The API route treats a conflict
-- here as "already on the list" rather than an error.
create unique index if not exists waitlist_email_unique on public.waitlist (lower(email));

-- Lock the table down. The site writes through the server route with the
-- service role key, which bypasses RLS, so no public policies are needed.
alter table public.waitlist enable row level security;

-- Export later with:  select email, source, created_at from public.waitlist order by created_at;
