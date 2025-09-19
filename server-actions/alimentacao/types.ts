import { z } from 'zod'

// Tipos de refeições
export const mealTypes = ['cafe', 'almoco', 'jantar', 'lanche'] as const
export type MealType = typeof mealTypes[number]

// Esquemas de validação Zod
export const createMealPlanSchema = z.object({
  name: z.string().min(1, 'Nome do plano é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  duration: z.number().int().min(1, 'Duração mínima de 1 dia').max(365, 'Duração máxima de 365 dias'),
  startDate: z.string().refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, 'Data inválida'),
  meals: z.array(z.object({
    type: z.enum(mealTypes),
    name: z.string().min(1, 'Nome da refeição é obrigatório'),
    description: z.string().max(200, 'Descrição muito longa').optional(),
    calories: z.number().int().min(0, 'Calorias não podem ser negativas').max(2000, 'Calorias muito altas').optional(),
    protein: z.number().min(0, 'Proteínas não podem ser negativas').max(200, 'Proteínas muito altas').optional(),
    carbs: z.number().min(0, 'Carboidratos não podem ser negativos').max(300, 'Carboidratos muito altos').optional(),
    fat: z.number().min(0, 'Gorduras não podem ser negativas').max(100, 'Gorduras muito altas').optional(),
    fiber: z.number().min(0, 'Fibras não podem ser negativas').max(50, 'Fibras muito altas').optional(),
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (HH:MM)'),
  })).min(1, 'Pelo menos uma refeição é obrigatória'),
  goals: z.object({
    dailyCalories: z.number().int().min(1200, 'Calorias diárias muito baixas').max(4000, 'Calorias diárias muito altas').optional(),
    dailyProtein: z.number().min(0, 'Proteínas diárias não podem ser negativas').max(400, 'Proteínas diárias muito altas').optional(),
    dailyCarbs: z.number().min(0, 'Carboidratos diários não podem ser negativos').max(600, 'Carboidratos diários muito altos').optional(),
    dailyFat: z.number().min(0, 'Gorduras diárias não podem ser negativas').max(200, 'Gorduras diárias muito altas').optional(),
    dailyFiber: z.number().min(0, 'Fibras diárias não podem ser negativas').max(100, 'Fibras diárias muito altas').optional(),
    waterGoal: z.number().int().min(500, 'Meta de água muito baixa').max(5000, 'Meta de água muito alta').optional(),
  }).optional(),
  isActive: z.boolean().default(true),
})

export const updateMealPlanSchema = createMealPlanSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
})

export const deleteMealPlanSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const createMealRecordSchema = z.object({
  mealPlanId: z.string().uuid('ID do plano inválido'),
  date: z.string().refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, 'Data inválida'),
  mealType: z.enum(mealTypes),
  name: z.string().min(1, 'Nome da refeição é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  calories: z.number().int().min(0, 'Calorias não podem ser negativas').max(2000, 'Calorias muito altas').optional(),
  protein: z.number().min(0, 'Proteínas não podem ser negativas').max(200, 'Proteínas muito altas').optional(),
  carbs: z.number().min(0, 'Carboidratos não podem ser negativos').max(300, 'Carboidratos muito altos').optional(),
  fat: z.number().min(0, 'Gorduras não podem ser negativas').max(100, 'Gorduras muito altas').optional(),
  fiber: z.number().min(0, 'Fibras não podem ser negativas').max(50, 'Fibras muito altas').optional(),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (HH:MM)'),
  notes: z.string().max(1000, 'Anotações muito longas').optional(),
  isCompleted: z.boolean().default(true),
})

export const updateMealRecordSchema = createMealRecordSchema.partial().extend({
  id: z.string().uuid('ID inválido'),
})

export const deleteMealRecordSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

export const addWaterIntakeSchema = z.object({
  amount: z.number().int().min(1, 'Quantidade mínima de 1ml').max(1000, 'Quantidade máxima de 1000ml'),
  date: z.string().refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, 'Data inválida'),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (HH:MM)').optional(),
  notes: z.string().max(200, 'Anotações muito longas').optional(),
})

