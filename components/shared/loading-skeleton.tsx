"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

// Skeleton específico para cards
export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  )
}

// Skeleton para listas de tarefas
export function TaskItemSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg border">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  )
}

// Skeleton para perfil de usuário
export function ProfileSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  )
}

// Skeleton para estatísticas
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <Skeleton className="h-8 w-8 rounded-lg mb-4" />
          <Skeleton className="h-6 w-20 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

// Skeleton para gráficos
export function ChartSkeleton() {
  return (
    <div className="w-full h-64 flex items-end justify-between space-x-2 p-4 border rounded-lg">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Skeleton key={i} className="w-full" style={{ height: `${Math.random() * 60 + 20}%` }} />
      ))}
    </div>
  )
}

// Skeleton para timer
export function TimerSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-8">
      <Skeleton className="h-24 w-48 rounded-lg" />
      <div className="flex space-x-4">
        <Skeleton className="h-12 w-24 rounded-lg" />
        <Skeleton className="h-12 w-24 rounded-lg" />
      </div>
    </div>
  )
}

// Skeleton para tabela
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <div className="border-b bg-muted/50">
        <div className="grid grid-cols-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-20" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Componente wrapper para loading
interface LoadingWrapperProps {
  isLoading: boolean
  children: React.ReactNode
  skeleton?: React.ReactNode
  fallback?: React.ReactNode
}

export function LoadingWrapper({
  isLoading,
  children,
  skeleton,
  fallback
}: LoadingWrapperProps) {
  if (isLoading) {
    return skeleton || <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  }

  if (fallback && !children) {
    return fallback
  }

  return <>{children}</>
}

// Skeleton animado com pulsação suave
export function PulseSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <Skeleton
      className={cn("animate-pulse", className)}
      {...props}
    />
  )
}

// Skeleton com ondas
export function WaveSkeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-wave",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }