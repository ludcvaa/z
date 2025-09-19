"use client"

import * as React from "react"
import { CheckCircle, XCircle, AlertCircle, Info, Loader2, Star, Heart, ThumbsUp, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "./toast-notifications"

// Componente de feedback para ações bem-sucedidas
export function SuccessFeedback({
  title,
  description,
  action,
  onAction,
  showConfetti = false
}: {
  title: string
  description?: string
  action?: string
  onAction?: () => void
  showConfetti?: boolean
}) {
  const { success } = useToast()

  React.useEffect(() => {
    success(title, description)
  }, [title, description, success])

  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/50 dark:border-green-800">
      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      <div className="flex-1">
        <h4 className="font-medium text-green-900 dark:text-green-100">{title}</h4>
        {description && (
          <p className="text-sm text-green-700 dark:text-green-300">{description}</p>
        )}
      </div>
      {action && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  )
}

// Componente de feedback para erros
export function ErrorFeedback({
  title,
  description,
  action,
  onAction,
  retryable = false
}: {
  title: string
  description?: string
  action?: string
  onAction?: () => void
  retryable?: boolean
}) {
  const { error } = useToast()

  React.useEffect(() => {
    error(title, description)
  }, [title, description, error])

  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-red-50 border border-red-200 dark:bg-red-950/50 dark:border-red-800">
      <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
      <div className="flex-1">
        <h4 className="font-medium text-red-900 dark:text-red-100">{title}</h4>
        {description && (
          <p className="text-sm text-red-700 dark:text-red-300">{description}</p>
        )}
      </div>
      {action && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
      {retryable && (
        <Button variant="destructive" size="sm" onClick={onAction}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}

// Componente de feedback para avisos
export function WarningFeedback({
  title,
  description,
  action,
  onAction
}: {
  title: string
  description?: string
  action?: string
  onAction?: () => void
}) {
  const { warning } = useToast()

  React.useEffect(() => {
    warning(title, description)
  }, [title, description, warning])

  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-950/50 dark:border-orange-800">
      <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
      <div className="flex-1">
        <h4 className="font-medium text-orange-900 dark:text-orange-100">{title}</h4>
        {description && (
          <p className="text-sm text-orange-700 dark:text-orange-300">{description}</p>
        )}
      </div>
      {action && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  )
}

// Componente de feedback para informações
export function InfoFeedback({
  title,
  description,
  action,
  onAction
}: {
  title: string
  description?: string
  action?: string
  onAction?: () => void
}) {
  const { info } = useToast()

  React.useEffect(() => {
    info(title, description)
  }, [title, description, info])

  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
      <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      <div className="flex-1">
        <h4 className="font-medium text-blue-900 dark:text-blue-100">{title}</h4>
        {description && (
          <p className="text-sm text-blue-700 dark:text-blue-300">{description}</p>
        )}
      </div>
      {action && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  )
}

// Componente de feedback para carregamento
export function LoadingFeedback({
  title,
  description,
  progress
}: {
  title: string
  description?: string
  progress?: number
}) {
  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-800">
      <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin" />
      <div className="flex-1">
        <h4 className="font-medium text-blue-900 dark:text-blue-100">{title}</h4>
        {description && (
          <p className="text-sm text-blue-700 dark:text-blue-300">{description}</p>
        )}
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente de feedback para conquistas
export function AchievementFeedback({
  title,
  description,
  icon = Star,
  level = 1
}: {
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
  level?: number
}) {
  const Icon = icon
  const { success } = useToast()

  React.useEffect(() => {
    success(title, description)
  }, [title, description, success])

  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 dark:from-purple-950/50 dark:to-pink-950/50 dark:border-purple-800">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h4 className="font-medium text-purple-900 dark:text-purple-100">{title}</h4>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
            Nível {level}
          </Badge>
        </div>
        {description && (
          <p className="text-sm text-purple-700 dark:text-purple-300">{description}</p>
        )}
      </div>
      <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
    </div>
  )
}

// Componente de feedback para metas concluídas
export function GoalCompletedFeedback({
  title,
  description,
  streak = 0
}: {
  title: string
  description?: string
  streak?: number
}) {
  const { success } = useToast()

  React.useEffect(() => {
    success(title, description)
  }, [title, description, success])

  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 dark:from-green-950/50 dark:to-emerald-950/50 dark:border-green-800">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <CheckCircle className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-green-900 dark:text-green-100">{title}</h4>
        {description && (
          <p className="text-sm text-green-700 dark:text-green-300">{description}</p>
        )}
        {streak > 0 && (
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-600 dark:text-green-300">
              🔥 {streak} dias seguidos
            </Badge>
          </div>
        )}
      </div>
      <ThumbsUp className="h-6 w-6 text-green-500 animate-bounce" />
    </div>
  )
}

// Componente de feedback para sessões de foco
export function FocusSessionFeedback({
  duration,
  completed,
  type = "focus"
}: {
  duration: number
  completed: boolean
  type?: "focus" | "break"
}) {
  const { success, info } = useToast()
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  React.useEffect(() => {
    if (completed) {
      success(
        `Sessão de ${type === "focus" ? "Foco" : "Pausa"} Concluída!`,
        `Você completou ${minutes}m ${seconds}s de ${type === "focus" ? "concentração" : "descanso"}.`
      )
    }
  }, [completed, duration, type, success])

  if (!completed) {
    return (
      <InfoFeedback
        title="Sessão em Andamento"
        description={`Tempo restante: ${minutes}m ${seconds}s`}
      />
    )
  }

  return (
    <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 dark:from-blue-950/50 dark:to-cyan-950/50 dark:border-blue-800">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <CheckCircle className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-blue-900 dark:text-blue-100">
          Sessão de {type === "focus" ? "Foco" : "Pausa"} Concluída!
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Você completou {minutes} minutos e {seconds} segundos de {type === "focus" ? "concentração" : "descanso"}.
        </p>
      </div>
      <Heart className="h-6 w-6 text-blue-500 animate-pulse" />
    </div>
  )
}

// Hook para feedback visual
export function useVisualFeedback() {
  return {
    success: (title: string, description?: string, options?: any) => {
      return <SuccessFeedback title={title} description={description} {...options} />
    },
    error: (title: string, description?: string, options?: any) => {
      return <ErrorFeedback title={title} description={description} {...options} />
    },
    warning: (title: string, description?: string, options?: any) => {
      return <WarningFeedback title={title} description={description} {...options} />
    },
    info: (title: string, description?: string, options?: any) => {
      return <InfoFeedback title={title} description={description} {...options} />
    },
    loading: (title: string, description?: string, options?: any) => {
      return <LoadingFeedback title={title} description={description} {...options} />
    },
    achievement: (title: string, description?: string, options?: any) => {
      return <AchievementFeedback title={title} description={description} {...options} />
    },
    goalCompleted: (title: string, description?: string, options?: any) => {
      return <GoalCompletedFeedback title={title} description={description} {...options} />
    },
    focusSession: (duration: number, completed: boolean, options?: any) => {
      return <FocusSessionFeedback duration={duration} completed={completed} {...options} />
    }
  }
}