import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.jsx'

const KIND_LABELS = {
  tracks: 'Track',
  powerBi: 'Power BI',
  mes: 'Hyper MS',
}

export default function Inbox() {
  const { role } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let cancel = false
    async function load() {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      if (cancel) return
      if (error) setErr(error.message)
      setRows(data || [])
      setLoading(false)
    }
    load()
    return () => { cancel = true }
  }, [])

  if (role !== 'lead') {
    return <div className="muted">Restricted — IT Lead only.</div>
  }

  return (
    <div>
      <h1 className="page-title">Feedback Inbox</h1>
      <p className="page-sub">All feedback across all projects. Newest first. {rows.length} message{rows.length === 1 ? '' : 's'}.</p>

      {err && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 8 }}>{err}</div>}
      {loading && <div className="muted">Loading…</div>}
      {!loading && rows.length === 0 && <div className="muted">No feedback yet.</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(c => (
          <div key={c.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: 'var(--slate)' }}>
                <span className="pill" style={{ background: '#1F386415', color: 'var(--navy)', marginRight: 8 }}>
                  {KIND_LABELS[c.item_kind] || c.item_kind} · {c.item_id}
                </span>
                <strong style={{ color: 'var(--navy)' }}>{c.author_name || c.author_email}</strong>
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate)' }}>
                {new Date(c.created_at).toLocaleString()}
              </div>
            </div>
            <div style={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
