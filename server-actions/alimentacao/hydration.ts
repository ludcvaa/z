'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { addWaterIntakeSchema, updateHydrationGoalSchema } from './types'
import { NutritionErrorHandler } from './utils'
import type { AddWaterIntakeInput, UpdateHydrationGoalInput, WaterIntakeResponse, HydrationGoalResponse } from './types'
import { NutritionError, NutritionErrorCodes } from './types'
import { CACHE_TAGS } from '@/lib/cache/alimentacao-cache'

export async function addWaterIntakeAction(input: AddWaterIntakeInput): Promise<WaterIntakeResponse> {
  try {
    // Validar entrada
    const validatedData = addWaterIntakeSchema.parse(input)

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

    // Preparar dados para inserção
    const waterIntakeData = {
      user_id: user.id,
      amount: validatedData.amount,
      date: validatedData.date,
      time: validatedData.time || new Date().toTimeString().slice(0, 5),
      notes: validatedData.notes,
    }

    // Inserir registro de água
    const { data: waterIntake, error: insertError } = await supabase
      .from('water_intake')
      .insert(waterIntakeData)
      .select()
      .single()

    if (insertError) {
      throw NutritionErrorHandler.handleError(insertError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.HYDRATION)
    revalidateTag(CACHE_TAGS.DAILY_SUMMARY)

    // Logar ação
    NutritionErrorHandler.logAction('add_water_intake', user.id, {
      waterIntakeId: waterIntake.id,
      amount: validatedData.amount,
      date: validatedData.date,
    })

    return {
      success: true,
      message: 'Registro de água adicionado com sucesso',
      data: NutritionErrorHandler.sanitizeWaterIntakeData(waterIntake),
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

export async function updateHydrationGoalAction(input: UpdateHydrationGoalInput): Promise<HydrationGoalResponse> {
  try {
    // Validar entrada
    const validatedData = updateHydrationGoalSchema.parse(input)

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

    // Verificar se já existe uma meta de hidratação para o usuário
    const { data: existingGoal, error: fetchError } = await supabase
      .from('hydration_goals')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    let goalData

    if (existingGoal) {
      // Atualizar meta existente
      const updateData: any = {
        daily_goal: validatedData.dailyGoal,
      }

      if (validatedData.startDate !== undefined) {
        updateData.start_date = validatedData.startDate
      }

      const { data: updatedGoal, error: updateError } = await supabase
        .from('hydration_goals')
        .update(updateData)
        .eq('id', existingGoal.id)
        .select()
        .single()

      if (updateError) {
        throw NutritionErrorHandler.handleError(updateError)
      }

      goalData = updatedGoal
    } else {
      // Criar nova meta
      const newGoalData = {
        user_id: user.id,
        daily_goal: validatedData.dailyGoal,
        start_date: validatedData.startDate || new Date().toISOString().split('T')[0],
      }

      const { data: newGoal, error: insertError } = await supabase
        .from('hydration_goals')
        .insert(newGoalData)
        .select()
        .single()

      if (insertError) {
        throw NutritionErrorHandler.handleError(insertError)
      }

      goalData = newGoal
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.HYDRATION)
    revalidateTag(CACHE_TAGS.DAILY_SUMMARY)

    // Logar ação
    NutritionErrorHandler.logAction('update_hydration_goal', user.id, {
      goalId: goalData.id,
      dailyGoal: validatedData.dailyGoal,
    })

    return {
      success: true,
      message: 'Meta de hidratação atualizada com sucesso',
      data: goalData,
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

export async function getWaterIntakeByDateAction(date: string): Promise<WaterIntakeResponse[]> {
  try {
    // Validar data
    new Date(date) // Lança erro se data for inválida

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

    // Buscar registros de água para a data
    const { data: waterIntakes, error: fetchError } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', date)
      .order('time', { ascending: true })

    if (fetchError) {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    // Sanitizar dados
    const sanitizedIntakes = waterIntakes?.map(intake =>
      NutritionErrorHandler.sanitizeWaterIntakeData(intake)
    ) || []

    return sanitizedIntakes.map(intake => ({
      success: true,
      message: 'Registro de água obtido com sucesso',
      data: intake,
    }))

  } catch (error) {
    if (error instanceof NutritionError) {
      return [{
        success: false,
        message: error.message,
        error: error.code,
      }]
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return [{
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }]
  }
}

export async function getWaterIntakeByDateRangeAction(startDate: string, endDate: string): Promise<WaterIntakeResponse[]> {
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

    // Buscar registros de água no período
    const { data: waterIntakes, error: fetchError } = await supabase
      .from('water_intake')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', start.toISOString().split('T')[0])
      .lte('date', end.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (fetchError) {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    // Sanitizar dados
    const sanitizedIntakes = waterIntakes?.map(intake =>
      NutritionErrorHandler.sanitizeWaterIntakeData(intake)
    ) || []

    return sanitizedIntakes.map(intake => ({
      success: true,
      message: 'Registro de água obtido com sucesso',
      data: intake,
    }))

  } catch (error) {
    if (error instanceof NutritionError) {
      return [{
        success: false,
        message: error.message,
        error: error.code,
      }]
    }

    const nutritionError = NutritionErrorHandler.handleError(error)
    return [{
      success: false,
      message: nutritionError.message,
      error: nutritionError.code,
    }]
  }
}

export async function getHydrationGoalAction(): Promise<HydrationGoalResponse> {
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

    // Buscar meta de hidratação do usuário
    const { data: hydrationGoal, error: fetchError } = await supabase
      .from('hydration_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    if (!hydrationGoal) {
      return {
        success: true,
        message: 'Nenhuma meta de hidratação encontrada',
        data: null,
      }
    }

    return {
      success: true,
      message: 'Meta de hidratação obtida com sucesso',
      data: hydrationGoal,
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

export async function getDailyWaterSummaryAction(date: string): Promise<{
  success: boolean
  message: string
  data?: {
    totalAmount: number
    goalAmount?: number
    percentage: number
    intakeCount: number
  }
  error?: string
}> {
  try {
    // Validar data
    new Date(date) // Lança erro se data for inválida

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

    // Buscar registros de água para a data
    const { data: waterIntakes, error: intakeError } = await supabase
      .from('water_intake')
      .select('amount')
      .eq('user_id', user.id)
      .eq('date', date)

    if (intakeError) {
      throw NutritionErrorHandler.handleError(intakeError)
    }

    // Buscar meta de hidratação
    const { data: hydrationGoal, error: goalError } = await supabase
      .from('hydration_goals')
      .select('daily_goal')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (goalError && goalError.code !== 'PGRST116') {
      throw NutritionErrorHandler.handleError(goalError)
    }

    // Calcular totais
    const totalAmount = waterIntakes?.reduce((sum, intake) => sum + intake.amount, 0) || 0
    const goalAmount = hydrationGoal?.daily_goal || 2000 // Meta padrão de 2L
    const percentage = Math.min((totalAmount / goalAmount) * 100, 100)
    const intakeCount = waterIntakes?.length || 0

    return {
      success: true,
      message: 'Resumo diário de água obtido com sucesso',
      data: {
        totalAmount,
        goalAmount,
        percentage,
        intakeCount,
      },
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

export async function deleteWaterIntakeAction(id: string): Promise<WaterIntakeResponse> {
  try {
    // Validar ID
    if (!id || typeof id !== 'string') {
      throw new NutritionError(
        'ID inválido',
        NutritionErrorCodes.VALIDATION_ERROR,
        400
      )
    }

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
    const { data: existingIntake, error: fetchError } = await supabase
      .from('water_intake')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingIntake) {
      throw new NutritionError(
        'Registro de água não encontrado',
        NutritionErrorCodes.HYDRATION_GOAL_NOT_FOUND,
        404
      )
    }

    // Deletar registro de água
    const { error: deleteError } = await supabase
      .from('water_intake')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw NutritionErrorHandler.handleError(deleteError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.HYDRATION)
    revalidateTag(CACHE_TAGS.DAILY_SUMMARY)

    // Logar ação
    NutritionErrorHandler.logAction('delete_water_intake', user.id, {
      waterIntakeId: id,
      amount: existingIntake.amount,
      date: existingIntake.date,
    })

    return {
      success: true,
      message: 'Registro de água deletado com sucesso',
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