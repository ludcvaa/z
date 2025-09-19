import crypto from 'crypto'

// Configurações CSRF
const CSRF_CONFIG = {
  TOKEN_LENGTH: 32,
  COOKIE_NAME: 'csrf_token',
  HEADER_NAME: 'X-CSRF-Token',
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: 86400, // 24 horas
  },
}

// Gerar token CSRF aleatório
export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_CONFIG.TOKEN_LENGTH).toString('hex')
}

// Validar token CSRF
export function validateCSRFToken(token: string, storedToken: string): boolean {
  if (!token || !storedToken) {
    return false
  }

  // Use timing-safe comparison para previnir timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(token, 'hex'),
      Buffer.from(storedToken, 'hex')
    )
  } catch {
    return false
  }
}

// Gerar token CSRF e configurar cookie
export function createCSRFProtection() {
  const token = generateCSRFToken()

  return {
    token,
    cookieHeader: `${CSRF_CONFIG.COOKIE_NAME}=${token}; ${Object.entries(CSRF_CONFIG.COOKIE_OPTIONS)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ')}`,
    headerName: CSRF_CONFIG.HEADER_NAME,
  }
}

// Middleware para verificar CSRF
export function csrfProtection(request: Request): { valid: boolean; error?: string } {
  // Verificar se é um método que requer proteção CSRF
  const method = request.method.toUpperCase()
  const unsafeMethods = ['POST', 'PUT', 'DELETE', 'PATCH']

  if (!unsafeMethods.includes(method)) {
    return { valid: true }
  }

  // Obter token do header
  const csrfToken = request.headers.get(CSRF_CONFIG.HEADER_NAME)

  // Obter token do cookie
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [key, value] = cookie.split('=')
      return [key, value]
    })
  )
  const cookieToken = cookies[CSRF_CONFIG.COOKIE_NAME]

  // Validar tokens
  if (!csrfToken || !cookieToken) {
    return {
      valid: false,
      error: 'CSRF token missing',
    }
  }

  if (!validateCSRFToken(csrfToken, cookieToken)) {
    return {
      valid: false,
      error: 'Invalid CSRF token',
    }
  }

  return { valid: true }
}

// Componente React para adicionar CSRF token em formulários
export function CSRFToken() {
  // Esta função deve ser usada em Server Components
  const token = generateCSRFToken()

  return (
    <>
      <input
        type="hidden"
        name="csrf_token"
        value={token}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Configurar cookie CSRF
            document.cookie = '${CSRF_CONFIG.COOKIE_NAME}=${token}; ${Object.entries(CSRF_CONFIG.COOKIE_OPTIONS)
              .map(([key, value]) => `${key}=${value}`)
              .join('; ')}';

            // Adicionar token a todas as requisições fetch
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
              if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
                options.headers = {
                  ...options.headers,
                  '${CSRF_CONFIG.HEADER_NAME}': '${token}'
                };
              }
              return originalFetch(url, options);
            };
          `,
        }}
      />
    </>
  )
}