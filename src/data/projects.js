// =============================================================
// Hyperfeeds Digital Transformation Tracker - DEFAULT DATA
// =============================================================
// This file is the seed/baseline data. At runtime the app loads
// any saved edits from localStorage and merges them on top.
// To "reset to defaults" the MD can use the "Reset" button.
// To export current edited state, use the "Export JSON" button
// in the top bar — paste the result here to make it permanent.
// =============================================================

export const programme = {
  title: 'Digital Transformation',
  startedLabel: 'Started March 2026',
  preparedBy: 'Joseph (IT Lead)',
  ownerLabel: 'Programme owner: MD',
}

// Status definitions: label, dot/pill colour, KPI bucket
export const STATUS = {
  LIVE:        { label: 'Live',        color: '#16A34A' },
  DEPLOYED:    { label: 'Deployed',    color: '#16A34A' },
  IN_PROGRESS: { label: 'In Progress', color: '#2E5FA3' },
  TESTING:     { label: 'Testing',     color: '#2E5FA3' },
  PLANNED:     { label: 'Planned',     color: '#94A3B8' },
  ONGOING:     { label: 'Ongoing',     color: '#94A3B8' },
  PENDING:     { label: 'Pending',     color: '#D97706' },
  TBC:         { label: 'TBC',         color: '#64748B' },
  DEFERRED:    { label: 'Deferred',    color: '#64748B' },
  IDEA:        { label: 'Idea',        color: '#C55A11' },
}

// Track summaries shown on Overview tab.
// `percent` is manual; `nextMilestone` and `estComplete` are display strings.
export const tracks = [
  { id: 'powerbi',    name: 'Power BI',                    status: 'IN_PROGRESS', percent: 32, nextMilestone: 'PB-03 Stock Levels + PB-05 Debtors (May–Jun)', estComplete: 'Dec 2026 (full programme into 2027)' },
  { id: 'mes',        name: 'Hyper Manufacturing System',  status: 'TESTING',     percent: 35, nextMilestone: 'Stock Take + Sage Bridge, go-live Aug 2026', estComplete: 'Go-live Aug 2026; full stabilisation Aug 2027' },
]

// Ordered by expected finishing date (earliest first).
export const powerBi = [
  { id: 'PB-01', title: 'Tonnage Page (Tonnage Sold at Branch)',          status: 'DEPLOYED',    targetDate: 'Apr 2026',   notes: 'Live and in use. Also under test before final sign-off.' },
  { id: 'PB-03', title: 'Stock Levels Page',                              status: 'IN_PROGRESS', targetDate: 'Jun 2026',   notes: 'Almost done — figures being corrected and verified by Accounts.' },
  { id: 'PB-05', title: 'Creditors / Debtors / Finance Page',             status: 'IN_PROGRESS', targetDate: 'Jun 2026',   notes: 'Debtors work to be concluded end of May into June.' },
  { id: 'PB-02', title: 'Procurement Page',                               status: 'PLANNED',     targetDate: 'Jul 2026',   notes: 'Not yet started — to begin once Stock Levels and Debtors are finalised.' },
  { id: 'PB-04', title: 'Sales Analysis Page (Enhanced)',                 status: 'PLANNED',     targetDate: 'Aug 2026',   notes: '' },
  { id: 'PB-06', title: 'Production Page (requires MES live)',            status: 'PLANNED',     targetDate: 'Sep 2026',   notes: 'Dependent on HMS go-live (Aug 2026).' },
  { id: 'PB-07', title: 'Cloud Capacity Planning',                        status: 'PLANNED',     targetDate: 'Dec 2026',   notes: '' },
  { id: 'PB-08', title: 'Polish, UAT & Stakeholder Sign-off (all pages)', status: 'ONGOING',     targetDate: 'Dec 2026+',  notes: 'Continuous through 2027.' },
]

