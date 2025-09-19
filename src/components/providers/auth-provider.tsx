'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  const supabase = createClient()

  // Função para atualizar a sessão
  const refreshSession = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        setError(error)
        setUser(null)
        setSession(null)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
        setError(null)
      }
    } catch (err) {
      console.error('Erro ao atualizar sessão:', err)
      setError(err as AuthError)
    } finally {
      setLoading(false)
    }
  }

  // Função de login
  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  // Função de registro
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  // Função de login OAuth
  const signInWithOAuth = async (provider: 'google' | 'github') => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  // Função de logout
  const signOut = async () => {
    try {
      setError(null)
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
    }
  }

  // Função de reset de senha
  const resetPassword = async (email: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  // Função de atualização de senha
  const updatePassword = async (password: string) => {
    try {
      setError(null)
      const { error } = await supabase.auth.updateUser({
        password,
      })
      return { error }
    } catch (err) {
      const authError = err as AuthError
      setError(authError)
      return { error: authError }
    }
  }

  // Efeito inicial para carregar sessão
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)

        // Obter sessão inicial
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          setError(error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }

        // Configurar listener para mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session)

            setSession(session)
            setUser(session?.user ?? null)
            setError(null)

            // Limpar erros em eventos bem-sucedidos
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              setError(null)
            }
          }
        )

        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Erro ao inicializar autenticação:', err)
        setError(err as AuthError)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Auto-refresh de sessão a cada 30 minutos
  useEffect(() => {
    if (!user) return

    const interval = setInterval(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error || !session) {
          // Sessão expirou, fazer logout
          await signOut()
        } else {
          setSession(session)
          setUser(session.user)
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err)
        await signOut()
      }
    }, 30 * 60 * 1000) // 30 minutos

    return () => clearInterval(interval)
  }, [user])

  const value: AuthContextType = {
    user,
    session,
    loading,
    error,
    signOut,
    refreshSession,
    signIn,
    signUp,
    signInWithOAuth,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

// Hook para verificar se usuário está autenticado
export function useRequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return { user: null, loading: true, isAuthenticated: false }
  }

  return {
    user,
    loading: false,
    isAuthenticated: !!user,
  }
}

// Hook para obter usuário atual com proteção
export function useCurrentUser() {
  const { user, loading, error } = useAuth()

  if (loading) {
    return { user: null, loading: true, error: null }
  }

  if (error) {
    return { user: null, loading: false, error }
  }

  if (!user) {
    return {
      user: null,
      loading: false,
      error: new Error('Usuário não autenticado') as AuthError,
    }
  }

  return { user, loading: false, error: null }
}