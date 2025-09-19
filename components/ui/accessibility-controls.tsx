"use client"

import * as React from "react"
import { Accessibility, Eye, Type, Motion, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useAccessibility } from "./accessibility-provider"

export function AccessibilityControls() {
  const {
    highContrast,
    largeText,
    reducedMotion,
    setHighContrast,
    setLargeText,
    setReducedMotion,
    resetSettings,
  } = useAccessibility()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Accessibility className="h-4 w-4" />
          <span className="sr-only">Configurações de acessibilidade</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações de Acessibilidade</DialogTitle>
          <DialogDescription>
            Personalize sua experiência de uso para melhor conforto e acessibilidade.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Alto Contraste */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="h-4 w-4" />
              <div className="space-y-0.5">
                <Label>Alto Contraste</Label>
                <p className="text-xs text-muted-foreground">
                  Aumenta o contraste entre cores para melhor legibilidade
                </p>
              </div>
            </div>
            <Switch
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          {/* Texto Grande */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Type className="h-4 w-4" />
              <div className="space-y-0.5">
                <Label>Texto Grande</Label>
                <p className="text-xs text-muted-foreground">
                  Aumenta o tamanho do texto em toda a aplicação
                </p>
              </div>
            </div>
            <Switch
              checked={largeText}
              onCheckedChange={setLargeText}
            />
          </div>

          {/* Redução de Movimento */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Motion className="h-4 w-4" />
              <div className="space-y-0.5">
                <Label>Reduzir Movimento</Label>
                <p className="text-xs text-muted-foreground">
                  Reduz animações e efeitos visuais
                </p>
              </div>
            </div>
            <Switch
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>

          {/* Botão de Reset */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="w-full"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurar Padrões
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Versão compacta para uso em menus
export function CompactAccessibilityControls() {
  const {
    highContrast,
    largeText,
    reducedMotion,
    setHighContrast,
    setLargeText,
    setReducedMotion,
  } = useAccessibility()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="high-contrast" className="flex items-center space-x-2">
          <Eye className="h-4 w-4" />
          <span>Alto Contraste</span>
        </Label>
        <Switch
          id="high-contrast"
          checked={highContrast}
          onCheckedChange={setHighContrast}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="large-text" className="flex items-center space-x-2">
          <Type className="h-4 w-4" />
          <span>Texto Grande</span>
        </Label>
        <Switch
          id="large-text"
          checked={largeText}
          onCheckedChange={setLargeText}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="reduced-motion" className="flex items-center space-x-2">
          <Motion className="h-4 w-4" />
          <span>Reduzir Movimento</span>
        </Label>
        <Switch
          id="reduced-motion"
          checked={reducedMotion}
          onCheckedChange={setReducedMotion}
        />
      </div>
    </div>
  )
}