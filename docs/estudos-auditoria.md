Auditoria do Módulo: Estudos (app/estudos)

Resumo geral
- Objetivo: apoiar a rotina de estudos do usuário com ferramentas de foco (Pomodoro), registro de sessões de estudo, atalho e experiência de simulados (carregar, responder, revisar resultados), incluindo um fluxo de simulado personalizado.
- Escopo: páginas client-side com autenticação obrigatória e integração direta com hooks de simulados/histórico/estatísticas. Parte da lógica de simulado é compartilhada com o módulo Concursos e usa armazenamento local no fluxo personalizado.

Arquitetura e composição (rotas principais)
- /estudos: dashboard de estudos com Pomodoro, registro de estudos e seção "Próximo Concurso".
- /estudos/simulado: experiência de simulado genérica baseada no estado do hook (carregar, revisar, resultados).
- /estudos/simulado-personalizado: experiência de simulado personalizada gerada a partir de questões previamente selecionadas (armazenadas em localStorage pelo módulo Concursos).

Funcionalidades principais
- Pomodoro e Registro
  - Temporizador Pomodoro para foco em sessões de estudo.
  - Registro de estudos para acompanhar atividades e progresso diário.

- Simulado (genérico)
  - Loader: carrega/seleciona simulado (UI de carregamento, controle via hook useSimulados).
  - Review: interface de perguntas com alternativas, progresso, navegação entre questões, registro das respostas e finalização.
  - Results: sumário percentual, acertos/erros/total, revisão questão a questão com gabarito e explicações.

- Simulado Personalizado
  - Verifica presença de questões no localStorage, carrega via useSimulados e inicia o fluxo de review/resultados.
  - Tratamento de erro simples (alerta e redirecionamento de fallback para /estudos/simulado quando não há dados válidos).

Layout e experiência de uso
- Tema escuro, uso de cards, botões, barras de progresso e modais compartilhados (ex.: histórico).
- Estados visuais: carregando, revisão, resultados; feedbacks de erro via alert e logs.
- Navegador de questões com indicadores de questão atual e respondidas.

Estado, dados e integrações
- Hooks: useSimulados, useSimulations, useSimulationHistory, useSimulationStatistics (client-side), centralizam estado do simulado, histórico e análises.
- Armazenamento local: simulado personalizado depende de localStorage para transportar questões selecionadas do módulo Concursos.
- Tipos: types/simulados.ts define a estrutura de dados de simulado/questões/resultado (modelo "legado" em paralelo aos tipos em types/concursos.ts).

Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
- Server-first & persistência: mover criação/execução do simulado para o servidor; persistir sessão/estado/tempo/respostas no backend (suporte a retomada, multiplataforma, auditoria).
- Unificação de modelos: consolidar o modelo de questões/simulados entre Estudos e Concursos (evitar duplicidades e mapeamentos ad-hoc).
- Segurança e validação: evitar dependência de localStorage para dados críticos; validar entradas/JSON (Zod) e sanitizar textos longos; aplicar RLS em todas as tabelas.
- UX e acessibilidade: skeletons; confirmação de ações; mensagens claras de erro/sucesso; foco/aria/teclado; i18n.
- Performance: paginação/infinite scroll ao revisar longas listas; cache/revalidateTag para histórico/estatísticas; otimizações de render.
- Testes: cenários de simulado (carga, navegação, correção, resultados), fluxo personalizado (sem dados, dados inválidos), integração com histórico/estatísticas.

Dependências e contexto
- App Router com AuthProvider; biblioteca de UI (cards, progress, buttons); hooks de simulado/histórico/estatísticas compartilhados com Concursos.

Resumo executivo
- O módulo Estudos reúne foco (Pomodoro), registro de estudos e execução de simulados, com fluxo para simulados personalizados. Para reimplementação robusta, priorizar server actions + RLS, unificar modelo de simulado/questões, persistir sessão e respostas no backend, reforçar UX e acessibilidade e ampliar cobertura de testes e performance.