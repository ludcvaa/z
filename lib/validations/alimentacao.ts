import { z } from 'zod'

// Validadores customizados
const timeSchema = z.string()
  .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário deve estar no formato HH:MM')
  .transform(val => val.trim())

const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
  .refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime())
  }, 'Data inválida')
  .transform(val => val.trim())

const positiveNumberSchema = z.number({
  required_error: 'Valor é obrigatório',
  invalid_type_error: 'Valor deve ser um número'
})
  .positive('Valor deve ser maior que zero')
  .max(10000, 'Valor muito grande')

const nonEmptyStringSchema = z.string({
  required_error: 'Campo é obrigatório'
})
  .min(1, 'Campo não pode estar vazio')
  .max(500, 'Texto muito longo')
  .transform(val => val.trim())

const optionalStringSchema = z.string()
  .max(500, 'Texto muito longo')
  .optional()
  .transform(val => val ? val.trim() : undefined)

// Schema para validação de horário de refeição
const mealTimeSchema = z.object({
  hours: z.number().int().min(0).max(23),
  minutes: z.number().int().min(0).max(59)
}).transform(({ hours, minutes }) =>
  `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
)

// Funções de sanitização
export const sanitizeInput = {
  text: (input: string): string => {
    return input
      .trim()
      .replace(/\s+/g, ' ') // Remove espaços múltiplos
      .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
  },

  number: (input: number): number => {
    return Math.max(0, Math.min(10000, input))
  },

  time: (input: string): string => {
    const timeMatch = input.match(/(\d{1,2}):(\d{2})/)
    if (timeMatch) {
      const hours = Math.min(23, Math.max(0, parseInt(timeMatch[1])))
      const minutes = Math.min(59, Math.max(0, parseInt(timeMatch[2])))
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
    return '12:00' // Valor padrão
  },

  date: (input: string): string => {
    const date = new Date(input)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
    return new Date().toISOString().split('T')[0] // Data atual como padrão
  }
}

// Schema para Meal Plans
export const mealPlanSchema = z.object({
  name: nonEmptyStringSchema,
  description: optionalStringSchema,
  duration: z.number()
    .int('Duração deve ser um número inteiro')
    .min(1, 'Duração mínima de 1 dia')
    .max(365, 'Duração máxima de 365 dias'),
  startDate: dateSchema,
  meals: z.array(z.object({
    type: z.enum(['café da manhã', 'almoço', 'jantar', 'lanche', 'sobremesa'], {
      errorMap: () => ({ message: 'Tipo de refeição inválido' })
    }),
    name: nonEmptyStringSchema,
    description: optionalStringSchema,
    calories: positiveNumberSchema.optional(),
    protein: positiveNumberSchema.optional(),
    carbs: positiveNumberSchema.optional(),
    fat: positiveNumberSchema.optional(),
    fiber: positiveNumberSchema.optional(),
    time: timeSchema
  })).optional(),
  goals: z.array(z.string()).optional(),
  isActive: z.boolean().default(true)
})

// Schema para Meal Records (registros diários)
export const mealRecordSchema = z.object({
  mealPlanId: z.string({
    required_error: 'ID do plano de refeição é obrigatório'
  }).uuid('ID inválido'),
  date: dateSchema,
  mealType: z.enum(['café da manhã', 'almoço', 'jantar', 'lanche', 'sobremesa'], {
    errorMap: () => ({ message: 'Tipo de refeição inválido' })
  }),
  name: nonEmptyStringSchema,
  description: optionalStringSchema,
  calories: positiveNumberSchema.optional(),
  protein: positiveNumberSchema.optional(),
  carbs: positiveNumberSchema.optional(),
  fat: positiveNumberSchema.optional(),
  fiber: positiveNumberSchema.optional(),
  time: timeSchema.default('12:00'),
  notes: optionalStringSchema,
  isCompleted: z.boolean().default(false)
})

// Schema para Hidratação
export const hydrationRecordSchema = z.object({
  date: dateSchema,
  amount: positiveNumberSchema,
  time: timeSchema.default(new Date().toTimeString().slice(0, 5)),
  notes: optionalStringSchema
})

// Schema para Meta de Hidratação
export const hydrationGoalSchema = z.object({
  dailyGoal: z.number()
    .int('Meta diária deve ser um número inteiro')
    .min(500, 'Meta mínima de 500ml')
    .max(5000, 'Meta máxima de 5000ml'),
  startDate: dateSchema
})

// Schema simplificado para registro por copos
export const hydrationGlassesSchema = z.object({
  date: dateSchema,
  glassesCount: z.number()
    .int('Número de copos deve ser inteiro')
    .min(1, 'Mínimo de 1 copo')
    .max(40, 'Máximo de 40 copos'),
  time: timeSchema.default(new Date().toTimeString().slice(0, 5)),
  notes: optionalStringSchema
}).transform((data) => ({
  ...data,
  amount: data.glassesCount * 250 // Converte copos para ml
}))

// Schema para busca e filtros
export const mealFilterSchema = z.object({
  date: dateSchema.optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  mealType: z.enum(['café da manhã', 'almoço', 'jantar', 'lanche', 'sobremesa']).optional(),
  search: z.string().max(100, 'Termo de busca muito longo').optional(),
  isCompleted: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
})

// Schema para atualização parcial
export const updateMealRecordSchema = mealRecordSchema.partial().extend({
  id: z.string().uuid('ID inválido').required('ID é obrigatório para atualização')
})

export const updateMealPlanSchema = mealPlanSchema.partial().extend({
  id: z.string().uuid('ID inválido').required('ID é obrigatório para atualização')
})

export const updateHydrationGoalSchema = hydrationGoalSchema.partial().extend({
  id: z.string().uuid('ID inválido').optional() // ID opcional para criar ou atualizar
})

// Schema para deleção
export const deleteMealRecordSchema = z.object({
  id: z.string().uuid('ID inválido').required('ID é obrigatório para deleção')
})

export const deleteMealPlanSchema = z.object({
  id: z.string().uuid('ID inválido').required('ID é obrigatório para deleção')
})

export const deleteHydrationRecordSchema = z.object({
  id: z.string().uuid('ID inválido').required('ID é obrigatório para deleção')
})

// Validadores compostos
export const validateMealTime = (time: string): string => {
  try {
    return timeSchema.parse(time)
  } catch (error) {
    throw new Error('Horário inválido. Use o formato HH:MM (ex: 14:30)')
  }
}

export const validateMealDate = (date: string): string => {
  try {
    return dateSchema.parse(date)
  } catch (error) {
    throw new Error('Data inválida. Use o formato YYYY-MM-DD (ex: 2024-01-15)')
  }
}

export const validateNutritionalValues = (values: {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
  fiber?: number
}) => {
  const result = {
    calories: values.calories ? positiveNumberSchema.parse(values.calories) : undefined,
    protein: values.protein ? positiveNumberSchema.parse(values.protein) : undefined,
    carbs: values.carbs ? positiveNumberSchema.parse(values.carbs) : undefined,
    fat: values.fat ? positiveNumberSchema.parse(values.fat) : undefined,
    fiber: values.fiber ? positiveNumberSchema.parse(values.fiber) : undefined
  }

  // Validação adicional: total de calorias não pode ser muito baixo se houver macros
  if (result.calories && result.calories < 50) {
    throw new Error('Calorias totais devem ser pelo menos 50 para uma refeição')
  }

  // Validação de proporções (opcional)
  const totalMacros = (result.protein || 0) + (result.carbs || 0) + (result.fat || 0)
  if (totalMacros > 0 && result.calories && result.calories < totalMacros * 2) {
    throw new Error('Valores nutricionais inconsistentes com o total de calorias')
  }

  return result
}

// Exportar tipos derivados dos schemas
export type MealPlanInput = z.infer<typeof mealPlanSchema>
export type MealRecordInput = z.infer<typeof mealRecordSchema>
export type HydrationRecordInput = z.infer<typeof hydrationRecordSchema>
export type HydrationGoalInput = z.infer<typeof hydrationGoalSchema>
export type HydrationGlassesInput = z.infer<typeof hydrationGlassesSchema>
export type MealFilterInput = z.infer<typeof mealFilterSchema>
export type UpdateMealRecordInput = z.infer<typeof updateMealRecordSchema>
export type UpdateMealPlanInput = z.infer<typeof updateMealPlanSchema>
export type UpdateHydrationGoalInput = z.infer<typeof updateHydrationGoalSchema>

// Funções de utilidade para validação em runtime
export const alimentacaoValidators = {
  mealPlan: (data: unknown) => mealPlanSchema.parse(data),
  mealRecord: (data: unknown) => mealRecordSchema.parse(data),
  hydrationRecord: (data: unknown) => hydrationRecordSchema.parse(data),
  hydrationGoal: (data: unknown) => hydrationGoalSchema.parse(data),
  hydrationGlasses: (data: unknown) => hydrationGlassesSchema.parse(data),
  mealFilter: (data: unknown) => mealFilterSchema.parse(data),
  updateMealRecord: (data: unknown) => updateMealRecordSchema.parse(data),
  updateMealPlan: (data: unknown) => updateMealPlanSchema.parse(data),
  updateHydrationGoal: (data: unknown) => updateHydrationGoalSchema.parse(data),
  deleteMealRecord: (data: unknown) => deleteMealRecordSchema.parse(data),
  deleteMealPlan: (data: unknown) => deleteMealPlanSchema.parse(data),
  deleteHydrationRecord: (data: unknown) => deleteHydrationRecordSchema.parse(data)
}

// Validação segura com erro customizado
export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  errorMessage = 'Validação falhou'
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors[0]?.message || errorMessage
      return { success: false, error: message }
    }
    return { success: false, error: errorMessage }
  }
}