'use client'

import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import DateNavigator, { type ViewMode, type DateRange } from '@/components/shared/date-navigator'
import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Utensils,
  Search,
  Filter,
  AlertCircle,
  Save,
  X,
  Calendar,
  Zap,
  Apple,
  Coffee,
  Sandwich
} from 'lucide-react'
import {
  createMealRecordAction,
  updateMealRecordAction,
  deleteMealRecordAction,
  getMealRecordsAction,
  getMealRecordsByDateRangeAction
} from '@/server-actions/alimentacao/meal-records'
import { getActiveMealPlanAction } from '@/server-actions/alimentacao/meal-plans'
import type { MealRecord, MealPlan, CreateMealRecordInput, UpdateMealRecordInput } from '@/server-actions/alimentacao/types'

interface MealRecordsProps {
  className?: string
}

const MEAL_TYPES = [
  { value: 'cafe', label: 'Café da Manhã', icon: Coffee, color: 'bg-blue-100 text-blue-800' },
  { value: 'almoco', label: 'Almoço', icon: Utensils, color: 'bg-green-100 text-green-800' },
  { value: 'jantar', label: 'Jantar', icon: Sandwich, color: 'bg-purple-100 text-purple-800' },
  { value: 'lanche', label: 'Lanche', icon: Apple, color: 'bg-yellow-100 text-yellow-800' }
]

