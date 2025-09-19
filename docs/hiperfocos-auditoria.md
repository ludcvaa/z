Auditoria do Módulo: Hiperfocos (app/hiperfocos)

Resumo geral
- Objetivo: ajudar usuários (especialmente neurodivergentes) a direcionar hiperfocos para objetivos práticos, convertendo interesses em projetos, alternando tarefas de forma saudável e mantendo foco com um temporizador dedicado.
- Escopo: página client-side com autenticação obrigatória; integra ferramentas de conversão de interesses, sistema de alternância de tarefas, visualização de projetos/tarefas e um temporizador de foco.

Arquitetura e composição
- Rota: /hiperfocos. Página com Tabs que agrupam quatro funcionalidades:
  - Conversor de Interesses: transforma interesses em projetos/tarefas com cores e estrutura básica.
  - Sistema de Alternância: ajuda a alternar entre tarefas/projetos para evitar fadiga e manter engajamento.
  - Estrutura de Projetos: visualiza projetos com cores, tarefas e status de conclusão.
  - Temporizador: cronômetro de foco dedicado (diferente do Pomodoro), com ciclos e controles de pausa/retomada.
- Resumo dos Hiperfocos: cartão que apresenta progresso por projeto (tarefas concluídas/total).
- Layout: tema escuro, uso de cards e grid responsiva; herda RootLayout (cabeçalho/tema/AuthProvider).

Funcionalidades por bloco
- Autenticação
  - Bloqueio de acesso para não autenticados; tela de carregamento durante fetch inicial.

- Conversor de Interesses
  - Captura interesses e converte em projetos e tarefas; aplica cor/identidade visual.

- Sistema de Alternância
  - Define lógica de alternância entre tarefas/projetos (ex.: rotacionar, priorizar, evitar monotonia); provê UI para executar trocas.

- Estrutura de Projetos
  - Visualização dos projetos com tarefas, contadores de concluídas e cores; pode oferecer ações básicas (criar, completar, reordenar) conforme hook.

- Temporizador de Foco
  - Contador ajustável com iniciar/pausar/retomar/zerar; pode registrar sessões e fornecer estatísticas locais.

Estado, dados e integrações
- Hook useHiperfocos centraliza projetos/tarefas e suas derivadas (getProjectsWithTasks); use-pomodoro fornece lógica do temporizador.
- Persistência: indícios de integração com Supabase via hooks (padrão nos outros módulos), mas a página opera toda no cliente.
- Dados exibidos: projetos com tasks, cores, progresso; estado de timer.

Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
- Server-first + RLS: mover CRUD de projetos/tarefas para server actions; garantir políticas por user_id.
- Modelagem: entidades Projeto, Tarefa, Rotina de Alternância, Sessão de Foco; índices por user_id/status; timestamps consistentes.
- UX e acessibilidade: feedbacks de sucesso/erro (toasts), confirmação para remoções, estados skeleton; foco/aria/teclado; i18n.
- Temporizador: persistir sessões e eventos (start/pause/resume) no backend para histórico e métricas; permitir retomada cross-device.
- Performance: cache e revalidateTag; paginação para listas grandes; memoização de cálculos de progresso.
- Testes: criação/edição/conclusão de tarefas, alternância entre itens, funcionamento do temporizador, consistência do progresso mostrado no "Resumo".

Dependências e contexto
- App Router com AuthProvider; componentes de UI (tabs, cards, buttons); hooks de hiperfoco e pomodoro.

Resumo executivo
- O módulo Hiperfocos integra conversão de interesses em projetos, alternância de tarefas, visualização de estrutura e um temporizador de foco. Para uma reimplementação sólida, priorizar server actions + RLS, modelagem clara das entidades, persistência de sessões do timer e reforço de UX, acessibilidade e testes.