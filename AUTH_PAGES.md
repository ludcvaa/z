# Páginas de Autenticação - StayFocus

Este documento descreve as páginas de autenticação implementadas no projeto.

## Estrutura de Arquivos

```
src/app/auth/
├── layout.tsx                    # Layout para páginas de auth
├── login/
│   └── page.tsx                 # Página de login
├── register/
│   └── page.tsx                 # Página de registro
├── callback/
│   └── page.tsx                 # Página de callback OAuth
├── forgot-password/
│   └── page.tsx                 # Página de esqueci senha
└── reset-password/
    └── page.tsx                 # Página de reset de senha

src/components/auth/
├── LoginForm.tsx               # Formulário de login
├── RegisterForm.tsx            # Formulário de registro
├── ForgotPasswordForm.tsx      # Formulário de recuperação de senha
├── SocialAuth.tsx              # Botões de login social
├── AuthGuard.tsx               # Guard de autenticação
└── AuthError.tsx               # Componente de erros
```

## Páginas Implementadas

### 1. Login (`/auth/login`)
- **Features**:
  - Formulário com validação Zod
  - Login com email e senha
  - Login social (Google, GitHub)
  - Redirecionamento após login
  - Lembrar usuário
  - Link para esqueci senha

### 2. Registro (`/auth/register`)
- **Features**:
  - Formulário com validação Zod
  - Validação de senha
  - Aceitação de termos
  - Login social (Google, GitHub)
  - Confirmação de email

### 3. Callback (`/auth/callback`)
- **Features**:
  - Processamento de OAuth
  - Troca de código por sessão
  - Redirecionamento inteligente
  - Tratamento de erros

### 4. Esqueci Senha (`/auth/forgot-password`)
- **Features**:
  - Formulário simples de email
  - Envio de link de recuperação
  - Validação de email

### 5. Reset de Senha (`/auth/reset-password`)
- **Features**:
  - Validação de token
  - Formulário de nova senha
  - Validação de senha
  - Atualização segura

## Componentes Reutilizáveis

### LoginForm
```tsx
import { LoginForm } from '@/components/auth/LoginForm'

function MyComponent() {
  return <LoginForm onSuccess={() => console.log('Login successful')} />
}
```

### RegisterForm
```tsx
import { RegisterForm } from '@/components/auth/RegisterForm'

function MyComponent() {
  return <RegisterForm onSuccess={() => console.log('Registration successful')} />
}
```

### SocialAuth
```tsx
import { SocialAuth } from '@/components/auth/SocialAuth'

function MyComponent() {
  return <SocialAuth redirectTo="/dashboard" />
}
```

## Validações

### Login Schema
```typescript
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})
```

### Register Schema
```typescript
const registerSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})
```

## Fluxos de Usuário

### 1. Login
1. Usuário acessa `/auth/login`
2. Preenche email e senha
3. Validação do formulário
4. Autenticação com Supabase
5. Redirecionamento para dashboard ou URL original

### 2. Registro
1. Usuário acessa `/auth/register`
2. Preenche formulário completo
3. Validação de todos os campos
4. Criação de conta no Supabase
5. Email de confirmação enviado
6. Redirecionamento para login

### 3. Recuperação de Senha
1. Usuário acessa `/auth/forgot-password`
2. Digita email cadastrado
3. Link de recuperação enviado
4. Usuário clica no link
5. Redirecionado para `/auth/reset-password`
6. Digita nova senha
7. Senha atualizada com sucesso

## Segurança

### Proteções Implementadas
- ✅ Validação de formulários no cliente
- ✅ Validação no servidor via Supabase
- ✅ Proteção CSRF
- ✅ Tokens JWT seguros
- ✅ Cookies HTTP-Only
- ✅ Proteção contra ataques de injeção

### Variáveis de Ambiente Necessárias
```bash
NEXT_PUBLIC_SUPABASE_URL=seu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

## Configuração OAuth

Para habilitar login social, configure no Supabase:

### Google
1. Acesse `Authentication > Providers > Google`
2. Ative o provedor
3. Adicione Client ID e Client Secret
4. Configure redirect URL: `https://seu-dominio.com/auth/callback`

### GitHub
1. Acesse `Authentication > Providers > GitHub`
2. Ative o provedor
3. Adicione Client ID e Client Secret
4. Configure redirect URL: `https://seu-dominio.com/auth/callback`

## Customização

### Cores e Estilos
- As páginas usam Tailwind CSS
- Cores principais: indigo-600, gray-900, white
- Layout responsivo com breakpoints
- Cards com sombras e bordas arredondadas

### Mensagens de Erro
- Mensagens amigáveis em português
- Ícones visuais para feedback
- Estados de loading com animações
- Feedback visual para validações

## Próximos Passos

1. **Adicionar mais provedores OAuth**: Microsoft, Twitter, Facebook
2. **Implementar 2FA**: Autenticação de dois fatores
3. **Adicionar rate limiting**: Proteção contra brute force
4. **Implementar reCAPTCHA**: Proteção contra bots
5. **Adicionar verificação de email**: Confirmação obrigatória
6. **Implementar SSO**: Login único para empresas

## Troubleshooting

### Problemas Comuns

**Login não funciona**
- Verifique variáveis de ambiente
- Confirme configuração do Supabase
- Verifique console do navegador

**OAuth não redireciona**
- Verifique configuração do provedor
- Confirme redirect URLs
- Verifique callback implementation

**Erros de tipo TypeScript**
- Atualize tipos do Supabase
- Verifique imports
- Confirme tsconfig.json

### Debug
- Use console.log para debugging
- Verifique network requests
- Monitore erros no console do Supabase