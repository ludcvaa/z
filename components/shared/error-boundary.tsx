"use client"

import * as React from "react"
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Chamar callback de erro se fornecido
    this.props.onError?.(error, errorInfo)

    // Log do erro para análise
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Aqui você poderia integrar com serviços de monitoramento como Sentry
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error)
    // }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-xl">Algo deu errado</CardTitle>
              <CardDescription>
                Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {this.props.showDetails && this.state.error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Detalhes do Erro</AlertTitle>
                  <AlertDescription className="text-xs font-mono">
                    {this.state.error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col space-y-2">
                <Button onClick={this.handleReset} className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar novamente
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Recarregar página
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <a href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Voltar ao início
                  </a>
                </Button>
              </div>
            </CardContent>

            <CardFooter className="text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center space-y-2">
                <p>Se o problema persistir, entre em contato conosco:</p>
                <a
                  href="mailto:suporte@stayfocus.com"
                  className="flex items-center text-primary hover:underline"
                >
                  <Mail className="mr-1 h-4 w-4" />
                  suporte@stayfocus.com
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Componente de erro para páginas específicas
export function PageError({
  title = "Erro ao carregar página",
  description = "Não foi possível carregar o conteúdo solicitado.",
  action = "Tentar novamente",
  onAction,
  showHomeButton = true
}: {
  title?: string
  description?: string
  action?: string
  onAction?: () => void
  showHomeButton?: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onAction}>
          {action}
        </Button>
        {showHomeButton && (
          <Button asChild variant="outline">
            <a href="/">Voltar ao início</a>
          </Button>
        )}
      </div>
    </div>
  )
}

// Componente de erro para API/Network
export function ApiError({
  error,
  onRetry
}: {
  error: { message?: string; status?: number }
  onRetry?: () => void
}) {
  const getErrorMessage = () => {
    if (error.status === 401) return "Não autorizado. Faça login novamente."
    if (error.status === 403) return "Você não tem permissão para acessar este recurso."
    if (error.status === 404) return "Recurso não encontrado."
    if (error.status === 500) return "Erro interno do servidor. Tente novamente mais tarde."
    if (error.status === 503) return "Serviço indisponível. Tente novamente mais tarde."
    return error.message || "Ocorreu um erro ao conectar com o servidor."
  }

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro de Conexão</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <span>{getErrorMessage()}</span>
        {onRetry && (
          <Button
            size="sm"
            variant="outline"
            onClick={onRetry}
            className="w-fit mt-2"
          >
            Tentar novamente
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

// Hook para tratamento de erros em componentes
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err)
    } else {
      setError(new Error(String(err)))
    }
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return {
    error,
    handleError,
    clearError,
    hasError: error !== null
  }
}

// Wrapper de erro para componentes assíncronos
export function AsyncErrorBoundary({
  children,
  fallback
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  )
}

export { ErrorBoundary }