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

// Other digital tracks (each has its own sidebar page).
// `items` holds sub-deliverables; can be empty until scoped.
export const otherTracks = [
  {
    id: 'monitoring',
    title: 'Monitoring / PC Tools',
    status: 'DEFERRED',
    owner: 'Joseph (IT Lead)',
    targetStart: 'TBC',
    description: 'Set of tools and dashboards for monitoring company PCs, servers, networks, and backups. Deferred while Power BI and HMS take priority.',
    note: 'Tools to be advised as capacity allows. Currently focused on Power BI and HMS.',
    items: [
      { id: 'MON-01', title: 'PC inventory & asset tracking',         status: 'PLANNED',  targetDate: 'TBC', notes: 'Scope to be defined.' },
      { id: 'MON-02', title: 'Network & uptime monitoring',           status: 'PLANNED',  targetDate: 'TBC', notes: '' },
      { id: 'MON-03', title: 'Backup verification & alerting',        status: 'PLANNED',  targetDate: 'TBC', notes: '' },
      { id: 'MON-04', title: 'Antivirus / endpoint compliance check', status: 'DEFERRED', targetDate: 'TBC', notes: '' },
    ],
  },
  {
    id: 'figjam',
    title: 'FigJam (Sales Force Automation)',
    status: 'PENDING',
    owner: 'Joseph (IT Lead) + Kuda Ndindana',
    targetStart: 'TBC',
    description: 'Mobile app / web platform for Sales Force Automation. Enables field teams to manage orders, customer interactions, and branch operations in real-time.',
    note: 'Will commence after requirements gathering session with Kuda Ndindana. Date TBC.',
    items: [
      { id: 'FJ-01', title: 'Requirements gathering session (Kuda Ndindana)', status: 'PENDING', targetDate: 'TBC', notes: 'Awaiting date.' },
      { id: 'FJ-02', title: 'Mobile app design & prototyping',                status: 'PLANNED', targetDate: 'TBC', notes: '' },
      { id: 'FJ-03', title: 'Order management & customer tracking',           status: 'PLANNED', targetDate: 'TBC', notes: '' },
      { id: 'FJ-04', title: 'Real-time sync with backend systems',            status: 'PLANNED', targetDate: 'TBC', notes: '' },
      { id: 'FJ-05', title: 'Pilot with field teams & sign-off',              status: 'PLANNED', targetDate: 'TBC', notes: '' },
    ],
  },
  {
    id: 'automation',
    title: 'Microsoft Automation (SharePoint Workflows)',
    status: 'TBC',
    owner: 'Joseph (IT Lead)',
    targetStart: 'After major tracks',
    description: 'SharePoint-triggered automation workflows for leave forms, fuel requests, general requests, and purchase approvals. Removes manual routing and approval steps.',
    note: 'Scope and start date TBC. Will address remaining manual processes after major tracks free up capacity.',
    items: [
      { id: 'AUT-01', title: 'Leave request workflow (auto-routing to HR)',    status: 'TBC', targetDate: 'TBC', notes: 'SharePoint form trigger.' },
      { id: 'AUT-02', title: 'Fuel request workflow (approval chain)',         status: 'TBC', targetDate: 'TBC', notes: 'Auto-notify manager.' },
      { id: 'AUT-03', title: 'General request workflow (ticketing)',           status: 'TBC', targetDate: 'TBC', notes: 'Auto-assign & track.' },
      { id: 'AUT-04', title: 'Purchase approval workflow (PO routing)',        status: 'TBC', targetDate: 'TBC', notes: 'Multi-level approval.' },
    ],
  },
  {
    id: 'it-sop',
    title: 'IT Quality Management System (SOP)',
    status: 'PENDING',
    owner: 'Joseph (IT Lead)',
    targetStart: 'Preparation mode',
    description: 'Establish documented IT Standard Operating Procedures and Quality Objectives. Covers incident management, change control, asset tracking, security, backups, and continuous improvement. Scalable to other departments.',
    note: 'Not started — in preparation mode. Document created; awaiting MD approval and team training.',
    items: [
      { id: 'SOP-01', title: 'Incident Management SOP',           status: 'PENDING', targetDate: 'TBC', notes: 'Response times, severity levels, escalation process.' },
      { id: 'SOP-02', title: 'Change Management SOP',             status: 'PENDING', targetDate: 'TBC', notes: 'Planning, testing, approval, rollback procedures.' },
      { id: 'SOP-03', title: 'Problem Management SOP',            status: 'PENDING', targetDate: 'TBC', notes: 'Root cause analysis, permanent fixes for recurring issues.' },
      { id: 'SOP-04', title: 'Asset Management SOP',              status: 'PENDING', targetDate: 'TBC', notes: 'Hardware, software, license tracking and maintenance.' },
      { id: 'SOP-05', title: 'Backup & Disaster Recovery SOP',    status: 'PENDING', targetDate: 'TBC', notes: 'Daily backups, recovery drills, RTO/RPO targets.' },
      { id: 'SOP-06', title: 'Security & Access Control SOP',     status: 'PENDING', targetDate: 'TBC', notes: 'User access, authentication, data encryption, compliance.' },
      { id: 'SOP-07', title: 'System Maintenance SOP',            status: 'PENDING', targetDate: 'TBC', notes: 'Patching, updates, optimization, preventive maintenance.' },
    ],
  },
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