export const mes = [
  { id: 'MES-01', title: 'Production Planning',                          status: 'TESTING', targetDate: 'May 2026', phase: 'pre',  notes: '' },
  { id: 'MES-02', title: 'Formulations & BOM (83 formulations seeded)',  status: 'TESTING', targetDate: 'May 2026', phase: 'pre',  notes: '83 formulations seeded.' },
  { id: 'MES-03', title: 'Raw Materials — all functions (73 RMs live)',  status: 'TESTING', targetDate: 'May 2026', phase: 'pre',  notes: '73 RMs live.' },
  { id: 'MES-04', title: 'Production Execution (batch tracking)',        status: 'TESTING', targetDate: 'May 2026', phase: 'pre',  notes: '' },
  { id: 'MES-05', title: 'Stock Take / Inventory',                       status: 'TESTING', targetDate: 'Jun 2026', phase: 'pre',  notes: '' },
  { id: 'MES-06', title: 'Sage 200 Bridge (all 7 events)',               status: 'TESTING', targetDate: 'Jun 2026', phase: 'pre',  notes: 'Bridge: localhost:50119' },
  { id: 'MES-07', title: 'Dispatch & Branch Stock Movements',            status: 'PLANNED', targetDate: 'Jun 2026', phase: 'pre',  notes: '' },
  { id: 'MES-08', title: 'QC (Quality Control) Module',                  status: 'PLANNED', targetDate: 'Jun 2026', phase: 'pre',  notes: '' },
  { id: 'MES-09', title: 'Reporting & Reconciliation',                   status: 'PLANNED', targetDate: 'Jul 2026', phase: 'pre',  notes: '' },
  { id: 'MES-10', title: 'Operator Training & Change Management',        status: 'PLANNED', targetDate: 'Jul 2026', phase: 'pre',  notes: '' },
  { id: 'MES-11', title: 'HMS Go-Live (supervised)',                     status: 'PLANNED', targetDate: 'Aug 2026', phase: 'go',   notes: 'Go-live 3 months from May 2026.' },
  { id: 'MES-12', title: 'Post Go-Live Stabilisation',                   status: 'PLANNED', targetDate: 'Aug 2027', phase: 'post', notes: 'Full stabilisation expected ~12 months post go-live.' },
]

export const mesFacts = {
  productionLines: ['Main Plant', 'Dog Plant', 'Samora Mix', 'Red Plant'],
  integratedWith:  'Sage 200 Evolution (Hyperfeeds 2024)',
  bridge:          'localhost:50119',
  url:             'jkaseke1.github.io/HYPER-MES',
}

export const otherTracks = [
  { id: 'monitoring', title: 'Monitoring / PC Tools',           status: 'DEFERRED', note: 'Tools to be advised as capacity allows. Currently focused on Power BI and MES.' },
  { id: 'figjam',     title: 'FigJam (Process Mapping)',        status: 'PENDING',  note: 'Will commence after requirements gathering session with Kuda Ndindana. Date TBC.' },
  { id: 'automation', title: 'Microsoft Automation (Power Automate)', status: 'TBC', note: 'Scope and start date TBC. Will address remaining manual processes after major tracks free up capacity.' },
]

export const stakeholders = [
  { name: 'MD (Managing Director)', role: 'Programme Sponsor & Decision Maker',                   group: 'Leadership' },
  { name: 'Joseph (IT Lead)',       role: 'Programme Delivery Lead — All Tracks',                 group: 'Leadership' },
  { name: 'Archfold',               role: 'Senior Accountant / Finance Owner — Power BI & Sage',  group: 'Finance' },
  { name: 'Owen',                   role: 'Accountant — Creditors & Procurement',                 group: 'Finance' },
  { name: 'Jonga',                  role: 'Accountant — Financial Reporting',                     group: 'Finance' },
  { name: 'Chamu',                  role: 'Production Manager — MES Lead & Change Management',    group: 'Operations' },
  { name: 'Mano Govere',            role: 'Raw Materials Manager — RM & Procurement',             group: 'Operations' },
  { name: 'Kuda Ndindana',          role: 'Branch Manager — Branch Operations & FigJam',          group: 'Operations' },
  { name: 'Mathuthu',               role: 'Chicks Manager — Specialist Feed Production',          group: 'Operations' },
  { name: 'Business Developer',     role: 'Demand & Growth Tracking',                             group: 'Operations' },
]

// Bundled default for state initialisation
export const defaultData = {
  programme,
  tracks,
  powerBi,
  mes,
  mesFacts,
  otherTracks,
  stakeholders,
}
