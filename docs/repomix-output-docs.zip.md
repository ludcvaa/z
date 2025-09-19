This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where empty lines have been removed, line numbers have been added, security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Empty lines have been removed from all files
- Line numbers have been added to the beginning of each line
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
docs/
  alimentacao-auditoria.md
  autoconhecimento-auditoria.md
  concursos-auditoria.md
  dashboard-auditoria.md
  estudos-auditoria.md
  financas-auditoria.md
  hiperfocos-auditoria.md
  lazer-auditoria.md
  perfil-auditoria.md
  receitas-auditoria.md
  saude-auditoria.md
  sono-auditoria.md
```

# Files

## File: docs/alimentacao-auditoria.md
```markdown
 1: Auditoria do Módulo: Alimentação (app/alimentacao)
 2: 
 3: Resumo geral
 4: - Objetivo: apoiar a rotina alimentar do usuário com três pilares principais: planejamento de refeições, registro diário de refeições e acompanhamento de hidratação, além de um atalho para o módulo de receitas.
 5: - Escopo: página client-side que exige autenticação e consome diretamente o Supabase para leituras e gravações.
 6: 
 7: Arquitetura e composição
 8: - Rota: app/alimentacao (renderização dinâmica forçada). A página exporta um componente principal localizado em components/pages/alimentacao-page.
 9: - Composição principal:
10:   - Planejador de Refeições: gerenciamento de planos (lista de horários/descrições) por usuário.
11:   - Registro de Refeições: registros diários filtrados por data, com navegação entre dias.
12:   - Hidratação: contador diário de copos com meta fixa.
13:   - CTA "Minhas Receitas": link para o módulo /receitas.
14: - Layout base: utiliza o RootLayout com cabeçalho fixo, theming e provedor de autenticação.
15: 
16: Funcionalidades por bloco
17: - Autenticação
18:   - Exige usuário autenticado para exibir os recursos. Sem usuário: exibe cartão de “Login necessário” com link para /auth.
19:   - Enquanto a autenticação carrega: mostra tela de carregamento.
20: 
21: - Planejador de Refeições
22:   - Lista os planos de refeição do usuário, ordenados por horário.
23:   - Permite adicionar item (horário + descrição) e remover; há botão de “editar” ainda não implementado.
24:   - Persistência em Supabase na tabela de planos.
25: 
26: - Registro de Refeições (diário)
27:   - Mostra registros do dia atual (ou de uma data específica recebida via query string). Usa um componente de navegação por datas.
28:   - Permite adicionar um registro (horário + descrição) e remover.
29:   - Persistência em Supabase na tabela de registros; filtro por intervalo de data/hora do dia selecionado.
30: 
31: - Hidratação
32:   - Exibe progresso diário com meta de 8 copos. Permite incrementar/decrementar copos e persiste o valor do dia.
33:   - Persistência em Supabase na tabela de hidratação, uma linha por dia e usuário (upsert).
34: 
35: Layout e experiência de uso
36: - Distribuição em grid: duas colunas em telas grandes (planejador de refeições ao lado do registro diário), uma coluna em telas pequenas.
37: - Uso de cartões (headers, conteúdos) com tema escuro, ícones contextuais e botões de ação.
38: - Suspense/estados de carregamento simples por seção; feedback de erro limitado a logs.
39: - Rodapé da página traz uma citação motivacional.
40: 
41: Estado, dados e integrações
42: - Todos os blocos funcionam como client components e acessam o Supabase diretamente no navegador.
43: - Data-base: data atual derivada do relógio do cliente e/ou do parâmetro "date" na URL (formato YYYY-MM-DD). Possível divergência de fuso horário ao usar datas derivadas de ISO.
44: - Tabelas utilizadas no Supabase (nomes observados):
45:   - meal_plans: planos de refeição do usuário (campos incluem user_id, time, description, id).
46:   - meal_records: registros de refeições (campos incluem user_id, time, description, created_at, id) — filtragem por janela do dia via created_at.
47:   - hydration_records: hidratação diária (campos incluem user_id, date, glasses_count).
48: - Navegação por data: o Registro de Refeições recebe e atualiza a data atual; a página lê a data do query string quando presente.
49: 
50: Pontos de atenção para refatoração (Next.js 15 + Supabase, melhores práticas)
51: - Server-first: considerar mover leituras e mutações para server components/server actions, usando o client do Supabase no servidor com RLS, reduzindo exposição de credenciais e lógica no cliente.
52: - Modelagem de dados: normalizar datas e fusos (ex.: guardar coluna date explícita em registros de refeições em vez de filtrar por faixa de created_at). Definir timezone de referência (UTC vs local) e padronizar conversões.
53: - Estado e UX: substituir console logs por feedbacks de erro/sucesso ao usuário; adicionar skeletons de carregamento; confirmar exclusões; otimizações com revalidação/caching onde aplicável.
54: - Acessibilidade e i18n: revisar textos alternativos, aria-labels e preparação para traduções.
55: - URL e compartilhamento de estado: sincronizar mudanças de data com o query string (push/replace) para deep-linking consistente.
56: - Testes: adicionar testes de unidade e integração para fluxos de CRUD e navegação por data.
57: - Segurança: garantir RLS nas tabelas citadas para restringir por user_id; validar entradas (ex.: Zod) antes de chamadas ao backend.
58: - Funcionalidades incompletas: implementar edição no Planejador de Refeições.
59: 
60: Dependências e contexto do módulo
61: - App Router com layout global, cabeçalho e tema escuro.
62: - Biblioteca de UI (cards, botões, inputs), ícones e provider de autenticação customizado.
63: - Integração direta com Supabase em cada componente funcional.
64: 
65: Resumo executivo
66: - O módulo entrega uma visão diária e de planejamento de alimentação, mais hidratação, orientada a usuário autenticado e armazenamento no Supabase. Para reimplementação com padrões rigorosos, priorizar server actions, modelagem consistente de datas, RLS e UX com feedbacks e testes sólidos.
```

## File: docs/autoconhecimento-auditoria.md
```markdown
 1: Auditoria do Módulo: Autoconhecimento (app/autoconhecimento)
 2: 
 3: Resumo geral
 4: - Objetivo: centralizar anotações de autoconhecimento do usuário em três categorias (Quem sou, Meus porquês, Meus padrões), com criação, edição, exclusão e busca.
 5: - Escopo: página client-side dependente de autenticação, com integração direta ao Supabase para operações CRUD de notas.
 6: 
 7: Arquitetura e composição
 8: - Rota: app/autoconhecimento. A página é um client component e renderiza um fluxo com duas visões: lista e editor.
 9: - Composição principal:
