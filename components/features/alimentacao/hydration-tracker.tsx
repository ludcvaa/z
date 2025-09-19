'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Glass, Plus, Minus, History, Settings, Droplets } from 'lucide-react'
import { toast } from 'sonner'
import {
  addWaterIntakeAction,
  getWaterIntakeByDateAction,
  getWaterIntakeByDateRangeAction,
  getHydrationGoalAction,
  updateHydrationGoalAction,
  getDailyWaterSummaryAction,
  deleteWaterIntakeAction
} from '@/server-actions/alimentacao/hydration'

interface WaterIntake {
  id: string
  amount: number
  date: string
  time: string
  notes?: string
}

interface HydrationGoal {
  id: string
  daily_goal: number
  start_date: string
}

interface DailySummary {
  totalAmount: number
  goalAmount?: number
  percentage: number
  intakeCount: number
}

interface HydrationTrackerProps {
  selectedDate?: string
  className?: string
}

export default function HydrationTracker({ selectedDate, className = '' }: HydrationTrackerProps) {
  const [waterIntakes, setWaterIntakes] = useState<WaterIntake[]>([])
  const [dailyGoal, setDailyGoal] = useState<number>(2000)
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [customGoal, setCustomGoal] = useState<string>('')
  const [customAmount, setCustomAmount] = useState<string>('250')
  const [notes, setNotes] = useState<string>('')
  const [historyData, setHistoryData] = useState<WaterIntake[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const today = selectedDate || format(new Date(), 'yyyy-MM-dd')

  useEffect(() => {
    loadData()
  }, [today])

  const loadData = async () => {
    try {
      setIsLoading(true)

      const [intakesResult, goalResult, summaryResult] = await Promise.all([
        getWaterIntakeByDateAction(today),
        getHydrationGoalAction(),
        getDailyWaterSummaryAction(today)
      ])

      if (intakesResult && intakesResult[0]?.success) {
        setWaterIntakes(intakesResult.map(item => item.data).filter(Boolean))
      }

      if (goalResult?.success && goalResult.data) {
        setDailyGoal(goalResult.data.daily_goal)
        setCustomGoal(goalResult.data.daily_goal.toString())
      }

      if (summaryResult?.success && summaryResult.data) {
        setDailySummary(summaryResult.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados de hidratação:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setIsLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)

      const result = await getWaterIntakeByDateRangeAction(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      )

      if (result && result[0]?.success) {
        setHistoryData(result.map(item => item.data).filter(Boolean))
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
      toast.error('Erro ao carregar histórico')
    }
  }

  const addWaterIntake = async (amount: number) => {
    try {
      const result = await addWaterIntakeAction({
        amount,
        date: today,
        time: format(new Date(), 'HH:mm'),
        notes: notes.trim() || undefined
      })

      if (result.success) {
        toast.success(`${amount}ml de água adicionados!`)
        setNotes('')
        await loadData()
      } else {
        toast.error(result.message || 'Erro ao adicionar água')
      }
    } catch (error) {
      console.error('Erro ao adicionar água:', error)
      toast.error('Erro ao adicionar água')
    }
  }

  const removeWaterIntake = async (id: string) => {
    try {
      const result = await deleteWaterIntakeAction(id)

      if (result.success) {
        toast.success('Registro removido com sucesso!')
        await loadData()
      } else {
        toast.error(result.message || 'Erro ao remover registro')
      }
    } catch (error) {
      console.error('Erro ao remover registro:', error)
      toast.error('Erro ao remover registro')
    }
  }

  const updateGoal = async () => {
    try {
      const goal = parseInt(customGoal)
      if (isNaN(goal) || goal < 500 || goal > 5000) {
        toast.error('Meta deve estar entre 500ml e 5000ml')
        return
      }

      const result = await updateHydrationGoalAction({
        dailyGoal: goal,
        startDate: today
      })

      if (result.success) {
        toast.success('Meta atualizada com sucesso!')
        setDailyGoal(goal)
        setIsGoalDialogOpen(false)
        await loadData()
      } else {
        toast.error(result.message || 'Erro ao atualizar meta')
      }
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
      toast.error('Erro ao atualizar meta')
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500'
    if (percentage >= 75) return 'bg-blue-500'
    if (percentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getDailyTotal = () => {
    return waterIntakes.reduce((sum, intake) => sum + intake.amount, 0)
  }

  const getProgressPercentage = () => {
    const total = getDailyTotal()
    return Math.min((total / dailyGoal) * 100, 100)
  }

  const getCupsCount = () => {
    return Math.round(getDailyTotal() / 250)
  }

  const getGoalCups = () => {
    return Math.round(dailyGoal / 250)
  }

  const handleHistoryToggle = async () => {
    if (!showHistory) {
      await loadHistory()
    }
    setShowHistory(!showHistory)
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

  const progressPercentage = getProgressPercentage()
  const dailyTotal = getDailyTotal()
  const cupsCount = getCupsCount()
  const goalCups = getGoalCups()

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Hidratação
          <Badge variant="secondary" className="ml-auto">
            {cupsCount}/{goalCups} copos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="history" onClick={handleHistoryToggle}>
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {dailyTotal}ml
              </div>
              <div className="text-sm text-gray-600">
                Meta: {dailyGoal}ml
              </div>
              <Progress
                value={progressPercentage}
                className="h-3"
              />
              <div className="text-sm font-medium">
                {progressPercentage.toFixed(0)}% da meta diária
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={() => addWaterIntake(250)}
                className="flex items-center gap-2"
              >
                <Glass className="h-4 w-4" />
                +1 copo
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => addWaterIntake(500)}
                className="flex items-center gap-2"
              >
                <Glass className="h-4 w-4" />
                +2 copos
              </Button>
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Quantidade (ml)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min="50"
                max="1000"
              />
              <Input
                placeholder="Observações"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  const amount = parseInt(customAmount)
                  if (amount && amount > 0) {
                    addWaterIntake(amount)
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Definir Meta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Meta Diária de Água</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal">Meta (ml)</Label>
                    <Input
                      id="goal"
                      type="number"
                      value={customGoal}
                      onChange={(e) => setCustomGoal(e.target.value)}
                      min="500"
                      max="5000"
                    />
                    <div className="text-sm text-gray-600 mt-1">
                      Recomendado: 2000ml (8 copos de 250ml)
                    </div>
                  </div>
                  <Button onClick={updateGoal} className="w-full">
                    Salvar Meta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {waterIntakes.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Registros de hoje:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {waterIntakes.map((intake) => (
                    <div
                      key={intake.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <div>
                        <span className="font-medium">{intake.amount}ml</span>
                        <span className="text-gray-600 ml-2">{intake.time}</span>
                        {intake.notes && (
                          <div className="text-gray-500 text-xs">{intake.notes}</div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWaterIntake(intake.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {showHistory && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Últimos 7 dias:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {historyData.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      Nenhum registro encontrado
                    </div>
                  ) : (
                    historyData
                      .reduce((acc, intake) => {
                        const date = intake.date
                        const existing = acc.find(item => item.date === date)
                        if (existing) {
                          existing.total += intake.amount
                          existing.count++
                        } else {
                          acc.push({
                            date,
                            total: intake.amount,
                            count: 1,
                            intakes: [intake]
                          })
                        }
                        return acc
                      }, [] as any[])
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((day) => (
                        <div key={day.date} className="p-3 bg-gray-50 rounded">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">
                                {format(new Date(day.date), 'dd/MM', { locale: ptBR })}
                              </div>
                              <div className="text-sm text-gray-600">
                                {day.total}ml • {day.count} registros
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                {Math.round((day.total / dailyGoal) * 100)}%
                              </div>
                              <Progress
                                value={Math.min((day.total / dailyGoal) * 100, 100)}
                                className="h-2 w-16"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}