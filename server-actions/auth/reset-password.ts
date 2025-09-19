'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import {
  resetPasswordSchema,
  updatePasswordSchema,
  type ResetPasswordInput,
  type UpdatePasswordInput,
  type ResetPasswordResponse,
} from './types'
import { AuthErrorHandler } from './utils'

export async function resetPasswordAction(input: ResetPasswordInput): Promise<ResetPasswordResponse> {
  try {
    // Validar entrada
    const validatedData = resetPasswordSchema.parse(input)

    // Obter IP para rate limiting
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    // Rate limiting
    AuthErrorHandler.checkRateLimit(ip, 'reset_password', 3, 300000) // 3 tentativas por 5 minutos

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(validatedData.email)) {
      throw new AuthError(
        'Email inválido',
        'VALIDATION_ERROR',
        400
      )
    }

    // Criar cliente Supabase
    const supabase = createClient()

    // Verificar se usuário existe (sem expor informações)
    const { data: { user } } = await supabase.auth.admin.getUserByEmail(validatedData.email)

    if (!user) {
      // Por segurança, retornar sucesso mesmo se usuário não existir
      // para evitar enumeração de emails
      return {
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link de recuperação',
        data: {
          emailSent: true,
          redirectTo: validatedData.redirectTo || '/auth/reset-password',
        },
      }
    }

    // Enviar email de recuperação
    const redirectTo = validatedData.redirectTo || `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
      redirectTo,
    })

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    // Logar ação (sem expor dados sensíveis)
    AuthErrorHandler.logAction('reset_password_request', user.id, {
      ip,
      userAgent: headersList.get('user-agent'),
    })

    return {
      success: true,
      message: 'Se o email estiver cadastrado, você receberá um link de recuperação',
      data: {
        emailSent: true,
        redirectTo,
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

export async function updatePasswordAction(input: UpdatePasswordInput): Promise<{ success: boolean; message: string }> {
  try {
    // Validar entrada
    const validatedData = updatePasswordSchema.parse(input)

    // Obter headers para logging
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new AuthError(
        'Usuário não autenticado',
        'SESSION_EXPIRED',
        401
      )
    }

    // Validar força da senha
    if (validatedData.password.length < 6) {
      throw new AuthError(
        'A senha deve ter no mínimo 6 caracteres',
        'WEAK_PASSWORD',
        400
      )
    }

    // Atualizar senha
    const { error } = await supabase.auth.updateUser({
      password: validatedData.password,
    })

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    // Logar ação
    AuthErrorHandler.logAction('update_password', user.id, {
      ip,
      userAgent: headersList.get('user-agent'),
    })

    return {
      success: true,
      message: 'Senha atualizada com sucesso',
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

// Action para verificar se token de reset é válido
export async function verifyResetTokenAction(token: string): Promise<{ success: boolean; message: string; valid?: boolean }> {
  try {
    const supabase = createClient()

    // Verificar token sem expor detalhes
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return {
        success: false,
        message: 'Token inválido ou expirado',
        valid: false,
      }
    }

    return {
      success: true,
      message: 'Token válido',
      valid: true,
    }

  } catch (error) {
    const authError = AuthErrorHandler.handleError(error)
    return {
      success: false,
      message: authError.message,
      valid: false,
    }
  }
}