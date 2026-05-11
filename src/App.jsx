import React, { useEffect, useMemo, useState } from 'react'
import { defaultData, STATUS } from './data/projects.js'
import { useAuth } from './lib/auth.jsx'
import LoginButton from './components/LoginButton.jsx'
import Comments from './components/Comments.jsx'
import Inbox from './components/Inbox.jsx'

// ---------- Persistence ----------
const STORAGE_KEY = 'hyperfeeds-tracker:v4'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultData)
    const saved = JSON.parse(raw)
    return { ...structuredClone(defaultData), ...saved }
  } catch {
    return structuredClone(defaultData)
  }
}

// ---------- Helpers ----------
const statusInfo = (key) => STATUS[key] || { label: key, color: '#94A3B8' }
const STATUS_KEYS = Object.keys(STATUS)
const alphaBg = (hex, alpha = '15') => `${hex}${alpha}`

// =====================================================================
// ROOT APP
// =====================================================================
export default function App() {
  const { role } = useAuth()
  const [data, setData] = useState(loadInitial)
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [detailTarget, setDetailTarget] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Edits are restricted to the IT Lead once auth is on
  const canEdit = role === 'lead' || role === null /* auth disabled */

  const TABS = useMemo(() => {
    const base = [
      { id: 'overview',     label: 'Overview' },
      { id: 'powerbi',      label: 'Power BI' },
      { id: 'mes',          label: 'Hyper MS' },
      { id: 'stakeholders', label: 'Stakeholders' },
    ]
    if (role === 'lead') base.splice(3, 0, { id: 'inbox', label: 'Inbox' })
    return base
  }, [role])

  function updateItem(kind, index, patch) {
    setData(d => ({ ...d, [kind]: d[kind].map((it, i) => i === index ? { ...it, ...patch } : it) }))
  }
  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `hyperfeeds-tracker-${new Date().toISOString().slice(0,10)}.json`; a.click()
    URL.revokeObjectURL(url)
  }
  function resetAll() {
    if (!confirm('Reset all data to the baseline? Edits will be discarded.')) return
    setData(structuredClone(defaultData))
  }
  function rowClick(kind, index, item) {
    if (editing && canEdit) setEditTarget({ kind, index, item })
    else setDetailTarget({ kind, index, item })
  }
  function saveEditor(patch) {
    if (!editTarget) return
    updateItem(editTarget.kind, editTarget.index, patch)
    setEditTarget(null)
  }

  return (
    <div className={`app-shell ${editing ? 'editing' : ''}`}>
      <Sidebar tab={tab} setTab={setTab} tabs={TABS} />

      <main className="main">
        {editing && canEdit && (
          <div className="banner-edit">
            Edit mode — click any row to edit. Changes saved to your browser.
          </div>
        )}

        <div className="main-inner">
          <div className="topbar">
            <div className="meta">
              Prepared by {data.programme.preparedBy} · v1.1 · May 2026
            </div>
            <div className="actions">
              <LoginButton />
              {canEdit && (
                <>
                  <button className={`btn ${editing ? 'primary' : ''}`} onClick={() => setEditing(e => !e)}>
                    {editing ? 'Done editing' : 'Edit'}
                  </button>
                  <button className="btn" onClick={exportJson}>Export JSON</button>
                  <button className="btn danger" onClick={resetAll}>Reset</button>
                </>
              )}
            </div>
          </div>

          {tab === 'overview'     && <Overview     data={data} onRowClick={rowClick} />}
          {tab === 'powerbi'      && <Deliverables kind="powerBi" title="Power BI" subtitle="8 deliverables, monthly cadence" rows={data.powerBi} onRowClick={rowClick} note="Long-term programme — full stability incl. cloud capacity expected into 2027." />}
          {tab === 'mes'          && <MES          data={data} onRowClick={rowClick} />}
          {tab === 'inbox'        && <Inbox />}
          {tab === 'stakeholders' && <Stakeholders data={data} onRowClick={rowClick} />}
        </div>

        <footer className="footer">
          Confidential · Hyperfeeds Animal Nutrition (Pvt) Ltd · Internal Use Only
        </footer>
      </main>

      {editTarget && (
        <Editor target={editTarget} onSave={saveEditor} onCancel={() => setEditTarget(null)} />
      )}
      {detailTarget && (
        <Detail target={detailTarget} onClose={() => setDetailTarget(null)} />
      )}
    </div>
  )
}

