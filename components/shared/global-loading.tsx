"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlobalLoadingProps {
  className?: string
  message?: string
}

export function GlobalLoading({ className, message }: GlobalLoadingProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadingMessage, setLoadingMessage] = React.useState("Carregando...")

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleStart = () => {
      setIsLoading(true)
      timeoutId = setTimeout(() => {
        setIsLoading(false)
      }, 5000) // Timeout máximo de 5 segundos
    }

    const handleComplete = () => {
      clearTimeout(timeoutId)
      setIsLoading(false)
    }

    // Simular loading ao mudar de rota
    const currentPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")

    // Mostrar loading brevemente ao entrar na página
    handleStart()
    const startTimeout = setTimeout(() => {
      handleComplete()
    }, 300)

    return () => {
      clearTimeout(timeoutId)
      clearTimeout(startTimeout)
    }
  }, [pathname, searchParams])

  // Atualizar mensagem baseada na rota
  React.useEffect(() => {
    const messages: Record<string, string> = {
      "/timer": "Iniciando timer...",
      "/analytics": "Carregando estatísticas...",
      "/planning": "Carregando planejamento...",
      "/goals": "Carregando metas...",
      "/training": "Carregando treino mental...",
      "/settings": "Carregando configurações...",
      "/profile": "Carregando perfil..."
    }

    const currentPath = pathname.split('/').filter(Boolean).join('/')
    setLoadingMessage(messages[currentPath] || message || "Carregando...")
  }, [pathname, message])

  if (!isLoading) return null

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">
          {loadingMessage}
        </p>
      </div>
    </div>
  )
}

// Componente de loading para conteúdo específico
interface ContentLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  skeleton?: React.ReactNode
  overlay?: boolean
}

export function ContentLoading({
  isLoading,
  children,
  skeleton,
  overlay = false
}: ContentLoadingProps) {
  if (isLoading) {
    if (overlay) {
      return (
        <div className="relative">
          {children}
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </div>
      )
    }

    return skeleton || (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}

// Hook para gerenciar loading states
export function useLoading() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadingMessage, setLoadingMessage] = React.useState("")

  const startLoading = React.useCallback((message = "Carregando...") => {
    setIsLoading(true)
    setLoadingMessage(message)
  }, [])

  const stopLoading = React.useCallback(() => {
    setIsLoading(false)
    setLoadingMessage("")
  }, [])

  const withLoading = React.useCallback(async <T>(
    fn: () => Promise<T>,
    message = "Carregando..."
  ): Promise<T> => {
    startLoading(message)
    try {
      const result = await fn()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  }
}

// Provider de loading global
interface LoadingContextType {
  isLoading: boolean
  loadingMessage: string
  startLoading: (message?: string) => void
  stopLoading: () => void
  withLoading: <T>(fn: () => Promise<T>, message?: string) => Promise<T>
}

const LoadingContext = React.createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [loadingMessage, setLoadingMessage] = React.useState("")

  const startLoading = React.useCallback((message = "Carregando...") => {
    setIsLoading(true)
    setLoadingMessage(message)
  }, [])

  const stopLoading = React.useCallback(() => {
    setIsLoading(false)
    setLoadingMessage("")
  }, [])

  const withLoading = React.useCallback(async <T>(
    fn: () => Promise<T>,
    message = "Carregando..."
  ): Promise<T> => {
    startLoading(message)
    try {
      const result = await fn()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  const value: LoadingContextType = {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  }

  return (
    <LoadingContext.Provider value={value}>
      <GlobalLoading />
      {children}
    </LoadingContext.Provider>
  )
}

export function useGlobalLoading() {
  const context = React.useContext(LoadingContext)
  if (!context) {
    throw new Error("useGlobalLoading must be used within a LoadingProvider")
  }
  return context
}

// Componente de loading para botões
interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function LoadingButton({
  isLoading,
  children,
  disabled,
  className
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {children}
    </button>
  )
}

// Componente de loading para página inteira
export function FullPageLoading({
  message = "Carregando...",
  className
}: GlobalLoadingProps) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

// Componente de loading para tabelas
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-8 bg-muted rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// Componente de loading para cards
export function CardLoading() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="h-6 bg-muted rounded animate-pulse w-3/4" />
      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      </div>
    </div>
  )
}