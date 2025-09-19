# Estrutura do Projeto StayFocus

## Diretórios Principais

### `src/app/`
- Páginas e rotas da aplicação Next.js 15
- Contém layout.tsx, page.tsx e outras rotas

### `src/components/`
- Componentes React reutilizáveis
- Subdiretório `ui/` para componentes do shadcn/ui

### `src/lib/`
- Utilitários e funções auxiliares
- Configurações de bibliotecas externas

### `src/server-actions/`
- Server Actions do Next.js
- Operações do lado do servidor

### `src/database/`
- Schema do Drizzle ORM
- Migrações e configurações do banco de dados

### `src/hooks/`
- Hooks personalizados do React
- Lógica compartilhada entre componentes

### `src/types/`
- Definições de tipos TypeScript
- Interfaces e enums

### `src/styles/`
- Arquivos CSS e estilos globais
- Configurações de tema

### `public/`
- Arquivos estáticos
- Imagens, fontes, etc.

### `src/tests/`
- Testes unitários e de integração
- Configurações de teste

### `src/docs/`
- Documentação do projeto
- Guias e referências

## Fluxo de Dados

1. **Componentes** usam **Hooks** para gerenciar estado
2. **Hooks** chamam **Server Actions** para operações de CRUD
3. **Server Actions** interagem com o **Database** via Drizzle ORM
4. **Types** garantem type safety em toda a aplicação