# Plano do Módulo Dashboard - Página Principal do Aplicativo

## Visão Geral
Implementação da página principal (dashboard) que oferece uma visão integrada do dia do usuário com atividades, prioridades, foco, compromissos e medicamentos, além de atalhos para módulos principais.

## Referência
Baseado na auditoria em `docs/dashboard-auditoria.md`

## Objetivos do Módulo
- Oferecer visão inicial integrada do dia do usuário
- Exibir múltiplos widgets em grid responsiva
- Orquestrar dados via server actions
- Implementar atalhos rápidos para todos os módulos
- Garantir performance com cache e streaming

## Tarefas Detalhadas

### 1. Estrutura da Página
- [ ] Criar `app/page.tsx` (página principal)
- [ ] Implementar estrutura de grid responsiva (3-4 colunas)
- [ ] Configurar streaming com Suspense para cada widget
- [ ] Implementar fallback para usuários não autenticados
- [ ] Adicionar loading states individuais por widget

### 2. Server Actions e Data Fetching
- [ ] Criar `server-actions/dashboard/`
- [ ] Implementar `getDashboardData()` action
- [ ] Implementar `addActivity()` action
- [ ] Implementar `toggleActivity()` action
- [ ] Implementar `addPriority()` action
- [ ] Implementar `togglePriority()` action
- [ ] Implementar `startFocusSession()` action
- [ ] Implementar `pauseFocusSession()` action
- [ ] Implementar `stopFocusSession()` action
- [ ] Implementar `getDashboardSummary()` action

### 3. Componentes de Widgets

#### Painel do Dia
- [ ] Criar `components/features/dashboard/activity-panel.tsx`
- [ ] Implementar lista de atividades do dia
- [ ] Adicionar funcionalidade de criar nova atividade
- [ ] Implementar marcar/desmarcar como concluído
- [ ] Adicionar filtragem por status
- [ ] Implementar ordenação por horário

#### Seus Módulos
- [ ] Criar `components/features/dashboard/modules-grid.tsx`
- [ ] Implementar grid de módulos com progresso
- [ ] Adicionar atalhos para todos os módulos principais:
  - [ ] Alimentação
  - [ ] Autoconhecimento
  - [ ] Concursos
  - [ ] Estudos
  - [ ] Finanças
  - [ ] Hiperfocos
  - [ ] Lazer
  - [ ] Perfil
  - [ ] Receitas
  - [ ] Saúde
  - [ ] Sono
- [ ] Implementar indicadores de progresso visual
- [ ] Adicionar navegação rápida

#### Prioridades do Dia
- [ ] Criar `components/features/dashboard/priorities-widget.tsx`
- [ ] Implementar lista de prioridades
- [ ] Adicionar funcionalidade de criar prioridade
- [ ] Implementar marcar/desmarcar como concluído
- [ ] Adicionar drag-and-drop para reordenar
- [ ] Implementar persistência de ordem

#### Foco (Temporizador)
- [ ] Criar `components/features/dashboard/focus-timer.tsx`
- [ ] Implementar temporizador de foco integrado
- [ ] Adicionar controles de iniciar/pausar/parar
- [ ] Implementar visualização de tempo restante
- [ ] Adicionar histórico de sessões recentes
- [ ] Implementar metas diárias de foco

#### Próximos Compromissos
- [ ] Criar `components/features/dashboard/upcoming-commitments.tsx`
- [ ] Implementar lista de compromissos próximos
- [ ] Adicionar filtragem por período (hoje, esta semana)
- [ ] Implementar visualização de horários
- [ ] Adicionar integração com calendário
- [ ] Implementar notificações

#### Medicamentos
- [ ] Criar `components/features/dashboard/medications-reminder.tsx`
- [ ] Implementar lista de medicamentos do dia
- [ ] Adicionar funcionalidade de marcar como tomado
- [ ] Implementar horários dos medicamentos
- [ ] Adicionar alertas para medicamentos pendentes
- [ ] Limitar a 3 itens visíveis com opção "ver todos"

#### Dica do Dia
- [ ] Criar `components/features/dashboard/daily-tip.tsx`
- [ ] Implementar sistema de dicas educativas
- [ ] Adicionar rotação de dicas
- [ ] Implementar dicas contextualizadas por módulo
- [ ] Adicionar opção de favoritar dicas

### 4. Hooks Customizados
- [ ] Criar `hooks/use-dashboard.ts`
- [ ] Implementar gerenciamento de estado otimizado
- [ ] Adicionar tratamento de erros consolidado
- [ ] Implementar refetch de dados
- [ ] Adicionar cache estratégico

### 5. Performance e Otimização
- [ ] Implementar revalidateTag por widget
- [ ] Adicionar streaming com Suspense boundaries
- [ ] Implementar lazy loading para widgets fora da viewport
- [ ] Otimizar queries de banco de dados
- [ ] Implementar memoização de componentes

### 6. UX e Acessibilidade
- [ ] Adicionar skeletons para cada widget
- [ ] Implementar toast notifications para feedback
- [ ] Garantir navegação por teclado
- [ ] Adicionar ARIA labels e roles
- [ ] Implementar preferências de ordem de widgets
- [ ] Adicionar modo compacto para telas pequenas

## Entregáveis Esperados
- Página dashboard funcional e responsiva
- Server actions para todas as operações
- Componentes de widgets implementados
- Sistema de cache e streaming otimizado
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Streaming e Suspense por widget
3. Performance com cache segmentado
4. UX acessível e responsiva

## Notas de Implementação
- Priorizar server-first approach
- Implementar RLS em todas as operações
- Garantir consistência com outros módulos
- Adicionar tratamento robusto de erros