// Gerenciador de sessões seguras com expiração e renovação automática

interface SessionConfig {
  accessTokenExpiry: number // segundos
  refreshTokenExpiry: number // segundos
  absoluteExpiry: number // segundos (expiração absoluta)
  inactivityTimeout: number // segundos
  renewalWindow: number // segundos (janela de renovação antes da expiração)
  maxConcurrentSessions: number // máximo de sessões concorrentes
}

interface SessionRecord {
  id: string
  userId: string
  accessToken: string
  refreshToken: string
  accessTokenExpiry: number
  refreshTokenExpiry: number
  absoluteExpiry: number
  lastActivity: number
  deviceId: string
  userAgent: string
  ipAddress: string
  isActive: boolean
  metadata: Record<string, any>
}

class SessionManager {
  private sessions = new Map<string, SessionRecord>()
  private userSessions = new Map<string, Set<string>>() // userId -> sessionIds
  private cleanupInterval: NodeJS.Timeout | null = null

  private readonly config: SessionConfig = {
    accessTokenExpiry: 3600, // 1 hora
    refreshTokenExpiry: 604800, // 7 dias
    absoluteExpiry: 2592000, // 30 dias
    inactivityTimeout: 1800, // 30 minutos
    renewalWindow: 300, // 5 minutos
    maxConcurrentSessions: 5, // 5 sessões por usuário
  }

