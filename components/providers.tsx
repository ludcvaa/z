'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { AccessibilityProvider } from '@/components/ui/accessibility-provider'
import { ToastProviderComponent } from '@/components/shared/toast-notifications'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }))

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
          <NextThemesProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <ToastProviderComponent>
            <AccessibilityProvider>
              {children}
            </AccessibilityProvider>
          </ToastProviderComponent>
        </NextThemesProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}