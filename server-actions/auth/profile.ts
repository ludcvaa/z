'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { updateProfileSchema, type UpdateProfileInput } from './types'
import { AuthErrorHandler } from './utils'

export async function updateProfileAction(input: UpdateProfileInput): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // Validar entrada
    const validatedData = updateProfileSchema.parse(input)

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

    // Preparar dados para atualização
    const updateData: any = {}

    if (validatedData.fullName !== undefined) {
      updateData.full_name = validatedData.fullName
    }

    if (validatedData.avatarUrl !== undefined) {
      // Validar URL da imagem
      try {
        new URL(validatedData.avatarUrl)
        updateData.avatar_url = validatedData.avatarUrl
      } catch {
        throw new AuthError(
          'URL de avatar inválida',
          'VALIDATION_ERROR',
          400
        )
      }
    }

    // Atualizar perfil
    const { data, error } = await supabase.auth.updateUser({
      data: updateData,
    })

    if (error) {
      throw AuthErrorHandler.handleError(error)
    }

    // Logar ação
    AuthErrorHandler.logAction('update_profile', user.id, {
      ip,
      userAgent: headersList.get('user-agent'),
    })

    // Sanitizar dados retornados
    const sanitizedUser = AuthErrorHandler.sanitizeUserData(data.user)

    return {
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: sanitizedUser,
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

// Action para obter perfil do usuário atual
export async function getProfileAction(): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    const supabase = createClient()

    // Obter usuário atual
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      throw new AuthError(
        'Usuário não autenticado',
        'SESSION_EXPIRED',
        401
      )
    }

    // Sanitizar dados
    const sanitizedUser = AuthErrorHandler.sanitizeUserData(user)

    return {
      success: true,
      message: 'Perfil obtido com sucesso',
      data: sanitizedUser,
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

// Action para excluir conta do usuário
export async function deleteAccountAction(password: string): Promise<{ success: boolean; message: string }> {
  try {
    const headersList = headers()
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

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

    // Verificar senha antes de excluir
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    })

    if (signInError) {
      throw new AuthError(
        'Senha incorreta',
        'INVALID_CREDENTIALS',
        401
      )
    }

    // Excluir usuário (requer service role key)
    const serviceSupabase = createClient()
    const { error: deleteError } = await serviceSupabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      throw AuthErrorHandler.handleError(deleteError)
    }

    // Logar ação
    AuthErrorHandler.logAction('delete_account', user.id, {
      ip,
      userAgent: headersList.get('user-agent'),
    })

    return {
      success: true,
      message: 'Conta excluída com sucesso',
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