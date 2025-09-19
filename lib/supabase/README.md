# Configuração do Supabase

Este diretório contém a configuração completa do Supabase para o projeto StayFocus.

## Arquivos

- **client.ts**: Cliente Supabase para uso no navegador (componentes React)
- **server.ts**: Cliente Supabase para uso no servidor (Server Components, Server Actions)
- **middleware.ts**: Funções para uso no middleware do Next.js
- **auth.ts**: Utilitários para autenticação e gestão de sessões
- **types.ts**: Tipos TypeScript gerados do Supabase

## Como usar

### No Cliente (Componentes React)
```typescript
'use client'

import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
```

### No Servidor (Server Components)
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
```

### Utilitários de Autenticação
```typescript
import { getSession, getCurrentUser, signOut } from '@/lib/supabase/auth'

const session = await getSession()
const user = await getCurrentUser()
await signOut()
```

## Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente:

```bash
NEXT_PUBLIC_SUPABASE_URL=seu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
SUPABASE_SERVICE_ROLE_KEY=sua-chave-servico
```

## Gerenciamento de Sessões

O middleware protege rotas e gerencia sessões usando cookies HTTP-Only para segurança.