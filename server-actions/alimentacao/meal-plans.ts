'use server'

import { revalidatePath, revalidateTag, unstable_cache as nextCache } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createMealPlanSchema, updateMealPlanSchema, deleteMealPlanSchema } from './types'
import { NutritionErrorHandler } from './utils'
import type { CreateMealPlanInput, UpdateMealPlanInput, DeleteMealPlanInput, MealPlanResponse, MealPlansResponse } from './types'
import { NutritionError, NutritionErrorCodes } from './types'
import { CACHE_TAGS } from '@/lib/cache/alimentacao-cache'

export async function createMealPlanAction(input: CreateMealPlanInput): Promise<MealPlanResponse> {
  try {
    // Validar entrada
    const validatedData = createMealPlanSchema.parse(input)

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

    // Calcular data final
    const startDate = new Date(validatedData.startDate)
    const endDate = new Date(startDate.getTime() + (validatedData.duration - 1) * 24 * 60 * 60 * 1000)

    // Preparar dados para inserção
    const mealPlanData = {
      name: validatedData.name,
      description: validatedData.description,
      duration: validatedData.duration,
      start_date: validatedData.startDate,
      end_date: endDate.toISOString().split('T')[0],
      goals: validatedData.goals,
      is_active: validatedData.isActive,
      user_id: user.id,
    }

    // Inserir plano de refeições
    const { data: mealPlan, error: insertError } = await supabase
      .from('meal_plans')
      .insert(mealPlanData)
      .select()
      .single()

    if (insertError) {
      throw NutritionErrorHandler.handleError(insertError)
    }

    // Inserir refeições do plano
    if (validatedData.meals.length > 0) {
      const mealsToInsert = validatedData.meals.map(meal => ({
        meal_plan_id: mealPlan.id,
        type: meal.type,
        name: meal.name,
        description: meal.description,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        fiber: meal.fiber,
        time: meal.time,
      }))

      const { error: mealsError } = await supabase
        .from('meals')
        .insert(mealsToInsert)

      if (mealsError) {
        // Se falhar ao inserir refeições, deletar o plano
        await supabase.from('meal_plans').delete().eq('id', mealPlan.id)
        throw NutritionErrorHandler.handleError(mealsError)
      }
    }

    // Buscar o plano completo com as refeições
    const { data: completeMealPlan, error: fetchError } = await supabase
      .from('meal_plans')
      .select(`
        *,
        meals (*)
      `)
      .eq('id', mealPlan.id)
      .single()

    if (fetchError) {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.MEAL_PLANS)
    revalidateTag(CACHE_TAGS.NUTRITION_STATS)

    // Logar ação
    NutritionErrorHandler.logAction('create_meal_plan', user.id, {
      mealPlanId: mealPlan.id,
      mealPlanName: validatedData.name,
    })

    return {
      success: true,
      message: 'Plano de refeições criado com sucesso',
      data: NutritionErrorHandler.sanitizeMealPlanData(completeMealPlan),
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

export async function updateMealPlanAction(input: UpdateMealPlanInput): Promise<MealPlanResponse> {
  try {
    // Validar entrada
    const validatedData = updateMealPlanSchema.parse(input)

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

    // Verificar se o plano existe e pertence ao usuário
    const { data: existingPlan, error: fetchError } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', validatedData.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingPlan) {
      throw new NutritionError(
        'Plano de refeições não encontrado',
        NutritionErrorCodes.MEAL_PLAN_NOT_FOUND,
        404
      )
    }

    // Preparar dados para atualização
    const updateData: any = {}

    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.duration !== undefined) {
      updateData.duration = validatedData.duration
      const startDate = new Date(validatedData.startDate || existingPlan.start_date)
      const endDate = new Date(startDate.getTime() + (validatedData.duration - 1) * 24 * 60 * 60 * 1000)
      updateData.end_date = endDate.toISOString().split('T')[0]
    }
    if (validatedData.startDate !== undefined) {
      updateData.start_date = validatedData.startDate
      const startDate = new Date(validatedData.startDate)
      const endDate = new Date(startDate.getTime() + (validatedData.duration || existingPlan.duration - 1) * 24 * 60 * 60 * 1000)
      updateData.end_date = endDate.toISOString().split('T')[0]
    }
    if (validatedData.goals !== undefined) updateData.goals = validatedData.goals
    if (validatedData.isActive !== undefined) updateData.is_active = validatedData.isActive

    // Atualizar plano de refeições
    const { data: updatedPlan, error: updateError } = await supabase
      .from('meal_plans')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single()

    if (updateError) {
      throw NutritionErrorHandler.handleError(updateError)
    }

    // Atualizar refeições se fornecidas
    if (validatedData.meals) {
      // Deletar refeições existentes
      await supabase.from('meals').delete().eq('meal_plan_id', validatedData.id)

      // Inserir novas refeições
      if (validatedData.meals.length > 0) {
        const mealsToInsert = validatedData.meals.map(meal => ({
          meal_plan_id: validatedData.id,
          type: meal.type,
          name: meal.name,
          description: meal.description,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          fiber: meal.fiber,
          time: meal.time,
        }))

        const { error: mealsError } = await supabase
          .from('meals')
          .insert(mealsToInsert)

        if (mealsError) {
          throw NutritionErrorHandler.handleError(mealsError)
        }
      }
    }

    // Buscar o plano completo com as refeições
    const { data: completeMealPlan, error: fetchCompleteError } = await supabase
      .from('meal_plans')
      .select(`
        *,
        meals (*)
      `)
      .eq('id', validatedData.id)
      .single()

    if (fetchCompleteError) {
      throw NutritionErrorHandler.handleError(fetchCompleteError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.MEAL_PLANS)
    revalidateTag(CACHE_TAGS.NUTRITION_STATS)

    // Logar ação
    NutritionErrorHandler.logAction('update_meal_plan', user.id, {
      mealPlanId: validatedData.id,
      updatedFields: Object.keys(updateData),
    })

    return {
      success: true,
      message: 'Plano de refeições atualizado com sucesso',
      data: NutritionErrorHandler.sanitizeMealPlanData(completeMealPlan),
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

export async function deleteMealPlanAction(input: DeleteMealPlanInput): Promise<MealPlanResponse> {
  try {
    // Validar entrada
    const validatedData = deleteMealPlanSchema.parse(input)

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

    // Verificar se o plano existe e pertence ao usuário
    const { data: existingPlan, error: fetchError } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('id', validatedData.id)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !existingPlan) {
      throw new NutritionError(
        'Plano de refeições não encontrado',
        NutritionErrorCodes.MEAL_PLAN_NOT_FOUND,
        404
      )
    }

    // Deletar refeições associadas
    await supabase.from('meals').delete().eq('meal_plan_id', validatedData.id)

    // Deletar plano de refeições
    const { error: deleteError } = await supabase
      .from('meal_plans')
      .delete()
      .eq('id', validatedData.id)

    if (deleteError) {
      throw NutritionErrorHandler.handleError(deleteError)
    }

    // Revalidar caminhos e tags
    revalidatePath('/alimentacao')
    revalidatePath('/dashboard')
    revalidateTag(CACHE_TAGS.MEAL_PLANS)
    revalidateTag(CACHE_TAGS.NUTRITION_STATS)

    // Logar ação
    NutritionErrorHandler.logAction('delete_meal_plan', user.id, {
      mealPlanId: validatedData.id,
      mealPlanName: existingPlan.name,
    })

    return {
      success: true,
      message: 'Plano de refeições deletado com sucesso',
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

export async function getMealPlansAction(): Promise<MealPlansResponse> {
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

    // Buscar planos de refeições do usuário
    const { data: mealPlans, error: fetchError } = await supabase
      .from('meal_plans')
      .select(`
        *,
        meals (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    // Sanitizar dados
    const sanitizedPlans = mealPlans?.map(plan =>
      NutritionErrorHandler.sanitizeMealPlanData(plan)
    ) || []

    return {
      success: true,
      message: 'Planos de refeições obtidos com sucesso',
      data: sanitizedPlans,
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

export async function getActiveMealPlanAction(): Promise<MealPlanResponse> {
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

    // Buscar plano de refeições ativo
    const { data: mealPlan, error: fetchError } = await supabase
      .from('meal_plans')
      .select(`
        *,
        meals (*)
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw NutritionErrorHandler.handleError(fetchError)
    }

    if (!mealPlan) {
      return {
        success: true,
        message: 'Nenhum plano de refeições ativo encontrado',
        data: null,
      }
    }

    return {
      success: true,
      message: 'Plano de refeições ativo obtido com sucesso',
      data: NutritionErrorHandler.sanitizeMealPlanData(mealPlan),
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