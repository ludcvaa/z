# Plano do Módulo Estudos - Sistema de Foco e Simulados

## Visão Geral
Implementação do módulo de estudos que apoia a rotina de estudos com ferramentas de foco (Pomodoro), registro de sessões e experiência completa de simulados.

## Referência
Baseado na auditoria em `docs/estudos-auditoria.md`

## Objetivos do Módulo
- Oferecer temporizador Pomodoro para sessões de estudo
- Registrar e acompanhar sessões de estudo
- Executar simulados genéricos e personalizados
- Integrar com módulo de concursos
- Fornecer estatísticas de desempenho

## Tarefas Detalhadas

### 1. Estrutura de Rotas
- [ ] Criar `app/(auth)/estudos/page.tsx` (dashboard de estudos)
- [ ] Criar `app/(auth)/estudos/simulado/page.tsx` (simulado genérico)
- [ ] Criar `app/(auth)/estudos/simulado-personalizado/page.tsx` (simulado personalizado)
- [ ] Adicionar loading states adequados

### 2. Server Actions
- [ ] Criar `server-actions/estudos/study-sessions.ts`
  - [ ] `createStudySession()`, `updateStudySession()`
  - [ ] `getStudySessions()`, `getSessionStatistics()`
- [ ] Criar `server-actions/estudos/pomodoro-sessions.ts`
  - [ ] `startPomodoroSession()`, `pausePomodoroSession()`
  - [ ] `completePomodoroSession()`, `getPomodoroStats()`
- [ ] Criar `server-actions/estudos/study-simulations.ts`
  - [ ] `getAvailableSimulations()`, `startStudySimulation()`
  - [ ] `submitStudySimulation()`, `getStudyResults()`

### 3. Componentes de Funcionalidades

#### Dashboard de Estudos
- [ ] Criar `components/features/estudos/study-dashboard.tsx`
- [ ] Implementar temporizador Pomodoro completo
- [ ] Adicionar controles de iniciar/pausar/parar
- [ ] Implementar registro de sessões de estudo
- [ ] Adicionar estatísticas recentes
- [ ] Implementar seção "Próximo Concurso"
- [ ] Adicionar metas diárias/semanais

#### Temporizador Pomodoro
- [ ] Criar `components/features/estudos/pomodoro-timer.tsx`
- [ ] Implementar timer com ciclos (25 min trabalho, 5 min pausa)
- [ ] Adicionar configuração de tempos personalizáveis
- [ ] Implementar notificações de fim de ciclo
- [ ] Adicionar histórico de sessões
- [ ] Implementar estatísticas de produtividade
- [ ] Adicionar sons e vibrações opcionais

#### Registro de Estudos
- [ ] Criar `components/features/estudos/study-tracker.tsx`
- [ ] Implementar formulário de registro de sessão
- [ ] Adicionar campos: matéria, duração, tópico, anotações
- [ ] Implementar lista de sessões recentes
- [ ] Adicionar filtros por data e matéria
- [ ] Implementar metas de estudo
- [ ] Adicionar gráficos de progresso

#### Simulado Genérico
- [ ] Criar `components/features/estudos/generic-simulation.tsx`
- [ ] Implementar carregador/seletor de simulados
- [ ] Reutilizar motor de execução do módulo concursos
- [ ] Adicionar interface de perguntas e respostas
- [ ] Implementar navegação entre questões
- [ ] Adicionar sistema de revisão de resultados
- [ ] Implementar estatísticas detalhadas

#### Simulado Personalizado
- [ ] Criar `components/features/estudos/custom-simulation.tsx`
- [ ] Implementar verificação de questões selecionadas
- [ ] Remover dependência de localStorage
- [ ] Implementar persistência no backend
- [ ] Adicionar tratamento robusto de erros
- [ ] Implementar integração com módulo concursos
- [ ] Adicionar fallbacks para dados inválidos

### 4. Validações e Schemas
- [ ] Criar `lib/validations/estudos.ts`
- [ ] Implementar schema para sessões de estudo
- [ ] Implementar schema para sessões Pomodoro
- [ ] Implementar schema para resultados de simulados
- [ ] Adicionar validações de tempo e data
- [ ] Implementar sanitização de anotações

### 5. Hooks Customizados
- [ ] Criar `hooks/use-estudos.ts`
- [ ] Implementar gerenciamento de Pomodoro
- [ ] Implementar gerenciamento de sessões
- [ ] Implementar estado de simulados
- [ ] Adicionar sincronização com backend
- [ ] Implementar estratégias de cache

### 6. Integração com Outros Módulos
- [ ] Implementar integração com módulo Concursos
- [ ] Compartilhar motor de simulados
- [ ] Sincronizar estatísticas entre módulos
- [ ] Implementar navegação fluida
- [ ] Unificar modelos de dados

### 7. Performance e Otimização
- [ ] Implementar revalidateTag para dados de estudos
- [ ] Adicionar otimizações para temporizador
- [ ] Implementar cache offline para sessões
- [ ] Otimizar gráficos e estatísticas
- [ ] Adicionar lazy loading para histórico

### 8. UX e Melhorias
- [ ] Adicionar notificações de fim de sessão
- [ ] Implementar modo foco (distraction-free)
- [ ] Adicionar atalhos de teclado
- [ ] Implementar confirmações para ações
- [ ] Adicionar animações suaves
- [ ] Implementar modo dark/tema consistente

## Entregáveis Esperados
- Dashboard de estudos completo
- Sistema Pomodoro funcional
- Registro e estatísticas de sessões
- Sistema de simulados integrado
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Remoção de dependência de localStorage
3. Unificação com módulo concursos
4. Performance com cache estratégico

## Notas de Implementação
- Priorizar server-first approach
- Implementar persistência no backend
- Unificar modelos de simulados
- Garantir RLS rigoroso
- Adicionar tratamento robusto de erros