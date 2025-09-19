'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

import {
  createMealPlanAction,
  updateMealPlanAction,
  deleteMealPlanAction,
  getMealPlansAction,
  getActiveMealPlanAction
} from '@/server-actions/alimentacao/meal-plans'

import {
  createMealRecordAction,
  updateMealRecordAction,
  deleteMealRecordAction,
  getMealRecordsAction,
  getMealRecordsByDateRangeAction,
  getMealRecordsByMealTypeAction
} from '@/server-actions/alimentacao/meal-records'

import {
  addWaterIntakeAction,
  updateHydrationGoalAction,
  getHydrationGoalAction,
  getWaterIntakeByDateAction,
  getWaterIntakeByDateRangeAction,
  getDailyWaterSummaryAction,
  deleteWaterIntakeAction
} from '@/server-actions/alimentacao/hydration'

import { safeValidate, MealPlanInput, MealRecordInput, HydrationRecordInput, HydrationGoalInput } from '@/lib/validations/alimentacao'

// Tipos
interface MealPlan {
  id: string
  name: string
  description?: string
  duration: number
  start_date: string
  end_date: string
  goals?: string[]
  is_active: boolean
  meals?: Meal[]
}

interface Meal {
  id: string
  meal_plan_id: string
  type: string
  name: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  time: string
}

interface MealRecord {
  id: string
  meal_plan_id: string
  date: string
  meal_type: string
  name: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  time: string
  notes?: string
  is_completed: boolean
}

interface WaterIntake {
  id: string
  amount: number
  date: string
  time: string
  notes?: string
}

interface HydrationGoal {
  id: string
  daily_goal: number
  start_date: string
}

interface DailyWaterSummary {
  totalAmount: number
  goalAmount?: number
  percentage: number
  intakeCount: number
}

// Cache simples para evitar requisições duplicadas
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

const getCacheKey = (prefix: string, params: any) => {
  return `${prefix}:${JSON.stringify(params)}`
}

const getCachedData = (key: string, ttl = 300000) => { // 5 minutos
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data
  }
  return null
}

const setCachedData = (key: string, data: any, ttl = 300000) => {
  cache.set(key, { data, timestamp: Date.now(), ttl })
}

