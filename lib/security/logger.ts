// Sistema de logging de segurança com análise e alertas

interface SecurityLogEntry {
  id: string
  timestamp: number
  level: 'info' | 'warn' | 'error' | 'critical'
  category: 'auth' | 'session' | 'csrf' | 'rate_limit' | 'input_validation' | 'access_control'
  action: string
  userId?: string
  sessionId?: string
  ipAddress: string
  userAgent: string
  metadata: Record<string, any>
  riskScore: number // 0-100
}

interface SecurityAlert {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: number
  userId?: string
  ipAddress: string
  metadata: Record<string, any>
  resolved: boolean
}

interface SecurityMetrics {
  totalEvents: number
  eventsByLevel: Record<string, number>
  eventsByCategory: Record<string, number>
  uniqueUsers: number
  uniqueIPs: number
  averageRiskScore: number
  criticalEvents: number
  topRiskFactors: Array<{ factor: string; count: number }>
}

class SecurityLogger {
  private logs: SecurityLogEntry[] = []
  private alerts: SecurityAlert[] = []
  private riskFactors = new Map<string, number>()
  private readonly maxLogEntries = 10000
  private readonly alertThresholds = {
    rateLimitExceeded: 5,
    failedLoginAttempts: 10,
    suspiciousIP: 20,
    sessionAnomaly: 15,
    highRiskLocation: 25,
  }

  // Logar evento de segurança
  log(params: {
    level: SecurityLogEntry['level']
    category: SecurityLogEntry['category']
    action: string
    userId?: string
    sessionId?: string
    ipAddress: string
    userAgent?: string
    metadata?: Record<string, any>
    riskScore?: number
  }): void {
    const entry: SecurityLogEntry = {
      id: this.generateLogId(),
      timestamp: Date.now(),
      level: params.level,
      category: params.category,
      action: params.action,
      userId: params.userId,
      sessionId: params.sessionId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent || 'unknown',
      metadata: params.metadata || {},
      riskScore: params.riskScore || this.calculateRiskScore(params),
    }

    // Manter limite de entradas
    if (this.logs.length >= this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries / 2)
    }

    this.logs.push(entry)

    // Analisar em tempo real
    this.analyzeEvent(entry)

    // Se for evento crítico, criar alerta
    if (entry.level === 'critical' || entry.riskScore >= 80) {
      this.createAlert({
        type: 'high_risk_event',
        severity: 'high',
        message: `Evento de alto risco detectado: ${params.action}`,
        userId: params.userId,
        ipAddress: params.ipAddress,
        metadata: {
          logId: entry.id,
          riskScore: entry.riskScore,
          category: params.category,
        },
      })
    }

