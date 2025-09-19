import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ButtonCustomProps extends ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "focus" | "timer"
  size?: "default" | "sm" | "lg" | "icon" | "timer"
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonCustomProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <Button
        className={cn(
          // Variantes personalizadas
          variant === "focus" && "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
          variant === "timer" && "bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-full",

          // Tamanhos personalizados
          size === "timer" && "text-2xl px-12 py-6",

          className
        )}
        variant={variant === "focus" || variant === "timer" ? "default" : variant}
        size={size === "timer" ? "default" : size}
        ref={ref}
        {...props}
      />
    )
  }
)
ButtonCustom.displayName = "ButtonCustom"

export { ButtonCustom }