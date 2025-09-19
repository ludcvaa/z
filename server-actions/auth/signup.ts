'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { signUpSchema, type SignUpInput, type SignUpResponse } from './types'
import { AuthErrorHandler } from './utils'

export async function signUpAction(input: SignUpInput): Promise<SignUpResponse> {
  try {
    // Validar entrada
    const validatedData = signUpSchema.parse(input)

    // Obter IP para rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    // Rate limiting
    AuthErrorHandler.checkRateLimit(ip, 'signup', 3, 300000) // 3 tentativas por 5 minutos

    // Criar cliente Supabase
    const supabase = createClient()

    // Verificar se email já existe (adicional à verificação do Supabase)
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(validatedData.email)
    if (existingUser.user) {
      throw new AuthError(
        'Este email já está em uso',
        'EMAIL_ALREADY_EXISTS',
        409
      )
    }

    // Realizar registro
    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          full_name: validatedData.fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    if (!data.user) {
      throw new AuthError(
        'Falha ao criar conta',
        'INTERNAL_ERROR',
        500
      )
    }

    // Sanitizar dados do usuário
    const sanitizedUser = AuthErrorHandler.sanitizeUserData(data.user)

    // Logar ação
    AuthErrorHandler.logAction('signup', data.user.id, {
      ip,
      userAgent: headersList.get('user-agent'),
    })

    // Verificar se confirmação de email é necessária
    const emailConfirmationRequired = !data.user.email_confirmed_at && data.user.identities?.length === 0

    return {
      success: true,
      message: emailConfirmationRequired
        ? 'Conta criada com sucesso! Verifique seu email para confirmar.'
        : 'Conta criada com sucesso!',
      data: {
        user: sanitizedUser,
        emailConfirmationRequired,
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

// Action para reenviar email de confirmação
export async function resendConfirmationEmailAction(
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AuthError(
        'Email inválido',
        'VALIDATION_ERROR',
        400
      )
    }

    const supabase = createClient()

    // Verificar se usuário existe
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== email) {
      throw new AuthError(
        'Usuário não encontrado',
        'EMAIL_NOT_FOUND',
        404
      )
    }

    // Reenviar email de confirmação
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    return {
      success: true,
      message: 'Email de confirmação reenviado com sucesso!',
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