    // Log para console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Security ${entry.level.toUpperCase()}]`, {
        category: entry.category,
        action: entry.action,
        userId: entry.userId,
        ipAddress: entry.ipAddress,
        riskScore: entry.riskScore,
        timestamp: new Date(entry.timestamp).toISOString(),
      })
    }
  }

  // Métodos específicos para diferentes tipos de eventos
  logAuthEvent(params: {
    action: string
    userId?: string
    ipAddress: string
    userAgent?: string
    success: boolean
    metadata?: Record<string, any>
  }): void {
    this.log({
      level: params.success ? 'info' : 'warn',
      category: 'auth',
      action: params.action,
      userId: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        ...params.metadata,
        success: params.success,
      },
      riskScore: params.success ? 10 : 40,
    })
  }

  logSessionEvent(params: {
    action: string
    userId: string
    sessionId: string
    ipAddress: string
    userAgent?: string
    metadata?: Record<string, any>
  }): void {
    this.log({
      level: 'info',
      category: 'session',
      action: params.action,
      userId: params.userId,
      sessionId: params.sessionId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: params.metadata,
      riskScore: 15,
    })
  }

  logCSRFEvent(params: {
    action: string
    userId?: string
    sessionId?: string
    ipAddress: string
    userAgent?: string
    tokenValid: boolean
    metadata?: Record<string, any>
  }): void {
    this.log({
      level: params.tokenValid ? 'info' : 'error',
      category: 'csrf',
      action: params.action,
      userId: params.userId,
      sessionId: params.sessionId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        ...params.metadata,
        tokenValid: params.tokenValid,
      },
      riskScore: params.tokenValid ? 5 : 70,
    })
  }

  logRateLimitEvent(params: {
    action: string
    userId?: string
    ipAddress: string
    userAgent?: string
    endpoint: string
    limited: boolean
    metadata?: Record<string, any>
  }): void {
    this.log({
      level: params.limited ? 'warn' : 'info',
      category: 'rate_limit',
      action: params.action,
      userId: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        ...params.metadata,
        endpoint: params.endpoint,
        limited: params.limited,
      },
      riskScore: params.limited ? 50 : 10,
    })
  }

  logValidationEvent(params: {
    action: string
    userId?: string
    ipAddress: string
    userAgent?: string
    inputType: string
    validationPassed: boolean
    metadata?: Record<string, any>
  }): void {
    this.log({
      level: params.validationPassed ? 'info' : 'warn',
      category: 'input_validation',
      action: params.action,
      userId: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        ...params.metadata,
        inputType: params.inputType,
        validationPassed: params.validationPassed,
      },
      riskScore: params.validationPassed ? 5 : 60,
    })
  }

  logAccessControlEvent(params: {
    action: string
    userId?: string
    ipAddress: string
    userAgent?: string
    resource: string
    accessGranted: boolean
    metadata?: Record<string, any>
  }): void {
    this.log({
      level: params.accessGranted ? 'info' : 'error',
      category: 'access_control',
      action: params.action,
      userId: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        ...params.metadata,
        resource: params.resource,
        accessGranted: params.accessGranted,
      },
      riskScore: params.accessGranted ? 5 : 80,
    })
  }

  // Análise de eventos em tempo real
  private analyzeEvent(entry: SecurityLogEntry): void {
    // Detectar padrões suspeitos
    this.detectSuspiciousPatterns(entry)

    // Atualizar fatores de risco
    this.updateRiskFactors(entry)

    // Verificar alertas
    this.checkAlerts(entry)
  }

  private detectSuspiciousPatterns(entry: SecurityLogEntry): void {
    const timeWindow = 5 * 60 * 1000 // 5 minutos
    const now = Date.now()
    const recentEvents = this.logs.filter(
      log => log.timestamp > now - timeWindow
    )

    // Detectar múltiplas falhas de login do mesmo IP
    const failedLoginsByIP = recentEvents.filter(
      log => log.category === 'auth' &&
             log.action.includes('failed') &&
             log.ipAddress === entry.ipAddress
    )

    if (failedLoginsByIP.length >= this.alertThresholds.failedLoginAttempts) {
      this.createAlert({
        type: 'multiple_failed_logins',
        severity: 'high',
        message: `Múltiplas tentativas de login falhadas detectadas do IP ${entry.ipAddress}`,
        ipAddress: entry.ipAddress,
        metadata: {
          attemptCount: failedLoginsByIP.length,
          timeWindow: '5 minutos',
        },
      })
    }

    // Detectar ataques de rate limiting
    const rateLimitViolations = recentEvents.filter(
      log => log.category === 'rate_limit' &&
             log.metadata?.limited === true &&
             log.ipAddress === entry.ipAddress
    )

    if (rateLimitViolations.length >= this.alertThresholds.rateLimitExceeded) {
      this.createAlert({
        type: 'rate_limit_abuse',
        severity: 'medium',
        message: `Múltiplas violações de rate limit detectadas do IP ${entry.ipAddress}`,
        ipAddress: entry.ipAddress,
        metadata: {
          violationCount: rateLimitViolations.length,
          timeWindow: '5 minutos',
        },
      })
    }

    // Detectar anomalias de sessão
    if (entry.category === 'session') {
      const userSessions = recentEvents.filter(
        log => log.category === 'session' &&
               log.userId === entry.userId &&
               log.ipAddress !== entry.ipAddress
      )

      if (userSessions.length > 0) {
        this.createAlert({
          type: 'session_anomaly',
          severity: 'medium',
          message: `Atividade de sessão detectada de múltiplos IPs para o usuário ${entry.userId}`,
          userId: entry.userId,
          ipAddress: entry.ipAddress,
          metadata: {
            previousIPs: [...new Set(userSessions.map(log => log.ipAddress))],
            sessionCount: userSessions.length,
          },
        })
      }
    }
  }

  private updateRiskFactors(entry: SecurityLogEntry): void {
    // Incrementar fator de risco para o IP
    const ipKey = `ip:${entry.ipAddress}`
    const currentIPRisk = this.riskFactors.get(ipKey) || 0
    this.riskFactors.set(ipKey, currentIPRisk + entry.riskScore)

    // Incrementar fator de risco para o usuário
    if (entry.userId) {
      const userKey = `user:${entry.userId}`
      const currentUserRisk = this.riskFactors.get(userKey) || 0
      this.riskFactors.set(userKey, currentUserRisk + entry.riskScore)
    }
  }

  private checkAlerts(entry: SecurityLogEntry): void {
    // Verificar se algum fator de risco excede os limites
    for (const [key, riskScore] of this.riskFactors.entries()) {
      if (riskScore >= 100) {
        const [type, identifier] = key.split(':')

        this.createAlert({
          type: 'high_risk_score',
          severity: 'critical',
          message: `Pontuação de risco crítica detectada para ${type}: ${identifier}`,
          ipAddress: type === 'ip' ? identifier : entry.ipAddress,
          userId: type === 'user' ? identifier : entry.userId,
          metadata: {
            riskScore,
            type,
            identifier,
          },
        })

        // Resetar pontuação após alerta crítico
        this.riskFactors.set(key, 0)
      }
    }
  }

  private createAlert(params: {
    type: string
    severity: SecurityAlert['severity']
    message: string
    userId?: string
    ipAddress: string
    metadata?: Record<string, any>
  }): void {
    const alert: SecurityAlert = {
      id: this.generateAlertId(),
      type: params.type,
      severity: params.severity,
      message: params.message,
      timestamp: Date.now(),
      userId: params.userId,
      ipAddress: params.ipAddress,
      metadata: params.metadata || {},
      resolved: false,
    }

    this.alerts.push(alert)

    // Aqui você poderia integrar com sistemas externos como:
    // - Email notifications
    // - Slack alerts
    // - PagerDuty
    // - SIEM systems

    console.warn(`[SECURITY ALERT] ${params.message}`, {
      severity: params.severity,
      type: params.type,
      userId: params.userId,
      ipAddress: params.ipAddress,
      timestamp: new Date(alert.timestamp).toISOString(),
    })
  }

  private calculateRiskScore(params: {
    level: SecurityLogEntry['level']
    category: SecurityLogEntry['category']
    action: string
    ipAddress: string
  }): number {
    let score = 0

    // Pontuação baseada no nível
    const levelScores = { info: 10, warn: 30, error: 60, critical: 90 }
    score += levelScores[params.level] || 10

    // Pontuação baseada na categoria
    const categoryScores = {
      auth: 20,
      session: 15,
      csrf: 40,
      rate_limit: 25,
      input_validation: 35,
      access_control: 45,
    }
    score += categoryScores[params.category] || 10

    // Ajustar baseado na ação
    if (params.action.includes('failed')) score += 20
    if (params.action.includes('invalid')) score += 15
    if (params.action.includes('blocked')) score += 30

    // Ajustar baseado no IP (se for conhecido como suspeito)
    const ipRisk = this.riskFactors.get(`ip:${params.ipAddress}`) || 0
    if (ipRisk > 50) score += 20

    return Math.min(score, 100)
  }

  // Métodos de consulta
  getLogs(params?: {
    level?: SecurityLogEntry['level']
    category?: SecurityLogEntry['category']
    userId?: string
    ipAddress?: string
    startTime?: number
    endTime?: number
    limit?: number
  }): SecurityLogEntry[] {
    let filteredLogs = [...this.logs]

    if (params) {
      if (params.level) {
        filteredLogs = filteredLogs.filter(log => log.level === params.level)
      }
      if (params.category) {
        filteredLogs = filteredLogs.filter(log => log.category === params.category)
      }
      if (params.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === params.userId)
      }
      if (params.ipAddress) {
        filteredLogs = filteredLogs.filter(log => log.ipAddress === params.ipAddress)
      }
      if (params.startTime) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= params.startTime!)
      }
      if (params.endTime) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= params.endTime!)
      }
    }

    return filteredLogs
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, params?.limit || 100)
  }

  getAlerts(params?: {
    severity?: SecurityAlert['severity']
    resolved?: boolean
    limit?: number
  }): SecurityAlert[] {
    let filteredAlerts = [...this.alerts]

    if (params) {
      if (params.severity) {
        filteredAlerts = filteredAlerts.filter(alert => alert.severity === params.severity)
      }
      if (params.resolved !== undefined) {
        filteredAlerts = filteredAlerts.filter(alert => alert.resolved === params.resolved)
      }
    }

    return filteredAlerts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, params?.limit || 50)
  }

  getMetrics(timeRange: number = 24 * 60 * 60 * 1000): SecurityMetrics {
    const now = Date.now()
    const startTime = now - timeRange
    const relevantLogs = this.logs.filter(log => log.timestamp >= startTime)

    const eventsByLevel: Record<string, number> = {}
    const eventsByCategory: Record<string, number> = {}

    relevantLogs.forEach(log => {
      eventsByLevel[log.level] = (eventsByLevel[log.level] || 0) + 1
      eventsByCategory[log.category] = (eventsByCategory[log.category] || 0) + 1
    })

    const uniqueUsers = new Set(relevantLogs.map(log => log.userId).filter(Boolean))
    const uniqueIPs = new Set(relevantLogs.map(log => log.ipAddress))

    const averageRiskScore = relevantLogs.length > 0
      ? relevantLogs.reduce((sum, log) => sum + log.riskScore, 0) / relevantLogs.length
      : 0

    const criticalEvents = relevantLogs.filter(log => log.level === 'critical').length

    // Calcular principais fatores de risco
    const riskFactorCounts = new Map<string, number>()
    relevantLogs.forEach(log => {
      if (log.riskScore > 50) {
        riskFactorCounts.set(log.category, (riskFactorCounts.get(log.category) || 0) + 1)
      }
    })

    const topRiskFactors = Array.from(riskFactorCounts.entries())
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalEvents: relevantLogs.length,
      eventsByLevel,
      eventsByCategory,
      uniqueUsers: uniqueUsers.size,
      uniqueIPs: uniqueIPs.size,
      averageRiskScore,
      criticalEvents,
      topRiskFactors,
    }
  }

  // Utilitários
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Limpar logs antigos
  cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - maxAge
    this.logs = this.logs.filter(log => log.timestamp > cutoffTime)
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime)
  }
}

