"use client"

import { Header } from "@/components/layout/header"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { SmartBreadcrumbs } from "@/components/shared/breadcrumbs"
import { LoadingProvider } from "@/components/shared/global-loading"
import { ErrorBoundary } from "@/components/shared/error-boundary"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default function AuthLayout({
  children,
  params
}: AuthLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${params.locale}/login`)
    }
  }, [status, router, params.locale])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <LoadingProvider>
      <div className="min-h-screen bg-background">
        <div className="flex flex-col min-h-screen">
          <Header />

          <div className="flex flex-1">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block w-64 border-r bg-muted/5">
              <div className="h-full py-6">
                <Navigation variant="sidebar" />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="container mx-auto px-4 py-6">
                {/* Breadcrumbs */}
                <SmartBreadcrumbs />

                {/* Page Content */}
                <div className="mt-6">
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </div>
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </LoadingProvider>
  )
}