"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Timer,
  BarChart3,
  Calendar,
  Target,
  Brain,
  Home,
  Settings,
  BookOpen,
  Users,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  Award
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  badge?: number
  variant?: "default" | "focus" | "secondary"
}

const navigationItems: NavItem[] = [
  {
    title: "Início",
    href: "/",
    icon: Home,
    description: "Visão geral do seu dia"
  },
  {
    title: "Timer",
    href: "/timer",
    icon: Timer,
    description: "Iniciar sessão de foco",
    variant: "focus"
  },
  {
    title: "Estatísticas",
    href: "/analytics",
    icon: BarChart3,
    description: "Análise de produtividade"
  },
  {
    title: "Planejamento",
    href: "/planning",
    icon: Calendar,
    description: "Organizar tarefas"
  },
  {
    title: "Metas",
    href: "/goals",
    icon: Target,
    description: "Acompanhar objetivos",
    badge: 3
  },
  {
    title: "Treino Mental",
    href: "/training",
    icon: Brain,
    description: "Exercícios de foco"
  }
]

const quickAccessItems: NavItem[] = [
  {
    title: "Sessão Rápida",
    href: "/timer/quick",
    icon: Clock,
    description: "25 minutos de foco"
  },
  {
    title: "Tarefas Hoje",
    href: "/planning/today",
    icon: CheckCircle,
    description: "Ver tarefas do dia"
  },
  {
    title: "Progresso",
    href: "/analytics/progress",
    icon: TrendingUp,
    description: "Ver evolução"
  },
  {
    title: "Conquistas",
    href: "/achievements",
    icon: Award,
    description: "Seus prêmios"
  }
]

interface NavigationProps {
  variant?: "sidebar" | "top" | "mobile"
  className?: string
}

export function Navigation({ variant = "sidebar", className }: NavigationProps) {
  const pathname = usePathname()

  const NavItemComponent = ({ item, isCollapsed = false }: { item: NavItem; isCollapsed?: boolean }) => {
    const isActive = pathname === item.href
    const Icon = item.icon

    const content = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn("h-4 w-4", isActive && "text-primary-foreground")} />
        {!isCollapsed && (
          <>
            <span className="truncate">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    )

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
              {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return content
  }

  if (variant === "top") {
    return (
      <nav className={cn("border-b bg-background", className)}>
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Timer className="h-6 w-6" />
              <span className="font-bold">StayFocus</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {navigationItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </div>
        </div>
      </nav>
    )
  }

  if (variant === "mobile") {
    return (
      <nav className={cn("grid gap-2 p-4", className)}>
        {navigationItems.map((item) => (
          <NavItemComponent key={item.href} item={item} />
        ))}
      </nav>
    )
  }

  // Sidebar variant (default)
  return (
    <div className={cn("flex h-full max-h-screen flex-col gap-2", className)}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Timer className="h-6 w-6" />
          <span>StayFocus</span>
        </Link>
      </div>

      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navigationItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* Acesso Rápido */}
      <div className="mt-auto p-4">
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-semibold text-muted-foreground">Acesso Rápido</h4>
          <div className="space-y-1">
            {quickAccessItems.map((item) => (
              <NavItemComponent key={item.href} item={item} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-accent"
          >
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:bg-accent"
          >
            <BookOpen className="h-4 w-4" />
            <span>Ajuda</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Mobile Navigation Component
export function MobileNavigation() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
      <div className="fixed inset-y-0 left-0 z-50 h-full w-3/4 max-w-sm border-r bg-background data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-xs">
        <Navigation variant="mobile" />
      </div>
    </div>
  )
}