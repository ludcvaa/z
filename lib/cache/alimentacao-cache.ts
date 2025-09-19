import { unstable_cache as nextCache } from 'next/cache'
import { revalidateTag } from 'next/cache'

// Tags para revalidação
export const CACHE_TAGS = {
  MEAL_PLANS: 'alimentacao-meal-plans',
  MEAL_RECORDS: 'alimentacao-meal-records',
  HYDRATION: 'alimentacao-hydration',
  DAILY_SUMMARY: 'alimentacao-daily-summary',
  USER_PREFERENCES: 'alimentacao-preferences',
  NUTRITION_STATS: 'alimentacao-stats'
} as const

// Funções de revalidação
export const revalidateAlimentacaoData = {
  mealPlans: () => revalidateTag(CACHE_TAGS.MEAL_PLANS),
  mealRecords: () => revalidateTag(CACHE_TAGS.MEAL_RECORDS),
  hydration: () => revalidateTag(CACHE_TAGS.HYDRATION),
  dailySummary: () => revalidateTag(CACHE_TAGS.DAILY_SUMMARY),
  userPreferences: () => revalidateTag(CACHE_TAGS.USER_PREFERENCES),
  nutritionStats: () => revalidateTag(CACHE_TAGS.NUTRITION_STATS),

  // Revalidar todos os dados do módulo
  all: () => {
    Object.values(CACHE_TAGS).forEach(tag => revalidateTag(tag))
  }
}

// Cache wrapper para operações frequentes
export class AlimentacaoCache {
  private static instance: AlimentacaoCache
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos

  constructor() {
    this.cache = new Map()
  }

  static getInstance(): AlimentacaoCache {
    if (!AlimentacaoCache.instance) {
      AlimentacaoCache.instance = new AlimentacaoCache()
    }
    return AlimentacaoCache.instance
  }

  // Gerar chave de cache baseada nos parâmetros
  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|')
    return `${prefix}:${sortedParams}`
  }

  // Obter dados do cache
  get<T>(prefix: string, params: Record<string, any> = {}): T | null {
    const key = this.generateKey(prefix, params)
    const cached = this.cache.get(key)

    if (!cached) return null

    // Verificar TTL
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data as T
  }

  // Armazenar dados no cache
  set<T>(
    prefix: string,
    data: T,
    params: Record<string, any> = {},
    ttl: number = this.DEFAULT_TTL
  ): void {
    const key = this.generateKey(prefix, params)
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  // Invalidar cache por prefixo
  invalidate(prefix: string): void {
    const keysToDelete: string[] = []

    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix + ':')) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }

  // Invalidar todo o cache
  clear(): void {
    this.cache.clear()
  }

  // Limpar entradas expiradas
  cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.cache.forEach((value, key) => {
      if (now - value.timestamp > value.ttl) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.cache.delete(key))
  }
}

// Funções cacheadas com Next.js Cache
export const cachedMealPlans = nextCache(
  async (userId: string) => {
    // Esta função será implementada com a query real do Supabase
    return { userId, data: [], timestamp: Date.now() }
  },
  ['meal-plans'],
  {
    tags: [CACHE_TAGS.MEAL_PLANS],
    revalidate: 300 // 5 minutos
  }
)

export const cachedMealRecords = nextCache(
  async (userId: string, date?: string) => {
    // Esta função será implementada com a query real do Supabase
    return { userId, date, data: [], timestamp: Date.now() }
  },
  ['meal-records'],
  {
    tags: [CACHE_TAGS.MEAL_RECORDS],
    revalidate: 60 // 1 minuto
  }
)

export const cachedHydrationData = nextCache(
  async (userId: string, date?: string) => {
    // Esta função será implementada com a query real do Supabase
    return { userId, date, data: [], timestamp: Date.now() }
  },
  ['hydration'],
  {
    tags: [CACHE_TAGS.HYDRATION],
    revalidate: 120 // 2 minutos
  }
)

export const cachedDailySummary = nextCache(
  async (userId: string, date: string) => {
    // Esta função será implementada com a query real do Supabase
    return { userId, date, data: null, timestamp: Date.now() }
  },
  ['daily-summary'],
  {
    tags: [CACHE_TAGS.DAILY_SUMMARY],
    revalidate: 180 // 3 minutos
  }
)

