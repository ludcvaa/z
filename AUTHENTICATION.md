# Sistema de Autenticação - StayFocus

Este documento descreve o sistema de autenticação implementado no projeto.

## Visão Geral

O sistema utiliza Supabase Authentication com middleware do Next.js para proteger rotas e gerenciar sessões de forma segura.

## Componentes

### 1. Middleware (`middleware.ts`)
- **Localização**: Raiz do projeto
- **Função**: Intercepta todas as requisições e valida sessões
- **Recursos**:
  - Proteção de rotas autenticadas
  - Redirecionamento inteligente
  - Tratamento de erros de autenticação
  - Gerenciamento de cookies seguros

### 2. Clientes Supabase (`lib/supabase/`)
- **client.ts**: Cliente para uso no navegador
- **server.ts**: Cliente para uso no servidor com service role
- **middleware.ts**: Funções para o middleware
- **auth.ts**: Utilitários de autenticação

### 3. Hooks e Componentes
- **useAuth.ts**: Hook para gerenciar estado de autenticação
- **AuthGuard.tsx**: Componente para proteger páginas no cliente
- **AuthError.tsx**: Componente para exibir mensagens de erro

## Rotas Protegidas

### Rotas Públicas
- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`

### Rotas Protegidas (Requerem Autenticação)
- `/dashboard`
- `/profile`
- `/settings`
- `/projects`
- `/tasks`
- `/time-tracking`
- `/analytics`

## Como Usar

### 1. Proteger Páginas com AuthGuard
```tsx
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Conteúdo protegido</div>
    </AuthGuard>
  )
}
```

### 2. Usar Hook useAuth em Componentes
```tsx
import { useAuth } from '@/hooks/useAuth'

function UserProfile() {
  const { user, loading, signOut } = useAuth()

  if (loading) return <Spinner />

  return (
    <div>
      <p>Bem-vindo, {user?.email}</p>
      <button onClick={signOut}>Sair</button>
    </div>
  )
}
```

### 3. Exibir Mensagens de Erro
```tsx
import { AuthError } from '@/components/auth/AuthError'

function LoginPage() {
  return (
    <div>
      <AuthError />
      {/* Formulário de login */}
    </div>
  )
}
```

## Segurança

### Cookies HTTP-Only
- Sessões são armazenadas em cookies HTTP-Only
- Proteção contra CSRF
- Configuração segura de cookies

### Middleware
- Validação de sessão em cada requisição
- Redirecionamento automático para login
- Proteção contra acesso não autorizado

### Variáveis de Ambiente
```bash
NEXT_PUBLIC_SUPABASE_URL=seu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-servico
```

## Fluxos de Autenticação

### 1. Login
1. Usuário envia credenciais
2. Supabase valida e retorna sessão
3. Middleware atualiza cookie de sessão
4. Usuário é redirecionado para dashboard

### 2. Logout
1. Usuário clica em sair
2. Sessão é encerrada no Supabase
3. Cookie de sessão é removido
4. Usuário é redirecionado para login

### 3. Acesso a Rota Protegida
1. Middleware verifica sessão
2. Se não autenticado, redireciona para login
3. Se autenticado, permite acesso

## Tratamento de Erros

### Tipos de Erros
- `session_expired`: Sessão expirada
- `access_denied`: Acesso negado
- `invalid_credentials`: Credenciais inválidas
- `email_not_confirmed`: Email não confirmado

### Redirecionamento com Parâmetros
- `?redirect=/dashboard`: URL original para redirecionar após login
- `?error=session_expired`: Tipo de erro para exibir mensagem

## Próximos Passos

1. Implementar formulários reais de login/register
2. Adicionar confirmação de email
3. Implementar recuperação de senha
4. Adicionar autenticação social (Google, GitHub)
5. Implementar 2FA