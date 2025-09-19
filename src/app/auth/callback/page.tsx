'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('Processando autenticação...')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient()

        // Obter o código e o next_url dos parâmetros de query
        const code = searchParams.get('code')
        const next = searchParams.get('next')

        if (code) {
          // Trocar o código por uma sessão
          const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            throw new Error(exchangeError.message)
          }

          setStatus('success')
          setMessage('Autenticação realizada com sucesso!')

          // Redirecionar para o dashboard ou para a URL original
          setTimeout(() => {
            if (next) {
              router.push(decodeURIComponent(next))
            } else {
              router.push('/dashboard')
            }
          }, 1500)
        } else {
          // Verificar se há sessão atual (para outros métodos de autenticação)
          const { data: { session }, error: sessionError } = await supabase.auth.getSession()

          if (sessionError) {
            throw new Error(sessionError.message)
          }

          if (session) {
            setStatus('success')
            setMessage('Autenticação realizada com sucesso!')

            setTimeout(() => {
              if (next) {
                router.push(decodeURIComponent(next))
              } else {
                router.push('/dashboard')
              }
            }, 1500)
          } else {
            throw new Error('Nenhuma sessão encontrada')
          }
        }
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : 'Erro durante autenticação')

        // Redirecionar para login após erro
        setTimeout(() => {
          router.push('/auth/login?error=authentication_failed')
        }, 3000)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="max-w-md w-full">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Autenticação
        </h2>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          )}

          {status === 'success' && (
            <CheckCircle className="h-12 w-12 text-green-500" />
          )}

          {status === 'error' && (
            <AlertCircle className="h-12 w-12 text-red-500" />
          )}

          <Alert className={status === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <AlertDescription className={status === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message}
            </AlertDescription>
          </Alert>

          {status === 'loading' && (
            <p className="text-sm text-gray-500">
              Por favor, aguarde enquanto processamos sua autenticação...
            </p>
          )}

          {status === 'error' && (
            <p className="text-sm text-gray-500">
              Você será redirecionado para a página de login em instantes...
            </p>
          )}

          {status === 'success' && (
            <p className="text-sm text-gray-500">
              Você será redirecionado para o dashboard em instantes...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}