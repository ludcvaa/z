# Plano do Módulo Finanças - Gestão Financeira Pessoal

## Visão Geral
Implementação do módulo de finanças que auxilia o usuário a visualizar e organizar finanças pessoais com rastreamento de gastos, envelopes virtuais, calendário de pagamentos e registro rápido de despesas.

## Referência
Baseado na auditoria em `docs/financas-auditoria.md`

## Objetivos do Módulo
- Visualizar gastos por categoria com gráficos
- Gerenciar envelopes virtuais com limites
- Controlar calendário de pagamentos com recorrência
- Registrar despesas rapidamente
- Oferecer insights financeiros

## Tarefas Detalhadas

### 1. Estrutura da Página
- [ ] Criar `app/(auth)/financas/page.tsx`
- [ ] Implementar layout em grid responsiva (até duas colunas)
- [ ] Adicionar loading states
- [ ] Implementar fallback para não autenticados
- [ ] Configurar streaming com Suspense

### 2. Server Actions
- [ ] Criar `server-actions/financas/expenses.ts`
  - [ ] `createExpense()`, `updateExpense()`, `deleteExpense()`
  - [ ] `getExpenses()`, `getExpensesByCategory()`
  - [ ] `getExpenseStatistics()`
- [ ] Criar `server-actions/financas/categories.ts`
  - [ ] `createCategory()`, `updateCategory()`
  - [ ] `getCategories()`, `getCategoryTotals()`
- [ ] Criar `server-actions/financas/envelopes.ts`
  - [ ] `createEnvelope()`, `updateEnvelope()`
  - [ ] `getEnvelopes()`, `updateEnvelopeUsage()`
- [ ] Criar `server-actions/financas/payments.ts`
  - [ ] `createScheduledPayment()`, `updateScheduledPayment()`
  - [ ] `getScheduledPayments()`, `markPaymentAsPaid()`

### 3. Componentes de Funcionalidades

#### Rastreador de Gastos
- [ ] Criar `components/features/financas/expense-tracker.tsx`
- [ ] Implementar gráfico de pizza com Recharts
- [ ] Adicionar lista por categorias com totais
- [ ] Implementar filtros por período
- [ ] Adicionar comparação com períodos anteriores
- [ ] Implementar exportação de dados
- [ ] Adicionar modo cliente-only para gráficos

#### Envelopes Virtuais
- [ ] Criar `components/features/financas/virtual-envelopes.tsx`
- [ ] Implementar cards de envelopes com cores
- [ ] Adicionar valores total/usado/percentual
- [ ] Implementar funcionalidade de alocar recursos
- [ ] Adicionar alertas de estouro de orçamento
- [ ] Implementar histórico de alocações
- [ ] Adicionar metas por envelope

#### Calendário de Pagamentos
- [ ] Criar `components/features/financas/payment-calendar.tsx`
- [ ] Implementar visão de calendário mensal
- [ ] Adicionar lista de pagamentos agendados
- [ ] Implementar sistema de recorrência (RRULE)
- [ ] Adicionar marcação de pago/pendente
- [ ] Implementar notificações de vencimento
- [ ] Adicionar geração de próximas ocorrências

#### Registro Rápido de Despesas
- [ ] Criar `components/features/financas/quick-expense.tsx`
- [ ] Implementar formulário simplificado
- [ ] Adicionar campos: descrição, valor, categoria, data
- [ ] Implementar auto-completar de categorias
- [ ] Adicionar sugestões baseadas no histórico
- [ ] Implementar validação em tempo real
- [ ] Adicionar feedback visual de salvamento

#### Dashboard Financeiro
- [ ] Criar `components/features/financas/financial-dashboard.tsx`
- [ ] Implementar cards com totais do mês
- [ ] Adicionar comparação com mês anterior
- [ ] Implementar tendências de gastos
- [ ] Adicionar alertas e insights
- [ ] Implementar metas financeiras
- [ ] Adicionar resumo rápido

### 4. Validações e Schemas
- [ ] Criar `lib/validations/financas.ts`
- [ ] Implementar schema para despesas (valor, categoria, data)
- [ ] Implementar schema para categorias (nome, cor, limite)
- [ ] Implementar schema para envelopes (nome, cor, valores)
- [ ] Implementar schema para pagamentos agendados
- [ ] Adicionar validações monetárias
- [ ] Implementar sanitização de entradas

### 5. Hooks Customizados
- [ ] Criar `hooks/use-financas.ts`
- [ ] Implementar gerenciamento de despesas
- [ ] Implementar gerenciamento de envelopes
- [ ] Implementar gerenciamento de pagamentos
- [ ] Adicionar cálculos e agregações
- [ ] Implementar estratégias de cache

### 6. Gráficos e Visualizações
- [ ] Configurar Recharts para SSR
- [ ] Implementar gráfico de pizza para categorias
- [ ] Adicionar gráfico de linha para tendências
- [ ] Implementar gráfico de barras para comparações
- [ ] Adicionar tooltips interativos
- [ ] Implementar exportação de imagens

### 7. Performance e Otimização
- [ ] Implementar revalidateTag para dados financeiros
- [ ] Adicionar lazy loading para gráficos
- [ ] Implementar cache de agregações
- [ ] Otimizar queries complexas
- [ ] Adicionar streaming para componentes pesados

### 8. UX e Acessibilidade
- [ ] Adicionar skeletons para carregamento
- [ ] Implementar toast notifications
- [ ] Adicionar confirmações para exclusões
- [ ] Implementar formatação monetária
- [ ] Adicionar atalhos de teclado
- [ ] Implementar modo de alto contraste

## Entregáveis Esperados
- Dashboard financeiro completo
- Sistema de categorização e envelopes
- Calendário de pagamentos com recorrência
- Registro rápido de despesas
- Gráficos e visualizações
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Modelagem consistente de dados
3. Sistema robusto de recorrência
4. Performance com otimizações

## Notas de Implementação
- Implementar RLS por user_id
- Normalizar categorias e envelopes
- Garantir timezone consistente
- Implementar validações robustas
- Priorizar server-first approach