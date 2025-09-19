import { updateSession } from '../lib/supabase/middleware'

export async function middleware(request: Request) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Corresponde a todas as solicitações, exceto:
     * - arquivos estáticos (/_next/static/, favicon.ico)
     * - imagens (_next/image/)
     * - arquivos públicos (public/)
     * - arquivos de assets (robots.txt, sitemap.xml)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)).*)',
  ],
}