  constructor() {
    // Limpar sessões expiradas a cada minuto
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions()
    }, 60000)
  }

  // Criar nova sessão
  createSession(params: {
    userId: string
    accessToken: string
    refreshToken: string
    deviceId: string
    userAgent: string
    ipAddress: string
    metadata?: Record<string, any>
  }): SessionRecord {
    const now = Date.now()
    const sessionId = this.generateSessionId()

    // Verificar limite de sessões concorrentes
    this.enforceSessionLimit(params.userId)

    const session: SessionRecord = {
      id: sessionId,
      userId: params.userId,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
      accessTokenExpiry: now + this.config.accessTokenExpiry * 1000,
      refreshTokenExpiry: now + this.config.refreshTokenExpiry * 1000,
      absoluteExpiry: now + this.config.absoluteExpiry * 1000,
      lastActivity: now,
      deviceId: params.deviceId,
      userAgent: params.userAgent,
      ipAddress: params.ipAddress,
      isActive: true,
      metadata: params.metadata || {},
    }

    this.sessions.set(sessionId, session)

    // Adicionar ao índice de sessões do usuário
    const userSessionSet = this.userSessions.get(params.userId) || new Set()
    userSessionSet.add(sessionId)
    this.userSessions.set(params.userId, userSessionSet)

    return session
  }

  // Validar e renovar sessão se necessário
  async validateAndRenewSession(sessionId: string, userActivity = true): Promise<{
    valid: boolean
    session?: SessionRecord
    renewed?: boolean
    error?: string
  }> {
    const session = this.sessions.get(sessionId)
    if (!session || !session.isActive) {
      return { valid: false, error: 'Sessão não encontrada' }
    }

    const now = Date.now()

    // Verificar expiração absoluta
    if (now > session.absoluteExpiry) {
      this.invalidateSession(sessionId, 'absolute_expiry')
      return { valid: false, error: 'Sessão expirou (tempo máximo)' }
    }

    // Verificar expiração por inatividade
    if (now > session.lastActivity + this.config.inactivityTimeout * 1000) {
      this.invalidateSession(sessionId, 'inactivity')
      return { valid: false, error: 'Sessão expirou por inatividade' }
    }

    // Verificar expiração do access token
    if (now > session.accessTokenExpiry) {
      // Verificar se refresh token ainda é válido
      if (now > session.refreshTokenExpiry) {
        this.invalidateSession(sessionId, 'refresh_expired')
        return { valid: false, error: 'Refresh token expirou' }
      }

      // Tentar renovar access token
      const renewalResult = await this.renewAccessToken(sessionId)
      if (!renewalResult.success) {
        this.invalidateSession(sessionId, 'renewal_failed')
        return { valid: false, error: 'Falha ao renovar sessão' }
      }

      // Atualizar timestamp de atividade se houver atividade do usuário
      if (userActivity) {
        this.updateActivity(sessionId)
      }

      return {
        valid: true,
        session: this.sessions.get(sessionId),
        renewed: true
      }
    }

    // Verificar se precisa renovar preventivamente
    if (now > session.accessTokenExpiry - this.config.renewalWindow * 1000) {
      const renewalResult = await this.renewAccessToken(sessionId)
      if (renewalResult.success) {
        // Atualizar timestamp de atividade se houver atividade do usuário
        if (userActivity) {
          this.updateActivity(sessionId)
        }

        return {
          valid: true,
          session: this.sessions.get(sessionId),
          renewed: true
        }
      }
    }

    // Atualizar timestamp de atividade se houver atividade do usuário
    if (userActivity) {
      this.updateActivity(sessionId)
    }

    return { valid: true, session }
  }

  // Renovar access token
  private async renewAccessToken(sessionId: string): Promise<{ success: boolean; newToken?: string }> {
    const session = this.sessions.get(sessionId)
    if (!session || !session.isActive) {
      return { success: false }
    }

    try {
      // Aqui você integraria com seu provedor de autenticação (Supabase, etc.)
      // Por enquanto, simulamos a renovação
      const newAccessToken = this.generateAccessToken()

      session.accessToken = newAccessToken
      session.accessTokenExpiry = Date.now() + this.config.accessTokenExpiry * 1000
      session.lastActivity = Date.now()

      this.sessions.set(sessionId, session)

      return { success: true, newToken }
    } catch (error) {
      console.error('Erro ao renovar access token:', error)
      return { success: false }
    }
  }

  // Invalidar sessão específica
  invalidateSession(sessionId: string, reason: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    session.isActive = false
    this.sessions.set(sessionId, session)

    // Remover do índice de sessões do usuário
    const userSessionSet = this.userSessions.get(session.userId)
    if (userSessionSet) {
      userSessionSet.delete(sessionId)
      if (userSessionSet.size === 0) {
        this.userSessions.delete(session.userId)
      }
    }

    // Logar invalidação
    this.logSessionEvent('invalidate', sessionId, session.userId, { reason })

    return true
  }

  // Invalidar todas as sessões de um usuário
  invalidateAllUserSessions(userId: string, exceptSessionId?: string): number {
    const userSessionSet = this.userSessions.get(userId)
    if (!userSessionSet) return 0

    let count = 0
    for (const sessionId of userSessionSet) {
      if (sessionId !== exceptSessionId) {
        if (this.invalidateSession(sessionId, 'user_logout_all')) {
          count++
        }
      }
    }

    return count
  }

  // Atualizar atividade da sessão
  updateActivity(sessionId: string): boolean {
    const session = this.sessions.get(sessionId)
    if (!session || !session.isActive) return false

    session.lastActivity = Date.now()
    this.sessions.set(sessionId, session)

    return true
  }

  // Obter sessões ativas do usuário
  getUserActiveSessions(userId: string): SessionRecord[] {
    const userSessionSet = this.userSessions.get(userId)
    if (!userSessionSet) return []

    const activeSessions: SessionRecord[] = []
    for (const sessionId of userSessionSet) {
      const session = this.sessions.get(sessionId)
      if (session && session.isActive) {
        activeSessions.push(session)
      }
    }

    return activeSessions.sort((a, b) => b.lastActivity - a.lastActivity)
  }

  // Verificar limite de sessões
  private enforceSessionLimit(userId: string): void {
    const activeSessions = this.getUserActiveSessions(userId)

    if (activeSessions.length >= this.config.maxConcurrentSessions) {
      // Remover a sessão mais antiga
      const oldestSession = activeSessions[activeSessions.length - 1]
      this.invalidateSession(oldestSession.id, 'session_limit')
    }
  }

  // Limpar sessões expiradas
  private cleanupExpiredSessions(): void {
    const now = Date.now()
    const toRemove: string[] = []

    for (const [sessionId, session] of this.sessions.entries()) {
      if (!session.isActive) {
        toRemove.push(sessionId)
        continue
      }

      // Remover sessões expiradas
      if (now > session.absoluteExpiry ||
          now > session.refreshTokenExpiry ||
          now > session.lastActivity + this.config.inactivityTimeout * 1000) {
        toRemove.push(sessionId)
      }
    }

    // Remover sessões expiradas
    for (const sessionId of toRemove) {
      const session = this.sessions.get(sessionId)
      if (session) {
        this.invalidateSession(sessionId, 'cleanup')
      }
    }
  }

  // Gerar ID de sessão aleatório
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Gerar access token aleatório (simulação)
  private generateAccessToken(): string {
    return `access_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
  }

  // Logar eventos de sessão
  private logSessionEvent(
    event: string,
    sessionId: string,
    userId: string,
    metadata: Record<string, any> = {}
  ): void {
    // Aqui você integraria com seu sistema de logging
    console.log(`Session Event: ${event}`, {
      sessionId,
      userId,
      timestamp: new Date().toISOString(),
      ...metadata,
    })
  }

  // Obter estatísticas
  getStats(): {
    totalSessions: number
    activeSessions: number
    usersWithSessions: number
    averageSessionsPerUser: number
  } {
    const activeSessions = Array.from(this.sessions.values()).filter(s => s.isActive)
    const usersWithSessions = this.userSessions.size

    return {
      totalSessions: this.sessions.size,
      activeSessions: activeSessions.length,
      usersWithSessions,
      averageSessionsPerUser: usersWithSessions > 0
        ? activeSessions.length / usersWithSessions
        : 0,
    }
  }

  // Destruir instância
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.sessions.clear()
    this.userSessions.clear()
  }
}

// Instância global
const globalSessionManager = new SessionManager()

// Funções de conveniência
export function createSecureSession(params: {
  userId: string
  accessToken: string
  refreshToken: string
  deviceId: string
  userAgent: string
  ipAddress: string
  metadata?: Record<string, any>
}): SessionRecord {
  return globalSessionManager.createSession(params)
}

export async function validateSecureSession(
  sessionId: string,
  userActivity = true
): Promise<{
  valid: boolean
  session?: SessionRecord
  renewed?: boolean
  error?: string
}> {
  return globalSessionManager.validateAndRenewSession(sessionId, userActivity)
}

export function invalidateSecureSession(sessionId: string, reason: string): boolean {
  return globalSessionManager.invalidateSession(sessionId, reason)
}

export function invalidateAllSecureUserSessions(userId: string, exceptSessionId?: string): number {
  return globalSessionManager.invalidateAllUserSessions(userId, exceptSessionId)
}

export function getSecureSessionStats() {
  return globalSessionManager.getStats()
}

// Middleware para validação de sessão
export function createSessionMiddleware() {
  return async (request: Request): Promise<{ valid: boolean; session?: SessionRecord; error?: string }> => {
    // Extrair token de autorização
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { valid: false, error: 'Token de autorização não encontrado' }
    }

    const token = authHeader.substring(7)

    // Aqui você decodificaria o token para obter o session ID
    // Por enquanto, usamos o token como session ID
    const sessionId = token

    // Validar sessão
    const result = await validateSecureSession(sessionId)

    if (!result.valid) {
      return { valid: false, error: result.error }
    }

    return { valid: true, session: result.session }
  }
}

// Hook React para gerenciamento de sessão
export function useSecureSession() {
  const checkSession = async (sessionId: string) => {
    try {
      const result = await validateSecureSession(sessionId)
      return result
    } catch (error) {
      console.error('Erro ao validar sessão:', error)
      return { valid: false, error: 'Erro interno' }
    }
  }

  const refreshSession = async (sessionId: string) => {
    try {
      const result = await validateSecureSession(sessionId, false)
      return result
    } catch (error) {
      console.error('Erro ao renovar sessão:', error)
      return { valid: false, error: 'Erro interno' }
    }
  }

  return { checkSession, refreshSession }
}

export { globalSessionManager, SessionManager }