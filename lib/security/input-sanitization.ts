// Sanitização de inputs para prevenir XSS e outras vulnerabilidades

export class InputSanitizer {
  // Lista de tags HTML permitidas e seus atributos permitidos
  private static readonly ALLOWED_HTML_TAGS = {
    'a': ['href', 'title', 'target'],
    'b': [],
    'i': [],
    'u': [],
    'strong': [],
    'em': [],
    'p': [],
    'br': [],
    'ul': [],
    'ol': [],
    'li': [],
    'blockquote': [],
    'code': [],
    'pre': [],
    'h1': [], 'h2': [], 'h3': [], 'h4': [], 'h5': [], 'h6': [],
  }

  // Padrões perigosos para detectar
  private static readonly DANGEROUS_PATTERNS = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /on\w+\s*=/i, // onclick, onmouseover, etc.
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
    /<embed[\s\S]*?>[\s\S]*?<\/embed>/gi,
    /<form[\s\S]*?>[\s\S]*?<\/form>/gi,
    /<input[\s\S]*?>/gi,
    /<button[\s\S]*?>[\s\S]*?<\/button>/gi,
    /expression\s*\(/i, // IE expression()
    /@import/i,
    /-moz-binding/i,
  ]

  // Sanitizar texto simples
  static sanitizeText(text: string): string {
    if (typeof text !== 'string') return ''

    // Remover caracteres de controle
    let sanitized = text.replace(/[\x00-\x1F\x7F]/g, '')

    // Converter entidades HTML
    sanitized = this.encodeHTMLEntities(sanitized)

    // Remover sequências perigosas
    sanitized = this.removeDangerousPatterns(sanitized)

    // Normalizar whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim()

    return sanitized
  }

  // Sanitizar HTML (permitindo apenas tags seguras)
  static sanitizeHTML(html: string): string {
    if (typeof html !== 'string') return ''

    // Remover scripts e conteúdo perigoso
    let sanitized = this.stripScripts(html)

    // Sanitizar tags HTML permitidas
    sanitized = this.sanitizeHTMLTags(sanitized)

    // Sanitizar atributos
    sanitized = this.sanitizeAttributes(sanitized)

    // Remover padrões perigosos restantes
    sanitized = this.removeDangerousPatterns(sanitized)

    return sanitized
  }

