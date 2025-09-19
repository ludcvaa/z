# Plano de Setup - Fase de Configuração Base

## Visão Geral
Configuração inicial do projeto Next.js 14 com TypeScript e dependências essenciais, estabelecendo a base para todo o desenvolvimento posterior.

## Objetivos da Fase
- Inicializar projeto Next.js 14 com TypeScript
- Configurar ferramentas de desenvolvimento
- Instalar dependências essenciais
- Criar estrutura de diretórios base

## Tarefas Detalhadas

### 1. Inicialização do Projeto
- [ ] Criar novo projeto Next.js 14 com TypeScript
- [ ] Configurar package.json com scripts necessários
- [ ] Configurar tsconfig.json para strict mode
- [ ] Configurar ESLint e Prettier
- [ ] Configurar .gitignore padrão para Next.js

### 2. Dependências Essenciais
- [ ] Instalar Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- [ ] Instalar Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
- [ ] Instalar Tailwind CSS e plugins
- [ ] Instalar shadcn/ui e componentes base
- [ ] Instalar Zod para validação
- [ ] Instalar React Hook Form
- [ ] Instalar Recharts para gráficos
- [ ] Instalar lucide-react para ícones

### 3. Configuração de Ferramentas
- [ ] Configurar Tailwind CSS (tailwind.config.ts)
- [ ] Configurar Drizzle (drizzle.config.ts)
- [ ] Configurar shadcn/ui (components.json)
- [ ] Criar arquivo .env.local com variáveis de ambiente
- [ ] Configurar path aliases no tsconfig.json

### 4. Estrutura de Diretório Base
- [ ] Criar estrutura principal de diretórios:
  ```
  stayfocus/
  ├── app/
  ├── components/
  ├── lib/
  ├── server-actions/
  ├── database/
  ├── hooks/
  ├── types/
  ├── styles/
  ├── public/
  ├── tests/
  └── docs/
  ```

### 5. Arquivos de Configuração
- [ ] Criar next.config.js
- [ ] Criar postcss.config.js
- [ ] Configurar ambiente de desenvolvimento
- [ ] Documentar setup inicial

## Entregáveis Esperados
- Projeto Next.js 14 inicializado e configurado
- Todas as dependências instaladas
- Estrutura de diretórios criada
- Configurações básicas funcionais
- README inicial com instruções de setup

## Prioridades
1. TypeScript strict mode
2. Integração Supabase funcional
3. Tailwind CSS configurado
4. Estrutura de diretórios consistente

## Referências
- Baseado na estrutura definida em docs/todo.md
- Alinhado com requisitos dos módulos auditados
- Segue melhores práticas Next.js 14 App Router