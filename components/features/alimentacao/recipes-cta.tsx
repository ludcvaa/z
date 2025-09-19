'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  ChefHat,
  Clock,
  Users,
  Flame,
  TrendingUp,
  Star,
  Plus,
  BookOpen,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface Recipe {
  id: string
  title: string
  description: string
  prep_time: number
  servings: number
  calories: number
  difficulty: 'easy' | 'medium' | 'hard'
  rating: number
  created_at: string
  image_url?: string
  category: string
}

interface RecipeStats {
  total_recipes: number
  recent_recipes: number
  top_category: string
  avg_rating: number
}

interface RecipesCTAProps {
  className?: string
  showPreview?: boolean
  limit?: number
}

export default function RecipesCTA({
  className = '',
  showPreview = true,
  limit = 3
}: RecipesCTAProps) {
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])
  const [recipeStats, setRecipeStats] = useState<RecipeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecipeData()
  }, [])

  const loadRecipeData = async () => {
    try {
      setIsLoading(true)

      // Mock data para demonstração
      // Em produção, buscar de: /api/recipes/recent e /api/recipes/stats

      const mockStats: RecipeStats = {
        total_recipes: 24,
        recent_recipes: 5,
        top_category: 'Saudável',
        avg_rating: 4.3
      }

      const mockRecipes: Recipe[] = [
        {
          id: '1',
          title: 'Salada Quinoa com Legumes',
          description: 'Refeição leve e nutritiva perfeita para o almoço',
          prep_time: 20,
          servings: 2,
          calories: 320,
          difficulty: 'easy',
          rating: 4.5,
          created_at: '2024-01-15T10:30:00Z',
          category: 'Saudável',
          image_url: '/placeholder-recipe.jpg'
        },
        {
          id: '2',
          title: 'Smoothie Energético',
          description: 'Combinação perfeita de frutas e proteína',
          prep_time: 5,
          servings: 1,
          calories: 280,
          difficulty: 'easy',
          rating: 4.8,
          created_at: '2024-01-14T08:15:00Z',
          category: 'Bebidas',
          image_url: '/placeholder-smoothie.jpg'
        },
        {
          id: '3',
          title: 'Frango Grelhado com Ervas',
          description: 'Proteína magra com sabor mediterrâneo',
          prep_time: 30,
          servings: 4,
          calories: 250,
          difficulty: 'medium',
          rating: 4.2,
          created_at: '2024-01-13T19:00:00Z',
          category: 'Proteína',
          image_url: '/placeholder-chicken.jpg'
        }
      ]

      setRecipeStats(mockStats)
      setRecentRecipes(mockRecipes.slice(0, limit))
    } catch (error) {
      console.error('Erro ao carregar dados de receitas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Médio'
      case 'hard': return 'Difícil'
      default: return difficulty
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-500" />
            Receitas Saudáveis
          </div>
          <Badge variant="secondary" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {recipeStats?.total_recipes || 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estatísticas rápidas */}
        {recipeStats && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {recipeStats.total_recipes}
              </div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">
                {recipeStats.recent_recipes}
              </div>
              <div className="text-xs text-gray-600">Novas</div>
            </div>
            <div className="p-2 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">
                {recipeStats.avg_rating.toFixed(1)}
              </div>
              <div className="text-xs text-gray-600">Avaliação</div>
            </div>
          </div>
        )}

        {/* Preview das últimas receitas */}
        {showPreview && recentRecipes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-gray-600">
                Recentes
              </h4>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>

            <div className="space-y-2">
              {recentRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-sm mb-1">
                        {recipe.title}
                      </h5>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {recipe.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {recipe.prep_time}min
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {recipe.servings}p
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {recipe.calories}cal
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}
                        >
                          {getDifficultyText(recipe.difficulty)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {recipe.category}
                        </Badge>
                        <div className="flex items-center gap-1 ml-auto">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs">{recipe.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA principal */}
        <div className="space-y-3 pt-2">
          <Link href="/receitas" className="block">
            <Button className="w-full" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Nova Receita
            </Button>
          </Link>

          <Link href="/receitas" className="block">
            <Button variant="outline" className="w-full">
              Ver Todas as Receitas
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Indicador de progresso */}
        {recipeStats && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Seu progresso este mês</span>
              <span className="font-medium">
                {Math.round((recipeStats.recent_recipes / 10) * 100)}%
              </span>
            </div>
            <Progress value={Math.min((recipeStats.recent_recipes / 10) * 100, 100)} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              Meta: 10 novas receitas este mês
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}