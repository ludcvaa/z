// Rate Limiter in-memory para desenvolvimento
// Em produção, usar Redis ou similar

interface RateLimitRecord {
  count: number
  resetTime: number
  blocked: boolean
}

interface RateLimitConfig {
  windowMs: number // janela de tempo em milissegundos
  maxRequests: number // máximo de requisições permitidas
  blockDuration?: number // duração do bloqueio em milissegundos
}

class RateLimiter {
  private store = new Map<string, RateLimitRecord>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Limpar registros expirados a cada minuto
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime && !record.blocked) {
        this.store.delete(key)
      }
    }
  }

  check(key: string, config: RateLimitConfig): {
    allowed: boolean
    remaining: number
    resetTime: number
    blocked: boolean
  } {
    const now = Date.now()
    const record = this.store.get(key)

    // Se não existe registro ou expirou
    if (!record || (now > record.resetTime && !record.blocked)) {
      const newRecord: RateLimitRecord = {
        count: 1,
        resetTime: now + config.windowMs,
        blocked: false,
      }

      this.store.set(key, newRecord)

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: newRecord.resetTime,
        blocked: false,
      }
    }

    // Se está bloqueado
    if (record.blocked) {
      if (now > record.resetTime) {
        // Bloqueio expirou
        const newRecord: RateLimitRecord = {
          count: 1,
          resetTime: now + config.windowMs,
          blocked: false,
        }

        this.store.set(key, newRecord)

        return {
          allowed: true,
          remaining: config.maxRequests - 1,
          resetTime: newRecord.resetTime,
          blocked: false,
        }
      }

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        blocked: true,
      }
    }

    // Se está dentro da janela de tempo
    if (record.count >= config.maxRequests) {
      // Excedeu limite - bloquear
      const blockDuration = config.blockDuration || config.windowMs * 2
      record.blocked = true
      record.resetTime = now + blockDuration

      this.store.set(key, record)

      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime,
        blocked: true,
      }
    }

    // Incrementar contador
    record.count++
    this.store.set(key, record)

    return {
      allowed: true,
      remaining: config.maxRequests - record.count,
      resetTime: record.resetTime,
      blocked: false,
    }
  }

  // Obter status sem atualizar contador
  getStatus(key: string): {
    count: number
    remaining: number
    resetTime: number
    blocked: boolean
  } | null {
    const record = this.store.get(key)
    if (!record) return null

    const now = Date.now()
    if (now > record.resetTime && !record.blocked) {
      return null
    }

    return {
      count: record.count,
      remaining: Math.max(0, record.count - record.count),
      resetTime: record.resetTime,
      blocked: record.blocked,
    }
  }

  // Limpar manualmente
  clear(key: string) {
    this.store.delete(key)
  }

  // Destruir instância
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

// Configurações de rate limiting para diferentes endpoints
export const RATE_LIMIT_CONFIGS = {
  // Endpoints de autenticação
  auth: {
    signIn: { windowMs: 60000, maxRequests: 5, blockDuration: 300000 }, // 5 por minuto, bloqueia 5 min
    signUp: { windowMs: 300000, maxRequests: 3, blockDuration: 900000 }, // 3 por 5 min, bloqueia 15 min
    signOut: { windowMs: 60000, maxRequests: 10, blockDuration: 60000 }, // 10 por minuto, bloqueia 1 min
    resetPassword: { windowMs: 300000, maxRequests: 3, blockDuration: 900000 }, // 3 por 5 min, bloqueia 15 min
    updatePassword: { windowMs: 60000, maxRequests: 3, blockDuration: 300000 }, // 3 por minuto, bloqueia 5 min
  },

  // Endpoints de API
  api: {
    default: { windowMs: 60000, maxRequests: 100, blockDuration: 300000 }, // 100 por minuto
    sensitive: { windowMs: 60000, maxRequests: 10, blockDuration: 60000 }, // 10 por minuto
  },

  // Páginas públicas
  public: {
    default: { windowMs: 60000, maxRequests: 200, blockDuration: 60000 }, // 200 por minuto
  },
} as const

// Instância global do rate limiter
const globalRateLimiter = new RateLimiter()

// Função middleware para rate limiting
export function rateLimit(
  key: string,
  config: RateLimitConfig
): {
  allowed: boolean
  remaining: number
  resetTime: number
  blocked: boolean
  headers: Record<string, string>
} {
  const result = globalRateLimiter.check(key, config)

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
    'Retry-After': result.blocked
      ? Math.ceil((result.resetTime - Date.now()) / 1000).toString()
      : '0',
  }

  return {
    ...result,
    headers,
  }
}

// Rate limiting baseado em IP
export function ipRateLimit(
  ip: string,
  endpoint: keyof typeof RATE_LIMIT_CONFIGS.auth,
  userAgent?: string
) {
  // Combinar IP com endpoint para chave única
  const key = `ip:${ip}:${endpoint}`

  // Adicionar fingerprint do browser para prevenir bypass simples
  if (userAgent) {
    const fingerprint = userAgent.substring(0, 50) // Limitar tamanho
    const fingerprintKey = `fingerprint:${fingerprint}:${endpoint}`

    // Verificar fingerprint também
    const fingerprintResult = rateLimit(
      fingerprintKey,
      RATE_LIMIT_CONFIGS.auth[endpoint]
    )

    if (!fingerprintResult.allowed) {
      return fingerprintResult
    }
  }

  return rateLimit(key, RATE_LIMIT_CONFIGS.auth[endpoint])
}

// Rate limiting baseado em usuário
export function userRateLimit(
  userId: string,
  endpoint: keyof typeof RATE_LIMIT_CONFIGS.auth
) {
  const key = `user:${userId}:${endpoint}`
  return rateLimit(key, RATE_LIMIT_CONFIGS.auth[endpoint])
}

// Middleware Express/Next.js
export function createRateLimitMiddleware(configMap: Record<string, RateLimitConfig>) {
  return async (request: Request, endpoint: string) => {
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''

    const config = configMap[endpoint] || configMap.default
    if (!config) {
      return { allowed: true }
    }

    return ipRateLimit(ip, endpoint as any, userAgent)
  }
}

// Obter IP real do cliente
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const real = request.headers.get('x-real-ip')

  if (forwarded) {
    // Pode ter múltiplos IPs, o primeiro é o real
    return forwarded.split(',')[0].trim()
  }

  if (real) {
    return real
  }

  return 'unknown'
}

// Hook React para rate limiting no cliente
export function useRateLimit() {
  const checkRateLimit = async (endpoint: string) => {
    try {
      const response = await fetch('/api/rate-limit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ endpoint }),
      })

      if (!response.ok) {
        throw new Error('Rate limit check failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Rate limit check error:', error)
      return { allowed: true }
    }
  }

  return { checkRateLimit }
}

// Exportar instância para uso direto
export { globalRateLimiter }