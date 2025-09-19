'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database
} from 'lucide-react'
import { toast } from 'sonner'

interface PendingAction {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: 'meal_plan' | 'meal_record' | 'water_intake'
  data: any
  timestamp: number
  retryCount: number
}

interface OfflineSyncProps {
  className?: string
}

export function OfflineSync({ className }: OfflineSyncProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null)

  useEffect(() => {
    // Verificar status online/offline
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Conexão restaurada')
      attemptSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.error('Conexão perdida. Trabalhando offline.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verificar status inicial
    setIsOnline(navigator.onLine)

    // Carregar ações pendentes do localStorage
    loadPendingActions()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const loadPendingActions = () => {
    try {
      const stored = localStorage.getItem('pendingAlimentacaoActions')
      if (stored) {
        const actions = JSON.parse(stored)
        setPendingActions(actions)
      }
    } catch (error) {
      console.error('Erro ao carregar ações pendentes:', error)
    }
  }

  const savePendingActions = (actions: PendingAction[]) => {
    try {
      localStorage.setItem('pendingAlimentacaoActions', JSON.stringify(actions))
    } catch (error) {
      console.error('Erro ao salvar ações pendentes:', error)
    }
  }

  const addPendingAction = (action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>) => {
    const newAction: PendingAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0
    }

    const updatedActions = [...pendingActions, newAction]
    setPendingActions(updatedActions)
    savePendingActions(updatedActions)

    toast.warning('Ação salva localmente. Será sincronizada quando online.')
  }

  const removePendingAction = (id: string) => {
    const updatedActions = pendingActions.filter(action => action.id !== id)
    setPendingActions(updatedActions)
    savePendingActions(updatedActions)
  }

  const attemptSync = async () => {
    if (!isOnline || pendingActions.length === 0 || isSyncing) return

    setIsSyncing(true)
    let completed = 0

    try {
      for (const action of pendingActions) {
        try {
          await executeAction(action)
          removePendingAction(action.id)
          completed++
          setSyncProgress((completed / pendingActions.length) * 100)
        } catch (error) {
          console.error(`Erro ao sincronizar ação ${action.id}:`, error)

          // Incrementar retry count
          const updatedActions = pendingActions.map(a =>
            a.id === action.id
              ? { ...a, retryCount: a.retryCount + 1 }
              : a
          )
          setPendingActions(updatedActions)
          savePendingActions(updatedActions)
        }
      }

      setLastSyncTime(Date.now())
      toast.success('Sincronização concluída!')
    } catch (error) {
      console.error('Erro na sincronização:', error)
      toast.error('Erro na sincronização. Tente novamente.')
    } finally {
      setIsSyncing(false)
      setSyncProgress(0)
    }
  }

  const executeAction = async (action: PendingAction) => {
    // Importar dinamicamente as ações para evitar circular dependencies
    const {
      createMealPlanAction,
      updateMealPlanAction,
      deleteMealPlanAction
    } = await import('@/server-actions/alimentacao/meal-plans')

    const {
      createMealRecordAction,
      updateMealRecordAction,
      deleteMealRecordAction
    } = await import('@/server-actions/alimentacao/meal-records')

    const {
      addWaterIntakeAction,
      updateHydrationGoalAction,
      deleteWaterIntakeAction
    } = await import('@/server-actions/alimentacao/hydration')

    switch (action.entity) {
      case 'meal_plan':
        if (action.type === 'create') {
          await createMealPlanAction(action.data)
        } else if (action.type === 'update') {
          await updateMealPlanAction(action.data)
        } else if (action.type === 'delete') {
          await deleteMealPlanAction(action.data)
        }
        break

      case 'meal_record':
        if (action.type === 'create') {
          await createMealRecordAction(action.data)
        } else if (action.type === 'update') {
          await updateMealRecordAction(action.data)
        } else if (action.type === 'delete') {
          await deleteMealRecordAction(action.data)
        }
        break

      case 'water_intake':
        if (action.type === 'create') {
          await addWaterIntakeAction(action.data)
        } else if (action.type === 'update') {
          await updateHydrationGoalAction(action.data)
        } else if (action.type === 'delete') {
          await deleteWaterIntakeAction(action.data)
        }
        break
    }
  }

  const clearPendingActions = () => {
    setPendingActions([])
    savePendingActions([])
    toast.info('Ações pendentes removidas')
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return 'agora'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min atrás`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h atrás`
    return date.toLocaleDateString()
  }

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'meal_plan': return '📋'
      case 'meal_record': return '🍽️'
      case 'water_intake': return '💧'
      default: return '📝'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Sincronização
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? (
              <Badge variant="default" className="bg-green-500">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="destructive">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            {pendingActions.length > 0 && (
              <Badge variant="secondary">
                {pendingActions.length} pendente(s)
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isOnline && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Você está offline. As alterações serão salvas localmente e sincronizadas quando a conexão for restaurada.
            </AlertDescription>
          </Alert>
        )}

        {lastSyncTime && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Última sincronização
            </div>
            <span>{formatTime(lastSyncTime)}</span>
          </div>
        )}

        {isSyncing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Sincronizando...</span>
              <span>{Math.round(syncProgress)}%</span>
            </div>
            <Progress value={syncProgress} className="h-2" />
          </div>
        )}

        {pendingActions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Ações pendentes</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPendingActions}
                className="h-6 text-xs"
              >
                Limpar
              </Button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {pendingActions.slice(0, 5).map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{getEntityIcon(action.entity)}</span>
                    <span className="capitalize">{action.type}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{formatTime(action.timestamp)}</span>
                  </div>
                  {action.retryCount > 0 && (
                    <Badge variant="destructive" className="h-4 text-xs">
                      {action.retryCount}
                    </Badge>
                  )}
                </div>
              ))}
              {pendingActions.length > 5 && (
                <div className="text-center text-xs text-gray-500 py-1">
                  +{pendingActions.length - 5} mais...
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={attemptSync}
            disabled={!isOnline || pendingActions.length === 0 || isSyncing}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
          </Button>

          {!isOnline && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <Wifi className="h-4 w-4 mr-2" />
              Verificar Conexão
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Hook para gerenciar ações offline
export function useOfflineSync() {
  const addOfflineAction = (action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>) => {
    // Esta função será chamada pelos componentes quando offline
    const pendingActions: PendingAction[] = JSON.parse(
      localStorage.getItem('pendingAlimentacaoActions') || '[]'
    )

    const newAction: PendingAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0
    }

    const updatedActions = [...pendingActions, newAction]
    localStorage.setItem('pendingAlimentacaoActions', JSON.stringify(updatedActions))
  }

  return { addOfflineAction }
}