10:   - Abas por categoria (Quem sou, Meus porquês, Meus padrões) para organizar notas.
11:   - Lista de notas com busca textual e ações de editar/excluir.
12:   - Editor de notas (título e conteúdo) com estado de salvamento e controle de navegação.
13: - Layout base: herda do RootLayout (cabeçalho fixo, tema, AuthProvider, etc.).
14: 
15: Funcionalidades por bloco
16: - Autenticação
17:   - Bloqueia acesso para usuários não autenticados e exibe cartão com CTA para login.
18:   - Exibe tela de carregamento enquanto estados de autenticação e carregamento de notas estão ativos.
19: 
20: - Listagem e organização
21:   - Abas definem a categoria ativa e filtram as notas por categoria.
22:   - Campo de busca filtra por título e conteúdo (case-insensitive) dentro da categoria ativa.
23:   - Cartões de nota exibem título, prévia do conteúdo e data/hora da última atualização.
24:   - Ações por nota: editar e excluir, com desabilitação temporária durante exclusão.
25: 
26: - Criação e edição
27:   - Botão “Nova nota” abre o editor em modo criação para a categoria ativa.
28:   - Edição abre o editor com a nota selecionada.
29:   - Persistência: salvar cria/atualiza no Supabase e retorna à lista.
30:   - Validações simples: título e conteúdo não vazios antes de salvar.
31: 
32: Layout e experiência de uso
33: - Organização em abas com estilos distintos por categoria.
34: - Lista com rolagem e cartões clicáveis; destaque visual para nota selecionada.
35: - Editor em tela cheia (estrutura com cabeçalho do editor, botões “Cancelar” e “Salvar”).
36: - Mensagens/microcopy e cores focadas no tema escuro; feedbacks de erro/sucesso limitados (principalmente logs).
37: - Rodapé com citação motivacional na visão de lista.
38: 
39: Estado, dados e integrações
40: - Client components gerenciam estado local de exibição (lista/editor), nota selecionada, modo de criação e termo de busca.
41: - Supabase: operações diretas no navegador.
42: - Tabela utilizada (nomes observados): self_knowledge_notes com campos típicos (id, user_id, category, title, content, created_at, updated_at).
43: - Ordenação padrão: notas por updated_at decrescente ao carregar.
44: - Atualização de updated_at é feita no cliente ao editar, podendo causar divergências de fuso horário ou consistência se múltiplos clientes editarem simultaneamente.
45: 
46: Pontos de atenção para refatoração (Next.js 15 + Supabase, melhores práticas)
47: - Server-first e segurança: migrar leituras e mutações para server components/server actions com RLS ativo; evitar lógica e credenciais no cliente. Considerar supabase-js no server e auth helpers com cookies.
48: - Validação e tipos: validar inputs (ex.: Zod) e tipar retorno/erros. Considerar geração de tipos a partir do schema do Supabase ou uso de ORM/tipagem (Drizzle + tipos do Supabase).
49: - UX e feedbacks: substituir logs por toasts/alertas; confirmar exclusões; exibir estados de carregamento/skeletons; tratamento de erros com mensagens claras.
50: - URL e deep-linking: refletir estado de aba e termo de busca no query string para compartilhamento e persistência de contexto.
51: - Performance e escalabilidade: paginação/infinite scroll para muitas notas; otimizações de cache e revalidação (revalidateTag); otimista com rollback em falhas.
52: - Concorrência e conflitos: estratégia para edições simultâneas (timestamps, versionamento, last-write-wins documentado ou locking).
53: - Acessibilidade e i18n: revisar aria-labels, foco, navegação por teclado; preparar para tradução.
54: - Conteúdo e segurança: sanitizar/renderização segura do conteúdo se for evoluir para rich text; limites de tamanho; proteção contra XSS.
55: 
56: Dependências e contexto do módulo
57: - App Router com layout global; UI baseada em componentes de cartão, botões, inputs, tabs e ícones.
58: - Provider de autenticação próprio integrado ao Supabase.
59: - Integração direta com a tabela self_knowledge_notes para CRUD.
60: 
61: Resumo executivo
62: - O módulo oferece um workflow simples e eficaz para registrar conhecimento pessoal em três categorias, com busca e edição. Para a reimplementação com padrões rigorosos, priorizar server actions, RLS, validação robusta, UX com feedbacks, sincronização de estado via URL e estratégias de performance/testes para garantir qualidade e escalabilidade.
```

## File: docs/concursos-auditoria.md
```markdown
 1: Auditoria do Módulo: Concursos (app/concursos)
 2: 
 3: Resumo geral
 4: - Objetivo: permitir que o usuário gerencie concursos (exames), suas disciplinas/tópicos, banco de questões e simulados; executar simulados, revisar resultados e acompanhar histórico/estatísticas.
 5: - Escopo: conjunto de páginas client-side com autenticação obrigatória, CRUDs integrados ao Supabase e componentes de revisão/execução de simulados. Há importação de dados via JSON e integração cruzada com o módulo de Estudos.
 6: 
 7: Arquitetura e composição (rotas principais)
 8: - /concursos: listagem dos concursos do usuário, criação manual e importação via JSON do edital.
 9: - /concursos/[id]: detalhes do concurso (status, organizadora, datas, disciplinas/tópicos, atalhos para questões e simulados).
