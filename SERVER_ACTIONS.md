# Server Actions para Autenticação - StayFocus

Este documento descreve o sistema de Server Actions implementado para autenticação no projeto.

## Visão Geral

As Server Actions fornecem uma maneira segura e eficiente de lidar com operações de autenticação no servidor, com validação robusta, tratamento de erros e proteções de segurança.

## Estrutura de Arquivos

```
server-actions/auth/
├── index.ts                  # Exportações principais
├── types.ts                  # Tipos e esquemas de validação
├── utils.ts                  # Utilitários e tratamento de erros
├── signin.ts                 # Actions de login
├── signup.ts                 # Actions de registro
├── signout.ts                # Actions de logout
├── reset-password.ts         # Actions de senha
└── profile.ts                # Actions de perfil

src/hooks/
└── useServerAuth.ts          # Hook para usar actions em componentes

src/components/auth/
├── ServerActionForm.tsx      # Exemplo de formulário
└── ServerAuthProfile.tsx     # Exemplo de perfil
```

## Actions Disponíveis

### 1. Autenticação

#### `signInAction(data: SignInInput)`
- **Descrição**: Realiza login com email e senha
- **Validação**: Email e senha obrigatórios
- **Rate Limiting**: 5 tentativas por minuto
- **Retorno**: `{ success, message, data?: { user, session } }`

#### `signUpAction(data: SignUpInput)`
- **Descrição**: Cria nova conta de usuário
- **Validação**: Email, senha, confirmação de senha e nome
- **Rate Limiting**: 3 tentativas por 5 minutos
- **Retorno**: `{ success, message, data?: { user, emailConfirmationRequired } }`

#### `signOutAction(options?: SignOutInput)`
- **Descrição**: Realiza logout do usuário
- **Recursos**: Suporta redirecionamento customizado
- **Retorno**: `{ success, message }`

### 2. Gerenciamento de Senha

#### `resetPasswordAction(data: ResetPasswordInput)`
- **Descrição**: Envia email de recuperação de senha
- **Segurança**: Não expõe se email existe ou não
- **Retorno**: `{ success, message, data?: { emailSent, redirectTo } }`

#### `updatePasswordAction(data: UpdatePasswordInput)`
- **Descrição**: Atualiza senha do usuário
- **Validação**: Senha forte e confirmação
- **Retorno**: `{ success, message }`

#### `verifyResetTokenAction(token: string)`
- **Descrição**: Verifica validade de token de reset
- **Retorno**: `{ success, message, valid?: boolean }`

### 3. Gerenciamento de Perfil

#### `updateProfileAction(data: UpdateProfileInput)`
- **Descrição**: Atualiza informações do perfil
- **Validação**: Nome e URL de avatar (se fornecido)
- **Retorno**: `{ success, message, data?: user }`

#### `getProfileAction()`
- **Descrição**: Obtém perfil do usuário atual
- **Retorno**: `{ success, message, data?: user }`

#### `deleteAccountAction(password: string)`
- **Descrição**: Excluir conta do usuário
- **Segurança**: Requer confirmação de senha
- **Retorno**: `{ success, message }`

### 4. Actions Adicionais

#### `signInWithOAuthAction(provider, options?)`
- **Descrição**: Login com provedores OAuth
- **Provedores**: google, github
- **Retorno**: `{ success, message, url?: string }`

#### `resendConfirmationEmailAction(email: string)`
- **Descrição**: Reenvia email de confirmação
- **Retorno**: `{ success, message }`

#### `signOutAllSessionsAction()`
- **Descrição**: Encerra todas as sessões do usuário
- **Retorno**: `{ success, message }`

## Como Usar

### 1. Diretamente em Server Components

```tsx
import { signInAction } from '@/server-actions/auth'

async function LoginPage() {
  return (
    <form action={async (formData) => {
      'use server'
      const result = await signInAction({
        email: formData.get('email'),
        password: formData.get('password'),
      })

      if (result.success) {
        redirect('/dashboard')
      }
    }}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

### 2. Com Hook em Client Components

```tsx
'use client'

import { useServerAuth } from '@/hooks/useServerAuth'

function LoginForm() {
  const { signIn, loading, error } = useServerAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn({
      email: e.target.email.value,
      password: e.target.password.value,
    })

    if (result.success) {
      window.location.href = '/dashboard'
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  )
}
```

### 3. Com Server Actions em Formulários

```tsx
'use client'

import { useForm } from 'react-hook-form'
import { signInAction } from '@/server-actions/auth'

function AdvancedLoginForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    const result = await signInAction(data)

    if (result.success) {
      // Redirecionar ou mostrar sucesso
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" />
      <input {...register('password')} type="password" />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

## Validações

### Esquemas Zod

Todos os inputs são validados com Zod:

```typescript
// Exemplo de esquema de login
const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  redirectTo: z.string().optional(),
})
```

### Validações Implementadas

- ✅ Email formato válido
- ✅ Senha mínima de 6 caracteres
- ✅ Confirmação de senha
- ✅ Nome mínimo de 2 caracteres
- ✅ URL de avatar válida
- ✅ Sanitização de URLs de redirecionamento

## Segurança

### 1. Rate Limiting
- **Login**: 5 tentativas por minuto por IP
- **Registro**: 3 tentativas por 5 minutos por IP
- **Reset de senha**: 3 tentativas por 5 minutos por IP

### 2. Proteções Implementadas
- ✅ Validação no servidor
- ✅ Sanitização de dados sensíveis
- ✅ Proteção contra enumeração de emails
- ✅ Validação de tokens JWT
- ✅ Logging seguro de ações
- ✅ Sanitização de URLs de redirecionamento

### 3. Tratamento de Erros

```typescript
// Erros personalizados com códigos específicos
export const AuthErrorCodes = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
}
```

## Logging

Todas as ações são logadas de forma segura:

```typescript
AuthErrorHandler.logAction('signin', userId, {
  ip: 'user-ip',
  userAgent: 'browser-user-agent',
})
```

## Exemplos de Uso

### 1. Formulário de Registro Completo

```tsx
'use client'

import { useServerAuth } from '@/hooks/useServerAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from '@/server-actions/auth/types'

function RegisterForm() {
  const { signUp, loading } = useServerAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data) => {
    const result = await signUp(data)

    if (result.success) {
      // Mostrar sucesso e redirecionar
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('fullName')} placeholder="Nome completo" />
      {errors.fullName && <span>{errors.fullName.message}</span>}

      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Senha" />
      {errors.password && <span>{errors.password.message}</span>}

      <input {...register('confirmPassword')} type="password" placeholder="Confirmar senha" />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <button type="submit" disabled={loading}>
        {loading ? 'Criando conta...' : 'Criar conta'}
      </button>
    </form>
  )
}
```

### 2. Dashboard com Perfil

```tsx
'use client'

import { useServerAuth } from '@/hooks/useServerAuth'
import { ServerAuthProfile } from '@/components/auth/ServerAuthProfile'

function Dashboard() {
  const { loading, error } = useServerAuth()

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      <h1>Dashboard</h1>
      <ServerAuthProfile />
    </div>
  )
}
```

## Melhores Práticas

### 1. Segurança
- Sempre valide dados no servidor
- Use HTTPS em produção
- Nunca exponha dados sensíveis
- Implemente rate limiting
- Logue ações de forma segura

### 2. Performance
- Use cache quando possível
- Evite requisições desnecessárias
- Implemente loading states
- Otimize validações

### 3. UX
- Forneça feedback claro
- Mostre loading states
- Valide em tempo real quando possível
- Redirecione após ações bem-sucedidas

## Testing

### Testes Unitários

```typescript
// tests/auth.test.ts
import { signInAction } from '@/server-actions/auth/signin'

describe('Auth Actions', () => {
  it('should sign in with valid credentials', async () => {
    const result = await signInAction({
      email: 'test@example.com',
      password: 'valid-password',
    })

    expect(result.success).toBe(true)
  })
})
```

### Testes de Integração

```typescript
// tests/integration.test.ts
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/auth/LoginForm'

describe('Auth Integration', () => {
  it('should handle form submission', async () => {
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })

    fireEvent.click(screen.getByText('Entrar'))

    // Assert expected behavior
  })
})
```

## Monitoramento

### Métricas Importantes
- Taxa de sucesso/falha de login
- Tempo médio de resposta
- Taxa de erros por tipo
- Uso de rate limiting
- Padrões de uso por região

## Próximos Passos

1. **Adicionar MFA**: Autenticação de múltiplos fatores
2. **Implementar RBAC**: Controle de acesso baseado em roles
3. **Adicionar auditoria**: Logs detalhados de segurança
4. **Implementar cache**: Redis para sessões
5. **Adicionar analytics**: Eventos de autenticação
6. **Implementar webhook**: Notificações em tempo real

As Server Actions fornecem uma base sólida, segura e escalável para gerenciar autenticação no servidor, com excelente experiência para desenvolvedores e segurança robusta.