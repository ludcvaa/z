'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Utensils,
  AlertCircle,
  Save,
  X
} from 'lucide-react'
import {
  createMealPlanAction,
  updateMealPlanAction,
  deleteMealPlanAction,
  getMealPlansAction,
  getActiveMealPlanAction
} from '@/server-actions/alimentacao/meal-plans'
import type { MealPlan, CreateMealPlanInput, UpdateMealPlanInput } from '@/server-actions/alimentacao/types'

interface MealPlannerProps {
  selectedDate?: Date
  onMealPlanChange?: (mealPlan: MealPlan | null) => void
}

interface MealFormData {
  name: string
  description?: string
  time: string
  calories?: string
  protein?: string
  carbs?: string
  fat?: string
  fiber?: string
}

export default function MealPlanner({ selectedDate, onMealPlanChange }: MealPlannerProps) {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MealPlan | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<MealPlan | null>(null)

  // Form data
  const [planName, setPlanName] = useState('')
  const [planDescription, setPlanDescription] = useState('')
  const [planDuration, setPlanDuration] = useState('7')
  const [planStartDate, setPlanStartDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [meals, setMeals] = useState<MealFormData[]>([
    { name: '', time: '08:00', calories: '', protein: '', carbs: '', fat: '', fiber: '' }
  ])

  // Carregar planos de refeição
  useEffect(() => {
    loadMealPlans()
  }, [])

  // Carregar plano ativo
  useEffect(() => {
    loadActiveMealPlan()
  }, [selectedDate])

  const loadMealPlans = async () => {
    try {
      setIsLoading(true)
      const result = await getMealPlansAction()
      if (result.success && result.data) {
        setMealPlans(result.data)
      }
    } catch (error) {
      setError('Erro ao carregar planos de refeição')
    } finally {
      setIsLoading(false)
    }
  }

  const loadActiveMealPlan = async () => {
    try {
      const result = await getActiveMealPlanAction()
      if (result.success && result.data) {
        setActivePlan(result.data)
        if (onMealPlanChange) {
          onMealPlanChange(result.data)
        }
      } else {
        setActivePlan(null)
        if (onMealPlanChange) {
          onMealPlanChange(null)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar plano ativo:', error)
    }
  }

  const addMeal = () => {
    setMeals([...meals, { name: '', time: '12:00', calories: '', protein: '', carbs: '', fat: '', fiber: '' }])
  }

  const removeMeal = (index: number) => {
    if (meals.length > 1) {
      setMeals(meals.filter((_, i) => i !== index))
    }
  }

  const updateMeal = (index: number, field: keyof MealFormData, value: string) => {
    const updatedMeals = [...meals]
    updatedMeals[index] = { ...updatedMeals[index], [field]: value }
    setMeals(updatedMeals)
  }

  const handleSubmit = async () => {
    if (!planName.trim()) {
      setError('Nome do plano é obrigatório')
      return
    }

    if (meals.some(meal => !meal.name.trim())) {
      setError('Todas as refeições precisam de um nome')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const mealData = meals.map(meal => ({
        type: getMealTypeByTime(meal.time),
        name: meal.name,
        description: meal.description,
        time: meal.time,
        calories: meal.calories ? parseInt(meal.calories) : undefined,
        protein: meal.protein ? parseFloat(meal.protein) : undefined,
        carbs: meal.carbs ? parseFloat(meal.carbs) : undefined,
        fat: meal.fat ? parseFloat(meal.fat) : undefined,
        fiber: meal.fiber ? parseFloat(meal.fiber) : undefined,
      }))

      const planData: CreateMealPlanInput = {
        name: planName,
        description: planDescription || undefined,
        duration: parseInt(planDuration),
        startDate: planStartDate,
        meals: mealData,
        isActive: true,
      }

      let result
      if (editingPlan) {
        const updateData: UpdateMealPlanInput = {
          id: editingPlan.id,
          ...planData,
        }
        result = await updateMealPlanAction(updateData)
      } else {
        result = await createMealPlanAction(planData)
      }

      if (result.success) {
        await loadMealPlans()
        await loadActiveMealPlan()
        resetForm()
        setIsDialogOpen(false)
        setEditingPlan(null)
      } else {
        setError(result.message || 'Erro ao salvar plano de refeição')
      }
    } catch (error) {
      setError('Erro ao salvar plano de refeição')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (plan: MealPlan) => {
    setEditingPlan(plan)
    setPlanName(plan.name)
    setPlanDescription(plan.description || '')
    setPlanDuration(plan.duration.toString())
    setPlanStartDate(plan.start_date)

    const mealFormData: MealFormData[] = plan.meals.map(meal => ({
      name: meal.name,
      description: meal.description,
      time: meal.time,
      calories: meal.calories?.toString() || '',
      protein: meal.protein?.toString() || '',
      carbs: meal.carbs?.toString() || '',
      fat: meal.fat?.toString() || '',
      fiber: meal.fiber?.toString() || '',
    }))

    setMeals(mealFormData.length > 0 ? mealFormData : [{ name: '', time: '08:00', calories: '', protein: '', carbs: '', fat: '', fiber: '' }])
    setIsDialogOpen(true)
  }

  const handleDelete = async (plan: MealPlan) => {
    try {
      const result = await deleteMealPlanAction({ id: plan.id })
      if (result.success) {
        await loadMealPlans()
        await loadActiveMealPlan()
        setDeleteConfirm(null)
      } else {
        setError(result.message || 'Erro ao deletar plano de refeição')
      }
    } catch (error) {
      setError('Erro ao deletar plano de refeição')
    }
  }

  const resetForm = () => {
    setPlanName('')
    setPlanDescription('')
    setPlanDuration('7')
    setPlanStartDate(format(new Date(), 'yyyy-MM-dd'))
    setMeals([{ name: '', time: '08:00', calories: '', protein: '', carbs: '', fat: '', fiber: '' }])
    setError(null)
  }

  const getMealTypeByTime = (time: string) => {
    const hour = parseInt(time.split(':')[0])
    if (hour < 10) return 'cafe'
    if (hour < 14) return 'almoco'
    if (hour < 18) return 'lanche'
    return 'jantar'
  }

  const getMealTypeLabel = (type: string) => {
    switch (type) {
      case 'cafe': return 'Café da Manhã'
      case 'almoco': return 'Almoço'
      case 'jantar': return 'Jantar'
      case 'lanche': return 'Lanche'
      default: return 'Refeição'
    }
  }

  const getMealTypeColor = (type: string) => {
    switch (type) {
      case 'cafe': return 'bg-blue-100 text-blue-800'
      case 'almoco': return 'bg-green-100 text-green-800'
      case 'jantar': return 'bg-purple-100 text-purple-800'
      case 'lanche': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const sortedPlans = [...mealPlans].sort((a, b) => {
    const aMeals = a.meals.map(m => m.time).sort()
    const bMeals = b.meals.map(m => m.time).sort()
    return aMeals[0]?.localeCompare(bMeals[0]) || 0
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Planejador de Refeições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Planejador de Refeições
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm()
                setEditingPlan(null)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPlan ? 'Editar Plano de Refeições' : 'Criar Novo Plano de Refeições'}
                </DialogTitle>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="planName">Nome do Plano</Label>
                    <Input
                      id="planName"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      placeholder="Ex: Plano Emagrecimento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planDuration">Duração (dias)</Label>
                    <Input
                      id="planDuration"
                      type="number"
                      min="1"
                      max="365"
                      value={planDuration}
                      onChange={(e) => setPlanDuration(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="planDescription">Descrição (opcional)</Label>
                  <Input
                    id="planDescription"
                    value={planDescription}
                    onChange={(e) => setPlanDescription(e.target.value)}
                    placeholder="Descrição do plano..."
                  />
                </div>

                <div>
                  <Label htmlFor="planStartDate">Data de Início</Label>
                  <Input
                    id="planStartDate"
                    type="date"
                    value={planStartDate}
                    onChange={(e) => setPlanStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Refeições</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMeal}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Refeição
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {meals.map((meal, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Refeição {index + 1}</span>
                          {meals.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeMeal(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`mealName-${index}`}>Nome</Label>
                            <Input
                              id={`mealName-${index}`}
                              value={meal.name}
                              onChange={(e) => updateMeal(index, 'name', e.target.value)}
                              placeholder="Ex: Aveia com frutas"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`mealTime-${index}`}>Horário</Label>
                            <Input
                              id={`mealTime-${index}`}
                              type="time"
                              value={meal.time}
                              onChange={(e) => updateMeal(index, 'time', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          <div>
                            <Label htmlFor={`mealCalories-${index}`}>Cal</Label>
                            <Input
                              id={`mealCalories-${index}`}
                              type="number"
                              value={meal.calories}
                              onChange={(e) => updateMeal(index, 'calories', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`mealProtein-${index}`}>Prot</Label>
                            <Input
                              id={`mealProtein-${index}`}
                              type="number"
                              step="0.1"
                              value={meal.protein}
                              onChange={(e) => updateMeal(index, 'protein', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`mealCarbs-${index}`}>Carb</Label>
                            <Input
                              id={`mealCarbs-${index}`}
                              type="number"
                              step="0.1"
                              value={meal.carbs}
                              onChange={(e) => updateMeal(index, 'carbs', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`mealFat-${index}`}>Gord</Label>
                            <Input
                              id={`mealFat-${index}`}
                              type="number"
                              step="0.1"
                              value={meal.fat}
                              onChange={(e) => updateMeal(index, 'fat', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`mealFiber-${index}`}>Fibr</Label>
                            <Input
                              id={`mealFiber-${index}`}
                              type="number"
                              step="0.1"
                              value={meal.fiber}
                              onChange={(e) => updateMeal(index, 'fiber', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingPlan ? 'Atualizar' : 'Criar'} Plano
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {activePlan && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800">Plano Ativo</h3>
                <p className="text-green-700">{activePlan.name}</p>
                <p className="text-sm text-green-600">
                  {format(new Date(activePlan.start_date), "dd 'de' MMMM", { locale: ptBR })} -
                  {format(new Date(activePlan.end_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Ativo
              </Badge>
            </div>
          </div>
        )}

        {sortedPlans.length === 0 ? (
          <div className="text-center py-8">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum plano de refeição
            </h3>
            <p className="text-gray-500 mb-4">
              Crie seu primeiro plano de refeições para começar a acompanhar sua alimentação
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Plano
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPlans.map((plan) => (
              <Card key={plan.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      {plan.description && (
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {format(new Date(plan.start_date), "dd 'de' MMMM", { locale: ptBR })} -
                        {format(new Date(plan.end_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        {' • '} {plan.duration} dias
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan.is_active && (
                        <Badge className="bg-green-100 text-green-800">
                          Ativo
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteConfirm(plan)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.meals
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((meal, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{meal.time}</span>
                          <Badge className={getMealTypeColor(meal.type)}>
                            {getMealTypeLabel(meal.type)}
                          </Badge>
                          <span>{meal.name}</span>
                          {meal.calories && (
                            <span className="text-gray-500">({meal.calories} kcal)</span>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              Tem certeza que deseja excluir o plano de refeição "{deleteConfirm?.name}"?
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}