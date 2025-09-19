'use client'

import { ReactNode } from 'react'
import { AuthProvider } from './auth-provider'
import { AuthLoading } from '@/components/auth/AuthLoading'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <AuthLoading>
        {children}
      </AuthLoading>
    </AuthProvider>
  )
}