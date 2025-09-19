'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createMealRecordSchema, updateMealRecordSchema, deleteMealRecordSchema } from './types'
import { NutritionErrorHandler } from './utils'
import type { CreateMealRecordInput, UpdateMealRecordInput, DeleteMealRecordInput, MealRecordResponse, MealRecordsResponse } from './types'
import { NutritionError, NutritionErrorCodes } from './types'
import { CACHE_TAGS } from '@/lib/cache/alimentacao-cache'

export async function createMealRecordAction(input: CreateMealRecordInput): Promise<MealRecordResponse> {
  try {
    // Validar entrada
    const validatedData = createMealRecordSchema.parse(input)

    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new NutritionError(
        'Usuário não autenticado',
        'UNAUTHORIZED',
        401
      )
    }

    // Verificar se o plano de refeições existe e pertence ao usuário
    const { data: mealPlan, error: planError } = await supabase
      .from('meal_plans')
      .select('user_id')
      .eq('id', validatedData.mealPlanId)
      .single()

    if (planError || !mealPlan) {
      throw new NutritionError(
        'Plano de refeições não encontrado',
        NutritionErrorCodes.MEAL_PLAN_NOT_FOUND,
        404
      )
    }

    if (mealPlan.user_id !== user.id) {
      throw new NutritionError(
        'Permissões insuficientes',
        NutritionErrorCodes.INSUFFICIENT_PERMISSIONS,
        403
      )
    }

    // Preparar dados para inserção
    const mealRecordData = {
      meal_plan_id: validatedData.mealPlanId,
      date: validatedData.date,
      meal_type: validatedData.mealType,
      name: validatedData.name,
      description: validatedData.description,
      calories: validatedData.calories,
      protein: validatedData.protein,
      carbs: validatedData.carbs,
      fat: validatedData.fat,
      fiber: validatedData.fiber,
      time: validatedData.time,
      notes: validatedData.notes,
      is_completed: validatedData.isCompleted,
    }

    // Inserir registro de refeição
    const { data: mealRecord, error: insertError } = await supabase
      .from('meal_records')
      .insert(mealRecordData)
      .select()
      .single()

    if (insertError) {
      throw NutritionErrorHandler.handleError(insertError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.MEAL_RECORDS)
    revalidateTag(CACHE_TAGS.DAILY_SUMMARY)
    revalidateTag(CACHE_TAGS.NUTRITION_STATS)

    // Logar ação
    NutritionErrorHandler.logAction('create_meal_record', user.id, {
      mealRecordId: mealRecord.id,
      mealPlanId: validatedData.mealPlanId,
      date: validatedData.date,
      mealType: validatedData.mealType,
    })

    return {
      success: true,
      message: 'Registro de refeição criado com sucesso',
      data: NutritionErrorHandler.sanitizeMealRecordData(mealRecord),
    }

  } catch (error) {
    if (error instanceof NutritionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      }
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return {
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }
  }
}

export async function updateMealRecordAction(input: UpdateMealRecordInput): Promise<MealRecordResponse> {
  try {
    // Validar entrada
    const validatedData = updateMealRecordSchema.parse(input)

    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new NutritionError(
        'Usuário não autenticado',
        'UNAUTHORIZED',
        401
      )
    }

    // Verificar se o registro existe e pertence ao usuário
    const { data: existingRecord, error: fetchError } = await supabase
      .from('meal_records')
      .select(`
        *,
        meal_plans (user_id)
      `)
      .eq('id', validatedData.id)
      .single()

    if (fetchError || !existingRecord) {
      throw new NutritionError(
        'Registro de refeição não encontrado',
        NutritionErrorCodes.MEAL_RECORD_NOT_FOUND,
        404
      )
    }

    if (existingRecord.meal_plans.user_id !== user.id) {
      throw new NutritionError(
        'Permissões insuficientes',
        NutritionErrorCodes.INSUFFICIENT_PERMISSIONS,
        403
      )
    }

    // Preparar dados para atualização
    const updateData: any = {}

    if (validatedData.mealPlanId !== undefined) updateData.meal_plan_id = validatedData.mealPlanId
    if (validatedData.date !== undefined) updateData.date = validatedData.date
    if (validatedData.mealType !== undefined) updateData.meal_type = validatedData.mealType
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.calories !== undefined) updateData.calories = validatedData.calories
    if (validatedData.protein !== undefined) updateData.protein = validatedData.protein
    if (validatedData.carbs !== undefined) updateData.carbs = validatedData.carbs
    if (validatedData.fat !== undefined) updateData.fat = validatedData.fat
    if (validatedData.fiber !== undefined) updateData.fiber = validatedData.fiber
    if (validatedData.time !== undefined) updateData.time = validatedData.time
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes
    if (validatedData.isCompleted !== undefined) updateData.is_completed = validatedData.isCompleted

    // Atualizar registro de refeição
    const { data: updatedRecord, error: updateError } = await supabase
      .from('meal_records')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single()

    if (updateError) {
      throw NutritionErrorHandler.handleError(updateError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.MEAL_RECORDS)
    revalidateTag(CACHE_TAGS.DAILY_SUMMARY)
    revalidateTag(CACHE_TAGS.NUTRITION_STATS)

    // Logar ação
    NutritionErrorHandler.logAction('update_meal_record', user.id, {
      mealRecordId: validatedData.id,
      updatedFields: Object.keys(updateData),
    })

    return {
      success: true,
      message: 'Registro de refeição atualizado com sucesso',
      data: NutritionErrorHandler.sanitizeMealRecordData(updatedRecord),
    }

  } catch (error) {
    if (error instanceof NutritionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      }
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return {
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }
  }
}