export function useAlimentacao() {
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const dateParam = searchParams.get('date')
    return dateParam || format(new Date(), 'yyyy-MM-dd')
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Estados para Meal Plans
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [activeMealPlan, setActiveMealPlan] = useState<MealPlan | null>(null)

  // Estados para Meal Records
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MealRecord[]>([])

  // Estados para Hidratação
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([])
  const [hydrationGoal, setHydrationGoal] = useState<HydrationGoal | null>(null)
  const [dailyWaterSummary, setDailyWaterSummary] = useState<DailyWaterSummary | null>(null)

  // Estados de filtros
  const [filters, setFilters] = useState({
    mealType: '',
    search: '',
    isCompleted: null as boolean | null,
    dateRange: { start: '', end: '' }
  })

  // Sincronizar data com query string
  useEffect(() => {
    const dateParam = searchParams.get('date')
    if (dateParam && dateParam !== selectedDate) {
      setSelectedDate(dateParam)
    }
  }, [searchParams])

  // Carregar dados iniciais
  useEffect(() => {
    loadAllData()
  }, [selectedDate])

  const loadAllData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      await Promise.all([
        loadMealPlans(),
        loadMealRecords(),
        loadHydrationData()
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      toast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate])

  // Meal Plans
  const loadMealPlans = useCallback(async () => {
    const cacheKey = getCacheKey('mealPlans', {})
    const cached = getCachedData(cacheKey)

    if (cached) {
      setMealPlans(cached)
      return
    }

    try {
      const result = await getMealPlansAction()
      if (result?.success && result.data) {
        const plans = result.data
        setMealPlans(plans)
        setCachedData(cacheKey, plans)

        // Encontrar plano ativo
        const active = plans.find(plan => plan.is_active && new Date(plan.end_date) >= new Date())
        setActiveMealPlan(active || null)
      }
    } catch (err) {
      console.error('Erro ao carregar planos de refeição:', err)
    }
  }, [])

  const createMealPlan = useCallback(async (data: MealPlanInput) => {
    const validation = safeValidate('mealPlan', data)
    if (!validation.success) {
      toast.error(validation.error)
      return null
    }

    try {
      setIsLoading(true)
      const result = await createMealPlanAction(validation.data)

      if (result.success) {
        toast.success('Plano de refeição criado com sucesso!')
        await loadMealPlans()
        return result.data
      } else {
        toast.error(result.message || 'Erro ao criar plano')
        return null
      }
    } catch (err) {
      toast.error('Erro ao criar plano de refeição')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [loadMealPlans])

  const updateMealPlan = useCallback(async (id: string, data: Partial<MealPlanInput>) => {
    try {
      setIsLoading(true)
      const result = await updateMealPlanAction({ id, ...data })

      if (result.success) {
        toast.success('Plano atualizado com sucesso!')
        await loadMealPlans()
        return result.data
      } else {
        toast.error(result.message || 'Erro ao atualizar plano')
        return null
      }
    } catch (err) {
      toast.error('Erro ao atualizar plano')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [loadMealPlans])

  const deleteMealPlan = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const result = await deleteMealPlanAction({ id })

      if (result.success) {
        toast.success('Plano deletado com sucesso!')
        await loadMealPlans()
        return true
      } else {
        toast.error(result.message || 'Erro ao deletar plano')
        return false
      }
    } catch (err) {
      toast.error('Erro ao deletar plano')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [loadMealPlans])

  // Meal Records
  const loadMealRecords = useCallback(async () => {
    const cacheKey = getCacheKey('mealRecords', { date: selectedDate, ...filters })
    const cached = getCachedData(cacheKey)

    if (cached) {
      setMealRecords(cached)
      applyFilters(cached)
      return
    }

    try {
      const result = await getMealRecordsAction(selectedDate)
      if (result?.success && result.data) {
        const records = result.data
        setMealRecords(records)
        setCachedData(cacheKey, records)
        applyFilters(records)
      }
    } catch (err) {
      console.error('Erro ao carregar registros de refeição:', err)
    }
  }, [selectedDate, filters])

  const createMealRecord = useCallback(async (data: MealRecordInput) => {
    const validation = safeValidate('mealRecord', data)
    if (!validation.success) {
      toast.error(validation.error)
      return null
    }

    try {
      setIsLoading(true)
      const result = await createMealRecordAction(validation.data)

      if (result.success) {
        toast.success('Registro criado com sucesso!')
        await loadMealRecords()
        return result.data
      } else {
        toast.error(result.message || 'Erro ao criar registro')
        return null
      }
    } catch (err) {
      toast.error('Erro ao criar registro')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [loadMealRecords])

  const updateMealRecord = useCallback(async (id: string, data: Partial<MealRecordInput>) => {
    try {
      setIsLoading(true)
      const result = await updateMealRecordAction({ id, ...data })

      if (result.success) {
        toast.success('Registro atualizado com sucesso!')
        await loadMealRecords()
        return result.data
      } else {
        toast.error(result.message || 'Erro ao atualizar registro')
        return null
      }
    } catch (err) {
      toast.error('Erro ao atualizar registro')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [loadMealRecords])

  const deleteMealRecord = useCallback(async (id: string) => {
    try {
      setIsLoading(true)
      const result = await deleteMealRecordAction({ id })

      if (result.success) {
        toast.success('Registro deletado com sucesso!')
        await loadMealRecords()
        return true
      } else {
        toast.error(result.message || 'Erro ao deletar registro')
        return false
      }
    } catch (err) {
      toast.error('Erro ao deletar registro')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [loadMealRecords])

  // Hidratação
  const loadHydrationData = useCallback(async () => {
    try {
      const [intakesResult, goalResult, summaryResult] = await Promise.all([
        getWaterIntakeByDateAction(selectedDate),
        getHydrationGoalAction(),
        getDailyWaterSummaryAction(selectedDate)
      ])

      if (intakesResult && intakesResult[0]?.success) {
        const intakes = intakesResult.map(item => item.data).filter(Boolean)
        setWaterIntakes(intakes)
      }

      if (goalResult?.success && goalResult.data) {
        setHydrationGoal(goalResult.data)
      }

      if (summaryResult?.success && summaryResult.data) {
        setDailyWaterSummary(summaryResult.data)
      }
    } catch (err) {
      console.error('Erro ao carregar dados de hidratação:', err)
    }
  }, [selectedDate])

  const addWaterIntake = useCallback(async (data: HydrationRecordInput) => {
    const validation = safeValidate('hydrationRecord', data)
    if (!validation.success) {
      toast.error(validation.error)
      return null
    }

    try {
      const result = await addWaterIntakeAction(validation.data)

      if (result.success) {
        toast.success('Água adicionada com sucesso!')
        await loadHydrationData()
        return result.data
      } else {
        toast.error(result.message || 'Erro ao adicionar água')
        return null
      }
    } catch (err) {
      toast.error('Erro ao adicionar água')
      return null
    }
  }, [loadHydrationData])

  const updateHydrationGoal = useCallback(async (data: HydrationGoalInput) => {
    try {
      const result = await updateHydrationGoalAction(data)

      if (result.success) {
        toast.success('Meta atualizada com sucesso!')
        await loadHydrationData()
        return result.data
      } else {
        toast.error(result.message || 'Erro ao atualizar meta')
        return null
      }
    } catch (err) {
      toast.error('Erro ao atualizar meta')
      return null
    }
  }, [loadHydrationData])

  const removeWaterIntake = useCallback(async (id: string) => {
    try {
      const result = await deleteWaterIntakeAction(id)

      if (result.success) {
        toast.success('Registro removido com sucesso!')
        await loadHydrationData()
        return true
      } else {
        toast.error(result.message || 'Erro ao remover registro')
        return false
      }
    } catch (err) {
      toast.error('Erro ao remover registro')
      return false
    }
  }, [loadHydrationData])

  // Filtros
  const applyFilters = useCallback((records: MealRecord[]) => {
    let filtered = [...records]

    if (filters.mealType) {
      filtered = filtered.filter(record => record.meal_type === filters.mealType)
    }

    if (filters.search) {
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        record.description?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.isCompleted !== null) {
      filtered = filtered.filter(record => record.is_completed === filters.isCompleted)
    }

    setFilteredRecords(filtered)
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      mealType: '',
      search: '',
      isCompleted: null,
      dateRange: { start: '', end: '' }
    })
  }, [])

  // Navegação de datas
  const navigateDate = useCallback((direction: 'prev' | 'next' | 'today') => {
    const currentDate = new Date(selectedDate)
    let newDate: Date

    switch (direction) {
      case 'prev':
        newDate = subDays(currentDate, 1)
        break
      case 'next':
        newDate = addDays(currentDate, 1)
        break
      case 'today':
        newDate = new Date()
        break
      default:
        newDate = currentDate
    }

    const newDateString = format(newDate, 'yyyy-MM-dd')
    setSelectedDate(newDateString)

    // Atualizar query string
    const url = new URL(window.location.href)
    url.searchParams.set('date', newDateString)
    window.history.pushState({}, '', url.toString())
  }, [selectedDate])

  // Cálculos derivados
  const dailyNutritionSummary = useMemo(() => {
    const todayRecords = mealRecords.filter(record => record.date === selectedDate)

    return todayRecords.reduce((acc, record) => ({
      calories: acc.calories + (record.calories || 0),
      protein: acc.protein + (record.protein || 0),
      carbs: acc.carbs + (record.carbs || 0),
      fat: acc.fat + (record.fat || 0),
      fiber: acc.fiber + (record.fiber || 0),
      totalMeals: acc.totalMeals + 1,
      completedMeals: acc.completedMeals + (record.is_completed ? 1 : 0)
    }), {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      totalMeals: 0,
      completedMeals: 0
    })
  }, [mealRecords, selectedDate])

  const waterProgress = useMemo(() => {
    if (!dailyWaterSummary || !hydrationGoal) return null

    return {
      current: dailyWaterSummary.totalAmount,
      goal: hydrationGoal.daily_goal,
      percentage: dailyWaterSummary.percentage,
      cups: Math.round(dailyWaterSummary.totalAmount / 250),
      goalCups: Math.round(hydrationGoal.daily_goal / 250)
    }
  }, [dailyWaterSummary, hydrationGoal])

  return {
    // Estados
    selectedDate,
    isLoading,
    error,
    mealPlans,
    activeMealPlan,
    mealRecords,
    filteredRecords,
    waterIntakes,
    hydrationGoal,
    dailyWaterSummary,
    filters,

    // Dados derivados
    dailyNutritionSummary,
    waterProgress,
    isToday: isToday(new Date(selectedDate)),

    // Actions - Meal Plans
    createMealPlan,
    updateMealPlan,
    deleteMealPlan,
    loadMealPlans,

    // Actions - Meal Records
    createMealRecord,
    updateMealRecord,
    deleteMealRecord,
    loadMealRecords,

    // Actions - Hidratação
    addWaterIntake,
    updateHydrationGoal,
    removeWaterIntake,
    loadHydrationData,

    // Actions - Filtros
    updateFilters,
    clearFilters,

    // Actions - Navegação
    navigateDate,
    setSelectedDate,

    // Actions - Gerais
    refreshData: loadAllData,
    clearError: () => setError(null)
  }
}