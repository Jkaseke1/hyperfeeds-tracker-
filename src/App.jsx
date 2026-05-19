import React, { useEffect, useMemo, useState } from 'react'
import { defaultData, STATUS } from './data/projects.js'
import { useAuth } from './lib/auth.jsx'
import { supabase, supabaseEnabled } from './lib/supabase.js'
import LoginButton from './components/LoginButton.jsx'
import Comments from './components/Comments.jsx'
import Inbox from './components/Inbox.jsx'

// ---------- Persistence ----------
const STORAGE_KEY = 'hyperfeeds-tracker-user-edits'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultData)
    const saved = JSON.parse(raw)
    // Always merge with fresh defaults to pick up new tracks/items
    const merged = structuredClone(defaultData)
    // Only preserve user edits to existing items (don't override structure)
    if (saved.tracks) merged.tracks = saved.tracks
    if (saved.powerBi) merged.powerBi = saved.powerBi
    if (saved.mes) merged.mes = saved.mes
    if (saved.otherTracks) merged.otherTracks = saved.otherTracks
    return merged
  } catch {
    return structuredClone(defaultData)
  }
}

// ---------- Helpers ----------
const statusInfo = (key) => STATUS[key] || { label: key, color: '#94A3B8' }
const STATUS_KEYS = Object.keys(STATUS)
const alphaBg = (hex, alpha = '15') => `${hex}${alpha}`

// Shorten a track title for the sidebar
function shortLabel(title) {
  if (/Monitoring/i.test(title)) return 'Monitoring'
  if (/FigJam/i.test(title))     return 'FigJam'
  if (/Automation/i.test(title)) return 'Automation'
  return title.length > 16 ? title.slice(0, 14) + '…' : title
}

// Group statuses into lifecycle stages for the Overview "Pipeline" view.
const STAGES = [
  { id: 'live',     label: 'Live / Deployed', desc: 'In production use',                statuses: ['LIVE','DEPLOYED'],         color: '#16A34A' },
  { id: 'testing',  label: 'In Testing',      desc: 'Built, pre go-live verification',  statuses: ['TESTING'],                 color: '#0EA5E9' },
  { id: 'building', label: 'In Build',        desc: 'Active development',               statuses: ['IN_PROGRESS'],             color: '#1F3864' },
  { id: 'planned',  label: 'Planned',         desc: 'Scoped, not started yet',          statuses: ['PLANNED'],                 color: '#94A3B8' },
  { id: 'ongoing',  label: 'Ongoing',         desc: 'Continuous activity',              statuses: ['ONGOING'],                 color: '#A78BFA' },
  { id: 'onhold',   label: 'On Hold / TBC',   desc: 'Pending, deferred or to be scoped', statuses: ['PENDING','TBC','DEFERRED','IDEA'], color: '#D97706' },
]

// Collect every deliverable in the programme with a tag of where it comes from
function allDeliverables(data) {
  const out = []
  data.powerBi.forEach(r => out.push({ ...r, _source: 'Power BI', _kind: 'powerBi', _tabId: 'powerbi' }))
  data.mes.forEach(r     => out.push({ ...r, _source: 'Hyper MS', _kind: 'mes',     _tabId: 'mes' }))
  data.otherTracks.forEach(t => {
    (t.items || []).forEach(r => out.push({ ...r, _source: t.title, _kind: 'otherItems', _tabId: `other:${t.id}` }))
  })
  return out
}

