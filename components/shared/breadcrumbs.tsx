"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  current?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: React.ReactNode
}

export function Breadcrumbs({
  items,
  className,
  showHome = true,
  separator = <ChevronRight className="h-4 w-4" />
}: BreadcrumbsProps) {
  const pathname = usePathname()

  // Gerar breadcrumbs automaticamente se não forem fornecidos
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    if (showHome) {
      breadcrumbs.push({
        label: "Início",
        href: "/",
        icon: Home
      })
    }

    let currentPath = ""

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`

      // Ignorar segmentos de locale
      if (segment.length === 2) return

      const isLast = index === segments.length - 1
      const label = formatSegmentLabel(segment)

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
        current: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm", className)}>
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          const Icon = item.icon

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-muted-foreground" aria-hidden="true">
                  {separator}
                </span>
              )}

              {isLast || !item.href ? (
                <span
                  className={cn(
                    "flex items-center space-x-1",
                    item.current
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Componente para breadcrumbs móveis (mais compacto)
export function MobileBreadcrumbs({
  items,
  className
}: BreadcrumbsProps) {
  const pathname = usePathname()
  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  // Mostrar apenas o último item e "..." para mobile
  if (breadcrumbItems.length <= 2) {
    return <Breadcrumbs items={breadcrumbItems} className={className} />
  }

  const homeItem = breadcrumbItems[0]
  const currentItem = breadcrumbItems[breadcrumbItems.length - 1]

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm", className)}>
      <ol className="flex items-center space-x-1">
        {/* Home */}
        <li>
          <Link
            href={homeItem.href || "/"}
            className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {/* Separator */}
        <span className="mx-1 text-muted-foreground">...</span>

        {/* Current item */}
        <li>
          <span className="flex items-center space-x-1 text-foreground font-medium">
            {currentItem.icon && (
              <currentItem.icon className="h-4 w-4" />
            )}
            <span>{currentItem.label}</span>
          </span>
        </li>
      </ol>
    </nav>
  )
}

// Hook para gerenciar breadcrumbs
export function useBreadcrumbs() {
  const pathname = usePathname()

  const createBreadcrumbs = React.useCallback((customItems?: BreadcrumbItem[]) => {
    if (customItems) {
      return customItems
    }
    return generateBreadcrumbs(pathname)
  }, [pathname])

  return {
    breadcrumbs: generateBreadcrumbs(pathname),
    createBreadcrumbs
  }
}

// Função auxiliar para formatar labels de segmentos
function formatSegmentLabel(segment: string): string {
  // Converter kebab-case ou snake_case para Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
    .replace(/\b\w{3,}\b/g, word => {
      // Ajustar casos especiais
      const lower = word.toLowerCase()
      if (['de', 'do', 'da', 'dos', 'das', 'e', 'em', 'com', 'para', 'por'].includes(lower)) {
        return lower
      }
      return word
    })
}

// Função para gerar breadcrumbs
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Home
  breadcrumbs.push({
    label: "Início",
    href: "/",
    icon: Home
  })

  let currentPath = ""

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Ignorar segmentos de locale
    if (segment.length === 2) return

    const isLast = index === segments.length - 1
    const label = formatSegmentLabel(segment)

    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      current: isLast
    })
  })

  return breadcrumbs
}

// Mapeamento de ícones para páginas comuns
const pageIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'timer': () => import("lucide-react").then(m => m.Timer),
  'analytics': () => import("lucide-react").then(m => m.BarChart3),
  'planning': () => import("lucide-react").then(m => m.Calendar),
  'goals': () => import("lucide-react").then(m => m.Target),
  'training': () => import("lucide-react").then(m => m.Brain),
  'settings': () => import("lucide-react").then(m => m.Settings),
  'profile': () => import("lucide-react").then(m => m.User),
  'achievements': () => import("lucide-react").then(m => m.Award),
}

// Componente de breadcrumbs com ícones automáticos
export function SmartBreadcrumbs({
  items,
  className
}: Omit<BreadcrumbsProps, 'separator'>) {
  const pathname = usePathname()
  const [icons, setIcons] = React.useState<Record<string, React.ComponentType<{ className?: string }>>>({})

  React.useEffect(() => {
    // Carregar ícones dinamicamente
    const loadIcons = async () => {
      const loadedIcons: Record<string, React.ComponentType<{ className?: string }>> = {}

      for (const [page, iconLoader] of Object.entries(pageIcons)) {
        if (pathname.includes(page)) {
          try {
            const Icon = await iconLoader()
            loadedIcons[page] = Icon
          } catch (error) {
            console.warn(`Failed to load icon for ${page}:`, error)
          }
        }
      }

      setIcons(loadedIcons)
    }

    loadIcons()
  }, [pathname])

  const breadcrumbItems = items || generateBreadcrumbs(pathname)

  // Adicionar ícones aos itens
  const itemsWithIcons = breadcrumbItems.map(item => {
    if (item.href) {
      const pageKey = Object.keys(pageIcons).find(key => item.href?.includes(key))
      if (pageKey && icons[pageKey]) {
        return { ...item, icon: icons[pageKey] }
      }
    }
    return item
  })

  return <Breadcrumbs items={itemsWithIcons} className={className} />
}