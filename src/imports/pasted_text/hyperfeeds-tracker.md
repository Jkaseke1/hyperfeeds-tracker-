Design a clean, minimal internal corporate dashboard called 
"Hyperfeeds Digital Transformation Tracker" — used by the Managing Director 
and senior leadership of an animal-feed manufacturing company to monitor 
internal IT projects. Single-page app with 5 tabs.

GOAL
Make it feel calm, executive, and trustworthy — like a McKinsey or Linear 
internal tool. Information-dense but not cluttered. Read-only. Desktop-first 
but responsive.

VISUAL DIRECTION (pick ONE and commit)
Option A — "Quiet Corporate":
  - Off-white background (#FAFAF7), white cards, hairline borders (1px #E8E8E3)
  - Deep navy #1F3864 for primary text/headers, muted slate #64748B for secondary
  - Single accent: burnt orange #C55A11 used sparingly (warnings, key numbers)
  - Inter or Geist font, tight tracking, small caps for labels
  - Zero shadows. Pure flat. Dividers do all the work.

Option B — "Soft Glassmorphism":
  - Light gray gradient bg, frosted white cards with 8% blur
  - Navy #1F3864 + steel blue #2E5FA3 accents
  - Subtle inner glow on active states
  - Inter font, generous whitespace

Pick Option A unless told otherwise.

LAYOUT
- Left sidebar (220px): logo "HN" in a navy rounded square + wordmark 
  "Hyperfeeds / Digital Tracker", then vertical nav: Overview, Power BI, 
  MES, Other Tracks, Stakeholders. Active item has a 2px navy left border 
  and bold weight, no background fill.
- Main area: max-width 1180px, 32px padding, sections separated by 48px.
- Top-right of main area: small text "Prepared by Joseph (IT Lead) · v1.0 · May 2026".

OVERVIEW TAB (default)
1. Programme header (no card, just text):
     H1: "Digital Transformation"
     Sub: "Started March 2026 · 6 active tracks · Programme owner: MD"
2. KPI strip — 4 small stat tiles in a row (no borders, just numbers):
     "2" Tracks live  |  "12" Deliverables in flight  |  "26%" Programme complete  |  "Oct 2026" Next major go-live
3. "Tracks" section — 6 rows (NOT cards), each row is a horizontal layout:
     [Track name, bold]  [tiny status dot + label]  [next milestone in muted text]  [progress bar 200px]  [% right-aligned]
   Status dots: green=Live, blue=In Progress, amber=Pending, gray=Deferred, orange=Idea.
   Hover reveals a thin underline on the track name.
4. No "Programme Health" duplicate section — the rows already show progress.

POWER BI & MES TABS
- Filter chips above the table: All / In Progress / Planned / Done
- Table: monospaced ID column, deliverable, status pill (small, square-ish 
  with 4px radius — NOT pill-shaped), target month as plain text, notes muted.
- Zebra striping with #FAFAF7 (very subtle).
- Below the table: a single-line callout in muted orange text with a small 
  left border instead of a full callout box:
    "▍ Long-term programme — full stability expected into 2027."

OTHER TRACKS TAB
- 2x2 grid of cards. Each card: title, status pill, 2-line description, 
  thin top border in the status colour. No icons.

STAKEHOLDERS TAB
- Two-column list (not a table). Name in navy bold, role in muted gray below. 
  Hairline divider between rows. Group visually by: Leadership, Finance, 
  Operations, IT.

MICRO-DETAILS
- All status pills use the same size (22px height, 11px font, uppercase, 
  letter-spacing 0.5px).
- Numbers use tabular-nums.
- Focus states: 2px navy outline, 2px offset.
- No emojis anywhere — replace with coloured dots or short uppercase labels.
- No gradients on buttons. No drop shadows. No rounded-full pills.
- Mobile: sidebar collapses to a top hamburger; tables scroll horizontally.

CONTENT (use this exact data)
Tracks: Power BI (In Progress, 18%, next: PB-02 Procurement, ETA Dec 2026); 
MES HYPER-MES (Testing, 35%, next: Stock Take + Sage Bridge, go-live Oct 2026); 
Monitoring/PC Tools (Deferred, 0%); FigJam Process Mapping (Pending, 5%, 
awaiting Kudzi session); Microsoft Automation (TBC, 0%); 
IT Project Tracking Site (Idea, 80%, this site).

Power BI deliverables: PB-01 Tonnage Page (Deployed, Apr 2026); 
PB-02 Procurement Page (In Progress, May 2026); PB-03 Stock Levels (Planned, 
Jun); PB-04 Sales Analysis Enhanced (Planned, Jul); PB-05 Creditors/Finance 
(Planned, Aug); PB-06 Production — needs MES live (Planned, Sep); 
PB-07 Cloud Capacity Planning (Planned, Dec); PB-08 Polish/UAT/Sign-off 
(Ongoing, Dec 2026+).

MES deliverables: MES-01 Production Planning (Testing, May); MES-02 Formulations 
& BOM, 83 seeded (Testing, May); MES-03 Raw Materials, 73 RMs live (Testing, 
May); MES-04 Production Execution (Testing, May); MES-05 Stock Take (Testing, 
Jun); MES-06 Sage 200 Bridge, 7 events (Testing, Jun); MES-07 Dispatch & 
Branch Stock (Planned, Jul); MES-08 QC Module (Planned, Jul); MES-09 Reporting 
(Planned, Aug); MES-10 Training & Change Mgmt (Planned, Sep); MES-11 Go-Live 
(Planned, Oct); MES-12 Stabilisation (Planned, Dec 2027).

MES facts strip: Lines = Main Plant, Dog Plant, Samora Mix, Red Plant. 
Integrated with Sage 200 Evolution (Hyperfeeds 2024). Bridge: localhost:50119. 
URL: jkaseke1.github.io/HYPER-MES.

Stakeholders: MD (sponsor); Archfold — Senior Accountant, Power BI & Sage; 
Chamu — Production Mgr, MES Lead; Mano Govere — RM Mgr; Kudzi — Branch Mgr, 
FigJam; Owen — Accountant, Creditors; Jonga — Accountant, Reporting; 
Mathuthu — Chicks Mgr; Joseph — IT Lead, Programme Delivery; Business Developer.

FOOTER
Single muted line, centered: 
"Confidential · Hyperfeeds Animal Nutrition (Pvt) Ltd · Internal Use Only"

DELIVERABLE
Static HTML+CSS or React + Tailwind. No backend. No animations beyond 100ms 
hover transitions. Show me the Overview tab fully styled first, then I'll 
ask for the others.