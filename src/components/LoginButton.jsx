import React, { useState } from 'react'
import { useAuth } from '../lib/auth.jsx'

export default function LoginButton() {
  const { user, profile, role, loading, supabaseEnabled, signInWithPassword, signUp, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
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
      if (mode === 'signin') {
        await signInWithPassword(email.trim(), password)
        setMsg('Signed in successfully.')
        setOpen(false)
      } else {
        await signUp(email.trim(), password, fullName.trim())
        setMsg('Account created. You can now sign in.')
        setMode('signin')
        setPassword('')
      }
    } catch (e) {
      setErr(e.message || 'Authentication failed.')
    } finally { setBusy(false) }
  }

  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>Sign in</button>
      {open && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
          <form className="modal" style={{ maxWidth: 400 }} onSubmit={submit}>
            <div className="modal-head">
              <h3>{mode === 'signin' ? 'Sign in' : 'Create account'}</h3>
              <button type="button" className="btn small" onClick={() => setOpen(false)}>Close</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label>Email</label>
                <input
                  type="email" required autoFocus
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@hyperfeeds.co.zw"
                />
              </div>
              <div className="field">
                <label>Password</label>
                <input
                  type="password" required
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              {mode === 'signup' && (
                <div className="field">
                  <label>Full name</label>
                  <input
                    type="text" required
                    value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="Joseph Kaseke"
                  />
                </div>
              )}
              {msg && <div style={{ fontSize: 12, color: '#16A34A', marginTop: 8 }}>{msg}</div>}
              {err && <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 8 }}>{err}</div>}
            </div>
            <div className="modal-foot">
              <button
                type="button"
                className="btn small"
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErr(''); setMsg('') }}
                style={{ fontSize: 12 }}
              >
                {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
              </button>
              <button type="submit" className="btn primary" disabled={busy}>
                {busy ? 'Processing…' : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
