import { AuthError, AuthErrorCodes } from './types'

// Classe para tratamento de erros de autenticação
export class AuthErrorHandler {
  static handleError(error: any): AuthError {
    console.error('Auth Error:', error)

    // Erros do Supabase
    if (error?.code) {
      switch (error.code) {
        case 'invalid_credentials':
          return new AuthError(
            'Email ou senha inválidos',
            AuthErrorCodes.INVALID_CREDENTIALS,
            401
          )
        case 'user_not_found':
          return new AuthError(
            'Usuário não encontrado',
            AuthErrorCodes.EMAIL_NOT_FOUND,
            404
          )
        case 'email_already_exists':
          return new AuthError(
            'Este email já está em uso',
            AuthErrorCodes.EMAIL_ALREADY_EXISTS,
            409
          )
        case 'weak_password':
          return new AuthError(
            'Senha muito fraca',
            AuthErrorCodes.WEAK_PASSWORD,
            400
          )
        case 'session_expired':
          return new AuthError(
            'Sessão expirada',
            AuthErrorCodes.SESSION_EXPIRED,
            401
          )
        case 'invalid_token':
          return new AuthError(
            'Token inválido',
            AuthErrorCodes.INVALID_TOKEN,
            401
          )
        default:
          return new AuthError(
            error.message || 'Erro de autenticação',
            AuthErrorCodes.INTERNAL_ERROR,
            500
          )
      }
    }

    // Erros de validação Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return new AuthError(
        'Dados inválidos',
        AuthErrorCodes.VALIDATION_ERROR,
        400
      )
    }

    // Erros genéricos
    return new AuthError(
      error?.message || 'Erro interno do servidor',
      AuthErrorCodes.INTERNAL_ERROR,
      500
    )
  }

  // Validação segura de dados sensíveis
  static sanitizeUserData(user: any) {
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name,
      avatarUrl: user.user_metadata?.avatar_url,
      provider: user.app_metadata?.provider,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
      emailConfirmed: user.email_confirmed_at !== null,
    }
  }

  // Validação de sessão
  static validateSession(session: any) {
    if (!session) {
      throw new AuthError(
        'Sessão não encontrada',
        AuthErrorCodes.SESSION_EXPIRED,
        401
      )
    }

    if (!session.access_token) {
      throw new AuthError(
        'Token de acesso inválido',
        AuthErrorCodes.INVALID_TOKEN,
        401
      )
    }

    if (session.expires_at * 1000 < Date.now()) {
      throw new AuthError(
        'Sessão expirada',
        AuthErrorCodes.SESSION_EXPIRED,
        401
      )
    }

    return session
  }

  // Rate limiting simples baseado em IP
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>()

  static checkRateLimit(ip: string, action: string, limit: number = 5, windowMs: number = 60000) {
    const key = `${ip}:${action}`
    const now = Date.now()
    const record = this.rateLimitStore.get(key)

    if (!record || now > record.resetTime) {
      // Criar novo registro
      this.rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (record.count >= limit) {
      throw new AuthError(
        'Muitas tentativas. Tente novamente mais tarde.',
        AuthErrorCodes.RATE_LIMITED,
        429
      )
    }

    record.count++
    return true
  }

  // Sanitização de URLs de redirecionamento
  static sanitizeRedirectUrl(url: string): string {
    try {
      // Permitir apenas URLs relativas ou do mesmo domínio
      const parsedUrl = new URL(url, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')

      // Verificar se é do mesmo domínio
      if (parsedUrl.origin !== new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').origin) {
        return '/dashboard'
      }

      // Remover parâmetros sensíveis
      parsedUrl.searchParams.delete('code')
      parsedUrl.searchParams.delete('access_token')
      parsedUrl.searchParams.delete('refresh_token')

      return parsedUrl.toString()
    } catch {
      return '/dashboard'
    }
  }

  // Logging seguro
  static logAction(action: string, userId?: string, metadata?: any) {
    const logData = {
      action,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      ip: metadata?.ip || 'unknown',
      userAgent: metadata?.userAgent || 'unknown',
      // Não logar dados sensíveis
    }

    console.log('Auth Action:', JSON.stringify(logData))
  }
}