'use client'

import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const redirect = searchParams.get('redirect')

  const errorMessages: Record<string, string> = {
    session_expired: 'Sua sessão expirou. Por favor, faça login novamente.',
    access_denied: 'Acesso negado. Você não tem permissão para acessar esta página.',
    invalid_credentials: 'Credenciais inválidas. Por favor, tente novamente.',
    email_not_confirmed: 'Por favor, confirme seu email antes de fazer login.',
    default: 'Ocorreu um erro de autenticação. Por favor, tente novamente.',
  }

  const message = error ? errorMessages[error] || errorMessages.default : null

  if (!message) return null

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col gap-2">
        <span>{message}</span>
        {redirect && (
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href={decodeURIComponent(redirect)}>
              Tentar acessar a página original
            </Link>
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}