"use client"

import * as React from "react"
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Calendar, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DateNavigatorProps {
  selectedDate?: Date
  onDateChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  view?: "day" | "week" | "month"
  onViewChange?: (view: "day" | "week" | "month") => void
  events?: Array<{
    id: string
    date: Date
    title: string
    type?: "focus" | "break" | "goal" | "task"
    completed?: boolean
  }>
  className?: string
}

export function DateNavigator({
  selectedDate = new Date(),
  onDateChange,
  minDate,
  maxDate,
  view = "day",
  onViewChange,
  events = [],
  className
}: DateNavigatorProps) {
  const [currentView, setCurrentView] = React.useState<"day" | "week" | "month">(view)
  const [currentDate, setCurrentDate] = React.useState(selectedDate)

  React.useEffect(() => {
    setCurrentView(view)
  }, [view])

  React.useEffect(() => {
    setCurrentDate(selectedDate)
  }, [selectedDate])

  const navigateDate = (direction: "prev" | "next") => {
    let newDate: Date

    switch (currentView) {
      case "day":
        newDate = direction === "prev" ? subDays(currentDate, 1) : addDays(currentDate, 1)
        break
      case "week":
        newDate = direction === "prev" ? subDays(currentDate, 7) : addDays(currentDate, 7)
        break
      case "month":
        newDate = direction === "prev"
          ? new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
          : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        break
    }

    // Verificar limites
    if (minDate && newDate < minDate) return
    if (maxDate && newDate > maxDate) return

    setCurrentDate(newDate)
    onDateChange?.(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    onDateChange?.(today)
  }

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
    onDateChange?.(date)
  }

  const getViewTitle = () => {
    switch (currentView) {
      case "day":
        return format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
      case "week":
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 })
        return `${format(weekStart, "d 'de' MMM", { locale: ptBR })} - ${format(weekEnd, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`
      case "month":
        return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date))
  }

  const renderDayView = () => (
    <div className="text-center py-8">
      <div className="text-3xl font-bold mb-2">
        {format(currentDate, "d", { locale: ptBR })}
      </div>
      <div className="text-muted-foreground mb-4">
        {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
      </div>
      {isToday(currentDate) && (
        <Badge variant="secondary" className="mb-4">Hoje</Badge>
      )}

      {/* Eventos do dia */}
      <div className="space-y-2 mt-6">
        {getEventsForDate(currentDate).map(event => (
          <div
            key={event.id}
            className={cn(
              "p-3 rounded-lg border text-left",
              event.type === "focus" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",
              event.type === "break" && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50",
              event.type === "goal" && "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/50",
              event.type === "task" && "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{event.title}</span>
              {event.completed && (
                <Badge variant="outline" className="text-xs">Concluído</Badge>
              )}
            </div>
          </div>
        ))}
        {getEventsForDate(currentDate).length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum evento para hoje</p>
        )}
      </div>
    </div>
  )

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(currentDate, { weekStartsOn: 0 })
    })

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {weekDays.map(day => {
          const dayEvents = getEventsForDate(day)
          const isSelected = isSameDay(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateSelect(day)}
              className={cn(
                "p-2 text-center border rounded-lg transition-colors hover:bg-accent",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                !isSelected && !isCurrentDay && "hover:bg-accent",
                isCurrentDay && !isSelected && "border-blue-500"
              )}
            >
              <div className="text-sm font-medium">
                {format(day, "d", { locale: ptBR })}
              </div>
              {dayEvents.length > 0 && (
                <div className="flex justify-center mt-1 space-x-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        event.type === "focus" && "bg-blue-500",
                        event.type === "break" && "bg-green-500",
                        event.type === "goal" && "bg-purple-500",
                        event.type === "task" && "bg-orange-500"
                      )}
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">+{dayEvents.length - 3}</div>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 0 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 0 })
    })

    return (
      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
        {monthDays.map(day => {
          const dayEvents = getEventsForDate(day)
          const isSelected = isSameDay(day, currentDate)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const isCurrentDay = isToday(day)

          return (
            <button
              key={day.toString()}
              onClick={() => handleDateSelect(day)}
              disabled={!isCurrentMonth}
              className={cn(
                "p-2 text-center border rounded-lg transition-colors min-h-[60px]",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
                !isSelected && isCurrentMonth && "hover:bg-accent",
                !isCurrentMonth && "text-muted-foreground bg-muted/30",
                isCurrentDay && !isSelected && "border-blue-500"
              )}
            >
              <div className="text-sm font-medium">
                {format(day, "d", { locale: ptBR })}
              </div>
              {dayEvents.length > 0 && (
                <div className="flex justify-center mt-1 space-x-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={cn(
                        "w-1 h-1 rounded-full",
                        event.type === "focus" && "bg-blue-500",
                        event.type === "break" && "bg-green-500",
                        event.type === "goal" && "bg-purple-500",
                        event.type === "task" && "bg-orange-500"
                      )}
                    />
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">+</div>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{getViewTitle()}</span>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex border rounded-lg">
              <Button
                size="sm"
                variant={currentView === "day" ? "default" : "ghost"}
                onClick={() => setCurrentView("day")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={currentView === "week" ? "default" : "ghost"}
                onClick={() => setCurrentView("week")}
                className="rounded-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={currentView === "month" ? "default" : "ghost"}
                onClick={() => setCurrentView("month")}
                className="rounded-l-none"
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigateDate("prev")}
                disabled={minDate && currentDate <= minDate}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={goToToday}
              >
                Hoje
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigateDate("next")}
                disabled={maxDate && currentDate >= maxDate}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {currentView === "day" && renderDayView()}
        {currentView === "week" && renderWeekView()}
        {currentView === "month" && renderMonthView()}
      </CardContent>
    </Card>
  )
}