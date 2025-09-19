import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Rotas públicas que não requerem autenticação
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
]

// Rotas protegidas que requerem autenticação
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/projects',
  '/tasks',
  '/time-tracking',
  '/analytics',
]

// Rotas de autenticação que não devem ser acessadas por usuários logados
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
]

export async function updateSession(request: NextRequest) {
  try {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // IMPORTANT: Evitar lógica entre createServerClient e supabase.auth.getUser()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Tratamento de erros de autenticação
    if (error) {
      console.error('Erro de autenticação no middleware:', error)

      // Redirecionar para login com mensagem de erro
      if (pathname.startsWith('/dashboard') || PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('error', 'session_expired')
        return NextResponse.redirect(url)
      }
    }

    // Redirecionar usuários autenticados para o dashboard se acessarem rotas de auth
    if (user && AUTH_ROUTES.some(route => pathname.startsWith(route))) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Redirecionar usuários não autenticados para login se acessarem rotas protegidas
    if (!user && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Permitir acesso a rotas públicas sem autenticação
    if (PUBLIC_ROUTES.includes(pathname)) {
      return supabaseResponse
    }

    // Verificar se é uma rota de API
    if (pathname.startsWith('/api/')) {
      // Para rotas de API, retornar erro 401 se não autenticado
      if (!user && pathname.startsWith('/api/protected')) {
        return NextResponse.json(
          { error: 'Não autorizado' },
          { status: 401 }
        )
      }
      return supabaseResponse
    }

    return supabaseResponse
  } catch (error) {
    console.error('Erro inesperado no middleware:', error)

    // Em caso de erro, permitir o acesso mas logar o erro
    return NextResponse.next({
      request,
    })
  }
}