10: - /concursos/[id]/questoes: gestão do banco de questões do concurso (criar, importar, visualizar), com seletor para simulado personalizado.
11: - /concursos/[id]/simulados: listagem/gerenciamento de simulados do concurso (criar, configurar, importar, iniciar).
12: - /concursos/[id]/simulados/[simuladoId]/executar: fluxo de execução (responder, navegar, acompanhar progresso, finalizar).
13: - /concursos/[id]/simulados/[simuladoId]/historico: histórico de tentativas e resultados do simulado.
14: - /concursos/teste: rota de testes/demonstração (não essencial à navegação principal).
15: 
16: Fluxos e funcionalidades principais
17: - Listagem de concursos
18:   - Exige autenticação; exibe grid de cards com status, organizadora e data da prova.
19:   - Ações: adicionar manualmente (form modal) ou importar JSON do edital (mapeia conteúdo programático para disciplinas e tópicos).
20:   - Navegação para a página de detalhes do concurso ao clicar no card.
21: 
22: - Banco de questões
23:   - CRUD de questões por concurso (modais para criar, importar JSON e visualizar).
24:   - Metadados de questão: enunciado, alternativas, gabarito, dificuldade, assunto/topico, ano, tags; flag para "gerado por IA".
25:   - Seletor de questões personalizadas: seleção múltipla, selos de dificuldade e início de simulado personalizado (atualmente usando armazenamento local e redirecionamento para Estudos/simulado-personalizado).
26: 
27: - Simulados
28:   - Criação e configuração de simulados (título, contagem de questões, filtros de dificuldade/assunto/tópico, tempo, público/rascunho, etc.).
29:   - Importação de simulados via JSON; contagem/estatísticas básicas por simulado.
30:   - Execução do simulado: UI de pergunta-resposta com progresso, navegação entre questões, registro de respostas, finalização e cálculo de nota.
31:   - Resultados: sumário (acertos/erros/percentual), barras de progresso, revisão item a item com correção e explicação quando disponível.
32:   - Histórico/Estatísticas: persistência de tentativas e métricas; integração com hooks e rotas /api para estatísticas agregadas.
33: 
34: Layout e experiência de uso
35: - Tema escuro, cartões e modais com ícones; grid responsiva nas listagens.
36: - Padrões de UI: botões de ação, estados de carregamento genéricos, feedbacks de erro majoritariamente via console.
37: - Execução do simulado com barra de progresso, navegação rápida por questão e indicadores de respondida/selecionada.
38: 
39: Estado, dados e integrações
40: - Tipos do domínio definidos em types/concursos.ts (Concurso, Disciplina, Topico, Questao, Simulado) e types/simulados.ts (estrutura de simulado/questão “legada”). Há sobreposição/duplicidade de modelos.
41: - Hooks client-side para gestão de concursos, questões, simulados, histórico e estatísticas; acesso direto ao Supabase no navegador.
42: - Armazenamento local usado para simulado personalizado (lista de questões selecionadas) com redirecionamento para /estudos/simulado-personalizado (integração cruzada com módulo Estudos).
43: - API interna para histórico/estatísticas de simulado em app/api/simulation-history/*, utilizada por hooks de análises.
44: 
45: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
46: - Server-first e RLS: mover leituras/mutações para server components/server actions; utilizar supabase no servidor com políticas RLS rigorosas por user_id. Evitar lógica sensível no cliente.
47: - Unificação de modelos: consolidar os tipos de Simulado/Questão (remover duplicidades entre types/concursos.ts e types/simulados.ts); padronizar nomenclaturas (enunciado/question_text, gabarito/correct_answer, etc.).
48: - Modelagem e chaves: garantir FKs entre concursos → disciplinas → tópicos → questões → simulados → tentativas; índices por chaves estrangeiras e filtros comuns (difficulty, subject/topic, year, is_active).
49: - Importação de JSON: validar com schema (Zod) e mapear campos com robustez; fornecer pré-visualização e relatório de inconsistências.
50: - Execução e resultados: persistir sessões de simulado/estado no backend (evitar localStorage) para suportar retomada, múltiplos dispositivos e auditoria; registrar timestamps e tempo por questão.
51: - Estatísticas: armazenar tentativas de forma normalizada e calcular agregados por assunto/tópico/dificuldade com jobs/SQL views; expor via endpoints com cache e revalidateTag.
52: - UX/feedbacks: substituir console logs por toasts/alerts; confirmar exclusões; skeletons para listas longas; paginação/infinite scroll; acessibilidade (aria, foco, teclado) e i18n.
53: - Segurança e validação: sanitização de textos longos (enunciados/explicações); limites de tamanho; controle de conteúdo gerado por IA com sinalização; auditoria de ações.
54: - Testes: cobertura para CRUDs, importadores, motor de simulado (cálculo de nota, correção, navegação) e estatísticas.
55: 
56: Taxonomia e termos do domínio (para LLMs)
57: - Concurso: exame com organizadora, datas, status e conteúdo programático.
58: - Disciplina e Tópico: hierarquia de conteúdo do concurso.
59: - Questão: item avaliatório com alternativas/gabarito, dificuldade, assunto/tópico, metadados.
60: - Simulado: conjunto de questões para prática; possui execução (tentativa), resultados e histórico.
61: - Tentativa/Histórico: execução do simulado com notas, tempo e respostas; base para estatísticas agregadas.
62: 
63: Dependências e contexto
64: - App Router com AuthProvider; biblioteca de UI com cards, modais, inputs, badges, progresso, etc.
65: - Hooks especializados (use-concursos, use-questions, use-simulados, use-simulation-history, use-simulation-statistics) e páginas/rotas API auxiliares.
66: 
67: Resumo executivo
68: - O módulo Concursos oferece um ecossistema completo: cadastro de concursos, banco de questões, criação/execução de simulados e análises históricas. Para a reimplementação com padrões rígidos, priorizar server actions + RLS, unificar modelos, validar importações, persistir estado do simulado no backend e elevar UX, acessibilidade, performance e testes para garantir robustez e escalabilidade.
```

## File: docs/dashboard-auditoria.md
```markdown
 1: Auditoria do Módulo: Dashboard (app/page.tsx)
 2: 
 3: Resumo geral
 4: - Objetivo: oferecer uma visão inicial integrada do dia do usuário com atividades, prioridades, foco, compromissos e medicamentos, além de atalhos para módulos principais.
 5: - Escopo: página client-side com autenticação obrigatória; orquestra dados via hook de dashboard; exibe múltiplos widgets em grid responsiva.
 6: 
 7: Arquitetura e composição
 8: - Rota: /. Componentiza a tela em cartões:
 9:   - Painel do Dia: atividades do dia (criar, marcar concluído, etc.).
10:   - Seus Módulos: grid de módulos com progresso (DashboardModules) como atalhos para áreas do app.
11:   - Prioridades do Dia: lista de prioridades com marcação de concluídas.
12:   - Foco: widget do temporizador de foco (TemporizadorFocoDashboard).
13:   - Próximos Compromissos: lista compacta de compromissos.
14:   - Medicamentos: atalho/visualização rápida de até 3 itens e estado “tomado hoje”.
15:   - Dica do Dia: texto educativo/auxílio rápido.
16: - Layout: grid 3-4 colunas responsivo; tema escuro; usa LoadingScreen durante carregamento e cartão de boas-vindas para visitantes não autenticados.
17: 
18: Funcionalidades principais
19: - Autenticação
20:   - Carregamento inicial; fallback de boas-vindas com CTA para login quando não autenticado.
21: 
22: - Orquestração de dados
23:   - Hook use-dashboard centraliza: painelDia, prioridades, medicamentos, sessão de foco, summary, loading e erros.
24:   - Ações expostas: adicionar/toggle atividades, adicionar/toggle prioridades; iniciar/pausar/parar sessão de foco; recarregar dados; limpar erro.
25: 
26: - Tratamento de erros
27:   - Banner de alerta com mensagem, botão para recarregar e para limpar erro.
28: 
29: Estado, dados e integrações
30: - Componentes widgets: PainelDia, PrioridadesDia, TemporizadorFocoDashboard, ProximosCompromissos, DashboardModules; todos client components.
31: - Dados provavelmente vêm do Supabase via hooks específicos agregados por use-dashboard.
32: 
33: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
34: - Server-first + RLS: mover agregação e ações para server actions; usar streaming/partial rendering com Suspense para cada widget.
35: - Observabilidade e performance: cache por widget (revalidateTag), prioridade de render (LCP); memoização; lazy para widgets fora da viewport.
36: - UX e acessibilidade: skeletons por widget; toasts para ações; teclabilidade/aria; preferência de usuário para ordem/visibilidade de widgets.
37: - Consistência de modelos: alinhar tipos usados por widgets com tabelas (atividades, prioridades, compromissos, medicamentos, sessões de foco) e garantir FKs/índices por user_id.
38: - Testes: render/erro por widget, ações de criação/marcação, timers, navegação para módulos.
39: 
40: Resumo executivo
41: - O dashboard integra diversos dados do dia e atalhos em uma tela. Para a nova base, priorizar server actions com RLS, Suspense/streaming por widget, cache segmentado e UX acessível com testes e observabilidade.
```

## File: docs/estudos-auditoria.md
```markdown
 1: Auditoria do Módulo: Estudos (app/estudos)
 2: 
 3: Resumo geral
 4: - Objetivo: apoiar a rotina de estudos do usuário com ferramentas de foco (Pomodoro), registro de sessões de estudo, atalho e experiência de simulados (carregar, responder, revisar resultados), incluindo um fluxo de simulado personalizado.
 5: - Escopo: páginas client-side com autenticação obrigatória e integração direta com hooks de simulados/histórico/estatísticas. Parte da lógica de simulado é compartilhada com o módulo Concursos e usa armazenamento local no fluxo personalizado.
 6: 
 7: Arquitetura e composição (rotas principais)
 8: - /estudos: dashboard de estudos com Pomodoro, registro de estudos e seção "Próximo Concurso".
 9: - /estudos/simulado: experiência de simulado genérica baseada no estado do hook (carregar, revisar, resultados).
10: - /estudos/simulado-personalizado: experiência de simulado personalizada gerada a partir de questões previamente selecionadas (armazenadas em localStorage pelo módulo Concursos).
11: 
12: Funcionalidades principais
13: - Pomodoro e Registro
14:   - Temporizador Pomodoro para foco em sessões de estudo.
15:   - Registro de estudos para acompanhar atividades e progresso diário.
16: 
17: - Simulado (genérico)
18:   - Loader: carrega/seleciona simulado (UI de carregamento, controle via hook useSimulados).
19:   - Review: interface de perguntas com alternativas, progresso, navegação entre questões, registro das respostas e finalização.
20:   - Results: sumário percentual, acertos/erros/total, revisão questão a questão com gabarito e explicações.
21: 
22: - Simulado Personalizado
23:   - Verifica presença de questões no localStorage, carrega via useSimulados e inicia o fluxo de review/resultados.
24:   - Tratamento de erro simples (alerta e redirecionamento de fallback para /estudos/simulado quando não há dados válidos).
25: 
26: Layout e experiência de uso
27: - Tema escuro, uso de cards, botões, barras de progresso e modais compartilhados (ex.: histórico).
28: - Estados visuais: carregando, revisão, resultados; feedbacks de erro via alert e logs.
29: - Navegador de questões com indicadores de questão atual e respondidas.
30: 
31: Estado, dados e integrações
32: - Hooks: useSimulados, useSimulations, useSimulationHistory, useSimulationStatistics (client-side), centralizam estado do simulado, histórico e análises.
33: - Armazenamento local: simulado personalizado depende de localStorage para transportar questões selecionadas do módulo Concursos.
34: - Tipos: types/simulados.ts define a estrutura de dados de simulado/questões/resultado (modelo "legado" em paralelo aos tipos em types/concursos.ts).
35: 
36: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
37: - Server-first & persistência: mover criação/execução do simulado para o servidor; persistir sessão/estado/tempo/respostas no backend (suporte a retomada, multiplataforma, auditoria).
38: - Unificação de modelos: consolidar o modelo de questões/simulados entre Estudos e Concursos (evitar duplicidades e mapeamentos ad-hoc).
39: - Segurança e validação: evitar dependência de localStorage para dados críticos; validar entradas/JSON (Zod) e sanitizar textos longos; aplicar RLS em todas as tabelas.
40: - UX e acessibilidade: skeletons; confirmação de ações; mensagens claras de erro/sucesso; foco/aria/teclado; i18n.
41: - Performance: paginação/infinite scroll ao revisar longas listas; cache/revalidateTag para histórico/estatísticas; otimizações de render.
42: - Testes: cenários de simulado (carga, navegação, correção, resultados), fluxo personalizado (sem dados, dados inválidos), integração com histórico/estatísticas.
43: 
44: Dependências e contexto
45: - App Router com AuthProvider; biblioteca de UI (cards, progress, buttons); hooks de simulado/histórico/estatísticas compartilhados com Concursos.
46: 
47: Resumo executivo
48: - O módulo Estudos reúne foco (Pomodoro), registro de estudos e execução de simulados, com fluxo para simulados personalizados. Para reimplementação robusta, priorizar server actions + RLS, unificar modelo de simulado/questões, persistir sessão e respostas no backend, reforçar UX e acessibilidade e ampliar cobertura de testes e performance.
```

## File: docs/financas-auditoria.md
```markdown
 1: Auditoria do Módulo: Finanças (app/financas)
 2: 
 3: Resumo geral
 4: - Objetivo: auxiliar o usuário a visualizar e organizar finanças pessoais por meio de rastreamento de gastos por categoria (com gráfico), sistema de envelopes virtuais, calendário de pagamentos e registro rápido de despesas.
 5: - Escopo: página client-side com autenticação obrigatória, componentes interativos que consomem dados via hook de finanças e gráfico client-only com carregamento dinâmico para evitar SSR.
 6: 
 7: Arquitetura e composição
 8: - Rota: /financas. Página client component que integra quatro blocos principais:
 9:   - Rastreador de Gastos: gráfico de pizza (Recharts) + lista por categorias com totais e percentuais.
10:   - Envelopes Virtuais: gerenciamento de envelopes (nome, cor, valores total/usado) e possíveis ações de alocação/ajuste.
11:   - Calendário de Pagamentos: agenda de contas a pagar, recorrência e marcação de pago.
12:   - Adicionar Despesa: formulário leve para registrar uma nova despesa com descrição, valor, categoria e data.
13: - Layout: grid responsiva em até duas colunas; tema escuro; usa RootLayout com cabeçalho/tema/AuthProvider.
14: 
15: Funcionalidades por bloco
16: - Autenticação
17:   - Bloqueio de acesso para não autenticados com CTA de login; estado de carregamento inicial.
18: 
19: - Rastreador de Gastos
20:   - Exibe distribuição de gastos por categoria em gráfico de pizza e tabela sintética com valores e percentuais.
21:   - Obtém dados do hook useFinancas (agregação por categoria e total geral).
22: 
23: - Envelopes Virtuais
24:   - Visualização e ações sobre envelopes (dados provenientes do hook useFinancas). Suporte a cores e limites de gasto.
25: 
26: - Calendário de Pagamentos
27:   - Lista e/ou visão de calendário com pagamentos agendados, recorrência e marcação como pago.
28: 
29: - Adicionar Despesa
30:   - Formulário que cria despesa vinculada a uma categoria e data; usa validações mínimas; feedback textual simples com desabilitação durante salvamento.
31: 
32: Estado, dados e integrações
33: - Hook useFinancas centraliza operações e cálculos (categorias, despesas, envelopes, agendamentos; agregações e totais).
34: - Tipos de domínio em types/financas.ts: CategoriaGasto, Despesa, EnvelopeVirtual, PagamentoAgendado, GastosPorCategoria.
35: - Gráfico client-only com next/dynamic (ssr: false) para evitar problemas de SSR do Recharts.
36: 
37: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
38: - Server-first + RLS: mover leituras e mutações para server actions; usar Supabase no servidor com políticas por user_id.
39: - Modelagem e consistência: normalizar categorias e envelopes; garantir FKs e índices (categoria_id, user_id, due_date). Padronizar timezone em datas/recorrências.
40: - Validações e UX: validar entradas com Zod; toasts/erros claros; confirmar exclusões/alterações; skeletons para listas e gráficos; acessibilidade e i18n.
41: - Agendamentos e recorrência: padronizar regras de recorrência (RRULE ou campo estruturado) e gerar próximas ocorrências no backend; notificações/lembretes (cron/webhooks) como evolução.
42: - Visualização: filtros por período, exportação (CSV), metas por categoria/envelope, e alertas de estouro de orçamento.
43: - Testes: cobertura para CRUDs (despesas, envelopes, pagamentos), agregações por categoria, recorrências e render do gráfico.
44: 
45: Dependências e contexto
46: - App Router com AuthProvider e UI de cartões/botões/inputs; Recharts para gráficos; hook de finanças como fonte única de dados.
47: 
48: Resumo executivo
49: - O módulo Finanças oferece visão consolidada de gastos, envelopes e contas a pagar, com registro rápido de despesas. Para a nova implementação, priorizar server actions + RLS, validação robusta, regras sólidas de recorrência e melhorias de UX/performance/testes, mantendo visualizações claras e responsivas.
```

## File: docs/hiperfocos-auditoria.md
```markdown
 1: Auditoria do Módulo: Hiperfocos (app/hiperfocos)
 2: 
 3: Resumo geral
 4: - Objetivo: ajudar usuários (especialmente neurodivergentes) a direcionar hiperfocos para objetivos práticos, convertendo interesses em projetos, alternando tarefas de forma saudável e mantendo foco com um temporizador dedicado.
 5: - Escopo: página client-side com autenticação obrigatória; integra ferramentas de conversão de interesses, sistema de alternância de tarefas, visualização de projetos/tarefas e um temporizador de foco.
 6: 
 7: Arquitetura e composição
 8: - Rota: /hiperfocos. Página com Tabs que agrupam quatro funcionalidades:
 9:   - Conversor de Interesses: transforma interesses em projetos/tarefas com cores e estrutura básica.
10:   - Sistema de Alternância: ajuda a alternar entre tarefas/projetos para evitar fadiga e manter engajamento.
11:   - Estrutura de Projetos: visualiza projetos com cores, tarefas e status de conclusão.
12:   - Temporizador: cronômetro de foco dedicado (diferente do Pomodoro), com ciclos e controles de pausa/retomada.
13: - Resumo dos Hiperfocos: cartão que apresenta progresso por projeto (tarefas concluídas/total).
14: - Layout: tema escuro, uso de cards e grid responsiva; herda RootLayout (cabeçalho/tema/AuthProvider).
15: 
16: Funcionalidades por bloco
17: - Autenticação
18:   - Bloqueio de acesso para não autenticados; tela de carregamento durante fetch inicial.
19: 
20: - Conversor de Interesses
21:   - Captura interesses e converte em projetos e tarefas; aplica cor/identidade visual.
22: 
23: - Sistema de Alternância
24:   - Define lógica de alternância entre tarefas/projetos (ex.: rotacionar, priorizar, evitar monotonia); provê UI para executar trocas.
25: 
26: - Estrutura de Projetos
27:   - Visualização dos projetos com tarefas, contadores de concluídas e cores; pode oferecer ações básicas (criar, completar, reordenar) conforme hook.
28: 
29: - Temporizador de Foco
30:   - Contador ajustável com iniciar/pausar/retomar/zerar; pode registrar sessões e fornecer estatísticas locais.
31: 
32: Estado, dados e integrações
33: - Hook useHiperfocos centraliza projetos/tarefas e suas derivadas (getProjectsWithTasks); use-pomodoro fornece lógica do temporizador.
34: - Persistência: indícios de integração com Supabase via hooks (padrão nos outros módulos), mas a página opera toda no cliente.
35: - Dados exibidos: projetos com tasks, cores, progresso; estado de timer.
36: 
37: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
38: - Server-first + RLS: mover CRUD de projetos/tarefas para server actions; garantir políticas por user_id.
39: - Modelagem: entidades Projeto, Tarefa, Rotina de Alternância, Sessão de Foco; índices por user_id/status; timestamps consistentes.
40: - UX e acessibilidade: feedbacks de sucesso/erro (toasts), confirmação para remoções, estados skeleton; foco/aria/teclado; i18n.
41: - Temporizador: persistir sessões e eventos (start/pause/resume) no backend para histórico e métricas; permitir retomada cross-device.
42: - Performance: cache e revalidateTag; paginação para listas grandes; memoização de cálculos de progresso.
43: - Testes: criação/edição/conclusão de tarefas, alternância entre itens, funcionamento do temporizador, consistência do progresso mostrado no "Resumo".
44: 
45: Dependências e contexto
46: - App Router com AuthProvider; componentes de UI (tabs, cards, buttons); hooks de hiperfoco e pomodoro.
47: 
48: Resumo executivo
49: - O módulo Hiperfocos integra conversão de interesses em projetos, alternância de tarefas, visualização de estrutura e um temporizador de foco. Para uma reimplementação sólida, priorizar server actions + RLS, modelagem clara das entidades, persistência de sessões do timer e reforço de UX, acessibilidade e testes.
```

## File: docs/lazer-auditoria.md
```markdown
 1: Auditoria do Módulo: Lazer (app/lazer)
 2: 
 3: Resumo geral
 4: - Objetivo: ajudar o usuário a equilibrar lazer e rotina, oferecendo um temporizador de lazer, lista/gestão de atividades recreativas e sugestões de descanso.
 5: - Escopo: página client-side com autenticação obrigatória; integra três blocos principais que interagem via hook de lazer e componentes de UI compartilhados.
 6: 
 7: Arquitetura e composição
 8: - Rota: /lazer. Página com três seções:
 9:   - Temporizador de Lazer: cronômetro com presets (15/30/45/60 min) e modo customizado, iniciar/pausar/resetar, persistência da sessão via hook.
10:   - Atividades de Lazer: listagem/organização de atividades, possivelmente com marcação de concluído, categorização e registro simples.
11:   - Sugestões de Descanso: recomendações curtas para pausas e bem-estar.
12: - Layout: tema escuro, uso de cards, tipografia e botões padrão; herda RootLayout.
13: 
14: Funcionalidades por bloco
15: - Autenticação
16:   - Bloqueia acesso a não autenticados; exibe tela de carregamento inicial.
17: 
18: - Temporizador de Lazer
19:   - Presets e slider para duração personalizada; controla estado (ativo/pausado) e tempo restante.
20:   - Integração com hook useLazer: criar sessão, atualizar tempo usado e finalizar; reinicialização após término.
21: 
22: - Atividades de Lazer
23:   - Gestão de atividades recreativas (criar/listar/atualizar); interface de marcação e possíveis filtros.
24: 
25: - Sugestões de Descanso
26:   - Bloco estático/dinâmico com dicas de pausas e higiene do descanso.
27: 
28: Estado, dados e integrações
29: - Hook useLazer coordena sessões, atividades e persistência; página e componentes são client components.
30: - Sessão de lazer: duracao_minutos, tempo_usado_minutos, status (ativo/pausado/concluído), com atualizações no pause/stop.
31: 
32: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
33: - Server-first + RLS: mover CRUD de atividades/sessões para server actions; políticas por user_id; registrar eventos (start/pause/stop) com timestamps para métricas.
34: - UX e acessibilidade: toasts, confirmação de ações, skeletons, foco/aria/teclado, i18n.
35: - Segurança e validação: validar entradas (Zod); limitar dados; sanitizar campos livres.
36: - Performance: cache/revalidateTag; memoização seletiva; paginação para atividades numerosas.
37: - Testes: fluxo do temporizador (iniciar/pausar/finalizar), CRUD de atividades e render das sugestões.
38: 
39: Dependências e contexto
40: - App Router, AuthProvider, UI de cards/botões/select/slider.
41: 
42: Resumo executivo
43: - O módulo Lazer fornece ferramentas para controlar o tempo de lazer, organizar atividades e incentivar pausas. A reimplementação deve priorizar server actions + RLS, registro robusto da sessão e melhorias de UX/acessibilidade/performance e testes.
```

## File: docs/perfil-auditoria.md
```markdown
 1: Auditoria do Módulo: Perfil (app/perfil)
 2: 
 3: Resumo geral
 4: - Objetivo: permitir que o usuário gerencie dados pessoais, metas diárias, preferências de acessibilidade/visual e exporte/importe dados da conta, além de acessar uma página de ajuda específica.
 5: - Escopo: páginas client-side com autenticação obrigatória; integração direta a um hook de perfil para CRUD de perfil, metas e preferências; oferece backup (exportação JSON), importação e reset de configurações.
 6: 
 7: Arquitetura e composição
 8: - Rotas:
 9:   - /perfil: página principal de configuração de conta.
10:   - /perfil/ajuda: página de ajuda com orientações e o formato JSON esperado para importação/backup (documentação embutida).
11: - Composição principal da página /perfil:
12:   - Cabeçalho com breadcrumbs e ação “Ajuda”.
13:   - Cartões em grid (duas colunas em telas grandes):
14:     1) Informações Pessoais: e-mail (somente leitura), nome de exibição e ação de salvar.
15:     2) Metas Diárias: horas de sono, tarefas por dia, copos de água, pausas por hora; ação de salvar.
16:     3) Preferências Visuais: alto contraste, texto grande e redução de estímulos; aplicação imediata (classes no root) e ação de salvar.
17:     4) Backup e Dados: exportar JSON, importar dados e resetar todas as configurações (zona de perigo com confirmação).
18: - Layout: tema escuro herdado do app; uso de cartões, inputs, switches e botões; página protegida por autenticação.
19: 
20: Funcionalidades por bloco
21: - Autenticação
22:   - Bloqueia acesso a usuários não autenticados e exibe CTA para login; estado de carregamento inicial.
23: 
24: - Informações Pessoais
25:   - Editar nome de exibição; validação simples (não vazio); persistência via hook de perfil.
26: 
27: - Metas Diárias
28:   - Definir metas numéricas (sono, tarefas, água e pausas); persistência via hook de perfil.
29: 
30: - Preferências Visuais/Acessibilidade
31:   - Alternar alto contraste, texto grande e redução de estímulos.
32:   - Aplicação imediata no DOM via classes globais; opção de “Salvar Preferências” para persistir no backend.
33: 
34: - Backup e Dados
35:   - Exportar dados do usuário (JSON) via ação dedicada.
36:   - Importar dados no formato JSON documentado em /perfil/ajuda.
37:   - Resetar todas as configurações com confirmação.
38: 
39: Estado, dados e integrações
40: - Hook useProfile centraliza carregamento e salvamento de: profile (display_name), preferences (high_contrast, large_text, reduced_stimuli) e goals (sleep_hours, daily_tasks, water_glasses, break_frequency).
41: - Fluxo de carregamento: tela de loading até que auth e dados do perfil sejam resolvidos; sincronização dos estados locais com dados carregados.
42: - Import/Export: operações orientadas a JSON; a página de ajuda expõe o schema esperado para evitar erros na importação.
43: 
44: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
45: - Server-first + RLS: mover leituras/mutações (perfil, metas, preferências, import/export, reset) para server actions; garantir políticas por user_id e validações de entrada.
46: - Preferências aplicadas no servidor: aplicar classes (alto contraste, texto grande, redução de estímulos) já no SSR/streaming para evitar flash visual; considerar persistência em cookie ou cabeçalho para hidratação consistente.
47: - Validação e UX: substituir alert/confirm por toasts e diálogos acessíveis; validação com Zod para importações e formulários; mensagens de erro/sucesso claras.
48: - Importação/Exportação: assinar e versionar o JSON exportado; validar versão no import; sanitizar strings.
49: - Acessibilidade e i18n: revisar rótulos, foco, leitura por leitor de tela; preparar traduções.
50: - Observabilidade e auditoria: registrar eventos críticos (reset/import) com carimbo de usuário/tempo.
51: - Testes: cenários de salvar perfil/metas/preferências, aplicar classes de acessibilidade, exportar/importar e resetar; testes de regressão visual para temas.
52: 
53: Taxonomia e contexto (para LLMs)
54: - Profile: dados de usuário exibidos publicamente (display_name) e e-mail.
55: - Preferences: opções visuais e de acessibilidade (alto contraste, texto grande, redução de estímulos) com efeito global.
56: - Goals: metas numéricas diárias usadas por outros módulos (sono, tarefas, água, pausas).
57: - Backup/Import: ciclo de exportação/importação de dados da conta num JSON versionado; ajuda embutida em /perfil/ajuda especifica o schema.
58: 
59: Resumo executivo
60: - O módulo de Perfil concentra configurações pessoais, metas e preferências de acessibilidade, além de ferramentas de backup/import/reset. Para a nova base em Next.js 15 + Supabase, priorizar server actions com RLS, aplicação SSR das preferências visuais, validação robusta (especialmente na importação), UX acessível e cobertura de testes para garantir segurança e consistência entre módulos.
```

## File: docs/receitas-auditoria.md
```markdown
 1: Auditoria do Módulo: Receitas (app/receitas)
 2: 
 3: Resumo geral
 4: - Objetivo: permitir que o usuário gerencie receitas culinárias (CRUD), visualize detalhes, crie lista de compras a partir de receitas selecionadas e marque favoritas.
 5: - Escopo: conjunto de páginas client-side com autenticação obrigatória; hooks de dados para operações; experiência com filtros, destaque de favoritas e integração com a lista de compras.
 6: 
 7: Arquitetura e composição (rotas principais)
 8: - /receitas: listagem com busca, filtro por categoria, cartões com informações resumidas (categoria, dificuldade, tempo, porções, ingredientes), ação para seleção e geração de lista de compras.
 9: - /receitas/adicionar: formulário para criar receita (nome, categoria, ingredientes, modo de preparo, tempo, porções, dificuldade, favorita).
10: - /receitas/[id]: detalhes da receita com badges, tempo, porções, datas e ações (editar, excluir, favoritar, adicionar à lista de compras, compartilhar).
11: - /receitas/[id]/editar: formulário de edição com preenchimento inicial e salvamento.
12: - /receitas/lista-compras: lista de compras vinculada a receitas (parâmetro ?receitas=...), permite adicionar itens, marcar como comprados e limpar itens comprados; exibe progresso e resumo por categoria.
13: 
14: Funcionalidades principais
15: - Listagem e filtros
16:   - Busca por nome; filtro por categoria dinâmica com base nos dados carregados.
17:   - Seleção de receitas para gerar lista de compras (botão flutuante com contagem e link para rota de lista-compras).
18: 
19: - CRUD de receitas
20:   - Criar, visualizar, atualizar, excluir; estado de favorita com toggle.
21:   - Campos suportados: nome, categoria, ingredientes, modo de preparo, tempo (min), porções, dificuldade (fácil/médio/difícil), favorita.
22: 
23: - Lista de compras
24:   - Geração automática a partir de receitas selecionadas (query string), itens agrupados por categoria, marcação de comprados e limpeza de itens comprados.
25:   - Adição manual de itens com quantidade e categoria; cálculo de progresso global e por categoria.
26: 
27: Layout e experiência
28: - Tema escuro com cards, badges, inputs, seletores; skeleton de carregamento em /receitas/loading e /receitas/[id]/loading.
29: - Ações com confirmação simples (confirm/alert) e feedback via texto; estados de carregamento padrão.
30: 
31: Estado, dados e integrações
32: - Hook use-receitas centraliza dados de receitas e lista de compras; todas as páginas são client components.
33: - Integração provável com Supabase para persistência; busca/filtragem e seleção via estado local.
34: - Comunicação Receitas -> Lista de Compras via query string; também pode ser acionada a partir da página de detalhes.
35: 
36: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
37: - Server-first + RLS: mover CRUD e geração de lista para server actions; validar e sanitizar entradas (Zod), aplicar políticas por user_id.
38: - Modelo de dados: normalizar entidades (receita, ingrediente, categoria, lista_item) com FKs e timestamps; índices por user_id e categoria; campos de dificuldade e favorita.
39: - Usabilidade: substituir alert/confirm por diálogos/feedback acessíveis; autosave e rascunho para formulários; upload de imagem da receita; compartilhamento (link público com permissões).
40: - Lista de compras: permitir agrupamento personalizado (setores do mercado), ordenação manual, exportação (PDF/CSV) e histórico de listas.
41: - Acessibilidade e i18n: aria, foco, contraste; textos prontos para tradução.
42: - Performance: paginação/infinite scroll na listagem; cache/revalidateTag; memoização de filtros.
43: - Testes: CRUD completo, seleção e geração de lista, marcação de comprados, progresso e edição; testes de rota com query string.
44: 
45: Dependências e contexto
46: - App Router, AuthProvider, UI de cards/badges/inputs/selects; hooks especializados do módulo.
47: 
48: Resumo executivo
49: - O módulo Receitas cobre o ciclo completo de gerenciamento de receitas e lista de compras. Para a reimplementação rígida, priorizar server actions com RLS, modelo normalizado, validação robusta, UX acessível e melhorias de performance/testes, mantendo integração com alimentação e planejamento diário quando necessário.
```

## File: docs/saude-auditoria.md
```markdown
 1: Auditoria do Módulo: Saúde (app/saude)
 2: 
 3: Resumo geral
 4: - Objetivo: acompanhar rotinas de saúde do usuário por dia, com foco em registro de medicamentos e monitoramento de humor; suporte a navegação por data via query string.
 5: - Escopo: página client-side com autenticação obrigatória; componentes interativos consomem hooks para persistência e exibem dados do dia selecionado.
 6: 
 7: Arquitetura e composição
 8: - Rota: /saude. Página com dois blocos principais:
 9:   - Registro de Medicamentos: cadastro e controle de tomadas por dia/horários; marcação de dose tomada; listagem e filtros temporais.
10:   - Monitoramento de Humor: registro de humor/emoções com escala e notas; histórico diário e possivelmente gráficos.
11: - Navegação por data: leitura de ?date=YYYY-MM-DD e atualização do URL ao trocar de dia.
12: - Layout: tema escuro, cartões e tipografia padrão; herda RootLayout.
13: 
14: Funcionalidades por bloco
15: - Autenticação
16:   - Bloqueia acesso a não autenticados; estado de carregamento inicial.
17: 
18: - Registro de Medicamentos
19:   - Definição de medicamentos e horários; marcar dose como tomada; gerenciamento diário.
20:   - Persistência via hook use-saude; suporte a anexos/observações e filtros (segundo o componente).
21: 
22: - Monitoramento de Humor
23:   - Registro de humor do dia (nível e descrição); histórico diário; UI para seleção de humor e input textual.
24: 
25: Estado, dados e integrações
26: - Hooks: use-saude centraliza leituras/mutações; componentes são client components.
27: - Data-base diária: seleção por string YYYY-MM-DD; sincronização com URL para deep-link.
28: - Integração potencial com hidratação (há componente separado LembreteHidratacao reaproveitável em outros módulos).
29: 
30: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
31: - Server-first + RLS: mover CRUDs para server actions; aplicar políticas por user_id; validar entradas (Zod) e sanitizar campos livres.
32: - Modelagem de dados: tabelas para medicamentos, agendamentos de dose, doses registradas, humores diários (escala + nota); índices por user_id e data.
33: - UX e acessibilidade: toasts/alertas ao invés de apenas logs; skeletons e loaders; acessibilidade (aria/teclado), i18n.
34: - Data/timezone: padronizar timezone (UTC vs local) e uso de colunas date/time explícitas para registros diários.
35: - Observabilidade: logs/auditoria de eventos de saúde (tomadas, alterações); privacidade/dados sensíveis.
36: - Testes: fluxos de criar/edit meds, marcar dose, registrar humor, navegar por datas.
37: 
38: Dependências e contexto
39: - App Router, AuthProvider e UI de cartões/botões/inputs; hooks especializados do módulo.
40: 
41: Resumo executivo
42: - O módulo Saúde centraliza rotinas diárias de saúde com foco em medicamentos e humor e navegação por data. Para uma reimplementação robusta, priorizar server actions + RLS, modelagem adequada das entidades de saúde, tratamento consistente de datas e UX acessível, com testes e auditoria para garantir confiabilidade e privacidade.
```

## File: docs/sono-auditoria.md
```markdown
 1: Auditoria do Módulo: Sono (app/sono)
 2: 
 3: Resumo geral
 4: - Objetivo: registrar sono diário (horários, qualidade, observações), configurar lembretes de dormir/acordar e visualizar padrões semanais básicos.
 5: - Escopo: página client-side com autenticação obrigatória, integrada ao hook use-sono para persistência e cálculo de estatísticas. UI com abas para registrar, visualizar e configurar lembretes.
 6: 
 7: Arquitetura e composição
 8: - Rota: /sono. Três abas:
 9:   - Registrar Sono: formulário para horários de dormir/acordar, qualidade (1-10) e observações; cálculo automático de horas de sono; dicas rápidas.
10:   - Visualizar Padrões: cartão com estatísticas da última semana (média de horas, qualidade média, consistência e tendências) com tratamento para ausência de dados.
11:   - Lembretes: configuração de lembretes (ativar/desativar, horários de dormir/acordar e dias da semana), com salvamento via hook.
12: - Layout: tema escuro, cards, inputs, badges e switches; herda RootLayout.
13: 
14: Funcionalidades por bloco
15: - Autenticação
16:   - Bloqueio e CTA de login para não autenticados; loading inicial.
17: 
18: - Registro de sono
19:   - Validações mínimas; calcula duração total (considerando virada do dia); feedback via toasts.
20: 
21: - Estatísticas
22:   - Estatística semanal com tendências (aumentando/diminuindo/estável) para horas e qualidade; consistência; resumo e padrões identificados (melhor dia, horários comuns).
23: 
24: - Lembretes
25:   - Flags e horários para dormir/acordar; persiste configuração com dias da semana; feedback via toasts.
26: 
27: Estado, dados e integrações
28: - Hook use-sono expõe: registrosSono, configuracaoLembretes, estatisticas e operações salvarRegistroSono/atualizarLembretes.
29: - Dados diários com campos: bedtime, wake_time, sleep_quality, notes, date. Configuração: bedtime_reminder_enabled/time, wake_reminder_enabled/time, weekdays.
30: 
31: Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
32: - Server-first + RLS: mover persistência de registros e lembretes para server actions com políticas por user_id; validar entradas (Zod) e sanitizar textos.
33: - Modelagem: tabelas para registros de sono e configuração de lembretes; índices por user_id e date; normalização de weekdays.
34: - UX e acessibilidade: toasts consistentes, diálogos acessíveis, skeletons; foco/aria; i18n.
35: - Data/timezone: lidar com virada de dia e timezone explicitamente (colunas time e date separadas, ou timestamps com TZ + cálculos no server).
36: - Observabilidade: auditar alterações de lembretes/registro; possibilidade de notificações push no futuro.
37: - Testes: casos de cálculo de horas, salvar/editar, visualização sem dados, salvar lembretes, tendências.
38: 
39: Dependências e contexto
40: - App Router com AuthProvider; UI de cards, inputs, tabs, switches e toasts (sonner); hook use-sono.
41: 
42: Resumo executivo
43: - O módulo Sono oferece registro diário e lembretes com visão semanal simples. Na reimplementação, priorizar server actions com RLS, modelagem sólida de datas/horários, validação forte e UX acessível, além de testes cobrindo cálculos e persistência.
```
