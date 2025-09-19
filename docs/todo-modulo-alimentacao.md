# Plano do Módulo Alimentação - Gestão de Refeições e Hidratação

## Visão Geral
Implementação do módulo de alimentação que apoia a rotina alimentar do usuário com planejamento de refeições, registro diário e acompanhamento de hidratação.

## Referência
Baseado na auditoria em `docs/alimentacao-auditoria.md`

## Objetivos do Módulo
- Planejamento de refeições com horários e descrições
- Registro diário de refeições com navegação por datas
- Acompanhamento de hidratação com meta diária
- Atalho para o módulo de receitas
- Integração total com Supabase usando server actions

## Tarefas Detalhadas

### 1. Estrutura da Página
- [ ] Criar `app/(auth)/alimentacao/page.tsx`
- [ ] Implementar layout em grid responsiva (duas colunas em desktop, uma em mobile)
- [ ] Adicionar `app/(auth)/alimentacao/loading.tsx` para loading states
- [ ] Implementar navegação por datas com query string
- [ ] Adicionar fallback para usuários não autenticados

### 2. Server Actions
- [ ] Criar `server-actions/alimentacao/meal-plans.ts` (já existe)
- [ ] Criar `server-actions/alimentacao/meal-records.ts`
- [ ] Criar `server-actions/alimentacao/hydration.ts`
- [ ] Implementar validações Zod para todas as ações
- [ ] Adicionar revalidatePath para atualização de dados
- [ ] Implementar tratamento de erros padronizado

### 3. Componentes de Funcionalidades

#### Planejador de Refeições
- [ ] Criar `components/features/alimentacao/meal-planner.tsx`
- [ ] Implementar lista de planos de refeição ordenados por horário
- [ ] Adicionar funcionalidade de criar novo plano (horário + descrição)
- [ ] Implementar edição de planos existentes
- [ ] Adicionar confirmação para exclusão de planos
- [ ] Implementar persistência no Supabase

#### Registro de Refeições (Diário)
- [ ] Criar `components/features/alimentacao/meal-records.tsx`
- [ ] Implementar lista de registros do dia selecionado
- [ ] Criar `components/shared/date-navigator.tsx` para navegação
- [ ] Adicionar funcionalidade de criar novo registro
- [ ] Implementar filtro por intervalo de data/hora
- [ ] Adicionar busca textual nos registros
- [ ] Implementar paginação para muitos registros

#### Hidratação
- [ ] Criar `components/features/alimentacao/hydration-tracker.tsx`
- [ ] Implementar contador diário com meta de 8 copos
- [ ] Adicionar botões de incrementar/decrementar
- [ ] Implementar visualização de progresso (barra ou círculo)
- [ ] Adicionar persistência com upsert por dia
- [ ] Implementar histórico de hidratação
- [ ] Adicionar metas personalizáveis

#### Atalho para Receitas
- [ ] Criar componente de CTA para módulo de receitas
- [ ] Implementar link para `/receitas`
- [ ] Adicionar preview de últimas receitas
- [ ] Implementar badge com contador de receitas

### 4. Validações e Schemas
- [ ] Criar `lib/validations/alimentacao.ts`
- [ ] Implementar schema para `meal_plans` (time, description)
- [ ] Implementar schema para `meal_records` (time, description, date)
- [ ] Implementar schema para `hydration_records` (glasses_count, date)
- [ ] Adicionar validações de formato (horário HH:MM)
- [ ] Implementar sanitização de inputs

### 5. Hooks Customizados
- [ ] Criar `hooks/use-alimentacao.ts`
- [ ] Implementar gerenciamento de estado de planos de refeição
- [ ] Implementar gerenciamento de estado de registros
- [ ] Implementar gerenciamento de estado de hidratação
- [ ] Adicionar sincronização com query string de datas
- [ ] Implementar otimizações de cache

### 6. UX e Melhorias
- [ ] Adicionar skeletons de carregamento por seção
- [ ] Implementar toast notifications para feedback
- [ ] Adicionar confirmações para ações destrutivas
- [ ] Implementar feedback visual para ações concluídas
- [ ] Adicionar animações e transições suaves
- [ ] Implementar modo offline com sincronização posterior

### 7. Performance e Otimização
- [ ] Implementar revalidateTag para dados do módulo
- [ ] Adicionar streaming com Suspense para cada seção
- [ ] Otimizar queries do Supabase com índices
- [ ] Implementar cache local para operações frequentes
- [ ] Adicionar paginação ou infinite scroll

## Entregáveis Esperados
- Página de alimentação funcional e responsiva
- Server actions para todas as operações CRUD
- Componentes de planejamento, registro e hidratação
- Sistema de navegação por datas
- Integração completa com Supabase
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Modelagem consistente de datas (UTC vs local)
3. UX com feedbacks claros
4. Performance com cache estratégico

## Notas de Implementação
- Normalizar datas com timezone UTC
- Implementar RLS por user_id
- Garantir sincronização com query string
- Adicionar tratamento robusto de erros
- Priorizar server-first approach