export async function deleteMealRecordAction(input: DeleteMealRecordInput): Promise<MealRecordResponse> {
  try {
    // Validar entrada
    const validatedData = deleteMealRecordSchema.parse(input)

    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new NutritionError(
        'Usuário não autenticado',
        'UNAUTHORIZED',
        401
      )
    }

    // Verificar se o registro existe e pertence ao usuário
    const { data: existingRecord, error: fetchError } = await supabase
      .from('meal_records')
      .select(`
        *,
        meal_plans (user_id)
      `)
      .eq('id', validatedData.id)
      .single()

    if (fetchError || !existingRecord) {
      throw new NutritionError(
        'Registro de refeição não encontrado',
        NutritionErrorCodes.MEAL_RECORD_NOT_FOUND,
        404
      )
    }

    if (existingRecord.meal_plans.user_id !== user.id) {
      throw new NutritionError(
        'Permissões insuficientes',
        NutritionErrorCodes.INSUFFICIENT_PERMISSIONS,
        403
      )
    }

    // Deletar registro de refeição
    const { error: deleteError } = await supabase
      .from('meal_records')
      .delete()
      .eq('id', validatedData.id)

    if (deleteError) {
      throw NutritionErrorHandler.handleError(deleteError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.MEAL_RECORDS)
    revalidateTag(CACHE_TAGS.DAILY_SUMMARY)
    revalidateTag(CACHE_TAGS.NUTRITION_STATS)

    // Logar ação
    NutritionErrorHandler.logAction('delete_meal_record', user.id, {
      mealRecordId: validatedData.id,
      date: existingRecord.date,
      mealType: existingRecord.meal_type,
    })

    return {
      success: true,
      message: 'Registro de refeição deletado com sucesso',
    }

  } catch (error) {
    if (error instanceof NutritionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      }
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return {
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }
  }
}

export async function getMealRecordsAction(date?: string, mealPlanId?: string): Promise<MealRecordsResponse> {
  try {
    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new NutritionError(
        'Usuário não autenticado',
        'UNAUTHORIZED',
        401
      )
    }

    // Construir query
    let query = supabase
      .from('meal_records')
      .select(`
        *,
        meal_plans (user_id)
      `)
      .eq('meal_plans.user_id', user.id)

    if (date) {
      query = query.eq('date', date)
    }

    if (mealPlanId) {
      query = query.eq('meal_plan_id', mealPlanId)
    }

    // Ordenar por data e horário
    query = query.order('date', { ascending: false }).order('time', { ascending: true })

    const { data: mealRecords, error: fetchError } = await query

    if (fetchError) {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    // Sanitizar dados
    const sanitizedRecords = mealRecords?.map(record =>
      NutritionErrorHandler.sanitizeMealRecordData(record)
    ) || []

    return {
      success: true,
      message: 'Registros de refeição obtidos com sucesso',
      data: sanitizedRecords,
    }

  } catch (error) {
    if (error instanceof NutritionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      }
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return {
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }
  }
}

export async function getMealRecordsByDateRangeAction(startDate: string, endDate: string): Promise<MealRecordsResponse> {
  try {
    // Validar datas
    const { start, end } = NutritionErrorHandler.validateDateRange(startDate, endDate)

    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new NutritionError(
        'Usuário não autenticado',
        'UNAUTHORIZED',
        401
      )
    }

    // Buscar registros de refeições no período
    const { data: mealRecords, error: fetchError } = await supabase
      .from('meal_records')
      .select(`
        *,
        meal_plans (user_id)
      `)
      .eq('meal_plans.user_id', user.id)
      .gte('date', start.toISOString().split('T')[0])
      .lte('date', end.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (fetchError) {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    // Sanitizar dados
    const sanitizedRecords = mealRecords?.map(record =>
      NutritionErrorHandler.sanitizeMealRecordData(record)
    ) || []

    return {
      success: true,
      message: 'Registros de refeição obtidos com sucesso',
      data: sanitizedRecords,
    }

  } catch (error) {
    if (error instanceof NutritionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      }
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return {
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }
  }
}

export async function getMealRecordsByMealTypeAction(mealType: string, date?: string): Promise<MealRecordsResponse> {
  try {
    // Criar cliente Supabase
    const supabase = createClient()

    // Obter usuário autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new NutritionError(
        'Usuário não autenticado',
        'UNAUTHORIZED',
        401
      )
    }

    // Construir query
    let query = supabase
      .from('meal_records')
      .select(`
        *,
        meal_plans (user_id)
      `)
      .eq('meal_plans.user_id', user.id)
      .eq('meal_type', mealType)

    if (date) {
      query = query.eq('date', date)
    }

    // Ordenar por data e horário
    query = query.order('date', { ascending: false }).order('time', { ascending: true })

    const { data: mealRecords, error: fetchError } = await query

    if (fetchError) {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    // Sanitizar dados
    const sanitizedRecords = mealRecords?.map(record =>
      NutritionErrorHandler.sanitizeMealRecordData(record)
    ) || []

    return {
      success: true,
      message: 'Registros de refeição obtidos com sucesso',
      data: sanitizedRecords,
    }

  } catch (error) {
    if (error instanceof NutritionError) {
      return {
        success: false,
        message: error.message,
        error: error.code,
      }
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return {
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }
  }
}