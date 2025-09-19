"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AccessibilityContextType {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  setHighContrast: (value: boolean) => void
  setLargeText: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
  resetSettings: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_SETTINGS)

  // Carregar preferências do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accessibility-settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings({ ...DEFAULT_SETTINGS, ...parsed })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações de acessibilidade:', error)
    }
  }, [])

  // Salvar preferências no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    } catch (error) {
      console.error('Erro ao salvar configurações de acessibilidade:', error)
    }
  }, [settings])

  // Aplicar classes ao body baseado nas configurações
  useEffect(() => {
    const body = document.body

    // Alto contraste
    if (settings.highContrast) {
      body.classList.add('high-contrast')
    } else {
      body.classList.remove('high-contrast')
    }

    // Texto grande
    if (settings.largeText) {
      body.classList.add('large-text')
    } else {
      body.classList.remove('large-text')
    }

    // Redução de movimento
    if (settings.reducedMotion) {
      body.classList.add('reduced-motion')
    } else {
      body.classList.remove('reduced-motion')
    }
  }, [settings])

  const setHighContrast = (value: boolean) => {
    setSettings(prev => ({ ...prev, highContrast: value }))
  }

  const setLargeText = (value: boolean) => {
    setSettings(prev => ({ ...prev, largeText: value }))
  }

  const setReducedMotion = (value: boolean) => {
    setSettings(prev => ({ ...prev, reducedMotion: value }))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const value: AccessibilityContextType = {
    ...settings,
    setHighContrast,
    setLargeText,
    setReducedMotion,
    resetSettings,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider')
  }
  return context
}