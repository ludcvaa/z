Auditoria do Módulo: Alimentação (app/alimentacao)

Resumo geral
- Objetivo: apoiar a rotina alimentar do usuário com três pilares principais: planejamento de refeições, registro diário de refeições e acompanhamento de hidratação, além de um atalho para o módulo de receitas.
- Escopo: página client-side que exige autenticação e consome diretamente o Supabase para leituras e gravações.

Arquitetura e composição
- Rota: app/alimentacao (renderização dinâmica forçada). A página exporta um componente principal localizado em components/pages/alimentacao-page.
- Composição principal:
  - Planejador de Refeições: gerenciamento de planos (lista de horários/descrições) por usuário.
  - Registro de Refeições: registros diários filtrados por data, com navegação entre dias.
  - Hidratação: contador diário de copos com meta fixa.
  - CTA "Minhas Receitas": link para o módulo /receitas.
- Layout base: utiliza o RootLayout com cabeçalho fixo, theming e provedor de autenticação.

Funcionalidades por bloco
- Autenticação
  - Exige usuário autenticado para exibir os recursos. Sem usuário: exibe cartão de “Login necessário” com link para /auth.
  - Enquanto a autenticação carrega: mostra tela de carregamento.

- Planejador de Refeições
  - Lista os planos de refeição do usuário, ordenados por horário.
  - Permite adicionar item (horário + descrição) e remover; há botão de “editar” ainda não implementado.
  - Persistência em Supabase na tabela de planos.

- Registro de Refeições (diário)
  - Mostra registros do dia atual (ou de uma data específica recebida via query string). Usa um componente de navegação por datas.
  - Permite adicionar um registro (horário + descrição) e remover.
  - Persistência em Supabase na tabela de registros; filtro por intervalo de data/hora do dia selecionado.

- Hidratação
  - Exibe progresso diário com meta de 8 copos. Permite incrementar/decrementar copos e persiste o valor do dia.
  - Persistência em Supabase na tabela de hidratação, uma linha por dia e usuário (upsert).

Layout e experiência de uso
- Distribuição em grid: duas colunas em telas grandes (planejador de refeições ao lado do registro diário), uma coluna em telas pequenas.
- Uso de cartões (headers, conteúdos) com tema escuro, ícones contextuais e botões de ação.
- Suspense/estados de carregamento simples por seção; feedback de erro limitado a logs.
- Rodapé da página traz uma citação motivacional.

Estado, dados e integrações
- Todos os blocos funcionam como client components e acessam o Supabase diretamente no navegador.
- Data-base: data atual derivada do relógio do cliente e/ou do parâmetro "date" na URL (formato YYYY-MM-DD). Possível divergência de fuso horário ao usar datas derivadas de ISO.
- Tabelas utilizadas no Supabase (nomes observados):
  - meal_plans: planos de refeição do usuário (campos incluem user_id, time, description, id).
  - meal_records: registros de refeições (campos incluem user_id, time, description, created_at, id) — filtragem por janela do dia via created_at.
  - hydration_records: hidratação diária (campos incluem user_id, date, glasses_count).
- Navegação por data: o Registro de Refeições recebe e atualiza a data atual; a página lê a data do query string quando presente.

Pontos de atenção para refatoração (Next.js 15 + Supabase, melhores práticas)
- Server-first: considerar mover leituras e mutações para server components/server actions, usando o client do Supabase no servidor com RLS, reduzindo exposição de credenciais e lógica no cliente.
- Modelagem de dados: normalizar datas e fusos (ex.: guardar coluna date explícita em registros de refeições em vez de filtrar por faixa de created_at). Definir timezone de referência (UTC vs local) e padronizar conversões.
- Estado e UX: substituir console logs por feedbacks de erro/sucesso ao usuário; adicionar skeletons de carregamento; confirmar exclusões; otimizações com revalidação/caching onde aplicável.
- Acessibilidade e i18n: revisar textos alternativos, aria-labels e preparação para traduções.
- URL e compartilhamento de estado: sincronizar mudanças de data com o query string (push/replace) para deep-linking consistente.
- Testes: adicionar testes de unidade e integração para fluxos de CRUD e navegação por data.
- Segurança: garantir RLS nas tabelas citadas para restringir por user_id; validar entradas (ex.: Zod) antes de chamadas ao backend.
- Funcionalidades incompletas: implementar edição no Planejador de Refeições.

Dependências e contexto do módulo
- App Router com layout global, cabeçalho e tema escuro.
- Biblioteca de UI (cards, botões, inputs), ícones e provider de autenticação customizado.
- Integração direta com Supabase em cada componente funcional.

Resumo executivo
- O módulo entrega uma visão diária e de planejamento de alimentação, mais hidratação, orientada a usuário autenticado e armazenamento no Supabase. Para reimplementação com padrões rigorosos, priorizar server actions, modelagem consistente de datas, RLS e UX com feedbacks e testes sólidos.