// =====================================================================
// ROOT APP
// =====================================================================
export default function App() {
  const { role, user, supabaseEnabled } = useAuth()
  const signedOut = supabaseEnabled && !user
  const [data, setData] = useState(loadInitial)
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [detailTarget, setDetailTarget] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Edits are restricted to the IT Lead once auth is on
  const canEdit = role === 'lead' || !supabaseEnabled /* auth disabled = local dev fallback */

  const TABS = useMemo(() => {
    // Public landing page: only Overview is reachable
    if (signedOut) return [{ id: 'overview', label: 'Overview' }]
    const base = [
      { id: 'overview',     label: 'Overview' },
      { id: 'powerbi',      label: 'Power BI' },
      { id: 'mes',          label: 'Hyper MS' },
      ...data.otherTracks.map(t => ({ id: `other:${t.id}`, label: shortLabel(t.title) })),
      { id: 'stakeholders', label: 'Stakeholders' },
    ]
    if (role === 'lead') base.push({ id: 'inbox', label: 'Inbox' })
    return base
  }, [role, data.otherTracks, signedOut])

  // If signed out and somehow on a non-overview tab, snap back
  useEffect(() => { if (signedOut && tab !== 'overview') setTab('overview') }, [signedOut, tab])

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
    // otherItems are read-only for now (no edit schema). Always open detail.
    if (editing && canEdit && kind !== 'otherItems') setEditTarget({ kind, index, item })
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
          <div className="banner-edit" style={{ background: '#FEF3C7', border: '2px solid #F59E0B', color: '#92400E', padding: '12px 20px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
            ✏️ Edit Mode Active — Click any row to edit status, dates, notes, and other fields. Changes are saved automatically.
          </div>
        )}

        <div className="main-inner">
          <div className="topbar">
            <div className="meta">
              Prepared by {data.programme.preparedBy} · v1.1 · May 2026
            </div>
            <div className="actions">
              <LoginButton />
              {!signedOut && canEdit && (
                <>
                  <button 
                    className={`btn ${editing ? 'primary' : ''}`} 
                    onClick={() => setEditing(e => !e)}
                    style={{ 
                      fontWeight: 700, 
                      fontSize: 14,
                      padding: '10px 20px',
                      background: editing ? '#10B981' : '#3B82F6',
                      color: 'white',
                      border: 'none'
                    }}
                  >
                    {editing ? '✓ Done Editing' : '✏️ Edit Status & Fields'}
                  </button>
                  <button className="btn" onClick={exportJson}>Export JSON</button>
                  <button className="btn danger" onClick={resetAll}>Reset</button>
                </>
              )}
            </div>
          </div>

          {tab === 'overview'     && (signedOut ? <PublicOverview data={data} /> : <Overview data={data} onRowClick={rowClick} setTab={setTab} />)}
          {tab === 'powerbi'      && <Deliverables kind="powerBi" title="Power BI" subtitle="8 deliverables, monthly cadence" rows={data.powerBi} onRowClick={rowClick} note="Long-term programme — full stability incl. cloud capacity expected into 2027." />}
          {tab === 'mes'          && <MES          data={data} onRowClick={rowClick} />}
          {tab === 'inbox'        && <Inbox />}
          {tab === 'stakeholders' && <Stakeholders data={data} onRowClick={rowClick} />}
          {tab.startsWith('other:') && (() => {
            const id = tab.slice(6)
            const idx = data.otherTracks.findIndex(t => t.id === id)
            if (idx < 0) return null
            return <OtherTaskPage track={data.otherTracks[idx]} index={idx} onRowClick={rowClick} />
          })()}
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
// PUBLIC OVERVIEW — minimal landing page for unauthenticated visitors
// =====================================================================
function PublicOverview({ data }) {
  const today = new Date()
  const goLiveDate = new Date('2026-08-01')
  const monthsToGoLive = Math.max(0, Math.round((goLiveDate - today) / (1000*60*60*24*30)))
  const all = allDeliverables(data)
  const live = all.filter(r => ['LIVE','DEPLOYED'].includes(r.status)).length
  const inFlight = all.filter(r => ['IN_PROGRESS','TESTING','ONGOING'].includes(r.status)).length
  const avgPct = data.tracks.length
    ? Math.round(data.tracks.reduce((s,t) => s + (t.percent || 0), 0) / data.tracks.length)
    : 0

  return (
    <div>
      <div className="hero">
        <div className="hero-head">
          <div>
            <h1 className="page-title" style={{ margin: 0 }}>{data.programme.title}</h1>
            <p className="page-sub" style={{ marginTop: 6 }}>
              {data.programme.startedLabel} · {data.programme.ownerLabel}
            </p>
          </div>
          <div className="health-badge" style={{ borderColor: '#16A34A', color: '#16A34A' }}>
            <span className="health-dot" style={{ background: '#16A34A' }} /> ON TRACK
          </div>
        </div>
        <p className="hero-summary">
          Hyperfeeds is executing a digital transformation across <strong>{data.tracks.length + data.otherTracks.length} tracks</strong>,
          with the <strong>Hyper Manufacturing System</strong> targeted for go-live in <strong>Aug 2026</strong> ({monthsToGoLive} months out).
          Power BI is delivering on a monthly cadence with the first page already in production use.
        </p>
      </div>

      <div className="kpis">
        <div className="kpi"><div className="v">{data.tracks.length + data.otherTracks.length}</div><div className="k">Digital tracks</div></div>
        <div className="kpi"><div className="v">{live}</div><div className="k">Live in production</div></div>
        <div className="kpi"><div className="v">{inFlight}</div><div className="k">Active deliverables</div></div>
        <div className="kpi" style={{ borderLeft: `3px solid #1F3864` }}>
          <div className="v" style={{ fontSize: 22 }}>Aug 2026</div>
          <div className="k">HMS go-live · {monthsToGoLive}mo to go</div>
        </div>
      </div>

      <div className="section-label" style={{ marginTop: 32 }}>Tracks</div>
      <p className="section-desc">High-level view of each digital track.</p>
      <div className="track-cards">
        {data.tracks.map(t => {
          const s = statusInfo(t.status)
          return (
            <div key={t.id} className="track-card-pro" style={{ borderTopColor: s.color, cursor: 'default' }}>
              <div className="tcp-head">
                <div>
                  <div className="tcp-title">{t.name}</div>
                  <div className="tcp-sub">{t.estComplete}</div>
                </div>
                <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
              </div>
              <div className="tcp-progress">
                <div className="tcp-bar"><div className="tcp-fill" style={{ width: `${t.percent}%`, background: s.color }} /></div>
                <div className="tcp-pct">{t.percent}%</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="public-cta">
        <strong>Sign in</strong> to see the full breakdown — every deliverable, status, milestones, feedback threads, and the IT Lead inbox.
      </div>
    </div>
  )
}

// =====================================================================
// OVERVIEW — executive briefing
// =====================================================================
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function Overview({ data, onRowClick, setTab }) {
  const all = useMemo(() => allDeliverables(data), [data])
  const byStage = useMemo(() => {
    const map = Object.fromEntries(STAGES.map(s => [s.id, []]))
    all.forEach(r => {
      const stage = STAGES.find(s => s.statuses.includes(r.status))
      if (stage) map[stage.id].push(r)
    })
    return map
  }, [all])

  const today = new Date()
  const currentMonthLabel = `${MONTHS[today.getMonth()]} ${today.getFullYear()}`
  const goLiveDate = new Date('2026-08-01')
  const monthsToGoLive = Math.max(0, Math.round((goLiveDate - today) / (1000*60*60*24*30)))

  const total = all.length
  const liveN = byStage.live.length
  const testingN = byStage.testing.length
  const buildN = byStage.building.length
  const ongoingN = byStage.ongoing.length
  const plannedN = byStage.planned.length
  const onholdN = byStage.onhold.length

  const avgPct = data.tracks.length
    ? Math.round(data.tracks.reduce((s,t) => s + (t.percent || 0), 0) / data.tracks.length)
    : 0

  const inFlight = testingN + buildN + ongoingN
  const health =
    onholdN > inFlight ? { color: '#D97706', label: 'AT WATCH', desc: 'More items are on hold than active. Capacity is the constraint.' } :
    inFlight === 0     ? { color: '#94A3B8', label: 'IDLE',     desc: 'Nothing currently in flight.' } :
                         { color: '#16A34A', label: 'ON TRACK', desc: 'Active development under way against the August go-live target.' }

  // Items in flight this month — anything currently IN_PROGRESS or TESTING
  const focus = all.filter(r => ['IN_PROGRESS','TESTING'].includes(r.status))

  return (
    <div className="overview-clean">
      {/* ---- HEADER ---- */}
      <div className="ov-header">
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{data.programme.title}</h1>
          <p className="page-sub" style={{ marginTop: 4 }}>
            {data.programme.startedLabel} · {data.tracks.length + data.otherTracks.length} digital tracks · {data.programme.ownerLabel}
          </p>
        </div>
        <div className="health-pill" style={{ background: health.color + '12', color: health.color, border: `1px solid ${health.color}40` }}>
          <span className="health-dot" style={{ background: health.color }} />
          {health.label}
        </div>
      </div>

      <p className="ov-summary">
        {health.desc} HMS is in <strong>pre go-live testing</strong>, cut-over targeted for
        <strong> {data.mes.find(m=>m.id==='MES-11')?.targetDate || 'Aug 2026'}</strong> ({monthsToGoLive} months out).
        Power BI: <strong>{liveN}</strong> live, <strong>{buildN}</strong> in build.
      </p>

      {/* ---- KPIs ---- */}
      <div className="ov-kpis">
        {[
          { v: `${liveN} / ${total}`, k: 'Deliverables live' },
          { v: `${inFlight}`, k: 'In flight now' },
          { v: `${avgPct}%`, k: 'Programme complete' },
          { v: data.mes.find(m=>m.id==='MES-11')?.targetDate || 'Aug 2026', k: `HMS go-live · ${monthsToGoLive}mo` },
        ].map((kpi, i) => (
          <div key={i} className="ov-kpi">
            <div className="ov-kpi-v">{kpi.v}</div>
            <div className="ov-kpi-k">{kpi.k}</div>
          </div>
        ))}
      </div>

      {/* ---- STATUS GRID ---- */}
      <div className="ov-section-title">Status Overview</div>
      <p className="ov-section-desc">{total} deliverables by lifecycle stage</p>
      <div className="ov-status-grid">
        {STAGES.map(stage => {
          const n = byStage[stage.id].length
          if (n === 0) return null
          return (
            <div key={stage.id} className="ov-status-card" style={{ borderTopColor: stage.color }}>
              <div className="ov-status-count" style={{ color: stage.color }}>{n}</div>
              <div className="ov-status-label">{stage.label}</div>
              <div className="ov-status-desc">{stage.desc}</div>
            </div>
          )
        })}
      </div>

      {/* ---- ROADMAP ---- */}
      <div className="ov-section-title">Key Milestones</div>
      <p className="ov-section-desc">From first Power BI go-live through HMS stabilisation</p>
      <div className="ov-roadmap">
        {[
          { date: 'Apr 2026', title: 'PB-01 Tonnage live', phase: 'past' },
          { date: 'Jun 2026', title: 'PB-03 Stock + PB-05 Debtors live', phase: 'now' },
          { date: 'Jul 2026', title: 'PB-02 Procurement build', phase: 'next' },
          { date: 'Aug 2026', title: 'HMS Go-Live (supervised)', phase: 'major', major: true },
          { date: 'Sep 2026', title: 'PB-06 Production page', phase: 'future' },
          { date: 'Dec 2026', title: 'Power BI core complete', phase: 'future' },
          { date: 'Aug 2027', title: 'HMS full stabilisation', phase: 'major', major: true },
        ].map((m, i) => (
          <div key={i} className={`ov-milestone ${m.phase} ${m.major ? 'major' : ''}`}>
            <div className="ov-milestone-dot" />
            <div className="ov-milestone-date">{m.date}</div>
            <div className="ov-milestone-title">{m.title}</div>
          </div>
        ))}
      </div>

      {/* ---- FOCUS ---- */}
      <div className="ov-section-title">This Month · {currentMonthLabel}</div>
      <p className="ov-section-desc">Deliverables actively being built or tested</p>
      {focus.length === 0 ? (
        <div className="muted" style={{ fontSize: 13 }}>Nothing in active build or testing.</div>
      ) : (
        <div className="ov-focus">
          {focus.map(r => {
            const s = statusInfo(r.status)
            return (
              <button key={`${r._tabId}:${r.id}`} className="ov-focus-row" onClick={() => setTab(r._tabId)}>
                <span className="ov-focus-id">{r.id}</span>
                <span className="ov-focus-title">{r.title}</span>
                <span className="ov-focus-src">{r._source}</span>
                <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
                <span className="ov-focus-date muted">{r.targetDate || ''}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ---- MAIN TRACK CARDS ---- */}
      <div className="ov-section-title">Main Tracks</div>
      <div className="track-cards">
        {data.tracks.map((t, i) => {
          const s = statusInfo(t.status)
          const sub = t.id === 'powerbi' ? data.powerBi : t.id === 'mes' ? data.mes : []
          const subLive    = sub.filter(x => ['LIVE','DEPLOYED'].includes(x.status)).length
          const subTesting = sub.filter(x => x.status === 'TESTING').length
          const subBuild   = sub.filter(x => x.status === 'IN_PROGRESS').length
          const subPlanned = sub.filter(x => x.status === 'PLANNED').length
          return (
            <div key={t.id} className="track-card-pro" style={{ borderTopColor: s.color }} onClick={() => setTab(t.id === 'powerbi' ? 'powerbi' : 'mes')}>
              <div className="tcp-head">
                <div>
                  <div className="tcp-title">{t.name}</div>
                  <div className="tcp-sub">{t.estComplete}</div>
                </div>
                <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
              </div>
              <div className="tcp-progress">
                <div className="tcp-bar"><div className="tcp-fill" style={{ width: `${t.percent}%`, background: s.color }} /></div>
                <div className="tcp-pct">{t.percent}%</div>
              </div>
              <div className="tcp-meta">
                <strong>Next:</strong> {t.nextMilestone || '—'}
              </div>
              <div className="tcp-mix">
                <span className="tcp-stat"><span className="tcp-num" style={{ color: '#16A34A' }}>{subLive}</span> live</span>
                <span className="tcp-stat"><span className="tcp-num" style={{ color: '#0EA5E9' }}>{subTesting}</span> testing</span>
                <span className="tcp-stat"><span className="tcp-num" style={{ color: '#1F3864' }}>{subBuild}</span> build</span>
                <span className="tcp-stat"><span className="tcp-num" style={{ color: '#94A3B8' }}>{subPlanned}</span> planned</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ---- OTHER INITIATIVES ---- */}
      {data.otherTracks.length > 0 && (
        <>
          <div className="ov-section-title">Other Initiatives</div>
          <p className="ov-section-desc">Smaller IT tracks. Capacity-dependent — may begin once main tracks free up.</p>
          <div className="other-grid">
            {data.otherTracks.map(t => {
              const s = statusInfo(t.status)
              const done = (t.items || []).filter(x => ['LIVE','DEPLOYED'].includes(x.status)).length
              const tot = (t.items || []).length
              return (
                <button key={t.id} className="other-card" style={{ borderTopColor: s.color }} onClick={() => setTab(`other:${t.id}`)}>
                  <div className="other-title">{t.title}</div>
                  <div className="other-meta">
                    <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
                    <span className="muted" style={{ fontSize: 12 }}>{done}/{tot} items</span>
                  </div>
                  <div className="other-note">{t.description || t.note}</div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// =====================================================================
// OTHER-TASK detail page (Monitoring / FigJam / Automation)
// =====================================================================
function OtherTaskPage({ track, index, onRowClick }) {
  const s = statusInfo(track.status)
  const items = track.items || []

  // Mini-KPIs for this track
  const counts = STAGES.map(stage => ({
    stage,
    n: items.filter(x => stage.statuses.includes(x.status)).length,
  }))

  return (
    <div>
      <h1 className="page-title">{track.title}</h1>
      <p className="page-sub">
        Owner: {track.owner || '—'} · Target start: {track.targetStart || 'TBC'}
      </p>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
        <span className="pill" style={{ color: s.color, background: alphaBg(s.color), fontSize: 12 }}>{s.label}</span>
        <span className="muted" style={{ fontSize: 12 }}>{items.length} sub-items</span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text)', maxWidth: 720, marginTop: 16 }}>
        {track.description}
      </p>
      {track.note && (
        <div className="notebar"><span>▍</span><span>{track.note}</span></div>
      )}

      {/* Stage mini-grid */}
      <div className="section-label" style={{ marginTop: 24 }}>Status Mix</div>
      <div className="stage-mini-grid">
        {counts.map(({ stage, n }) => (
          <div key={stage.id} className="stage-mini" style={{ borderTopColor: stage.color }}>
            <div className="stage-mini-count" style={{ color: stage.color }}>{n}</div>
            <div className="stage-mini-label">{stage.label}</div>
          </div>
        ))}
      </div>

      {/* Items list */}
      <div className="section-label" style={{ marginTop: 24 }}>Planned Items</div>
      {items.length === 0 ? (
        <div className="muted" style={{ fontSize: 13 }}>No items yet — scope to be defined.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{width: '90px'}}>ID</th>
                <th>Item</th>
                <th style={{width: '140px'}}>Status</th>
                <th style={{width: '120px'}}>Target</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, i) => {
                const rs = statusInfo(r.status)
                // We pass the parent track index + sub-index through a synthetic kind
                return (
                  <tr key={r.id} className="editable" onClick={() => onRowClick('otherItems', { trackIndex: index, itemIndex: i }, { ...r, _trackTitle: track.title })}>
                    <td className="id">{r.id}</td>
                    <td>{r.title}</td>
                    <td><span className="pill" style={{ color: rs.color, background: alphaBg(rs.color) }}>{rs.label}</span></td>
                    <td className="muted">{r.targetDate}</td>
                    <td className="muted">{r.notes || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
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
  const [commentsData, setCommentsData] = useState({})
  const { user } = useAuth()
  const f = FILTERS.find(x => x.id === filter) || FILTERS[0]
  const visible = rows.map((r, i) => ({ r, i })).filter(({ r }) => f.match(r))

  useEffect(() => {
    async function loadComments() {
      if (!supabaseEnabled || !user) return
      const { data } = await supabase
        .from('comments')
        .select('item_id, body, created_at')
        .eq('item_kind', kind)
        .order('created_at', { ascending: false })
      
      if (data) {
        const grouped = {}
        data.forEach(c => {
          if (!grouped[c.item_id]) grouped[c.item_id] = []
          grouped[c.item_id].push(c)
        })
        setCommentsData(grouped)
      }
    }
    loadComments()
  }, [kind, user])

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
              <th>Notes / Latest Comment</th>
              <th style={{width: '100px', textAlign: 'center'}}>Comments</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(({ r, i }) => {
              const s = statusInfo(r.status)
              const comments = commentsData[r.id] || []
              const latestComment = comments[0]
              const commentCount = comments.length
              
              return (
                <tr key={r.id} className="editable" onClick={() => onRowClick(kind, i, r)}>
                  <td className="id">{r.id}</td>
                  <td>{r.title}</td>
                  <td>
                    <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
                  </td>
                  <td className="muted">{r.targetDate}</td>
                  <td className="muted">
                    {latestComment ? (
                      <div>
                        <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginBottom: 2 }}>
                          💬 Latest: {new Date(latestComment.created_at).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: 12, color: '#374151' }}>
                          {latestComment.body.length > 60 ? latestComment.body.substring(0, 60) + '...' : latestComment.body}
                        </div>
                      </div>
                    ) : (
                      r.notes || '—'
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: 4, 
                      padding: '4px 10px', 
                      background: commentCount > 0 ? '#10B981' : '#3B82F6', 
                      color: 'white', 
                      borderRadius: 4, 
                      fontSize: 12, 
                      fontWeight: 600,
                      cursor: 'pointer',
                      position: 'relative'
                    }}>
                      📝 View
                      {commentCount > 0 && (
                        <span style={{ 
                          position: 'absolute', 
                          top: -6, 
                          right: -6, 
                          background: '#EF4444', 
                          color: 'white', 
                          borderRadius: '50%', 
                          width: 18, 
                          height: 18, 
                          fontSize: 10, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontWeight: 700
                        }}>
                          {commentCount}
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="muted" style={{ textAlign: 'center', padding: '24px' }}>No deliverables match this filter.</td></tr>
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
    kind === 'tracks'       ? item.id :
    kind === 'powerBi'      ? item.id :
    kind === 'mes'          ? item.id :
    kind === 'otherTracks'  ? item.id :
    kind === 'otherItems'   ? item.id :
    kind === 'stakeholders' ? `person:${item.name}` :
    `${kind}:${item.id || item.name}`

  // Stakeholders: no comments thread
  const showComments = kind !== 'stakeholders'
  const s = item.status ? statusInfo(item.status) : null

  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth: 720, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-head">
          <h3>{item.id ? `${item.id} · ` : ''}{item.title || item.name}</h3>
          <button type="button" className="btn small" onClick={onClose}>Close</button>
        </div>
        <div className="modal-body">
          {s && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
              <span className="pill" style={{ color: s.color, background: alphaBg(s.color) }}>{s.label}</span>
              {item.targetDate && <span style={{ fontSize: 12, color: 'var(--slate)' }}>Target: {item.targetDate}</span>}
              {typeof item.percent === 'number' && (
                <span style={{ fontSize: 12, color: 'var(--slate)' }}>· {item.percent}% complete</span>
              )}
            </div>
          )}
          {item.nextMilestone && <div style={{ fontSize: 13, marginBottom: 8 }}><strong>Next:</strong> {item.nextMilestone}</div>}
          {item.estComplete    && <div style={{ fontSize: 13, marginBottom: 8 }}><strong>ETA:</strong> {item.estComplete}</div>}
          
          {(item.notes || item.note) && (
            <div style={{ marginTop: 12, marginBottom: 12, padding: 12, background: '#F8FAFC', borderRadius: 6, borderLeft: '3px solid #94A3B8' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 4, textTransform: 'uppercase' }}>Project Notes (Static)</div>
              <div style={{ fontSize: 13, color: 'var(--slate)' }}>{item.notes || item.note}</div>
            </div>
          )}
          
          {item.role && <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 8 }}>{item.role}</div>}

          {showComments && (
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '2px solid var(--border)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1E40AF', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                � Manager Comments & Feedback
              </div>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
                Add your updates, questions, or feedback below. IT Lead will be notified.
              </div>
              <Comments kind={kind} itemId={commentItemId} />
            </div>
          )}
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
