'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { signInSchema, type SignInInput, type SignInResponse } from './types'
import { AuthErrorHandler } from './utils'

export async function signInAction(input: SignInInput): Promise<SignInResponse> {
  try {
    // Validar entrada
    const validatedData = signInSchema.parse(input)

    // Obter IP para rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    // Rate limiting
    AuthErrorHandler.checkRateLimit(ip, 'signin', 5, 60000) // 5 tentativas por minuto

    // Criar cliente Supabase
    const supabase = createClient()

    // Realizar login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    })

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    if (!data.user || !data.session) {
      throw new AuthError(
        'Falha ao realizar login',
        'INTERNAL_ERROR',
        500
      )
    }

    // Sanitizar dados do usuário
    const sanitizedUser = AuthErrorHandler.sanitizeUserData(data.user)

    // Logar ação
    AuthErrorHandler.logAction('signin', data.user.id, {
      ip,
      userAgent: headersList.get('user-agent'),
    })

    return {
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        user: sanitizedUser,
        session: {
          accessToken: data.session.access_token,
          expiresAt: data.session.expires_at,
        },
      },
    }

  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      }
    }

    const authError = AuthErrorHandler.handleError(error)
    return {
      success: false,
      message: authError.message,
      error: authError.code,
    }
  }
}

// Action para OAuth login
export async function signInWithOAuthAction(
  provider: 'google' | 'github',
  options?: { redirectTo?: string }
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const supabase = createClient()

    const redirectTo = options?.redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    return {
      success: true,
      message: 'Redirecionando para provedor OAuth',
      url: data.url,
    }

  } catch (error) {
    if (error instanceof AuthError) {
      return {
        success: false,
        message: error.message,
      }
    }

    const authError = AuthErrorHandler.handleError(error)
    return {
      success: false,
      message: authError.message,
    }
  }
}