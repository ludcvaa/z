import * as React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardCustomProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "focus" | "timer" | "stats"
}

const CardCustom = React.forwardRef<HTMLDivElement, CardCustomProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-200 hover:shadow-lg",
        variant === "focus" && "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50",
        variant === "timer" && "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50",
        variant === "stats" && "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/50",
        className
      )}
      {...props}
    />
  )
)
CardCustom.displayName = "CardCustom"

const CardHeaderCustom = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardHeader ref={ref} className={cn("space-y-1", className)} {...props} />
))
CardHeaderCustom.displayName = "CardHeaderCustom"

const CardTitleCustom = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <CardTitle ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
))
CardTitleCustom.displayName = "CardTitleCustom"

const CardDescriptionCustom = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <CardDescription ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
CardDescriptionCustom.displayName = "CardDescriptionCustom"

const CardContentCustom = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardContent ref={ref} className={cn("", className)} {...props} />
))
CardContentCustom.displayName = "CardContentCustom"

const CardFooterCustom = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <CardFooter ref={ref} className={cn("flex items-center space-x-2", className)} {...props} />
))
CardFooterCustom.displayName = "CardFooterCustom"

export { CardCustom, CardHeaderCustom, CardTitleCustom, CardDescriptionCustom, CardContentCustom, CardFooterCustom }