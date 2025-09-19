'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const mealPlanSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/),
  description: z.string().min(1).max(255),
})

export async function createMealPlan(data: unknown) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const validated = mealPlanSchema.parse(data)

  const { error } = await supabase
    .from('meal_plans')
    .insert({
      user_id: user.id,
      ...validated,
    })

  if (error) throw error

  revalidatePath('/alimentacao')
  return { success: true }
}

export async function getMealPlans() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('time')

  return data || []
}