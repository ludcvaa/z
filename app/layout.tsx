import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const metadata = {
  title: 'StayFocus - Productivity & Focus Timer',
  description: 'Stay focused and productive with our advanced focus timer and productivity tracking application',
  viewport: 'width=device-width, initial-scale=1',
  keywords: ['productivity', 'focus', 'timer', 'pomodoro', 'time management'],
  authors: [{ name: 'StayFocus Team' }],
  openGraph: {
    title: 'StayFocus - Productivity & Focus Timer',
    description: 'Stay focused and productive with our advanced focus timer and productivity tracking application',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StayFocus - Productivity & Focus Timer',
    description: 'Stay focused and productive with our advanced focus timer and productivity tracking application',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                  <div className="mr-4 hidden md:flex">
                    <h1 className="text-lg font-semibold">StayFocus</h1>
                  </div>
                </div>
              </header>
              <main className="flex-1">
                {children}
              </main>
              <footer className="border-t py-6 md:px-8 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                  <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © 2024 StayFocus. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}