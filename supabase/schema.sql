-- ============================================================
-- Hyperfeeds Tracker — Supabase schema
-- Run this once in your Supabase project: SQL Editor → New query → paste → Run.
-- Idempotent: safe to re-run.
-- ============================================================

-- ---- profiles: 1 row per user, holds role ('viewer' | 'lead') ----
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  role        text not null default 'viewer' check (role in ('viewer','lead')),
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

-- A user can read their own profile (no lead check to avoid recursion)
drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles upsert own" on public.profiles;
create policy "profiles upsert own" on public.profiles
  for insert with check (id = auth.uid());

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ---- comments: feedback against any deliverable / track ----
create table if not exists public.comments (
  id            uuid primary key default gen_random_uuid(),
  item_kind     text not null,           -- 'tracks' | 'powerBi' | 'mes'
  item_id       text not null,           -- e.g. 'powerbi' or 'PB-02' or 'MES-11'
  body          text not null,
  author_id     uuid not null references auth.users(id) on delete cascade,
  author_email  text,
  author_name   text,
  created_at    timestamptz default now()
);

create index if not exists comments_item_idx on public.comments(item_kind, item_id, created_at desc);
create index if not exists comments_recent_idx on public.comments(created_at desc);

alter table public.comments enable row level security;

-- helper: is the current user a lead?
create or replace function public.is_lead() returns boolean language sql stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'lead');
$$;

-- SELECT: author can see own; leads can see all
drop policy if exists "comments select" on public.comments;
create policy "comments select" on public.comments
  for select using (author_id = auth.uid() or public.is_lead());

-- INSERT: any logged-in user can post as themselves
drop policy if exists "comments insert" on public.comments;
create policy "comments insert" on public.comments
  for insert with check (author_id = auth.uid());

-- DELETE: author or lead
drop policy if exists "comments delete" on public.comments;
create policy "comments delete" on public.comments
  for delete using (author_id = auth.uid() or public.is_lead());

-- ============================================================
-- After running this, set yourself (Joseph) as the IT Lead:
--    update public.profiles set role = 'lead' where email = 'YOUR-EMAIL@example.com';
-- (Run once you have signed in at least once so your profile row exists.)
-- ============================================================
