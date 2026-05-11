# Hyperfeeds Digital Transformation Tracker

Internal management dashboard for tracking IT projects at Hyperfeeds Animal Nutrition (Pvt) Ltd. Static React + Vite site — no backend, no auth.

## Stack
- React 18 + Vite
- Plain CSS (design tokens in `src/styles.css`) — "Quiet Corporate" theme
- Static seed data in `src/data/projects.js`
- Live edits persisted to browser `localStorage`

## Quick start

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (usually http://localhost:5173).

## Editing tasks (in the running site)

1. Click **Edit** in the top-right.
2. Click any track row, deliverable row (Power BI / MES), other-track card, or stakeholder.
3. Edit fields in the modal and click **Save**.
4. Changes are saved to your browser automatically and **reflect across every tab in real-time** (Overview KPIs, status pills, progress bars, tables — all driven from the same state).
5. Click **Done editing** to exit edit mode.

### Persistence model
- Edits live in `localStorage` under `hyperfeeds-tracker:v1` so your changes survive page reloads.
- Use **Export JSON** in the top-right to download the current state.
- Use **Reset** to discard all edits and return to the baseline data in `src/data/projects.js`.

### Making edits permanent for everyone
LocalStorage is per-browser — to publish your edits to all viewers:

1. Click **Export JSON** to download the current state.
2. Open `src/data/projects.js` and update the relevant arrays to match the JSON.
3. Commit and push — the GitHub Actions workflow will redeploy the new baseline.

(Alternative: bulk-edit `src/data/projects.js` directly — the UI re-renders automatically.)

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deploy to GitHub Pages (automatic)

A GitHub Actions workflow at `.github/workflows/deploy.yml` deploys to GitHub Pages on every push to `main`.

### One-time setup
1. Push this repo to GitHub (suggested name: `hyperfeeds-tracker`).
2. On GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. If your repo name is **not** `hyperfeeds-tracker`, edit `.github/workflows/deploy.yml` and change `VITE_BASE` to `/<your-repo-name>/`.
4. Push to `main`. The workflow builds and deploys automatically. Site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Manual deploy (alternative)
```bash
$env:VITE_BASE = "/hyperfeeds-tracker/"; npm run build
npx gh-pages -d dist
```
Then in GitHub → Settings → Pages, choose branch `gh-pages` / root.

## Project structure

```
hyperfeeds-tracker/
├─ .github/workflows/deploy.yml   ← GH Pages auto-deploy
├─ index.html
├─ package.json
├─ vite.config.js                 ← reads VITE_BASE env var
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx                     ← UI + edit modal + state
│  ├─ styles.css                  ← design system
│  └─ data/projects.js            ← seed data (edit to change defaults)
└─ README.md
```

## Status keys
`LIVE | DEPLOYED | IN_PROGRESS | TESTING | PLANNED | ONGOING | PENDING | TBC | DEFERRED | IDEA`

Each maps to a colour and label in `STATUS` inside `src/data/projects.js`.

---
Confidential — Hyperfeeds Animal Nutrition (Pvt) Ltd — Internal Use Only.
