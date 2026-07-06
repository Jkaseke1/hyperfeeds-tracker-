import React, { useState } from 'react'
import { useAuth } from '../lib/auth.jsx'

export default function LoginButton() {
  const { user, profile, role, loading, supabaseEnabled, signInWithPassword, signUp, signOut, resetPassword } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'reset'
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
      if (mode === 'reset') {
        await resetPassword(email.trim())
        setMsg('Password reset email sent! Check your inbox (including spam folder).')
        setMode('signin')
      } else if (mode === 'signin') {
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
      if (mode === 'reset') {
        setErr('Unable to send reset email. Please contact Joseph (IT Lead) at it02@hyperfeeds.co.zw to reset your password manually.')
      } else {
        setErr(e.message || 'Authentication failed.')
      }
    } finally { setBusy(false) }
  }

  return (
    <>
      <button className="btn primary" onClick={() => setOpen(true)}>Sign in</button>
      {open && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
          <form className="modal" style={{ maxWidth: 400 }} onSubmit={submit}>
            <div className="modal-head">
              <h3>{mode === 'reset' ? 'Reset Password' : mode === 'signin' ? 'Sign in' : 'Create account'}</h3>
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
              {mode !== 'reset' && (
                <div className="field">
                  <label>Password</label>
                  <input
                    type="password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              )}
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
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setErr(''); setMsg('') }}
                  style={{ fontSize: 12, color: '#3B82F6', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline', marginTop: -8 }}
                >
                  Forgot password?
                </button>
              )}
              {mode === 'reset' && (
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 8 }}>
                  Enter your email and we'll send you a link to reset your password.
                </div>
              )}
              {msg && <div style={{ fontSize: 12, color: '#16A34A', marginTop: 8, padding: 8, background: '#F0FDF4', borderRadius: 4 }}>{msg}</div>}
              {err && <div style={{ fontSize: 12, color: '#b91c1c', marginTop: 8, padding: 8, background: '#FEF2F2', borderRadius: 4 }}>{err}</div>}
            </div>
            <div className="modal-foot">
              <button
                type="button"
                className="btn small"
                onClick={() => { 
                  if (mode === 'reset') setMode('signin')
                  else setMode(mode === 'signin' ? 'signup' : 'signin')
                  setErr(''); setMsg('') 
                }}
                style={{ fontSize: 12 }}
              >
                {mode === 'reset' ? 'Back to sign in' : mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
              </button>
              <button type="submit" className="btn primary" disabled={busy}>
                {busy ? 'Processing…' : mode === 'reset' ? 'Send reset link' : mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
