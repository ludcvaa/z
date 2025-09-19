# AuthProvider - StayFocus

Este documento descreve o sistema de Provider de Autenticação implementado no projeto.

## Visão Geral

O AuthProvider é um contexto React que gerencia o estado global de autenticação em toda a aplicação, fornecendo uma maneira centralizada e eficiente de gerenciar sessões de usuário.

## Arquivos Principais

```
src/components/providers/
├── auth-provider.tsx          # Provider principal de autenticação
├── app-provider.tsx           # Provider wrapper principal
└── index.ts                   # Exportações

src/components/auth/
├── ProtectedRoute.tsx         # Componente de proteção de rotas
├── AuthLoading.tsx            # Componente de loading
└── UserProfile.tsx            # Componente de perfil do usuário

src/components/layout/
└── Header.tsx                 # Header que usa o AuthProvider
```

## AuthProvider Features

### 1. Gerenciamento de Estado Centralizado
- **Estado do usuário**: User | null
- **Sessão**: Session | null
- **Loading state**: boolean
- **Estado de erro**: AuthError | null

### 2. Métodos Disponíveis

```typescript
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
}
```

### 3. Hooks Disponíveis

```typescript
// Hook principal para autenticação
const { user, loading, signIn, signOut } = useAuth()

// Hook para verificar autenticação (com loading state)
const { isAuthenticated, loading } = useRequireAuth()

// Hook para obter usuário atual (com erro se não autenticado)
const { user, loading, error } = useCurrentUser()
```

## Como Usar

### 1. Configuração no Layout Principal

```tsx
// src/app/layout.tsx
import { AppProvider } from '@/components/providers/app-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}
```

### 2. Proteger Rotas

```tsx
// Usando ProtectedRoute
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function Dashboard() {
  return (
    <ProtectedRoute redirectTo="/auth/login">
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  )
}
```

### 3. Usar Hooks em Componentes

```tsx
// Em qualquer componente
import { useAuth } from '@/components/providers/auth-provider'

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()

  if (loading) return <Spinner />

  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sair</button>
      ) : (
        <button onClick={() => signIn('email@example.com', 'password')}>
          Entrar
        </button>
      )}
    </div>
  )
}
```

### 4. Componente de Perfil

```tsx
import { UserProfile } from '@/components/auth/UserProfile'

function Header() {
  return (
    <header>
      <UserProfile />
    </header>
  )
}
```

## Features Avançadas

### 1. Auto-Refresh de Sessão
- Verificação automática a cada 30 minutos
- Logout automático se sessão expirar
- Atualização silenciosa de tokens

### 2. Gerenciamento de Erros
- Captura centralizada de erros
- Propagação de erros para componentes
- Logging automático de erros

### 3. Loading States
- Loading inicial durante carregamento da sessão
- Estados de loading para operações assíncronas
- Componentes de loading reutilizáveis

### 4. Listener em Tempo Real
- Atualização instantânea quando usuário faz login/logout
- Sincronização entre múltiplas abas
- Eventos de mudança de estado

## Exemplos de Uso

### 1. Formulário de Login com Provider

```tsx
import { useAuth } from '@/components/providers/auth-provider'

function LoginForm() {
  const { signIn, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await signIn(email, password)

    if (error) {
      console.error('Login failed:', error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <div className="error">{error.message}</div>}
    </form>
  )
}
```

### 2. Proteção por Role

```tsx
import { RoleProtectedRoute } from '@/components/auth/ProtectedRoute'

function AdminPanel() {
  return (
    <RoleProtectedRoute requiredRole="admin">
      <div>Painel de Administrador</div>
    </RoleProtectedRoute>
  )
}
```

### 3. Header Dinâmico

```tsx
import { Header } from '@/components/layout/Header'

function App() {
  return (
    <div>
      <Header />
      <main>
        {/* Conteúdo */}
      </main>
    </div>
  )
}
```

## Performance e Otimizações

### 1. Memoização
- Contexto otimizado com React.memo
- Evita re-renders desnecessários
- Componentes memoizados onde necessário

### 2. Lazy Loading
- Carregamento sob demanda de componentes
- Splitting de código automático
- Otimização de bundle size

### 3. Cache Local
- Sessão cacheada localmente
- Redução de chamadas à API
- Offline detection

## Segurança

### 1. Proteções Implementadas
- ✅ Validação de tokens JWT
- ✅ Proteção CSRF
- ✅ Secure cookies
- ✅ Rate limiting implícito
- ✅ Sanitização de dados

### 2. Best Practices
- Never expose sensitive data in context
- Always validate on server side
- Use HTTPS in production
- Implement proper error handling

## Troubleshooting

### Problemas Comuns

**Estado não atualiza**
- Verifique se o componente está dentro do AuthProvider
- Confirme se o listener está funcionando
- Verifique console para erros

**Performance lenta**
- Verifique re-renders desnecessários
- Otimize componentes com memo
- Verifique tamanho do contexto

**Erros de autenticação**
- Verifique configuração do Supabase
- Confirme variáveis de ambiente
- Verifique network requests

### Debug
```typescript
// Habilitar logging detalhado
const { user, loading } = useAuth()

console.log('Auth State:', { user, loading })

// Verificar eventos de autenticação
useEffect(() => {
  console.log('Auth state changed')
}, [user])
```

## Próximos Passos

1. **Adicionar persistência offline**: Cache local para uso offline
2. **Implementar refresh tokens**: Gerenciamento avançado de sessões
3. **Adicionar suporte a múltiplos dispositivos**: Sessão sincronizada
4. **Implementar rate limiting**: Proteção contra brute force
5. **Adicionar analytics**: Rastreamento de eventos de autenticação

## Integração com Outros Sistemas

### 1. Server Actions
```typescript
// server-actions/auth.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export async function getServerSession() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
```

### 2. Middleware
```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'

export async function middleware(request) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll() } }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Lógica de proteção de rotas
  return response
}
```

O AuthProvider fornece uma base sólida e escalável para gerenciar autenticação em toda a aplicação StayFocus.