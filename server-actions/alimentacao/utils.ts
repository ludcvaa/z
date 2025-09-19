import { NutritionError, NutritionErrorCodes } from './types'

// Classe para tratamento de erros de nutrição
export class NutritionErrorHandler {
  static handleError(error: any): NutritionError {
    console.error('Nutrition Error:', error)

    // Erros de validação Zod
    if (error instanceof Error && error.name === 'ZodError') {
      return new NutritionError(
        'Dados inválidos',
        NutritionErrorCodes.VALIDATION_ERROR,
        400
      )
    }

    // Erros do Supabase
    if (error?.code) {
      switch (error.code) {
        case 'PGRST116':
          return new NutritionError(
            'Registro não encontrado',
            NutritionErrorCodes.MEAL_RECORD_NOT_FOUND,
            404
          )
        case 'PGRST301':
          return new NutritionError(
            'Permissões insuficientes',
            NutritionErrorCodes.INSUFFICIENT_PERMISSIONS,
            403
          )
        case '23505':
          return new NutritionError(
            'Registro duplicado',
            NutritionErrorCodes.VALIDATION_ERROR,
            409
          )
        default:
          return new NutritionError(
            error.message || 'Erro de banco de dados',
            NutritionErrorCodes.DATABASE_ERROR,
            500
          )
      }
    }

    // Erros genéricos
    return new NutritionError(
      error?.message || 'Erro interno do servidor',
      NutritionErrorCodes.INTERNAL_ERROR,
      500
    )
  }

  // Validação de datas
  static validateDateRange(startDate: string, endDate?: string) {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()

    if (isNaN(start.getTime()) || (endDate && isNaN(end.getTime()))) {
      throw new NutritionError(
        'Data inválida',
        NutritionErrorCodes.VALIDATION_ERROR,
        400
      )
    }

    if (start > end) {
      throw new NutritionError(
        'Data inicial não pode ser maior que a data final',
        NutritionErrorCodes.INVALID_DATE_RANGE,
        400
      )
    }

    if (end > new Date()) {
      throw new NutritionError(
        'Data final não pode ser no futuro',
        NutritionErrorCodes.INVALID_DATE_RANGE,
        400
      )
    }

    return { start, end }
  }

  // Validação de plano de refeições
  static validateMealPlan(mealPlan: any) {
    if (!mealPlan) {
      throw new NutritionError(
        'Plano de refeições não encontrado',
        NutritionErrorCodes.MEAL_PLAN_NOT_FOUND,
        404
      )
    }

    if (!mealPlan.is_active) {
      throw new NutritionError(
        'Plano de refeições inativo',
        NutritionErrorCodes.MEAL_PLAN_EXPIRED,
        400
      )
    }

    if (new Date(mealPlan.end_date) < new Date()) {
      throw new NutritionError(
        'Plano de refeições expirado',
        NutritionErrorCodes.MEAL_PLAN_EXPIRED,
        400
      )
    }

    return mealPlan
  }

  // Sanitização de dados sensíveis
  static sanitizeMealData(meal: any) {
    if (!meal) return null

    return {
      id: meal.id,
      type: meal.type,
      name: meal.name,
      description: meal.description,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fat: meal.fat,
      fiber: meal.fiber,
      time: meal.time,
      created_at: meal.created_at,
      updated_at: meal.updated_at,
    }
  }

  static sanitizeMealPlanData(mealPlan: any) {
    if (!mealPlan) return null

    return {
      id: mealPlan.id,
      name: mealPlan.name,
      description: mealPlan.description,
      duration: mealPlan.duration,
      start_date: mealPlan.start_date,
      end_date: mealPlan.end_date,
      meals: mealPlan.meals?.map((meal: any) => this.sanitizeMealData(meal)) || [],
      goals: mealPlan.goals,
      is_active: mealPlan.is_active,
      created_at: mealPlan.created_at,
      updated_at: mealPlan.updated_at,
    }
  }

  static sanitizeMealRecordData(mealRecord: any) {
    if (!mealRecord) return null

    return {
      id: mealRecord.id,
      meal_plan_id: mealRecord.meal_plan_id,
      date: mealRecord.date,
      meal_type: mealRecord.meal_type,
      name: mealRecord.name,
      description: mealRecord.description,
      calories: mealRecord.calories,
      protein: mealRecord.protein,
      carbs: mealRecord.carbs,
      fat: mealRecord.fat,
      fiber: mealRecord.fiber,
      time: mealRecord.time,
      notes: mealRecord.notes,
      is_completed: mealRecord.is_completed,
      created_at: mealRecord.created_at,
      updated_at: mealRecord.updated_at,
    }
  }

  static sanitizeWaterIntakeData(waterIntake: any) {
    if (!waterIntake) return null

    return {
      id: waterIntake.id,
      amount: waterIntake.amount,
      date: waterIntake.date,
      time: waterIntake.time,
      notes: waterIntake.notes,
      created_at: waterIntake.created_at,
    }
  }

  // Cálculo de resumo nutricional
  static calculateNutritionSummary(mealRecords: any[], waterIntakes: any[], goals?: any) {
    const totalCalories = mealRecords.reduce((sum, record) => sum + (record.calories || 0), 0)
    const totalProtein = mealRecords.reduce((sum, record) => sum + (record.protein || 0), 0)
    const totalCarbs = mealRecords.reduce((sum, record) => sum + (record.carbs || 0), 0)
    const totalFat = mealRecords.reduce((sum, record) => sum + (record.fat || 0), 0)
    const totalFiber = mealRecords.reduce((sum, record) => sum + (record.fiber || 0), 0)
    const totalWater = waterIntakes.reduce((sum, intake) => sum + intake.amount, 0)

    const uniqueDays = new Set(mealRecords.map(record => record.date)).size || 1
    const daysCount = uniqueDays

    const averageCalories = Math.round(totalCalories / daysCount)
    const averageProtein = Math.round(totalProtein / daysCount)
    const averageCarbs = Math.round(totalCarbs / daysCount)
    const averageFat = Math.round(totalFat / daysCount)
    const averageFiber = Math.round(totalFiber / daysCount)
    const averageWater = Math.round(totalWater / daysCount)

    const goalsAchieved = {
      calories: goals?.daily_calories ? averageCalories <= goals.daily_calories : false,
      protein: goals?.daily_protein ? averageProtein >= goals.daily_protein : false,
      carbs: goals?.daily_carbs ? averageCarbs <= goals.daily_carbs : false,
      fat: goals?.daily_fat ? averageFat <= goals.daily_fat : false,
      fiber: goals?.daily_fiber ? averageFiber >= goals.daily_fiber : false,
      water: goals?.water_goal ? averageWater >= goals.water_goal : false,
    }

    return {
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      averageCalories,
      averageProtein,
      averageCarbs,
      averageFat,
      averageFiber,
      totalWater,
      averageWater,
      daysCount,
      goalsAchieved,
    }
  }

  // Logging seguro
  static logAction(action: string, userId?: string, metadata?: any) {
    const logData = {
      action,
      userId: userId || 'anonymous',
      timestamp: new Date().toISOString(),
      // Não logar dados sensíveis
    }

    console.log('Nutrition Action:', JSON.stringify(logData))
  }
}