export default function MealRecords({ className = '' }: MealRecordsProps) {
  const [mealRecords, setMealRecords] = useState<MealRecord[]>([])
  const [activePlan, setActivePlan] = useState<MealPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<MealRecord | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<MealRecord | null>(null)

  // Filtros e busca
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: new Date(), end: new Date() })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMealType, setSelectedMealType] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Form data
  const [recordData, setRecordData] = useState({
    mealPlanId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    mealType: 'cafe',
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    time: format(new Date(), 'HH:mm'),
    notes: '',
    isCompleted: true
  })

  // Carregar registros de refeição
  useEffect(() => {
    loadMealRecords()
  }, [selectedDate, viewMode, selectedRange])

  // Carregar plano ativo
  useEffect(() => {
    loadActiveMealPlan()
  }, [])

  // Resetar paginação quando filtros mudam
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedMealType, selectedDate, viewMode, selectedRange])

  const loadMealRecords = async () => {
    try {
      setIsLoading(true)
      setError(null)
      let result

      if (viewMode === 'day') {
        result = await getMealRecordsAction(format(selectedDate, 'yyyy-MM-dd'))
      } else {
        result = await getMealRecordsByDateRangeAction(
          format(selectedRange.start, 'yyyy-MM-dd'),
          format(selectedRange.end, 'yyyy-MM-dd')
        )
      }

      if (result.success && result.data) {
        setMealRecords(result.data)
      } else {
        setMealRecords([])
      }
    } catch (error) {
      setError('Erro ao carregar registros de refeição')
      setMealRecords([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadActiveMealPlan = async () => {
    try {
      const result = await getActiveMealPlanAction()
      if (result.success && result.data) {
        setActivePlan(result.data)
        setRecordData(prev => ({ ...prev, mealPlanId: result.data!.id }))
      }
    } catch (error) {
      console.error('Erro ao carregar plano ativo:', error)
    }
  }

  const handleSubmit = async () => {
    if (!recordData.name.trim()) {
      setError('Nome da refeição é obrigatório')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const mealData: CreateMealRecordInput | UpdateMealRecordInput = {
        ...(editingRecord ? { id: editingRecord.id } : {}),
        mealPlanId: recordData.mealPlanId || undefined,
        date: recordData.date,
        mealType: recordData.mealType as any,
        name: recordData.name,
        description: recordData.description || undefined,
        calories: recordData.calories ? parseInt(recordData.calories) : undefined,
        protein: recordData.protein ? parseFloat(recordData.protein) : undefined,
        carbs: recordData.carbs ? parseFloat(recordData.carbs) : undefined,
        fat: recordData.fat ? parseFloat(recordData.fat) : undefined,
        fiber: recordData.fiber ? parseFloat(recordData.fiber) : undefined,
        time: recordData.time,
        notes: recordData.notes || undefined,
        isCompleted: recordData.isCompleted,
      }

      let result
      if (editingRecord) {
        result = await updateMealRecordAction(mealData as UpdateMealRecordInput)
      } else {
        result = await createMealRecordAction(mealData as CreateMealRecordInput)
      }

      if (result.success) {
        await loadMealRecords()
        resetForm()
        setIsDialogOpen(false)
        setEditingRecord(null)
      } else {
        setError(result.message || 'Erro ao salvar registro de refeição')
      }
    } catch (error) {
      setError('Erro ao salvar registro de refeição')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (record: MealRecord) => {
    setEditingRecord(record)
    setRecordData({
      mealPlanId: record.meal_plan_id,
      date: record.date,
      mealType: record.meal_type,
      name: record.name,
      description: record.description || '',
      calories: record.calories?.toString() || '',
      protein: record.protein?.toString() || '',
      carbs: record.carbs?.toString() || '',
      fat: record.fat?.toString() || '',
      fiber: record.fiber?.toString() || '',
      time: record.time,
      notes: record.notes || '',
      isCompleted: record.is_completed,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (record: MealRecord) => {
    try {
      const result = await deleteMealRecordAction({ id: record.id })
      if (result.success) {
        await loadMealRecords()
        setDeleteConfirm(null)
      } else {
        setError(result.message || 'Erro ao deletar registro de refeição')
      }
    } catch (error) {
      setError('Erro ao deletar registro de refeição')
    }
  }

  const resetForm = () => {
    setRecordData({
      mealPlanId: activePlan?.id || '',
      date: viewMode === 'day' ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
      mealType: 'cafe',
      name: '',
      description: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      time: format(new Date(), 'HH:mm'),
      notes: '',
      isCompleted: true,
    })
    setError(null)
  }

  // Filtrar e paginar registros
  const filteredRecords = useMemo(() => {
    return mealRecords.filter(record => {
      const matchesSearch = searchTerm === '' ||
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMealType = selectedMealType === 'all' || record.meal_type === selectedMealType

      return matchesSearch && matchesMealType
    })
  }, [mealRecords, searchTerm, selectedMealType])

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredRecords.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredRecords, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage)

  const getMealTypeInfo = (type: string) => {
    return MEAL_TYPES.find(meal => meal.value === type) || MEAL_TYPES[0]
  }

  const getTotalNutrition = () => {
    return filteredRecords.reduce((acc, record) => ({
      calories: acc.calories + (record.calories || 0),
      protein: acc.protein + (record.protein || 0),
      carbs: acc.carbs + (record.carbs || 0),
      fat: acc.fat + (record.fat || 0),
      fiber: acc.fiber + (record.fiber || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 })
  }

  const totalNutrition = getTotalNutrition()

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Registro de Refeições
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
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
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Registro de Refeições
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                resetForm()
                setEditingRecord(null)
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingRecord ? 'Editar Registro de Refeição' : 'Novo Registro de Refeição'}
                </DialogTitle>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recordDate">Data</Label>
                    <Input
                      id="recordDate"
                      type="date"
                      value={recordData.date}
                      onChange={(e) => setRecordData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="recordTime">Horário</Label>
                    <Input
                      id="recordTime"
                      type="time"
                      value={recordData.time}
                      onChange={(e) => setRecordData(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                </div>

                {activePlan && (
                  <div>
                    <Label htmlFor="mealPlan">Plano de Refeições</Label>
                    <Select value={recordData.mealPlanId} onValueChange={(value) => setRecordData(prev => ({ ...prev, mealPlanId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={activePlan.id}>{activePlan.name}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="mealType">Tipo de Refeição</Label>
                  <Select value={recordData.mealType} onValueChange={(value) => setRecordData(prev => ({ ...prev, mealType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEAL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="mealName">Nome da Refeição</Label>
                  <Input
                    id="mealName"
                    value={recordData.name}
                    onChange={(e) => setRecordData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Salada com grelhado"
                  />
                </div>

                <div>
                  <Label htmlFor="mealDescription">Descrição (opcional)</Label>
                  <Input
                    id="mealDescription"
                    value={recordData.description}
                    onChange={(e) => setRecordData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrição da refeição..."
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  <div>
                    <Label htmlFor="calories">Calorias</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={recordData.calories}
                      onChange={(e) => setRecordData(prev => ({ ...prev, calories: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Proteínas (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      step="0.1"
                      value={recordData.protein}
                      onChange={(e) => setRecordData(prev => ({ ...prev, protein: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carboidratos (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      step="0.1"
                      value={recordData.carbs}
                      onChange={(e) => setRecordData(prev => ({ ...prev, carbs: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Gorduras (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      step="0.1"
                      value={recordData.fat}
                      onChange={(e) => setRecordData(prev => ({ ...prev, fat: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fiber">Fibras (g)</Label>
                    <Input
                      id="fiber"
                      type="number"
                      step="0.1"
                      value={recordData.fiber}
                      onChange={(e) => setRecordData(prev => ({ ...prev, fiber: e.target.value }))}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Anotações (opcional)</Label>
                  <Input
                    id="notes"
                    value={recordData.notes}
                    onChange={(e) => setRecordData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Anotações sobre a refeição..."
                  />
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
                        {editingRecord ? 'Atualizar' : 'Criar'} Registro
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Navegador de datas */}
        <DateNavigator
          selectedDate={selectedDate}
          selectedRange={selectedRange}
          viewMode={viewMode}
          onDateChange={(date) => {
            setSelectedDate(date)
            setSelectedRange({ start: date, end: date })
          }}
          onRangeChange={(range) => {
            setSelectedRange(range)
            setViewMode('custom')
          }}
          onViewModeChange={setViewMode}
          showSearch={true}
          showFilter={true}
        />

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={selectedMealType} onValueChange={setSelectedMealType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {MEAL_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {searchTerm}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Badge variant="outline">
            {filteredRecords.length} registro{filteredRecords.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Resumo nutricional */}
        {filteredRecords.length > 0 && (
          <Card className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Resumo Nutricional
                </h3>
                <span className="text-sm text-muted-foreground">
                  {filteredRecords.length} refeição{filteredRecords.length !== 1 ? 'ões' : ''}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <div className="font-medium">{totalNutrition.calories}</div>
                  <div className="text-muted-foreground">Calorias</div>
                </div>
                <div>
                  <div className="font-medium">{totalNutrition.protein.toFixed(1)}g</div>
                  <div className="text-muted-foreground">Proteínas</div>
                </div>
                <div>
                  <div className="font-medium">{totalNutrition.carbs.toFixed(1)}g</div>
                  <div className="text-muted-foreground">Carboidratos</div>
                </div>
                <div>
                  <div className="font-medium">{totalNutrition.fat.toFixed(1)}g</div>
                  <div className="text-muted-foreground">Gorduras</div>
                </div>
                <div>
                  <div className="font-medium">{totalNutrition.fiber.toFixed(1)}g</div>
                  <div className="text-muted-foreground">Fibras</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de registros */}
        {paginatedRecords.length === 0 ? (
          <div className="text-center py-8">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || selectedMealType !== 'all' ? 'Nenhum registro encontrado' : 'Nenhum registro de refeição'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedMealType !== 'all'
                ? 'Tente ajustar seus filtros ou termos de busca'
                : 'Comece a registrar suas refeições para acompanhar sua alimentação'
              }
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primeira Refeição
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedRecords.map((record) => {
              const mealTypeInfo = getMealTypeInfo(record.meal_type)
              const MealIcon = mealTypeInfo.icon

              return (
                <Card key={record.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MealIcon className="h-5 w-5 text-gray-600" />
                          <div className="flex items-center gap-2">
                            <Badge className={mealTypeInfo.color}>
                              {mealTypeInfo.label}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(record.date), "dd/MM/yyyy")} • {record.time}
                            </span>
                            {record.is_completed && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Concluída
                              </Badge>
                            )}
                          </div>
                        </div>

                        <h3 className="font-semibold text-lg mb-1">{record.name}</h3>
                        {record.description && (
                          <p className="text-gray-600 mb-2">{record.description}</p>
                        )}

                        {(record.calories || record.protein || record.carbs || record.fat || record.fiber) && (
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            {record.calories && (
                              <span>{record.calories} kcal</span>
                            )}
                            {record.protein && (
                              <span>{record.protein}g prot</span>
                            )}
                            {record.carbs && (
                              <span>{record.carbs}g carb</span>
                            )}
                            {record.fat && (
                              <span>{record.fat}g gord</span>
                            )}
                            {record.fiber && (
                              <span>{record.fiber}g fibra</span>
                            )}
                          </div>
                        )}

                        {record.notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">
                            "{record.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(record)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredRecords.length)} de {filteredRecords.length} registros
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  const isCurrentPage = page === currentPage
                  const isEllipsis = totalPages > 5 && i === 4

                  if (isEllipsis) {
                    return <span key="ellipsis" className="px-2">...</span>
                  }

                  return (
                    <Button
                      key={page}
                      variant={isCurrentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
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
              Tem certeza que deseja excluir o registro "{deleteConfirm?.name}"?
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