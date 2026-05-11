import React, { useEffect, useMemo, useState } from 'react'
import { defaultData, STATUS } from './data/projects.js'

// ---------- Persistence ----------
const STORAGE_KEY = 'hyperfeeds-tracker:v1'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultData)
    const saved = JSON.parse(raw)
    // Shallow merge so newly added keys in defaultData still appear
    return { ...structuredClone(defaultData), ...saved }
  } catch {
    return structuredClone(defaultData)
  }
}

// ---------- Tabs ----------
const TABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'powerbi',      label: 'Power BI' },
  { id: 'mes',          label: 'MES' },
  { id: 'tracks',       label: 'Other Tracks' },
  { id: 'stakeholders', label: 'Stakeholders' },
]

// ---------- Helpers ----------
const statusInfo = (key) => STATUS[key] || { label: key, color: '#94A3B8' }
const STATUS_KEYS = Object.keys(STATUS)

function alphaBg(hex, alpha = '15') {
  // hex like #RRGGBB → rgba/hex+alpha
  return `${hex}${alpha}`
}

// =====================================================================
// ROOT APP
// =====================================================================
export default function App() {
  const [data, setData] = useState(loadInitial)
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [editTarget, setEditTarget] = useState(null) // { kind, index, item }

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // ----- Mutators (single source of truth — all tabs read from `data`) -----
  function updateItem(kind, index, patch) {
    setData(d => {
      const next = { ...d, [kind]: d[kind].map((it, i) => i === index ? { ...it, ...patch } : it) }
      return next
    })
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hyperfeeds-tracker-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function resetAll() {
    if (!confirm('Reset all data to the baseline values? This will discard your edits.')) return
    setData(structuredClone(defaultData))
  }

  function openEditor(kind, index) {
    if (!editing) return
    setEditTarget({ kind, index, item: data[kind][index] })
  }

  function saveEditor(patch) {
    if (!editTarget) return
    updateItem(editTarget.kind, editTarget.index, patch)
    setEditTarget(null)
  }

  return (
    <div className={`app-shell ${editing ? 'editing' : ''}`}>
      <Sidebar tab={tab} setTab={setTab} />

      <main className="main">
        {editing && (
          <div className="banner-edit">
            Edit mode — click any task or track to edit. Changes are saved automatically.
          </div>
        )}

        <div className="main-inner">
          <div className="topbar">
            <div className="meta">
              Prepared by {data.programme.preparedBy} · v1.0 · May 2026
            </div>
            <div className="actions">
              <button className={`btn ${editing ? 'primary' : ''}`} onClick={() => setEditing(e => !e)}>
                {editing ? 'Done editing' : 'Edit'}
              </button>
              <button className="btn" onClick={exportJson}>Export JSON</button>
              <button className="btn danger" onClick={resetAll}>Reset</button>
            </div>
          </div>

          {tab === 'overview'     && <Overview     data={data} onEdit={openEditor} />}
          {tab === 'powerbi'      && <Deliverables kind="powerBi" title="Power BI" subtitle="8 deliverables, monthly cadence" rows={data.powerBi} onEdit={openEditor} note="Long-term programme — full stability incl. cloud capacity expected into 2027." />}
          {tab === 'mes'          && <MES          data={data} onEdit={openEditor} />}
          {tab === 'tracks'       && <OtherTracks  data={data} onEdit={openEditor} />}
          {tab === 'stakeholders' && <Stakeholders data={data} onEdit={openEditor} />}
        </div>

        <footer className="footer">
          Confidential · Hyperfeeds Animal Nutrition (Pvt) Ltd · Internal Use Only
        </footer>
      </main>

      {editTarget && (
        <Editor
          target={editTarget}
          onSave={saveEditor}
          onCancel={() => setEditTarget(null)}
        />
      )}
    </div>
  )
}

// =====================================================================
// SIDEBAR
// =====================================================================
function Sidebar({ tab, setTab }) {
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
        {TABS.map(t => (
          <button
            key={t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        Internal use · Hyperfeeds<br/>
        Animal Nutrition (Pvt) Ltd
      </div>
    </aside>
  )
}

// =====================================================================
// OVERVIEW
// =====================================================================
function Overview({ data, onEdit }) {
  const kpis = useMemo(() => {
    const live = data.tracks.filter(t => ['LIVE','DEPLOYED'].includes(t.status)).length
    const inFlight =
      data.powerBi.filter(p => ['IN_PROGRESS','TESTING','ONGOING','DEPLOYED','LIVE'].includes(p.status)).length +
      data.mes.filter(p =>     ['IN_PROGRESS','TESTING','ONGOING','DEPLOYED','LIVE'].includes(p.status)).length
    const avg = Math.round(data.tracks.reduce((s,t) => s + (t.percent || 0), 0) / data.tracks.length)
    const goLive = data.mes.find(m => m.id === 'MES-11')?.targetDate || 'TBC'
    return [
      { v: live,         k: 'Tracks live' },
      { v: inFlight,     k: 'Deliverables in flight' },
      { v: `${avg}%`,    k: 'Programme complete' },
      { v: goLive,       k: 'Next major go-live' },
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
        {data.tracks.map((t, i) => {
          const s = statusInfo(t.status)
          return (
            <div
              key={t.id}
              className="track-row editable"
              onClick={() => onEdit('tracks', i)}
            >
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
        })}
      </div>
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

function Deliverables({ kind, title, subtitle, rows, onEdit, note }) {
  const [filter, setFilter] = useState('all')
  const f = FILTERS.find(x => x.id === filter) || FILTERS[0]
  const visible = rows.map((r, i) => ({ r, i })).filter(({ r }) => f.match(r))

  return (
    <div>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-sub">{subtitle}</p>}

      <div className="filters">
        {FILTERS.map(x => (
          <button
            key={x.id}
            className={`chip ${filter === x.id ? 'active' : ''}`}
            onClick={() => setFilter(x.id)}
          >
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
                <tr key={r.id} className="editable" onClick={() => onEdit(kind, i)}>
                  <td className="id">{r.id}</td>
                  <td>{r.title}</td>
                  <td>
                    <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>
                      {s.label}
                    </span>
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
// MES TAB (table + facts)
// =====================================================================
function MES({ data, onEdit }) {
  return (
    <div>
      <Deliverables
        kind="mes"
        title="MES (HYPER-MES)"
        subtitle="12 components · go-live Oct 2026 · stabilisation into 2027"
        rows={data.mes}
        onEdit={onEdit}
        note="Long-term programme — full stability expected 12+ months post go-live (into 2027 and beyond)."
      />
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

// =====================================================================
// OTHER TRACKS
// =====================================================================
function OtherTracks({ data, onEdit }) {
  return (
    <div>
      <h1 className="page-title">Other Tracks</h1>
      <p className="page-sub">Additional initiatives and exploratory projects</p>
      <div className="cards-grid">
        {data.otherTracks.map((t, i) => {
          const s = statusInfo(t.status)
          return (
            <div
              key={t.id}
              className="track-card editable"
              style={{ borderTopColor: s.color }}
              onClick={() => onEdit('otherTracks', i)}
            >
              <div className="head">
                <h3>{t.title}</h3>
                <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
              </div>
              <p>{t.note}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =====================================================================
// STAKEHOLDERS
// =====================================================================
function Stakeholders({ data, onEdit }) {
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
              <div key={p._i} className="person editable" onClick={() => onEdit('stakeholders', p._i)}>
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
// EDITOR MODAL — schemas per kind
// =====================================================================
const SCHEMAS = {
  tracks: [
    { key: 'name',          label: 'Track name',       type: 'text' },
    { key: 'status',        label: 'Status',           type: 'status' },
    { key: 'percent',       label: 'Progress %',       type: 'number', min: 0, max: 100 },
    { key: 'nextMilestone', label: 'Next milestone',   type: 'text' },
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
  mes: 'Edit MES Component',
  otherTracks: 'Edit Other Track',
  stakeholders: 'Edit Stakeholder',
}

function Editor({ target, onSave, onCancel }) {
  const schema = SCHEMAS[target.kind] || []
  const [form, setForm] = useState(() => ({ ...target.item }))

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function submit(e) {
    e.preventDefault()
    // Coerce numbers
    const out = { ...form }
    schema.forEach(f => {
      if (f.type === 'number') out[f.key] = Number(out[f.key]) || 0
    })
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
              {f.type === 'text' && (
                <input type="text" value={form[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
              )}
              {f.type === 'number' && (
                <input type="number" min={f.min} max={f.max} value={form[f.key] ?? 0} onChange={e => set(f.key, e.target.value)} />
              )}
              {f.type === 'textarea' && (
                <textarea value={form[f.key] ?? ''} onChange={e => set(f.key, e.target.value)} />
              )}
              {f.type === 'status' && (
                <select value={form[f.key] ?? 'PLANNED'} onChange={e => set(f.key, e.target.value)}>
                  {STATUS_KEYS.map(k => <option key={k} value={k}>{STATUS[k].label} ({k})</option>)}
                </select>
              )}
            </div>
          ))}
        </div>
        <div className="modal-foot">
          <span style={{ fontSize: 11, color: 'var(--slate)' }}>
            Saved automatically across all tabs · Use "Export JSON" to make permanent.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">Save</button>
          </div>
        </div>
      </form>
    </div>
  )
}
