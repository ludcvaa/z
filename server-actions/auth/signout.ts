'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { signOutSchema, type SignOutInput } from './types'
import { AuthErrorHandler } from './utils'
import { redirect } from 'next/navigation'

export async function signOutAction(input?: SignOutInput): Promise<{ success: boolean; message: string }> {
  try {
    // Validar entrada (se fornecida)
    if (input) {
      const validatedData = signOutSchema.parse(input)
    }

    // Obter headers para logging
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário atual para logging
    const { data: { user } } = await supabase.auth.getUser()

    // Realizar logout
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    // Logar ação
    if (user) {
      AuthErrorHandler.logAction('signout', user.id, {
        ip,
        userAgent: headersList.get('user-agent'),
      })
    }

    // Sanitizar URL de redirecionamento
    const redirectTo = input?.redirectTo
      ? AuthErrorHandler.sanitizeRedirectUrl(input.redirectTo)
      : '/'

    // Redirecionar após logout
    if (redirectTo !== '/') {
      redirect(redirectTo)
    }

    return {
      success: true,
      message: 'Logout realizado com sucesso',
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

// Action para logout em todas as sessões do usuário
export async function signOutAllSessionsAction(): Promise<{ success: boolean; message: string }> {
  try {
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    const supabase = createClient()

    // Obter usuário atual
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new AuthError(
        'Usuário não autenticado',
        'SESSION_EXPIRED',
        401
      )
    }

    // Revogar todos os tokens do usuário
    const { error } = await supabase.auth.admin.deleteUser(user.id)

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    // Logar ação
    AuthErrorHandler.logAction('signout_all_sessions', user.id, {
      ip,
      userAgent: headersList.get('user-agent'),
    })

    return {
      success: true,
      message: 'Todas as sessões foram encerradas com sucesso',
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