// Instância global
const securityLogger = new SecurityLogger()

// Exportar funções de conveniência
export const logSecurityEvent = securityLogger.log.bind(securityLogger)
export const logAuthEvent = securityLogger.logAuthEvent.bind(securityLogger)
export const logSessionEvent = securityLogger.logSessionEvent.bind(securityLogger)
export const logCSRFEvent = securityLogger.logCSRFEvent.bind(securityLogger)
export const logRateLimitEvent = securityLogger.logRateLimitEvent.bind(securityLogger)
export const logValidationEvent = securityLogger.logValidationEvent.bind(securityLogger)
export const logAccessControlEvent = securityLogger.logAccessControlEvent.bind(securityLogger)

export const getSecurityLogs = securityLogger.getLogs.bind(securityLogger)
export const getSecurityAlerts = securityLogger.getAlerts.bind(securityLogger)
export const getSecurityMetrics = securityLogger.getMetrics.bind(securityLogger)

// Middleware para logging de segurança
export function createSecurityLoggingMiddleware() {
  return async (request: Request, response: any, next: () => void) => {
    const startTime = Date.now()
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Obter IP real
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Logar requisição
    logSecurityEvent({
      level: 'info',
      category: 'access_control',
      action: 'request_start',
      ipAddress: ip,
      userAgent,
      metadata: {
        method: request.method,
        url: request.url,
        userAgent,
      },
    })

    try {
      await next()

      // Logar resposta bem-sucedida
      logSecurityEvent({
        level: 'info',
        category: 'access_control',
        action: 'request_success',
        ipAddress: ip,
        userAgent,
        metadata: {
          method: request.method,
          url: request.url,
          statusCode: response.status,
          duration: Date.now() - startTime,
        },
      })
    } catch (error) {
      // Logar erro
      logSecurityEvent({
        level: 'error',
        category: 'access_control',
        action: 'request_error',
        ipAddress: ip,
        userAgent,
        metadata: {
          method: request.method,
          url: request.url,
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: Date.now() - startTime,
        },
      })
      throw error
    }
  }
}

// Hook React para logging de segurança no cliente
export function useSecurityLogger() {
  const logClientEvent = (params: {
    action: string
    category: SecurityLogEntry['category']
    metadata?: Record<string, any>
  }) => {
    // Enviar evento para o servidor
    fetch('/api/security/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...params,
        timestamp: Date.now(),
      }),
    }).catch(error => {
      console.error('Falha ao enviar log de segurança:', error)
    })
  }

  return { logClientEvent }
}

export { securityLogger, SecurityLogger }