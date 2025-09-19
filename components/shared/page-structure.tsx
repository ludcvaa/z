"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumbs, SmartBreadcrumbs } from "./breadcrumbs"
import { LoadingWrapper } from "./loading-skeleton"
import { ErrorBoundary } from "./error-boundary"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{
    label: string
    href?: string
    icon?: React.ComponentType<{ className?: string }>
  }>
  className?: string
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && <SmartBreadcrumbs items={breadcrumbs} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

interface PageLayoutProps {
  children: React.ReactNode
  header?: PageHeaderProps
  loading?: boolean
  error?: boolean
  className?: string
  contentClassName?: string
}

export function PageLayout({
  children,
  header,
  loading = false,
  error = false,
  className,
  contentClassName
}: PageLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {header && <PageHeader {...header} />}

      <ErrorBoundary>
        <LoadingWrapper
          isLoading={loading}
          skeleton={
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          }
        >
          <div className={contentClassName}>
            {children}
          </div>
        </LoadingWrapper>
      </ErrorBoundary>
    </div>
  )
}

// Layout para páginas com abas
interface TabsLayoutProps {
  children: React.ReactNode
  header?: PageHeaderProps
  tabs: Array<{
    id: string
    label: string
    content: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
    disabled?: boolean
  }>
  defaultTab?: string
  loading?: boolean
  className?: string
}

export function TabsLayout({
  children,
  header,
  tabs,
  defaultTab,
  loading = false,
  className
}: TabsLayoutProps) {
  const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0]?.id)

  return (
    <PageLayout
      header={header}
      loading={loading}
      className={className}
    >
      {/* Tabs Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300",
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.icon && (
                <tab.icon className="inline-block w-4 h-4 mr-2" />
              )}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={cn(
              "transition-opacity duration-200",
              activeTab === tab.id ? "block" : "hidden"
            )}
          >
            {tab.content}
          </div>
        ))}
      </div>

      {children}
    </PageLayout>
  )
}

// Layout para páginas com seções
interface SectionLayoutProps {
  children: React.ReactNode
  sections: Array<{
    id: string
    title: string
    description?: string
    content: React.ReactNode
    collapsed?: boolean
  }>
  defaultCollapsed?: boolean
  className?: string
}

export function SectionLayout({
  children,
  sections,
  defaultCollapsed = false,
  className
}: SectionLayoutProps) {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(sections.filter(s => !s.collapsed).map(s => s.id))
  )

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {sections.map(section => (
        <Card key={section.id}>
          <CardHeader>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full text-left flex items-center justify-between"
            >
              <div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </div>
              <div className="text-muted-foreground">
                {expandedSections.has(section.id) ? "▼" : "▶"}
              </div>
            </button>
          </CardHeader>
          {expandedSections.has(section.id) && (
            <CardContent>
              {section.content}
            </CardContent>
          )}
        </Card>
      ))}

      {children}
    </div>
  )
}

// Layout para páginas em duas colunas
interface TwoColumnLayoutProps {
  children: React.ReactNode
  leftColumn: React.ReactNode
  rightColumn: React.ReactNode
  leftWidth?: number // 1-12
  rightWidth?: number // 1-12
  className?: string
  gap?: "sm" | "md" | "lg"
}

export function TwoColumnLayout({
  children,
  leftColumn,
  rightColumn,
  leftWidth = 8,
  rightWidth = 4,
  className,
  gap = "lg"
}: TwoColumnLayoutProps) {
  const gapClass = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8"
  }[gap]

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-12", gapClass, className)}>
      <div className={`lg:col-span-${leftWidth}`}>
        {leftColumn}
      </div>
      <div className={`lg:col-span-${rightWidth}`}>
        {rightColumn}
      </div>
      {children}
    </div>
  )
}

// Layout para dashboard
interface DashboardLayoutProps {
  children: React.ReactNode
  header?: PageHeaderProps
  stats?: React.ReactNode
  mainContent: React.ReactNode
  sidebar?: React.ReactNode
  className?: string
}

export function DashboardLayout({
  children,
  header,
  stats,
  mainContent,
  sidebar,
  className
}: DashboardLayoutProps) {
  return (
    <PageLayout
      header={header}
      className={className}
    >
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          {mainContent}
        </div>
        {sidebar && (
          <div className="lg:col-span-4">
            {sidebar}
          </div>
        )}
      </div>

      {children}
    </PageLayout>
  )
}

// Layout para páginas de formulários
interface FormLayoutProps {
  children: React.ReactNode
  header?: PageHeaderProps
  sidebarContent?: React.ReactNode
  helpContent?: React.ReactNode
  loading?: boolean
  className?: string
}

export function FormLayout({
  children,
  header,
  sidebarContent,
  helpContent,
  loading = false,
  className
}: FormLayoutProps) {
  return (
    <PageLayout
      header={header}
      loading={loading}
      className={className}
    >
      <TwoColumnLayout
        leftWidth={8}
        rightWidth={4}
        leftColumn={children}
        rightColumn={
          <div className="space-y-4">
            {sidebarContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações</CardTitle>
                </CardHeader>
                <CardContent>
                  {sidebarContent}
                </CardContent>
              </Card>
            )}
            {helpContent && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ajuda</CardTitle>
                </CardHeader>
                <CardContent>
                  {helpContent}
                </CardContent>
              </Card>
            )}
          </div>
        }
      />
    </PageLayout>
  )
}