export const updateHydrationGoalSchema = z.object({
  dailyGoal: z.number().int().min(500, 'Meta diária muito baixa').max(5000, 'Meta diária muito alta'),
  startDate: z.string().refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, 'Data inválida').optional(),
})

export const getNutritionSummarySchema = z.object({
  startDate: z.string().refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, 'Data inicial inválida').optional(),
  endDate: z.string().refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, 'Data final inválida').optional(),
})

// Tipos derivados dos esquemas
export type CreateMealPlanInput = z.infer<typeof createMealPlanSchema>
export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>
export type DeleteMealPlanInput = z.infer<typeof deleteMealPlanSchema>
export type CreateMealRecordInput = z.infer<typeof createMealRecordSchema>
export type UpdateMealRecordInput = z.infer<typeof updateMealRecordSchema>
export type DeleteMealRecordInput = z.infer<typeof deleteMealRecordSchema>
export type AddWaterIntakeInput = z.infer<typeof addWaterIntakeSchema>
export type UpdateHydrationGoalInput = z.infer<typeof updateHydrationGoalSchema>
export type GetNutritionSummaryInput = z.infer<typeof getNutritionSummarySchema>

// Tipos de dados
export interface Meal {
  id: string
  type: MealType
  name: string
  description?: string
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
  time: string
  created_at: string
  updated_at: string
}

export interface MealPlan {
  id: string
  name: string
  description?: string
  duration: number
  start_date: string
  end_date: string
  meals: Meal[]
  goals?: {
    daily_calories?: number
    daily_protein?: number
    daily_carbs?: number
    daily_fat?: number
    daily_fiber?: number
    water_goal?: number
  }
  is_active: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface MealRecord {
  id: string
  meal_plan_id: string
  date: string
  meal_type: MealType
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
  created_at: string
  updated_at: string
}

export interface WaterIntake {
  id: string
  amount: number
  date: string
  time: string
  notes?: string
  created_at: string
}

export interface HydrationGoal {
  id: string
  daily_goal: number
  start_date: string
  user_id: string
  created_at: string
  updated_at: string
}

export interface NutritionSummary {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  totalFiber: number
  averageCalories: number
  averageProtein: number
  averageCarbs: number
  averageFat: number
  averageFiber: number
  totalWater: number
  averageWater: number
  daysCount: number
  goalsAchieved: {
    calories: boolean
    protein: boolean
    carbs: boolean
    fat: boolean
    fiber: boolean
    water: boolean
  }
}

// Tipos de resposta
export interface NutritionResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

export interface MealPlanResponse extends NutritionResponse {
  data?: MealPlan
}

export interface MealPlansResponse extends NutritionResponse {
  data?: MealPlan[]
}

export interface MealRecordResponse extends NutritionResponse {
  data?: MealRecord
}

export interface MealRecordsResponse extends NutritionResponse {
  data?: MealRecord[]
}

export interface WaterIntakeResponse extends NutritionResponse {
  data?: WaterIntake
}

export interface HydrationGoalResponse extends NutritionResponse {
  data?: HydrationGoal
}

export interface NutritionSummaryResponse extends NutritionResponse {
  data?: NutritionSummary
}

// Classe de erro personalizada
export class NutritionError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'NutritionError'
  }
}

// Códigos de erro
export const NutritionErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MEAL_PLAN_NOT_FOUND: 'MEAL_PLAN_NOT_FOUND',
  MEAL_RECORD_NOT_FOUND: 'MEAL_RECORD_NOT_FOUND',
  HYDRATION_GOAL_NOT_FOUND: 'HYDRATION_GOAL_NOT_FOUND',
  INVALID_DATE_RANGE: 'INVALID_DATE_RANGE',
  MEAL_PLAN_EXPIRED: 'MEAL_PLAN_EXPIRED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const