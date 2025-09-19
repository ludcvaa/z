'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/spinner'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function AuthGuard({
  children,
  redirectTo = '/login',
  requireAuth = true
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Se requer autenticação e usuário não está logado
        const currentPath = window.location.pathname + window.location.search
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
      } else if (!requireAuth && user) {
        // Se não requer autenticação e usuário está logado (páginas de login/cadastro)
        router.push('/dashboard')
      }
    }
  }, [user, loading, router, redirectTo, requireAuth])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (requireAuth && !user) {
    return null // Vai redirecionar via useEffect
  }

  if (!requireAuth && user) {
    return null // Vai redirecionar via useEffect
  }

  return <>{children}</>
}