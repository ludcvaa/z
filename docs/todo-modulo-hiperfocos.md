# Plano do Módulo Hiperfocos - Gestão de Hiperfocos e Projetos

## Visão Geral
Implementação do módulo de hiperfocos que ajuda usuários (especialmente neurodivergentes) a direcionar hiperfocos para objetivos práticos, convertendo interesses em projetos, alternando tarefas e mantendo foco com temporizador dedicado.

## Referência
Baseado na auditoria em `docs/hiperfocos-auditoria.md`

## Objetivos do Módulo
- Converter interesses em projetos estruturados
- Implementar sistema de alternância saudável entre tarefas
- Oferecer visualização clara de projetos e progresso
- Fornecer temporizador de foco dedicado
- Acompanhar métricas de produtividade

## Tarefas Detalhadas

### 1. Estrutura da Página
- [ ] Criar `app/(auth)/hiperfocos/page.tsx`
- [ ] Implementar layout com Tabs para quatro funcionalidades
- [ ] Adicionar loading states
- [ ] Implementar fallback para não autenticados
- [ ] Configurar navegação entre funcionalidades

### 2. Server Actions
- [ ] Criar `server-actions/hiperfocos/projects.ts`
  - [ ] `createProject()`, `updateProject()`, `deleteProject()`
  - [ ] `getProjects()`, `getProjectsWithTasks()`
- [ ] Criar `server-actions/hiperfocos/tasks.ts`
  - [ ] `createTask()`, `updateTask()`, `deleteTask()`
  - [ ] `getTasksByProject()`, `toggleTaskCompletion()`
- [ ] Criar `server-actions/hiperfocos/focus-sessions.ts`
  - [ ] `startFocusSession()`, `pauseFocusSession()`
  - [ ] `resumeFocusSession()`, `completeFocusSession()`
  - [ ] `getFocusSessionStats()`
- [ ] Criar `server-actions/hiperfocos/rotations.ts`
  - [ ] `createRotation()`, `getRotationHistory()`
  - [ ] `suggestNextTask()`

### 3. Componentes de Funcionalidades

#### Conversor de Interesses
- [ ] Criar `components/features/hiperfocos/interest-converter.tsx`
- [ ] Implementar formulário para capturar interesses
- [ ] Adicionar sistema de conversão em projetos
- [ ] Implementar sugestões de estruturação
- [ ] Adicionar seleção de cores e identidade visual
- [ ] Implementar templates de projetos
- [ ] Adicionar validação de viabilidade

#### Sistema de Alternância
- [ ] Criar `components/features/hiperfocos/task-rotation.tsx`
- [ ] Implementar lógica de alternância entre tarefas
- [ ] Adicionar recomendações de troca
- [ ] Implementar histórico de alternâncias
- [ ] Adicionar métricas de eficácia
- [ ] Implementar notificações de alternância
- [ ] Adicionar configuração de intervalos

#### Estrutura de Projetos
- [ ] Criar `components/features/hiperfocos/projects-structure.tsx`
- [ ] Implementar visualização de projetos com cores
- [ ] Adicionar lista de tarefas por projeto
- [ ] Implementar contadores de conclusão
- [ ] Adicionar ações de criar/completar/reordenar
- [ ] Implementar drag-and-drop de tarefas
- [ ] Adicionar gráfico de progresso

#### Temporizador de Foco
- [ ] Criar `components/features/hiperfocos/focus-timer.tsx`
- [ ] Implementar cronômetro ajustável
- [ ] Adicionar controles de iniciar/pausar/retomar/zerar
- [ ] Implementar sessões com ciclos
- [ ] Adicionar estatísticas de sessões
- [ ] Implementar registro de produtividade
- [ ] Adicionar integração com projetos/tarefas
- [ ] Implementar modo de descanso

#### Resumo dos Hiperfocos
- [ ] Criar `components/features/hiperfocos/summary-widget.tsx`
- [ ] Implementar cartão de progresso por projeto
- [ ] Adicionar métricas consolidadas
- [ ] Implementar insights de produtividade
- [ ] Adicionar recomendações
- [ ] Implementar compartilhamento de progresso

### 4. Validações e Schemas
- [ ] Criar `lib/validations/hiperfocos.ts`
- [ ] Implementar schema para projetos (nome, cor, descrição)
- [ ] Implementar schema para tarefas (título, status, projeto)
- [ ] Implementar schema para sessões de foco
- [ ] Adicionar validações de tempo e duração
- [ ] Implementar sanitização de inputs

### 5. Hooks Customizados
- [ ] Criar `hooks/use-hiperfocos.ts`
- [ ] Implementar gerenciamento de projetos e tarefas
- [ ] Implementar estado do temporizador
- [ ] Adicionar lógica de alternância
- [ ] Implementar cálculos de progresso
- [ ] Adicionar estratégias de cache

### 6. Algoritmos de Alternância
- [ ] Implementar algoritmo de rotação baseado em:
  - [ ] Tempo desde última alternância
  - [ ] Progresso do projeto
  - [ ] Nível de energia/fadiga
  - [ ] Prioridades definidas
- [ ] Adicionar aprendizado de padrões
- [ ] Implementar sugestões personalizadas
- [ ] Adicionar configuração de regras

### 7. Performance e Otimização
- [ ] Implementar revalidateTag para dados de hiperfocos
- [ ] Adicionar otimizações para timer em tempo real
- [ ] Implementar cache local para sessões ativas
- [ ] Otimizar cálculos de progresso
- [ ] Adicionar streaming para componentes pesados

### 8. UX e Acessibilidade
- [ ] Adicionar skeletons para carregamento
- [ ] Implementar feedback visual claro
- [ ] Adicionar confirmações para ações
- [ ] Implementar navegação por teclado
- [ ] Adicionar modo de alto contraste
- [ ] Implementar redução de estímulos
- [ ] Adicionar notificações não intrusivas

### 9. Integração com Outros Módulos
- [ ] Integrar com módulo de estudos (sessões)
- [ ] Compartilhar dados de produtividade
- [ ] Sincronizar metas com perfil
- [ ] Implementar exportação de relatórios
- [ ] Adicionar integração com calendário

## Entregáveis Esperados
- Sistema completo de gestão de hiperfocos
- Conversor de interesses funcional
- Sistema de alternância inteligente
- Temporizador de foco dedicado
- Visualização de progresso claro
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Modelagem clara de entidades
3. Persistência de sessões no backend
4. Algoritmos de alternância eficazes

## Notas de Implementação
- Priorizar server-first approach
- Implementar RLS rigoroso por user_id
- Garantir acessibilidade neurodivergente
- Adicionar tratamento robusto de erros
- Implementar aprendizado contínuo