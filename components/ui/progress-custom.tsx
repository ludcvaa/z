"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressCustomProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  variant?: "default" | "focus" | "timer" | "success" | "warning"
}

const ProgressCustom = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressCustomProps
>(({ className, value, variant = "default", ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      variant === "focus" && "bg-blue-100 dark:bg-blue-900",
      variant === "timer" && "bg-green-100 dark:bg-green-900",
      variant === "success" && "bg-emerald-100 dark:bg-emerald-900",
      variant === "warning" && "bg-amber-100 dark:bg-amber-900",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-300",
        variant === "default" && "bg-primary",
        variant === "focus" && "bg-blue-600",
        variant === "timer" && "bg-green-600",
        variant === "success" && "bg-emerald-600",
        variant === "warning" && "bg-amber-600"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
ProgressCustom.displayName = ProgressPrimitive.Root.displayName

export { ProgressCustom }