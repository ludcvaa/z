'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeedbackToastProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading'
  title: string
  description?: string
  duration?: number
  onClose?: () => void
}

export function FeedbackToast({
  type,
  title,
  description,
  duration = 3000,
  onClose
}: FeedbackToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800'
        }
      case 'error':
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800'
        }
      case 'warning':
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-500" />,
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800'
        }
      case 'info':
        return {
          icon: <Info className="h-5 w-5 text-blue-500" />,
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800'
        }
      case 'loading':
        return {
          icon: <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />,
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800'
        }
      default:
        return {
          icon: <Info className="h-5 w-5 text-gray-500" />,
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border shadow-lg transition-all duration-300 transform',
        styles.bgColor,
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      )}
    >
      <div className="flex items-start gap-3">
        {styles.icon}
        <div className="flex-1">
          <h4 className={cn('font-medium text-sm', styles.textColor)}>
            {title}
          </h4>
          {description && (
            <p className={cn('text-sm mt-1', styles.textColor)}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook para feedback visual
export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackToastProps[]>([])

  const showFeedback = (props: Omit<FeedbackToastProps, 'onClose'>) => {
    const id = Date.now()
    const feedback = { ...props, id }

    setFeedbacks(prev => [...prev, feedback])

    // Remover feedback após a duração
    setTimeout(() => {
      setFeedbacks(prev => prev.filter(f => f.id !== id))
    }, props.duration || 3000)
  }

  const showSuccess = (title: string, description?: string) => {
    showFeedback({ type: 'success', title, description })
  }

  const showError = (title: string, description?: string) => {
    showFeedback({ type: 'error', title, description, duration: 5000 })
  }

  const showWarning = (title: string, description?: string) => {
    showFeedback({ type: 'warning', title, description, duration: 4000 })
  }

  const showInfo = (title: string, description?: string) => {
    showFeedback({ type: 'info', title, description })
  }

  const showLoading = (title: string, description?: string) => {
    showFeedback({ type: 'loading', title, description })
  }

  return {
    feedbacks,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    showFeedback
  }
}

// Componente de botão com feedback visual
interface ActionButtonProps {
  onClick: () => Promise<void> | void
  children: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  loadingText?: string
  successText?: string
  errorText?: string
  className?: string
  disabled?: boolean
}

export function ActionButton({
  onClick,
  children,
  variant = 'default',
  size = 'default',
  loadingText = 'Processando...',
  successText,
  errorText,
  className,
  disabled = false
}: ActionButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleClick = async () => {
    if (state !== 'idle') return

    try {
      setState('loading')
      await onClick()
      setState('success')

      if (successText) {
        setTimeout(() => setState('idle'), 2000)
      } else {
        setState('idle')
      }
    } catch (error) {
      setState('error')

      if (errorText) {
        setTimeout(() => setState('idle'), 3000)
      } else {
        setState('idle')
      }
    }
  }

  const getStateText = () => {
    switch (state) {
      case 'loading':
        return loadingText
      case 'success':
        return successText || children
      case 'error':
        return errorText || children
      default:
        return children
    }
  }

  const getStateIcon = () => {
    switch (state) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'error':
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getVariant = () => {
    if (state === 'success') return 'default'
    if (state === 'error') return 'destructive'
    return variant
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state !== 'idle'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
        // Variant styles
        getVariant() === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        getVariant() === 'destructive' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        getVariant() === 'outline' && 'border border-input hover:bg-accent hover:text-accent-foreground',
        getVariant() === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        getVariant() === 'ghost' && 'hover:bg-accent hover:text-accent-foreground',
        getVariant() === 'link' && 'underline-offset-4 hover:underline text-primary',
        // Size styles
        size === 'default' && 'h-10 py-2 px-4',
        size === 'sm' && 'h-9 px-3 rounded-md',
        size === 'lg' && 'h-11 px-8 rounded-md',
        size === 'icon' && 'h-10 w-10',
        className
      )}
    >
      {getStateIcon()}
      {getStateText()}
    </button>
  )
}

// Componente de animação de progresso
interface ProgressAnimationProps {
  isComplete: boolean
  children: React.ReactNode
  className?: string
}

export function ProgressAnimation({ isComplete, children, className }: ProgressAnimationProps) {
  const [showProgress, setShowProgress] = useState(false)
  const [isCompleteAnimated, setIsCompleteAnimated] = useState(false)

  useEffect(() => {
    if (!isComplete) {
      setShowProgress(false)
      setIsCompleteAnimated(false)
      return
    }

    setShowProgress(true)

    const timer = setTimeout(() => {
      setIsCompleteAnimated(true)
      setTimeout(() => setShowProgress(false), 1000)
    }, 100)

    return () => clearTimeout(timer)
  }, [isComplete])

  return (
    <div className={cn('relative', className)}>
      {children}

      {showProgress && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
          <div className={cn(
            'text-white font-bold text-lg transition-all duration-500 transform',
            isCompleteAnimated ? 'scale-110 opacity-100' : 'scale-95 opacity-70'
          )}>
            <CheckCircle className="h-8 w-8 mx-auto mb-2" />
            Concluído!
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de shake animation para erros
interface ShakeOnErrorProps {
  hasError: boolean
  children: React.ReactNode
  className?: string
}

export function ShakeOnError({ hasError, children, className }: ShakeOnErrorProps) {
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (hasError) {
      setShake(true)
      const timer = setTimeout(() => setShake(false), 500)
      return () => clearTimeout(timer)
    }
  }, [hasError])

  return (
    <div className={cn(
      'transition-transform duration-300',
      shake && 'animate-shake',
      className
    )}>
      {children}
    </div>
  )
}

// Adicionar CSS customizado para animações
export function FeedbackAnimationsStyles() {
  return (
    <style jsx global>{`
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }

      .animate-shake {
        animation: shake 0.5s ease-in-out;
      }
    `}</style>
  )
}