'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Spinner } from '@/components/ui/spinner'

interface AuthLoadingProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: ReactNode
}

export function AuthLoading({
  children,
  fallback,
  errorFallback,
}: AuthLoadingProps) {
  const { loading, error } = useAuth()

  if (loading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Spinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      )
    )
  }

  if (error) {
    return (
      errorFallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-red-600">
            <p>Erro ao carregar autenticação</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}