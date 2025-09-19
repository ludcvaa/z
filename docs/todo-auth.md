# Plano de Autenticação - Sistema de Autenticação com Supabase

## Visão Geral
Implementação completa do sistema de autenticação usando Supabase, seguindo as melhores práticas do Next.js 15 com Server Actions e RLS (Row Level Security).

## Objetivos da Fase
- Configurar clientes Supabase para diferentes ambientes
- Implementar middleware de proteção de rotas
- Criar páginas de autenticação (login, register, callback)
- Implementar provider de autenticação global
- Garantir segurança com RLS e server-first approach

## Tarefas Detalhadas

### 1. Configuração de Clientes Supabase
- [ ] Criar `lib/supabase/client.ts` para uso no navegador
- [ ] Criar `lib/supabase/server.ts` para uso no servidor
- [ ] Criar `lib/supabase/middleware.ts` para uso no middleware
- [ ] Configurar tipos gerados do Supabase
- [ ] Implementar gerenciamento seguro de sessões com cookies

### 2. Middleware de Autenticação
- [ ] Implementar `middleware.ts` na raiz do projeto
- [ ] Configurar proteção para rotas autenticadas `/(auth)/*`
- [ ] Implementar redirecionamento baseado em status de autenticação
- [ ] Adicionar tratamento de erros de autenticação
- [ ] Configurar matcher para rotas específicas

### 3. Páginas de Autenticação
- [ ] Criar estrutura `app/auth/`
- [ ] Implementar página de login (`app/auth/login/page.tsx`)
- [ ] Implementar página de registro (`app/auth/register/page.tsx`)
- [ ] Implementar página de callback (`app/auth/callback/page.tsx`)
- [ ] Criar layouts específicos para páginas de auth
- [ ] Implementar formulários com validação Zod
- [ ] Adicionar tratamento de erros e feedback visual

### 4. Provider de Autenticação
- [ ] Criar `components/providers/auth-provider.tsx`
- [ ] Implementar gerenciamento de estado de autenticação
- [ ] Adicionar contexto global para usuário e sessão
- [ ] Implementar carregamento inicial e refresh de sessão
- [ ] Adicionar proteção contra acesso não autenticado

### 5. Server Actions para Autenticação
- [ ] Criar `server-actions/auth/` para ações de autenticação
- [ ] Implementar `signIn` action
- [ ] Implementar `signUp` action
- [ ] Implementar `signOut` action
- [ ] Implementar `resetPassword` action
- [ ] Adicionar validações com Zod
- [ ] Implementar tratamento de erros seguro

### 6. Segurança e Melhores Práticas
- [ ] Configurar RLS (Row Level Security) no Supabase
- [ ] Implementar proteção CSRF
- [ ] Adicionar rate limiting para endpoints de auth
- [ ] Implementar sanitização de inputs
- [ ] Configurar expiração segura de sessões
- [ ] Adicionar logging de segurança

## Entregáveis Esperados
- Sistema de autenticação funcional e seguro
- Páginas de login, registro e callback
- Middleware de proteção de rotas
- Provider global de autenticação
- Server actions para operações de auth
- Documentação de segurança

## Prioridades
1. Segurança com RLS e server-first approach
2. Experiência de usuário com feedback claro
3. Tratamento robusto de erros
4. Proteção contra acessos não autorizados

## Referências
- Baseado nos requisitos de autenticação identificados nas auditorias dos módulos
- Segue padrões do @supabase/ssr para Next.js 15
- Alinhado com estrutura definida em docs/todo.md

## Notas de Implementação
- Todos os módulos auditados exigem autenticação obrigatória
- Priorizar server actions sobre client-side operations
- Implementar fallbacks para usuários não autenticados
- Garantir consistência em toda a aplicação