// Cache para estatísticas nutricionais
export const cachedNutritionStats = nextCache(
  async (userId: string, startDate: string, endDate: string) => {
    // Esta função será implementada com a query real do Supabase
    return { userId, startDate, endDate, data: null, timestamp: Date.now() }
  },
  ['nutrition-stats'],
  {
    tags: [CACHE_TAGS.NUTRITION_STATS],
    revalidate: 600 // 10 minutos
  }
)

// Estratégia de cache para diferentes tipos de dados
export const CACHE_STRATEGIES = {
  // Dados que mudam com frequência
  FREQUENT: {
    ttl: 60 * 1000, // 1 minuto
    revalidate: 60
  },

  // Dados que mudam ocasionalmente
  OCCASIONAL: {
    ttl: 5 * 60 * 1000, // 5 minutos
    revalidate: 300
  },

  // Dados que mudam raramente
  RARE: {
    ttl: 30 * 60 * 1000, // 30 minutos
    revalidate: 1800
  },

  // Dados de referência
  REFERENCE: {
    ttl: 24 * 60 * 60 * 1000, // 24 horas
    revalidate: 86400
  }
}

// Função para invalidar cache após mutações
export const invalidateOnMutation = {
  mealPlanCreated: () => {
    revalidateAlimentacaoData.mealPlans()
    revalidateAlimentacaoData.nutritionStats()
  },

  mealPlanUpdated: () => {
    revalidateAlimentacaoData.mealPlans()
    revalidateAlimentacaoData.nutritionStats()
  },

  mealPlanDeleted: () => {
    revalidateAlimentacaoData.mealPlans()
    revalidateAlimentacaoData.nutritionStats()
    revalidateAlimentacaoData.mealRecords()
  },

  mealRecordCreated: () => {
    revalidateAlimentacaoData.mealRecords()
    revalidateAlimentacaoData.dailySummary()
    revalidateAlimentacaoData.nutritionStats()
  },

  mealRecordUpdated: () => {
    revalidateAlimentacaoData.mealRecords()
    revalidateAlimentacaoData.dailySummary()
    revalidateAlimentacaoData.nutritionStats()
  },

  mealRecordDeleted: () => {
    revalidateAlimentacaoData.mealRecords()
    revalidateAlimentacaoData.dailySummary()
    revalidateAlimentacaoData.nutritionStats()
  },

  hydrationAdded: () => {
    revalidateAlimentacaoData.hydration()
    revalidateAlimentacaoData.dailySummary()
  },

  hydrationGoalUpdated: () => {
    revalidateAlimentacaoData.hydration()
    revalidateAlimentacaoData.dailySummary()
  }
}

// Hook para gerenciar cache local
export function useAlimentacaoCache() {
  const cache = AlimentacaoCache.getInstance()

  const getCachedData = <T>(
    prefix: string,
    params: Record<string, any> = {},
    ttl?: number
  ): T | null => {
    return cache.get<T>(prefix, params)
  }

  const setCachedData = <T>(
    prefix: string,
    data: T,
    params: Record<string, any> = {},
    ttl?: number
  ): void => {
    cache.set<T>(prefix, data, params, ttl)
  }

  const invalidateCache = (prefix: string): void => {
    cache.invalidate(prefix)
  }

  const clearAllCache = (): void => {
    cache.clear()
  }

  // Cleanup periódico
  useEffect(() => {
    const interval = setInterval(() => {
      cache.cleanup()
    }, 60 * 1000) // Limpar a cada minuto

    return () => clearInterval(interval)
  }, [])

  return {
    getCachedData,
    setCachedData,
    invalidateCache,
    clearAllCache
  }
}

// Middleware para cache de queries
export function withCache<T>(
  fn: () => Promise<T>,
  key: string,
  ttl: number = CACHE_STRATEGIES.FREQUENT.ttl
): () => Promise<T> {
  const cache = AlimentacaoCache.getInstance()

  return async () => {
    // Tentar obter do cache
    const cached = cache.get<T>(key)
    if (cached) {
      return cached
    }

    // Executar a função
    const result = await fn()

    // Armazenar no cache
    cache.set(key, result, {}, ttl)

    return result
  }
}

// Função para prefetch de dados
export function prefetchAlimentacaoData(userId: string) {
  if (typeof window === 'undefined') return

  // Prefetch dados que serão provavelmente necessários
  Promise.all([
    cachedMealPlans(userId),
    cachedMealRecords(userId, new Date().toISOString().split('T')[0]),
    cachedHydrationData(userId, new Date().toISOString().split('T')[0])
  ]).catch(console.error)
}