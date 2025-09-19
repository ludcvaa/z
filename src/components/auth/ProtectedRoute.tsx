'use client'

import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { useRequireAuth } from '@/components/providers/auth-provider'
import { Spinner } from '@/components/ui/spinner'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
  requiredRole?: string
  fallback?: ReactNode
}

export function ProtectedRoute({
  children,
  redirectTo = '/auth/login',
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Salvar URL atual para redirecionar após login
        const currentPath = window.location.pathname + window.location.search
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`)
      } else if (requiredRole && user?.role !== requiredRole) {
        // Verificar permissão (se implementado)
        router.push('/unauthorized')
      }
    }
  }, [user, loading, isAuthenticated, router, redirectTo, requiredRole])

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null // Vai redirecionar via useEffect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null // Vai redirecionar via useEffect
  }

  return <>{children}</>
}

// Componente para proteger rotas específicas por role
export function RoleProtectedRoute({
  children,
  requiredRole,
  fallback,
}: {
  children: ReactNode
  requiredRole: string
  fallback?: ReactNode
}) {
  const { user, loading } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login')
      } else if (user.role !== requiredRole) {
        router.push('/unauthorized')
      }
    }
  }, [user, loading, router, requiredRole])

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      )
    )
  }

  if (!user || user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}