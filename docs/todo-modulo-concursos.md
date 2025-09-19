# Plano do Módulo Concursos - Sistema Completo para Gestão de Concursos

## Visão Geral
Implementação do módulo de concursos que permite gerenciar concursos, disciplinas, tópicos, banco de questões e simulados, com execução de simulados e revisão de resultados.

## Referência
Baseado na auditoria em `docs/concursos-auditoria.md`

## Objetivos do Módulo
- Gerenciar concursos com informações completas
- Organizar conteúdo programático em disciplinas e tópicos
- Manter banco de questões com metadados detalhados
- Criar e executar simulados personalizados
- Analisar desempenho com estatísticas detalhadas

## Tarefas Detalhadas

### 1. Estrutura de Rotas
- [ ] Criar `app/(auth)/concursos/page.tsx` (listagem)
- [ ] Criar `app/(auth)/concursos/[id]/page.tsx` (detalhes)
- [ ] Criar `app/(auth)/concursos/[id]/questoes/page.tsx` (gestão de questões)
- [ ] Criar `app/(auth)/concursos/[id]/simulados/page.tsx` (listagem de simulados)
- [ ] Criar `app/(auth)/concursos/[id]/simulados/[simuladoId]/executar/page.tsx` (execução)
- [ ] Criar `app/(auth)/concursos/[id]/simulados/[simuladoId]/historico/page.tsx` (histórico)
- [ ] Adicionar loading states para cada rota

### 2. Server Actions
- [ ] Criar `server-actions/concursos/contests.ts`
  - [ ] `createContest()`, `updateContest()`, `deleteContest()`
  - [ ] `getContests()`, `getContestById()`
  - [ ] `importContestFromJSON()`
- [ ] Criar `server-actions/concursos/disciplines.ts`
  - [ ] Gerenciamento de disciplinas e tópicos
- [ ] Criar `server-actions/concursos/questions.ts`
  - [ ] CRUD de questões
  - [ ] `importQuestionsFromJSON()`
  - [ ] `getQuestionsByFilters()`
- [ ] Criar `server-actions/concursos/simulations.ts`
  - [ ] `createSimulation()`, `updateSimulation()`
  - [ ] `startSimulationAttempt()`, `submitSimulationAttempt()`
  - [ ] `getSimulationStatistics()`

### 3. Componentes de Funcionalidades

#### Listagem de Concursos
- [ ] Criar `components/features/concursos/contests-grid.tsx`
- [ ] Implementar cards com status, organizadora e data
- [ ] Adicionar botões de adicionar manual e importar JSON
- [ ] Implementar filtros por status e organizadora
- [ ] Adicionar busca textual
- [ ] Implementar paginação

#### Detalhes do Concurso
- [ ] Criar `components/features/concursos/contest-details.tsx`
- [ ] Exibir informações completas do concurso
- [ ] Listar disciplinas e tópicos
- [ ] Adicionar atalhos para questões e simulados
- [ ] Implementar edição do concurso
- [ ] Adicionar gráfico de progresso

#### Banco de Questões
- [ ] Criar `components/features/concursos/question-bank.tsx`
- [ ] Implementar tabela/lista de questões
- [ ] Adicionar modal de criação/edição de questões
- [ ] Implementar importação via JSON
- [ ] Adicionar filtros por dificuldade, assunto, ano
- [ ] Implementar seletor para simulado personalizado
- [ ] Adicionar visualização detalhada da questão

#### Simulados
- [ ] Criar `components/features/concursos/simulations-manager.tsx`
- [ ] Implementar listagem de simulados do concurso
- [ ] Adicionar configuração de simulados (título, questões, tempo)
- [ ] Implementar filtros de dificuldade e assunto
- [ ] Adicionar importação de simulados via JSON
- [ ] Exibir estatísticas básicas

#### Execução de Simulado
- [ ] Criar `components/features/concursos/simulation-engine.tsx`
- [ ] Implementar interface de perguntas e alternativas
- [ ] Adicionar barra de progresso e navegação
- [ ] Implementar registro de respostas e tempo
- [ ] Adicionar marcação de questões para revisão
- [ ] Implementar finalização e cálculo de nota
- [ ] Adicionar timer com pausa opcional

#### Resultados e Revisão
- [ ] Criar `components/features/concursos/simulation-results.tsx`
- [ ] Exibir sumário de acertos/erros/percentual
- [ ] Implementar revisão questão a questão
- [ ] Adicionar explicações quando disponíveis
- [ ] Implementar comparação com tentativas anteriores
- [ ] Adicionar gráficos de desempenho

#### Estatísticas
- [ ] Criar `components/features/concursos/statistics-charts.tsx`
- [ ] Implementar gráficos de desempenho por assunto
- [ ] Adicionar evolução de notas ao longo do tempo
- [ ] Implementar análise de tempo por questão
- [ ] Adicionar comparação com metas

### 4. Validações e Schemas
- [ ] Criar `lib/validations/concursos.ts`
- [ ] Implementar schemas para:
  - [ ] Contest (organizadora, datas, status)
  - [ ] Question (enunciado, alternativas, gabarito, metadados)
  - [ ] Simulation (configuração, filtros, tempo)
  - [ ] SimulationAttempt (respostas, tempo, nota)
- [ ] Adicionar validação de JSON de importação
- [ ] Implementar sanitização de textos longos

### 5. Hooks Customizados
- [ ] Criar `hooks/use-concursos.ts`
- [ ] Criar `hooks/use-questions.ts`
- [ ] Criar `hooks/use-simulations.ts`
- [ ] Criar `hooks/use-simulation-history.ts`
- [ ] Criar `hooks/use-simulation-statistics.ts`
- [ ] Implementar gerenciamento de estado otimizado
- [ ] Adicionar estratégias de cache

### 6. Performance e Otimização
- [ ] Implementar revalidateTag para dados de concursos
- [ ] Adicionar lazy loading para listas longas
- [ ] Implementar cache de questões e simulados
- [ ] Otimizar queries com índices adequados
- [ ] Adicionar streaming para componentes pesados

### 7. UX e Acessibilidade
- [ ] Adicionar skeletons para carregamento
- [ ] Implementar toast notifications
- [ ] Adicionar confirmações para ações destrutivas
- [ ] Implementar navegação por teclado
- [ ] Adicionar ARIA labels apropriados
- [ ] Implementar modo de foco

## Entregáveis Esperados
- Sistema completo de gestão de concursos
- Banco de questões funcional
- Motor de simulados completo
- Sistema de estatísticas detalhado
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Unificação de modelos (questões/simulados)
3. Persistência de estado no backend
4. Performance com otimizações adequadas

## Notas de Implementação
- Implementar RLS rigoroso por user_id
- Unificar tipos de simulado/questões
- Persistir sessões no backend
- Implementar validação robusta de importações
- Adicionar estratégia de concorrência