// =====================================================================
// SIDEBAR
// =====================================================================
function Sidebar({ tab, setTab, tabs }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">HN</div>
        <div>
          <div className="name">HYPERFEEDS</div>
          <div className="tag">Digital Tracker</div>
        </div>
      </div>
      <nav className="nav">
        {tabs.map(t => (
          <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        Internal use · Hyperfeeds<br/>Animal Nutrition (Pvt) Ltd
      </div>
    </aside>
  )
}

// =====================================================================
// OVERVIEW (main tracks + other tracks below)
// =====================================================================
function Overview({ data, onRowClick }) {
  const allTracks = [...data.tracks, ...data.otherTracks.map(o => ({
    id: o.id, name: o.title, status: o.status, percent: 0,
    nextMilestone: o.note, estComplete: '', _other: true,
  }))]

  const kpis = useMemo(() => {
    const active = data.tracks.filter(t => ['LIVE','DEPLOYED','IN_PROGRESS','TESTING'].includes(t.status)).length
    const inFlight =
      data.powerBi.filter(p => ['IN_PROGRESS','TESTING','ONGOING','DEPLOYED','LIVE'].includes(p.status)).length +
      data.mes.filter(p =>     ['IN_PROGRESS','TESTING','ONGOING','DEPLOYED','LIVE'].includes(p.status)).length
    const main = data.tracks
    const avg = main.length ? Math.round(main.reduce((s,t) => s + (t.percent || 0), 0) / main.length) : 0
    const goLive = data.mes.find(m => m.id === 'MES-11')?.targetDate || 'TBC'
    const today = new Date()
    const goLiveDate = new Date('2026-08-01')
    const monthsToGoLive = Math.max(0, Math.round((goLiveDate - today) / (1000 * 60 * 60 * 24 * 30)))
    const phaseLabel = today < goLiveDate ? `Pre Go-Live · ${monthsToGoLive}mo to go` : 'Go-Live / Post Go-Live'
    return [
      { v: active,     k: 'Active main tracks' },
      { v: inFlight,   k: 'Deliverables in flight' },
      { v: `${avg}%`,  k: 'Programme complete' },
      { v: goLive,     k: `Go-Live · ${phaseLabel}` },
    ]
  }, [data])

  return (
    <div>
      <h1 className="page-title">{data.programme.title}</h1>
      <p className="page-sub">
        {data.programme.startedLabel} · {data.tracks.length} active tracks · {data.programme.ownerLabel}
      </p>

      <div className="kpis">
        {kpis.map((k, i) => (
          <div className="kpi" key={i}>
            <div className="v">{k.v}</div>
            <div className="k">{k.k}</div>
          </div>
        ))}
      </div>

      <div className="section-label">Tracks</div>
      <div className="tracks-list">
        {data.tracks.map((t, i) => (
          <TrackRow key={t.id} t={t} onClick={() => onRowClick('tracks', i, t)} />
        ))}
      </div>

      {data.otherTracks.length > 0 && (
        <>
          <div className="section-label" style={{ marginTop: 32 }}>Other Tasks</div>
          <div className="tracks-list">
            {data.otherTracks.map((t, i) => (
              <OtherRow key={t.id} t={t} onClick={() => onRowClick('otherTracks', i, t)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function TrackRow({ t, onClick }) {
  const s = statusInfo(t.status)
  return (
    <div className="track-row editable" onClick={onClick}>
      <div className="name">{t.name}</div>
      <div className="status">
        <span className="dot" style={{ background: s.color }} />
        <span>{s.label}</span>
      </div>
      <div className="ms">{t.nextMilestone || '—'}</div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${t.percent}%`, background: s.color }} />
      </div>
      <div className="pct">{t.percent}%</div>
    </div>
  )
}

function OtherRow({ t, onClick }) {
  const s = statusInfo(t.status)
  return (
    <div className="track-row editable" onClick={onClick}>
      <div className="name">{t.title}</div>
      <div className="status">
        <span className="dot" style={{ background: s.color }} />
        <span>{s.label}</span>
      </div>
      <div className="ms" style={{ gridColumn: 'span 2' }}>{t.note}</div>
      <div className="pct" style={{ color: 'var(--slate)', fontWeight: 400 }}>—</div>
    </div>
  )
}

// =====================================================================
// DELIVERABLES TABLE (Power BI / MES)
// =====================================================================
const FILTERS = [
  { id: 'all',     label: 'All',         match: () => true },
  { id: 'active',  label: 'In Progress', match: r => ['IN_PROGRESS','TESTING','ONGOING'].includes(r.status) },
  { id: 'planned', label: 'Planned',     match: r => r.status === 'PLANNED' },
  { id: 'done',    label: 'Done',        match: r => ['DEPLOYED','LIVE'].includes(r.status) },
]

function Deliverables({ kind, title, subtitle, rows, onRowClick, note }) {
  const [filter, setFilter] = useState('all')
  const f = FILTERS.find(x => x.id === filter) || FILTERS[0]
  const visible = rows.map((r, i) => ({ r, i })).filter(({ r }) => f.match(r))

  return (
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}

      <div className="filters">
        {FILTERS.map(x => (
          <button key={x.id} className={`chip ${filter === x.id ? 'active' : ''}`} onClick={() => setFilter(x.id)}>
            {x.label}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{width: '90px'}}>ID</th>
              <th>Deliverable</th>
              <th style={{width: '140px'}}>Status</th>
              <th style={{width: '120px'}}>Target</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ r, i }) => {
              const s = statusInfo(r.status)
              return (
                <tr key={r.id} className="editable" onClick={() => onRowClick(kind, i, r)}>
                  <td className="id">{r.id}</td>
                  <td>{r.title}</td>
                  <td>
                    <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
                  </td>
                  <td className="muted">{r.targetDate}</td>
                  <td className="muted">{r.notes || '—'}</td>
                </tr>
              )
            })}
            {visible.length === 0 && (
              <tr><td colSpan={5} className="muted" style={{ textAlign: 'center', padding: '24px' }}>No deliverables match this filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {note && (
        <div className="notebar">
          <span>▍</span><span>{note}</span>
        </div>
      )}
    </div>
  )
}

// =====================================================================
// MES TAB
// =====================================================================
function MES({ data, onRowClick }) {
  const today = new Date()
  const phases = [
    { id: 'pre',  label: 'Pre Go-Live',          sub: 'Build & Test', range: 'now – Jul 2026', start: new Date('2026-04-01'), end: new Date('2026-08-01') },
    { id: 'go',   label: 'Go-Live',              sub: 'Supervised cut-over', range: 'Aug 2026',     start: new Date('2026-08-01'), end: new Date('2026-09-01') },
    { id: 'post', label: 'Post Go-Live',         sub: 'Stabilisation',       range: 'Sep 2026 – Aug 2027', start: new Date('2026-09-01'), end: new Date('2027-08-31') },
  ]
  const currentPhase = phases.find(p => today >= p.start && today < p.end) || phases[0]

  return (
    <div>
      <h1 className="page-title">Hyper Manufacturing System</h1>
      <p className="page-sub">12 components · go-live Aug 2026 · full stabilisation Aug 2027</p>

      {/* Phase timeline */}
      <div className="phases">
        {phases.map((p, i) => (
          <div key={p.id} className={`phase ${currentPhase.id === p.id ? 'current' : ''}`}>
            <div className="phase-step">{i + 1}</div>
            <div className="phase-info">
              <div className="phase-label">{p.label}{currentPhase.id === p.id && <span className="phase-now">· NOW</span>}</div>
              <div className="phase-sub">{p.sub}</div>
              <div className="phase-range">{p.range}</div>
            </div>
          </div>
        ))}
      </div>

      <PhaseGroup phase="pre"  title="Pre Go-Live — Build & Test"   subtitle="All work before going live in August" rows={data.mes} onRowClick={onRowClick} />
      <PhaseGroup phase="go"   title="Go-Live"                     subtitle="Supervised cut-over to production"   rows={data.mes} onRowClick={onRowClick} />
      <PhaseGroup phase="post" title="Post Go-Live — Stabilisation" subtitle="~12 months of fixes, tuning & training" rows={data.mes} onRowClick={onRowClick} />

      <div className="section-label">Key Facts</div>
      <div className="facts">
        <div className="fact"><div className="k">Production Lines</div><div className="v">{data.mesFacts.productionLines.join(', ')}</div></div>
        <div className="fact"><div className="k">Integrated With</div><div className="v">{data.mesFacts.integratedWith}</div></div>
        <div className="fact"><div className="k">Sage Bridge</div><div className="v">{data.mesFacts.bridge}</div></div>
        <div className="fact"><div className="k">MES URL</div><div className="v">{data.mesFacts.url}</div></div>
      </div>
    </div>
  )
}

function PhaseGroup({ phase, title, subtitle, rows, onRowClick }) {
  const items = rows.map((r, i) => ({ r, i })).filter(({ r }) => r.phase === phase)
  if (items.length === 0) return null
  return (
    <div style={{ marginTop: 24 }}>
      <div className="section-label" style={{ marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 12 }}>{subtitle}</div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th style={{width: '90px'}}>ID</th>
              <th>Component</th>
              <th style={{width: '140px'}}>Status</th>
              <th style={{width: '120px'}}>Target</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({ r, i }) => {
              const s = statusInfo(r.status)
              return (
                <tr key={r.id} className="editable" onClick={() => onRowClick('mes', i, r)}>
                  <td className="id">{r.id}</td>
                  <td>{r.title}</td>
                  <td><span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span></td>
                  <td className="muted">{r.targetDate}</td>
                  <td className="muted">{r.notes || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =====================================================================
// STAKEHOLDERS
// =====================================================================
function Stakeholders({ data, onRowClick }) {
  const groups = useMemo(() => {
    const map = new Map()
    data.stakeholders.forEach((p, i) => {
      const key = p.group || 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push({ ...p, _i: i })
    })
    return [...map.entries()]
  }, [data.stakeholders])

  return (
    <div>
      <h1 className="page-title">Stakeholders</h1>
      <p className="page-sub">Programme stakeholders by function</p>
      {groups.map(([group, people]) => (
        <div key={group} className="people-group">
          <div className="ghead">{group}</div>
          <div className="people-list">
            {people.map(p => (
              <div key={p._i} className="person editable" onClick={() => onRowClick('stakeholders', p._i, p)}>
                <div className="pn">{p.name}</div>
                <div className="pr">{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// =====================================================================
// DETAIL MODAL (read-only details + comments)
// =====================================================================
function Detail({ target, onClose }) {
  const { kind, item } = target
  const commentItemId =
    kind === 'tracks'      ? item.id :
    kind === 'powerBi'     ? item.id :
    kind === 'mes'         ? item.id :
    kind === 'otherTracks' ? item.id :
    kind === 'stakeholders'? `person:${item.name}` :
    `${kind}:${item.id || item.name}`

  // Stakeholders: no comments thread
  const showComments = kind !== 'stakeholders'
  const s = item.status ? statusInfo(item.status) : null

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: 640 }}>
        <div className="modal-head">
          <h3>{item.id ? `${item.id} · ` : ''}{item.title || item.name}</h3>
          <button type="button" className="btn small" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          {s && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
              {item.targetDate && <span style={{ fontSize: 12, color: 'var(--slate)' }}>Target: {item.targetDate}</span>}
              {typeof item.percent === 'number' && (
                <span style={{ fontSize: 12, color: 'var(--slate)' }}>· {item.percent}% complete</span>
              )}
            </div>
          )}
          {item.nextMilestone && <div style={{ fontSize: 13 }}><strong>Next:</strong> {item.nextMilestone}</div>}
          {item.estComplete    && <div style={{ fontSize: 13 }}><strong>ETA:</strong> {item.estComplete}</div>}
          {item.notes          && <div style={{ fontSize: 13, color: 'var(--slate)' }}>{item.notes}</div>}
          {item.note           && <div style={{ fontSize: 13, color: 'var(--slate)' }}>{item.note}</div>}
          {item.role           && <div style={{ fontSize: 13, color: 'var(--slate)' }}>{item.role}</div>}

          {showComments && <Comments kind={kind} itemId={commentItemId} />}
        </div>
      </div>
    </div>
  )
}

// =====================================================================
// EDITOR MODAL (lead/edit-mode only)
// =====================================================================
const SCHEMAS = {
  tracks: [
    { key: 'name',          label: 'Track name',           type: 'text' },
    { key: 'status',        label: 'Status',               type: 'status' },
    { key: 'percent',       label: 'Progress %',           type: 'number', min: 0, max: 100 },
    { key: 'nextMilestone', label: 'Next milestone',       type: 'text' },
    { key: 'estComplete',   label: 'Estimated completion', type: 'text' },
  ],
  powerBi: [
    { key: 'id',         label: 'ID',          type: 'text' },
    { key: 'title',      label: 'Deliverable', type: 'text' },
    { key: 'status',     label: 'Status',      type: 'status' },
    { key: 'targetDate', label: 'Target',      type: 'text' },
    { key: 'notes',      label: 'Notes',       type: 'textarea' },
  ],
  mes: [
    { key: 'id',         label: 'ID',          type: 'text' },
    { key: 'title',      label: 'Component',   type: 'text' },
    { key: 'status',     label: 'Status',      type: 'status' },
    { key: 'targetDate', label: 'Target',      type: 'text' },
    { key: 'notes',      label: 'Notes',       type: 'textarea' },
  ],
  otherTracks: [
    { key: 'title',  label: 'Title',  type: 'text' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'note',   label: 'Note',   type: 'textarea' },
  ],
  stakeholders: [
    { key: 'name',  label: 'Name',  type: 'text' },
    { key: 'role',  label: 'Role',  type: 'text' },
    { key: 'group', label: 'Group', type: 'text' },
  ],
}
const KIND_TITLES = {
  tracks: 'Edit Track',
  powerBi: 'Edit Power BI Deliverable',
  mes: 'Edit Hyper MS Component',
  otherTracks: 'Edit Other Task',
  stakeholders: 'Edit Stakeholder',
}

function Editor({ target, onSave, onCancel }) {
  const schema = SCHEMAS[target.kind] || []
  const [form, setForm] = useState(() => ({ ...target.item }))
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  function submit(e) {
    e.preventDefault()
    const out = { ...form }
    schema.forEach(f => { if (f.type === 'number') out[f.key] = Number(out[f.key]) || 0 })
    onSave(out)
  }
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <form className="modal" onSubmit={submit}>
        <div className="modal-head">
          <h3>{KIND_TITLES[target.kind] || 'Edit'}</h3>
          <button type="button" className="btn small" onClick={onCancel}>Close</button>
        </div>
        <div className="modal-body">
          {schema.map(f => (
            <div className="field" key={f.key}>
              <label>{f.label}</label>
              {f.type === 'text' && <input type="text" value={form[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />}
              {f.type === 'number' && <input type="number" min={f.min} max={f.max} value={form[f.key] ?? 0} onChange={e => set(f.key, e.target.value)} />}
              {f.type === 'textarea' && <textarea value={form[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />}
              {f.type === 'status' && (
                <select value={form[f.key] ?? 'PLANNED'} onChange={e => set(f.key, e.target.value)}>
                  {STATUS_KEYS.map(k => <option key={k} value={k}>{STATUS[k].label} ({k})</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <span style={{ fontSize: 11, color: 'var(--slate)' }}>Saved to your browser. Use "Export JSON" to make permanent.</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  )
}
