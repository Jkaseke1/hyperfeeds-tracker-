import React, { useEffect, useState } from 'react'
import { supabase, supabaseEnabled } from '../lib/supabase.js'
import { useAuth } from '../lib/auth.jsx'

export default function Comments({ kind, itemId }) {
  const { user, profile, role } = useAuth()
  const [rows, setRows] = useState([])
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  async function load() {
    if (!supabaseEnabled || !user) { setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('item_kind', kind)
      .eq('item_id', itemId)
      .order('created_at', { ascending: false })
    if (error) setErr(error.message)
    setRows(data || [])
    setLoading(false)
  }

  useEffect(() => { load() /* eslint-disable-next-line */ }, [kind, itemId, user])

  if (!supabaseEnabled) {
    return <div className="muted" style={{ fontSize: 12 }}>Comments not available — auth not configured.</div>
  }
  if (!user) {
    return <div className="muted" style={{ fontSize: 12 }}>Sign in to leave feedback for the IT Lead.</div>
  }

  async function submit(e) {
    e.preventDefault()
    if (!body.trim()) return
    setBusy(true); setErr('')
    const { error } = await supabase.from('comments').insert({
      item_kind: kind,
      item_id: itemId,
      body: body.trim(),
      author_id: user.id,
      author_email: user.email,
      author_name: profile?.full_name || user.email,
    })
    setBusy(false)
    if (error) { setErr(error.message); return }
    setBody('')
    load()
  }

  async function remove(id) {
    if (!confirm('Delete this comment?')) return
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) { setErr(error.message); return }
    load()
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div className="section-label" style={{ margin: '0 0 8px', fontSize: 11 }}>
        Feedback {role === 'lead' && <span style={{ color: 'var(--slate)', fontWeight: 400 }}>(all users · lead view)</span>}
        {role !== 'lead' && <span style={{ color: 'var(--slate)', fontWeight: 400 }}>(private to you and the IT Lead)</span>}
      </div>

      <form onSubmit={submit} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <textarea
          value={body} onChange={e => setBody(e.target.value)}
          placeholder="Write a note for the IT Lead…"
          style={{ flex: 1, minHeight: 60 }}
        />
        <button type="submit" className="btn primary" disabled={busy || !body.trim()} style={{ alignSelf: 'flex-start' }}>
          {busy ? 'Posting…' : 'Post'}
        </button>
      </form>

      {err && <div style={{ color: '#b91c1c', fontSize: 12, marginBottom: 8 }}>{err}</div>}
      {loading && <div className="muted" style={{ fontSize: 12 }}>Loading…</div>}
      {!loading && rows.length === 0 && (
        <div className="muted" style={{ fontSize: 12 }}>No feedback yet.</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(c => (
          <div key={c.id} style={{ background: '#FAFAF7', border: '1px solid var(--border)', padding: '10px 12px', borderRadius: 4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--navy)' }}>
                {c.author_name || c.author_email}
                <span style={{ marginLeft: 8, fontWeight: 400, color: 'var(--slate)' }}>
                  {new Date(c.created_at).toLocaleString()}
                </span>
              </div>
              {(c.author_id === user.id || role === 'lead') && (
                <button className="btn small danger" type="button" onClick={() => remove(c.id)}>Delete</button>
              )}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text)', whiteSpace: 'pre-wrap', marginTop: 4 }}>{c.body}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
