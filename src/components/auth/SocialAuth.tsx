'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Chrome, Github } from 'lucide-react'

interface SocialAuthProps {
  redirectTo?: string
}

export function SocialAuth({ redirectTo }: SocialAuthProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(provider)
    setError(null)

    try {
      const redirectToUrl = redirectTo
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : `${window.location.origin}/auth/callback`

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectToUrl,
        },
      })

      if (signInError) {
        throw new Error(signInError.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Erro ao fazer login com ${provider}`
      setError(errorMessage)
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 text-gray-500">Ou continue com</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading === 'google'}
          className="flex items-center justify-center gap-2"
        >
          {isLoading === 'google' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          ) : (
            <Chrome className="h-4 w-4" />
          )}
          Google
        </Button>

        <Button
          variant="outline"
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading === 'github'}
          className="flex items-center justify-center gap-2"
        >
          {isLoading === 'github' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          ) : (
            <Github className="h-4 w-4" />
          )}
          GitHub
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}