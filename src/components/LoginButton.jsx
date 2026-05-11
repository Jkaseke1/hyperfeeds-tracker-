import React, { useState } from 'react'
import { useAuth } from '../lib/auth.jsx'

export default function LoginButton() {
  const { user, profile, role, loading, supabaseEnabled, signInWithMagicLink, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  if (!supabaseEnabled) {
    return <span className="meta" style={{ fontSize: 11, color: 'var(--slate)' }}>Auth not configured</span>
  }

  if (loading) return <span className="meta" style={{ fontSize: 11 }}>…</span>

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--slate)' }}>
          {profile?.full_name || user.email} {role === 'lead' ? '· LEAD' : ''}
        </span>
        <button className="btn small" onClick={signOut}>Sign out</button>
      </div>
    )
  }

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr(''); setMsg('')
    try {
      await signInWithMagicLink(email.trim())
      setMsg('Check your email for the sign-in link.')
    } catch (e) {
      setErr(e.message || 'Failed to send link.')
    } finally { setBusy(false) }
  }

  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>Sign in</button>
      {open && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
          <form className="modal" style={{ maxWidth: 400 }} onSubmit={submit}>
            <div className="modal-head">
              <h3>Sign in</h3>
              <button type="button" className="btn small" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="modal-body">
              <p style={{ margin: 0, fontSize: 13, color: 'var(--slate)' }}>
                Enter your work email. We'll send a sign-in link — no password needed.
              </p>
              <div className="field">
                <label>Email</label>
                <input
                  type="email" required autoFocus
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@hyperfeeds.co.zw"
                />
              </div>
              {msg && <div style={{ fontSize: 12, color: '#16A34A' }}>{msg}</div>}
              {err && <div style={{ fontSize: 12, color: '#b91c1c' }}>{err}</div>}
            </div>
            <div className="modal-foot">
              <span style={{ fontSize: 11, color: 'var(--slate)' }}>Magic link · No password</span>
              <button type="submit" className="btn primary" disabled={busy}>
                {busy ? 'Sending…' : 'Send link'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