  // Sanitizar URL
  static sanitizeURL(url: string): string {
    if (typeof url !== 'string') return ''

    try {
      // Remover whitespace
      url = url.trim()

      // Verificar se é URL relativa ou absoluta
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
        return '#invalid-url'
      }

      // Parsear URL
      const parsedUrl = new URL(url, 'http://localhost')

      // Permitir apenas protocolos seguros
      if (!['http:', 'https:', 'mailto:', 'tel:'].includes(parsedUrl.protocol)) {
        return '#invalid-protocol'
      }

      // Remover credenciais da URL
      parsedUrl.username = ''
      parsedUrl.password = ''

      // Sanitizar query parameters
      const sanitizedParams = new URLSearchParams()
      for (const [key, value] of parsedUrl.searchParams) {
        if (this.isSafeQueryParam(key, value)) {
          sanitizedParams.append(key, value)
        }
      }
      parsedUrl.search = sanitizedParams.toString()

      // Remover fragmento se contiver javascript
      if (parsedUrl.hash && this.DANGEROUS_PATTERNS.some(pattern => pattern.test(parsedUrl.hash))) {
        parsedUrl.hash = ''
      }

      return parsedUrl.toString()

    } catch {
      return '#invalid-url'
    }
  }

  // Sanitizar email
  static sanitizeEmail(email: string): string {
    if (typeof email !== 'string') return ''

    // Remover whitespace
    email = email.trim().toLowerCase()

    // Validação básica de formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return ''
    }

    // Remover caracteres perigosos
    email = email.replace(/[<>"'&]/g, '')

    return email
  }

  // Sanitizar nome de usuário
  static sanitizeUsername(username: string): string {
    if (typeof username !== 'string') return ''

    // Permitir apenas caracteres alfanuméricos e alguns especiais
    username = username.replace(/[^a-zA-Z0-9_\-.@]/g, '')

    // Limitar tamanho
    username = username.substring(0, 50)

    // Remover whitespace do início e fim
    username = username.trim()

    // Não permitir usernames que parecem emails
    if (username.includes('@')) {
      return username.split('@')[0]
    }

    return username
  }

  // Sanitizar dados de formulário
  static sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        // Determinar tipo de sanitização baseado no nome do campo
        if (key.toLowerCase().includes('email')) {
          sanitized[key] = this.sanitizeEmail(value)
        } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('website')) {
          sanitized[key] = this.sanitizeURL(value)
        } else if (key.toLowerCase().includes('password')) {
          // Não sanitizar senhas, apenas validar formato
          sanitized[key] = value.length > 0 ? value : ''
        } else if (key.toLowerCase().includes('html') || key.toLowerCase().includes('content')) {
          sanitized[key] = this.sanitizeHTML(value)
        } else {
          sanitized[key] = this.sanitizeText(value)
        }
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeFormData(value)
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => {
          if (typeof item === 'string') {
            return this.sanitizeText(item)
          }
          return item
        })
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  // Métodos privados
  private static encodeHTMLEntities(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  private static stripScripts(html: string): string {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<script\b[^>]*>/gi, '')
      .replace(/<\/script>/gi, '')
      .replace(/on\w+\s*=['"][^'"]*['"]/gi, '') // Remove event handlers
  }

  private static sanitizeHTMLTags(html: string): string {
    // Remover todas as tags não permitidas
    const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g

    return html.replace(tagPattern, (match, tagName) => {
      const lowerTagName = tagName.toLowerCase()

      if (this.ALLOWED_HTML_TAGS.hasOwnProperty(lowerTagName)) {
        // Tag permitida - sanitizar atributos
        return this.sanitizeTagAttributes(match, lowerTagName)
      } else {
        // Tag não permitida - remover
        return ''
      }
    })
  }

  private static sanitizeTagAttributes(tag: string, tagName: string): string {
    const allowedAttrs = this.ALLOWED_HTML_TAGS[tagName as keyof typeof this.ALLOWED_HTML_TAGS]
    if (!allowedAttrs || allowedAttrs.length === 0) {
      return tag.replace(/<[^>]+>/, `<${tagName}>`)
    }

    // Extrair atributos
    const attrPattern = /(\w+)=['"]([^'"]*)['"]/g
    const sanitizedAttrs: string[] = []

    let match
    while ((match = attrPattern.exec(tag)) !== null) {
      const [, attrName, attrValue] = match

      if (allowedAttrs.includes(attrName.toLowerCase())) {
        // Sanitizar valor do atributo
        const sanitizedValue = this.sanitizeAttributeValue(attrValue, attrName)
        sanitizedAttrs.push(`${attrName}="${sanitizedValue}"`)
      }
    }

    return `<${tagName}${sanitizedAttrs.length > 0 ? ' ' + sanitizedAttrs.join(' ') : ''}>`
  }

  private static sanitizeAttributes(html: string): string {
    // Remover atributos perigosos de qualquer tag
    return html.replace(/\s+(on\w+|style|id|class)[^>]*=/gi, '')
  }

  private static sanitizeAttributeValue(value: string, attrName: string): string {
    // Para href, sanitizar como URL
    if (attrName.toLowerCase() === 'href') {
      return this.sanitizeURL(value)
    }

    // Para outros atributos, sanitizar como texto
    return this.encodeHTMLEntities(value)
  }

  private static removeDangerousPatterns(text: string): string {
    let sanitized = text

    for (const pattern of this.DANGEROUS_PATTERNS) {
      sanitized = sanitized.replace(pattern, '')
    }

    return sanitized
  }

  private static isSafeQueryParam(key: string, value: string): boolean {
    const dangerousKeys = ['script', 'javascript', 'data', 'vbscript', 'onload', 'onerror']
    const dangerousValues = ['javascript:', 'data:', 'vbscript:', '<script', '</script>']

    return !dangerousKeys.some(dangerous =>
      key.toLowerCase().includes(dangerous)
    ) && !dangerousValues.some(dangerous =>
      value.toLowerCase().includes(dangerous)
    )
  }
}

// Decorator para sanitizar inputs em funções
export function sanitizeInput(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value

  descriptor.value = function(...args: any[]) {
    // Sanitizar todos os argumentos string
    const sanitizedArgs = args.map(arg => {
      if (typeof arg === 'string') {
        return InputSanitizer.sanitizeText(arg)
      }
      if (typeof arg === 'object' && arg !== null) {
        return InputSanitizer.sanitizeFormData(arg)
      }
      return arg
    })

    return originalMethod.apply(this, sanitizedArgs)
  }

  return descriptor
}

// Middleware para sanitização de requests
export function createSanitizationMiddleware() {
  return async (request: Request) => {
    // Clonar request para poder modificar body
    const clonedRequest = request.clone()

    try {
      // Se tem body, sanitizar
      if (request.method !== 'GET' && request.headers.get('content-type')?.includes('application/json')) {
        const body = await clonedRequest.json()
        const sanitizedBody = InputSanitizer.sanitizeFormData(body)

        // Criar novo request com body sanitizado
        return new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(sanitizedBody),
        })
      }
    } catch (error) {
      console.error('Sanitization middleware error:', error)
    }

    return request
  }
}

// Hook React para sanitização
export function useSanitization() {
  const sanitize = {
    text: (text: string) => InputSanitizer.sanitizeText(text),
    html: (html: string) => InputSanitizer.sanitizeHTML(html),
    url: (url: string) => InputSanitizer.sanitizeURL(url),
    email: (email: string) => InputSanitizer.sanitizeEmail(email),
    username: (username: string) => InputSanitizer.sanitizeUsername(username),
    formData: (data: Record<string, any>) => InputSanitizer.sanitizeFormData(data),
  }

  return { sanitize }
}