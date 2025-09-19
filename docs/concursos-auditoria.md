Auditoria do Módulo: Concursos (app/concursos)

Resumo geral
- Objetivo: permitir que o usuário gerencie concursos (exames), suas disciplinas/tópicos, banco de questões e simulados; executar simulados, revisar resultados e acompanhar histórico/estatísticas.
- Escopo: conjunto de páginas client-side com autenticação obrigatória, CRUDs integrados ao Supabase e componentes de revisão/execução de simulados. Há importação de dados via JSON e integração cruzada com o módulo de Estudos.

Arquitetura e composição (rotas principais)
- /concursos: listagem dos concursos do usuário, criação manual e importação via JSON do edital.
- /concursos/[id]: detalhes do concurso (status, organizadora, datas, disciplinas/tópicos, atalhos para questões e simulados).
- /concursos/[id]/questoes: gestão do banco de questões do concurso (criar, importar, visualizar), com seletor para simulado personalizado.
- /concursos/[id]/simulados: listagem/gerenciamento de simulados do concurso (criar, configurar, importar, iniciar).
- /concursos/[id]/simulados/[simuladoId]/executar: fluxo de execução (responder, navegar, acompanhar progresso, finalizar).
- /concursos/[id]/simulados/[simuladoId]/historico: histórico de tentativas e resultados do simulado.
- /concursos/teste: rota de testes/demonstração (não essencial à navegação principal).

Fluxos e funcionalidades principais
- Listagem de concursos
  - Exige autenticação; exibe grid de cards com status, organizadora e data da prova.
  - Ações: adicionar manualmente (form modal) ou importar JSON do edital (mapeia conteúdo programático para disciplinas e tópicos).
  - Navegação para a página de detalhes do concurso ao clicar no card.

- Banco de questões
  - CRUD de questões por concurso (modais para criar, importar JSON e visualizar).
  - Metadados de questão: enunciado, alternativas, gabarito, dificuldade, assunto/topico, ano, tags; flag para "gerado por IA".
  - Seletor de questões personalizadas: seleção múltipla, selos de dificuldade e início de simulado personalizado (atualmente usando armazenamento local e redirecionamento para Estudos/simulado-personalizado).

- Simulados
  - Criação e configuração de simulados (título, contagem de questões, filtros de dificuldade/assunto/tópico, tempo, público/rascunho, etc.).
  - Importação de simulados via JSON; contagem/estatísticas básicas por simulado.
  - Execução do simulado: UI de pergunta-resposta com progresso, navegação entre questões, registro de respostas, finalização e cálculo de nota.
  - Resultados: sumário (acertos/erros/percentual), barras de progresso, revisão item a item com correção e explicação quando disponível.
  - Histórico/Estatísticas: persistência de tentativas e métricas; integração com hooks e rotas /api para estatísticas agregadas.

Layout e experiência de uso
- Tema escuro, cartões e modais com ícones; grid responsiva nas listagens.
- Padrões de UI: botões de ação, estados de carregamento genéricos, feedbacks de erro majoritariamente via console.
- Execução do simulado com barra de progresso, navegação rápida por questão e indicadores de respondida/selecionada.

Estado, dados e integrações
- Tipos do domínio definidos em types/concursos.ts (Concurso, Disciplina, Topico, Questao, Simulado) e types/simulados.ts (estrutura de simulado/questão “legada”). Há sobreposição/duplicidade de modelos.
- Hooks client-side para gestão de concursos, questões, simulados, histórico e estatísticas; acesso direto ao Supabase no navegador.
- Armazenamento local usado para simulado personalizado (lista de questões selecionadas) com redirecionamento para /estudos/simulado-personalizado (integração cruzada com módulo Estudos).
- API interna para histórico/estatísticas de simulado em app/api/simulation-history/*, utilizada por hooks de análises.

Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
- Server-first e RLS: mover leituras/mutações para server components/server actions; utilizar supabase no servidor com políticas RLS rigorosas por user_id. Evitar lógica sensível no cliente.
- Unificação de modelos: consolidar os tipos de Simulado/Questão (remover duplicidades entre types/concursos.ts e types/simulados.ts); padronizar nomenclaturas (enunciado/question_text, gabarito/correct_answer, etc.).
- Modelagem e chaves: garantir FKs entre concursos → disciplinas → tópicos → questões → simulados → tentativas; índices por chaves estrangeiras e filtros comuns (difficulty, subject/topic, year, is_active).
- Importação de JSON: validar com schema (Zod) e mapear campos com robustez; fornecer pré-visualização e relatório de inconsistências.
- Execução e resultados: persistir sessões de simulado/estado no backend (evitar localStorage) para suportar retomada, múltiplos dispositivos e auditoria; registrar timestamps e tempo por questão.
- Estatísticas: armazenar tentativas de forma normalizada e calcular agregados por assunto/tópico/dificuldade com jobs/SQL views; expor via endpoints com cache e revalidateTag.
- UX/feedbacks: substituir console logs por toasts/alerts; confirmar exclusões; skeletons para listas longas; paginação/infinite scroll; acessibilidade (aria, foco, teclado) e i18n.
- Segurança e validação: sanitização de textos longos (enunciados/explicações); limites de tamanho; controle de conteúdo gerado por IA com sinalização; auditoria de ações.
- Testes: cobertura para CRUDs, importadores, motor de simulado (cálculo de nota, correção, navegação) e estatísticas.

Taxonomia e termos do domínio (para LLMs)
- Concurso: exame com organizadora, datas, status e conteúdo programático.
- Disciplina e Tópico: hierarquia de conteúdo do concurso.
- Questão: item avaliatório com alternativas/gabarito, dificuldade, assunto/tópico, metadados.
- Simulado: conjunto de questões para prática; possui execução (tentativa), resultados e histórico.
- Tentativa/Histórico: execução do simulado com notas, tempo e respostas; base para estatísticas agregadas.

Dependências e contexto
- App Router com AuthProvider; biblioteca de UI com cards, modais, inputs, badges, progresso, etc.
- Hooks especializados (use-concursos, use-questions, use-simulados, use-simulation-history, use-simulation-statistics) e páginas/rotas API auxiliares.

Resumo executivo
- O módulo Concursos oferece um ecossistema completo: cadastro de concursos, banco de questões, criação/execução de simulados e análises históricas. Para a reimplementação com padrões rígidos, priorizar server actions + RLS, unificar modelos, validar importações, persistir estado do simulado no backend e elevar UX, acessibilidade, performance e testes para garantir robustez e escalabilidade.