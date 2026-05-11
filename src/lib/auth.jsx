import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, supabaseEnabled } from './supabase.js'

const AuthContext = createContext({
  user: null, profile: null, role: null,
  loading: false, supabaseEnabled: false,
  signInWithMagicLink: async () => {}, signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabaseEnabled) { setLoading(false); return }

    let mounted = true

    async function loadProfile(u) {
      if (!u) { setProfile(null); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', u.id).maybeSingle()
      if (!mounted) return
      // Auto-create profile row if missing (first-time login)
      if (!data) {
        const insert = {
          id: u.id,
          email: u.email,
          full_name: u.user_metadata?.full_name || u.email?.split('@')[0],
          role: 'viewer',
        }
        await supabase.from('profiles').insert(insert)
        setProfile(insert)
      } else {
        setProfile(data)
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const u = data.session?.user || null
      setUser(u)
      loadProfile(u).finally(() => mounted && setLoading(false))
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null
      setUser(u)
      loadProfile(u)
    })
    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  const value = useMemo(() => ({
    user,
    profile,
    role: profile?.role || (user ? 'viewer' : null),
    loading,
    supabaseEnabled,
    async signInWithMagicLink(email) {
      if (!supabaseEnabled) throw new Error('Auth not configured')
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.href },
      })
      if (error) throw error
    },
    async signOut() {
      if (!supabaseEnabled) return
      await supabase.auth.signOut()
      setProfile(null)
    },
  }), [user, profile, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { return useContext(AuthContext) }
