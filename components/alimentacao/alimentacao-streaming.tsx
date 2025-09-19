'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { MealPlanSkeleton } from '@/components/shared/loading-skeletons'
import { HydrationSkeleton } from '@/components/shared/loading-skeletons'
import { MealRecordSkeleton } from '@/components/shared/loading-skeletons'
import { NutritionSummarySkeleton } from '@/components/shared/loading-skeletons'
import { RecipesCTASkeleton } from '@/components/shared/loading-skeletons'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Componente de erro para boundaries
function ErrorFallback({
  error,
  resetError,
  sectionName
}: {
  error: Error
  resetError: () => void
  sectionName: string
}) {
  return (
    <Card className="border-red-200">
      <CardContent className="p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          Erro ao carregar {sectionName}
        </h3>
        <p className="text-sm text-red-600 mb-4">
          {error.message || 'Ocorreu um erro inesperado'}
        </p>
        <Button onClick={resetError} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  )
}

// Componente de streaming para Planos de Refeição
export async function MealPlansSection({ userId, date }: { userId: string; date: string }) {
  return (
    <ErrorBoundary
      Fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} sectionName="planos de refeição" />
      )}
    >
      <Suspense fallback={<MealPlanSkeleton />}>
        <MealPlansContent userId={userId} date={date} />
      </Suspense>
    </ErrorBoundary>
  )
}

async function MealPlansContent({ userId, date }: { userId: string; date: string }) {
  // Componente será implementado com a lógica real
  // Por enquanto, retorna o skeleton para demonstração
  return <MealPlanSkeleton />
}

// Componente de streaming para Registros de Refeição
export async function MealRecordsSection({ userId, date }: { userId: string; date: string }) {
  return (
    <ErrorBoundary
      Fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} sectionName="registros de refeição" />
      )}
    >
      <Suspense fallback={<MealRecordSkeleton />}>
        <MealRecordsContent userId={userId} date={date} />
      </Suspense>
    </ErrorBoundary>
  )
}

async function MealRecordsContent({ userId, date }: { userId: string; date: string }) {
  // Componente será implementado com a lógica real
  return <MealRecordSkeleton />
}

// Componente de streaming para Hidratação
export async function HydrationSection({ userId, date }: { userId: string; date: string }) {
  return (
    <ErrorBoundary
      Fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} sectionName="hidratação" />
      )}
    >
      <Suspense fallback={<HydrationSkeleton />}>
        <HydrationContent userId={userId} date={date} />
      </Suspense>
    </ErrorBoundary>
  )
}

async function HydrationContent({ userId, date }: { userId: string; date: string }) {
  // Componente será implementado com a lógica real
  return <HydrationSkeleton />
}

// Componente de streaming para Resumo Nutricional
export async function NutritionSummarySection({ userId, date }: { userId: string; date: string }) {
  return (
    <ErrorBoundary
      Fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} sectionName="resumo nutricional" />
      )}
    >
      <Suspense fallback={<NutritionSummarySkeleton />}>
        <NutritionSummaryContent userId={userId} date={date} />
      </Suspense>
    </ErrorBoundary>
  )
}

async function NutritionSummaryContent({ userId, date }: { userId: string; date: string }) {
  // Componente será implementado com a lógica real
  return <NutritionSummarySkeleton />
}

// Componente de streaming para CTA de Receitas
export async function RecipesCTASection({ userId }: { userId: string }) {
  return (
    <ErrorBoundary
      Fallback={({ error, resetError }) => (
        <ErrorFallback error={error} resetError={resetError} sectionName="receitas" />
      )}
    >
      <Suspense fallback={<RecipesCTASkeleton />}>
        <RecipesCTAContent userId={userId} />
      </Suspense>
    </ErrorBoundary>
  )
}

async function RecipesCTAContent({ userId }: { userId: string }) {
  // Componente será implementado com a lógica real
  return <RecipesCTASkeleton />
}

