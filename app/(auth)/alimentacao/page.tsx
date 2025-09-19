'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { format, addDays, subDays, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Plus, Utensils, Droplets, Apple, Coffee } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface MealEntry {
  id: string
  type: 'cafe' | 'almoco' | 'jantar' | 'lanche'
  name: string
  description?: string
  calories?: number
  time: string
}

interface NutritionData {
  date: string
  meals: MealEntry[]
  water: number
  summary: {
    totalCalories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

function AlimentacaoContent() {
  const searchParams = useSearchParams()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const dateParam = searchParams.get('data')
    if (dateParam) {
      try {
        const parsedDate = parseISO(dateParam)
        setSelectedDate(parsedDate)
      } catch (error) {
        console.error('Invalid date format in query parameter')
      }
    }
    loadNutritionData()
  }, [searchParams])

  const loadNutritionData = async () => {
    setIsLoading(true)
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      const response = await fetch(`/api/nutrition?data=${dateStr}`)
      if (response.ok) {
        const data = await response.json()
        setNutritionData(data)
      } else {
        setNutritionData(null)
      }
    } catch (error) {
      console.error('Error loading nutrition data:', error)
      setNutritionData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const changeDate = (direction: 'prev' | 'next') => {
    const newDate = direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1)
    setSelectedDate(newDate)
    const url = new URL(window.location.href)
    url.searchParams.set('data', format(newDate, 'yyyy-MM-dd'))
    window.history.pushState({}, '', url)
    loadNutritionData()
  }

  const goToToday = () => {
    setSelectedDate(new Date())
    const url = new URL(window.location.href)
    url.searchParams.set('data', format(new Date(), 'yyyy-MM-dd'))
    window.history.pushState({}, '', url)
    loadNutritionData()
  }

  const getMealIcon = (type: MealEntry['type']) => {
    switch (type) {
      case 'cafe':
        return <Coffee className="h-4 w-4" />
      case 'almoco':
        return <Utensils className="h-4 w-4" />
      case 'jantar':
        return <Apple className="h-4 w-4" />
      case 'lanche':
        return <Droplets className="h-4 w-4" />
      default:
        return <Utensils className="h-4 w-4" />
    }
  }

  const getMealLabel = (type: MealEntry['type']) => {
    switch (type) {
      case 'cafe':
        return 'Café da Manhã'
      case 'almoco':
        return 'Almoço'
      case 'jantar':
        return 'Jantar'
      case 'lanche':
        return 'Lanche'
      default:
        return 'Refeição'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Acompanhamento Nutricional</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Acompanhamento Nutricional</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Refeição
        </Button>
      </div>

      <div className="flex items-center justify-center space-x-4 bg-muted/50 p-4 rounded-lg">
        <Button variant="outline" size="sm" onClick={() => changeDate('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-center">
          <div className="text-lg font-semibold">
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={goToToday}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            Hoje
          </Button>
        </div>

        <Button variant="outline" size="sm" onClick={() => changeDate('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Refeições</h2>

          {nutritionData?.meals && nutritionData.meals.length > 0 ? (
            nutritionData.meals.map((meal) => (
              <Card key={meal.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getMealIcon(meal.type)}
                      <CardTitle className="text-lg">{getMealLabel(meal.type)}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      {meal.calories && (
                        <Badge variant="secondary">{meal.calories} kcal</Badge>
                      )}
                      <span className="text-sm text-muted-foreground">{meal.time}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium">{meal.name}</h4>
                    {meal.description && (
                      <p className="text-sm text-muted-foreground mt-1">{meal.description}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma refeição registrada hoje</p>
                <Button className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar primeira refeição
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Resumo do Dia</h2>

          {nutritionData?.summary ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5" />
                    <span>Água</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {nutritionData.water}ml
                    </div>
                    <p className="text-sm text-muted-foreground">Meta: 2000ml</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((nutritionData.water / 2000) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Macronutrientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Calorias</span>
                      <span className="font-semibold">{nutritionData.summary.totalCalories} kcal</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Proteínas</span>
                      <span className="font-semibold">{nutritionData.summary.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Carboidratos</span>
                      <span className="font-semibold">{nutritionData.summary.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Gorduras</span>
                      <span className="font-semibold">{nutritionData.summary.fat}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fibras</span>
                      <span className="font-semibold">{nutritionData.summary.fiber}g</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Adicione refeições para ver o resumo nutricional</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AlimentacaoPage() {
  return (
    <ProtectedRoute>
      <AlimentacaoContent />
    </ProtectedRoute>
  )
}