# Hyperfeeds Digital Transformation Tracker

Internal management dashboard with **per-project feedback** for Hyperfeeds Animal Nutrition (Pvt) Ltd.

## Stack
- React 18 + Vite (static, deployed to GitHub Pages)
- Plain CSS — "Quiet Corporate" theme
- **Supabase** (Postgres + magic-link auth) for users + comments
- localStorage for the IT Lead's edits to project metadata (until exported to `src/data/projects.js`)

## Features
- Login via magic link (no passwords) — restricted to people with profiles
- Two roles: **viewer** (writes private feedback) and **lead** (sees all feedback + edits data)
- Per-deliverable feedback threads — viewers' notes are private to them + the lead
- Lead-only **Inbox** tab consolidating all feedback
- Public read-only dashboard for unauthenticated visitors

---

## Supabase setup (one-time, ~5 minutes)

1. Create a free project at **https://supabase.com** → New project
2. From **Project Settings → API** copy:
   - `Project URL`
   - `anon public` key
3. Open **SQL Editor → New query** → paste the contents of `supabase/schema.sql` → **Run**
4. Allow magic-link sign-ins:
   **Authentication → Providers → Email** → enable, ensure "Email OTP" / magic link is on
5. Add the production site to allowed redirect URLs:
   **Authentication → URL Configuration → Redirect URLs** → add
   `https://jkaseke1.github.io/hyperfeeds-tracker-/` and `http://localhost:5173/`

### Make yourself the IT Lead
1. Sign in once at the live site (or `npm run dev`)
2. In Supabase SQL Editor:
   ```sql
   update public.profiles set role = 'lead' where email = 'YOUR-EMAIL@example.com';
   ```
3. Refresh the page — you'll see the **Inbox** tab + Edit buttons.

### Invite the MD and managers
There's no whitelist — anyone with a magic link can sign in and post comments (those comments are private to them + you). To restrict access, in Supabase: **Authentication → Providers → Email** → enable **"Confirm email"** + use **"Disable signups"** and pre-create users in **Authentication → Users → Add user**.

---

## Local development

```bash
npm install
copy .env.local.example .env.local   # create the file, fill values
npm run dev
```

`.env.local` example:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

If env vars are missing, the app runs without auth (Comments + Login are disabled).

---

## Deploy (GitHub Pages, automatic)

`.github/workflows/deploy.yml` deploys on every push to `main`.

### One-time
1. **GitHub → Settings → Secrets and variables → Actions → New repository secret** — add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. **Settings → Pages → Source = GitHub Actions** (already done)
3. Push — Actions runs, site live at:
   ```
   https://jkaseke1.github.io/hyperfeeds-tracker-/
   ```

### Future updates
```powershell
git add . ; git commit -m "msg" ; git push
```
Auto-redeploys in ~90 seconds.

---

## Editing project data (persistent)

The IT Lead can edit any track / deliverable directly in the UI ("Edit" button → click any row). Edits live in your browser. To make them visible to everyone:
1. Click **Export JSON** → downloads current state
2. Paste new values into `src/data/projects.js`
3. Commit & push.

For a one-line tweak (e.g. status change), edit `src/data/projects.js` directly.

---

## Status keys
`LIVE | DEPLOYED | IN_PROGRESS | TESTING | PLANNED | ONGOING | PENDING | TBC | DEFERRED | IDEA`

Mapping in `src/data/projects.js` → `STATUS`.

---
Confidential — Hyperfeeds Animal Nutrition (Pvt) Ltd — Internal Use Only.