// Componente principal de streaming
export function AlimentacaoStreaming({ userId, date }: { userId: string; date: string }) {
  return (
    <div className="space-y-6">
      {/* Carrega as seções em paralelo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MealPlansSection userId={userId} date={date} />
          <HydrationSection userId={userId} date={date} />
        </div>
        <div className="space-y-6">
          <MealRecordsSection userId={userId} date={date} />
          <NutritionSummarySection userId={userId} date={date} />
        </div>
      </div>

      {/* CTA de receitas carrega por último */}
      <div className="lg:col-span-2">
        <RecipesCTASection userId={userId} />
      </div>
    </div>
  )
}

// Componente para streaming condicional
export function ConditionalStreaming({
  condition,
  children,
  fallback
}: {
  condition: boolean
  children: React.ReactNode
  fallback: React.ReactNode
}) {
  if (condition) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

// Componente para streaming com prioridade
export function PriorityStreaming({
  highPriority,
  lowPriority,
  highPriorityFallback,
  lowPriorityFallback
}: {
  highPriority: React.ReactNode
  lowPriority: React.ReactNode
  highPriorityFallback: React.ReactNode
  lowPriorityFallback: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Alta prioridade - carrega imediatamente */}
      <div>
        <Suspense fallback={highPriorityFallback}>
          {highPriority}
        </Suspense>
      </div>

      {/* Baixa prioridade - carrega após o render inicial */}
      <div>
        <Suspense fallback={lowPriorityFallback}>
          {lowPriority}
        </Suspense>
      </div>
    </div>
  )
}

// Hook para gerenciar streaming de dados
export function useStreamingData<T>(
  fetchFunction: () => Promise<T>,
  options: {
    suspense?: boolean
    retryCount?: number
    retryDelay?: number
  } = {}
) {
  const {
    suspense = true,
    retryCount = 3,
    retryDelay = 1000
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let retryAttempt = 0

    const fetchDataWithRetry = async () => {
      try {
        setIsLoading(true)
        const result = await fetchFunction()
        setData(result)
        setError(null)
      } catch (err) {
        if (retryAttempt < retryCount) {
          retryAttempt++
          setTimeout(fetchDataWithRetry, retryDelay * retryAttempt)
        } else {
          setError(err instanceof Error ? err : new Error('Erro desconhecido'))
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!suspense) {
      fetchDataWithRetry()
    }
  }, [fetchFunction, suspense, retryCount, retryDelay])

  return {
    data,
    error,
    isLoading,
    refetch: () => {
      setIsLoading(true)
      setError(null)
      return fetchFunction()
        .then(setData)
        .catch(setError)
        .finally(() => setIsLoading(false))
    }
  }
}

// Componente para streaming com cache
export function CachedStreaming<T>({
  cacheKey,
  fetchFunction,
  children,
  fallback,
  ttl = 300000 // 5 minutos
}: {
  cacheKey: string
  fetchFunction: () => Promise<T>
  children: (data: T) => React.ReactNode
  fallback: React.ReactNode
  ttl?: number
}) {
  const getCachedData = () => {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < ttl) {
          return data
        }
      }
    } catch (error) {
      console.error('Erro ao ler cache:', error)
    }
    return null
  }

  const setCachedData = (data: T) => {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Erro ao salvar cache:', error)
    }
  }

  const cachedData = getCachedData()

  if (cachedData) {
    return <>{children(cachedData)}</>
  }

  return (
    <Suspense fallback={fallback}>
      <StreamingContent
        fetchFunction={fetchFunction}
        onSuccess={(data) => {
          setCachedData(data)
          return children(data)
        }}
        fallback={fallback}
      />
    </Suspense>
  )
}

async function StreamingContent<T>({
  fetchFunction,
  onSuccess,
  fallback
}: {
  fetchFunction: () => Promise<T>
  onSuccess: (data: T) => React.ReactNode
  fallback: React.ReactNode
}) {
  const data = await fetchFunction()
  return onSuccess(data)
}