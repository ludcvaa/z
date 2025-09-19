Auditoria do Módulo: Finanças (app/financas)

Resumo geral
- Objetivo: auxiliar o usuário a visualizar e organizar finanças pessoais por meio de rastreamento de gastos por categoria (com gráfico), sistema de envelopes virtuais, calendário de pagamentos e registro rápido de despesas.
- Escopo: página client-side com autenticação obrigatória, componentes interativos que consomem dados via hook de finanças e gráfico client-only com carregamento dinâmico para evitar SSR.

Arquitetura e composição
- Rota: /financas. Página client component que integra quatro blocos principais:
  - Rastreador de Gastos: gráfico de pizza (Recharts) + lista por categorias com totais e percentuais.
  - Envelopes Virtuais: gerenciamento de envelopes (nome, cor, valores total/usado) e possíveis ações de alocação/ajuste.
  - Calendário de Pagamentos: agenda de contas a pagar, recorrência e marcação de pago.
  - Adicionar Despesa: formulário leve para registrar uma nova despesa com descrição, valor, categoria e data.
- Layout: grid responsiva em até duas colunas; tema escuro; usa RootLayout com cabeçalho/tema/AuthProvider.

Funcionalidades por bloco
- Autenticação
  - Bloqueio de acesso para não autenticados com CTA de login; estado de carregamento inicial.

- Rastreador de Gastos
  - Exibe distribuição de gastos por categoria em gráfico de pizza e tabela sintética com valores e percentuais.
  - Obtém dados do hook useFinancas (agregação por categoria e total geral).

- Envelopes Virtuais
  - Visualização e ações sobre envelopes (dados provenientes do hook useFinancas). Suporte a cores e limites de gasto.

- Calendário de Pagamentos
  - Lista e/ou visão de calendário com pagamentos agendados, recorrência e marcação como pago.

- Adicionar Despesa
  - Formulário que cria despesa vinculada a uma categoria e data; usa validações mínimas; feedback textual simples com desabilitação durante salvamento.

Estado, dados e integrações
- Hook useFinancas centraliza operações e cálculos (categorias, despesas, envelopes, agendamentos; agregações e totais).
- Tipos de domínio em types/financas.ts: CategoriaGasto, Despesa, EnvelopeVirtual, PagamentoAgendado, GastosPorCategoria.
- Gráfico client-only com next/dynamic (ssr: false) para evitar problemas de SSR do Recharts.

Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
- Server-first + RLS: mover leituras e mutações para server actions; usar Supabase no servidor com políticas por user_id.
- Modelagem e consistência: normalizar categorias e envelopes; garantir FKs e índices (categoria_id, user_id, due_date). Padronizar timezone em datas/recorrências.
- Validações e UX: validar entradas com Zod; toasts/erros claros; confirmar exclusões/alterações; skeletons para listas e gráficos; acessibilidade e i18n.
- Agendamentos e recorrência: padronizar regras de recorrência (RRULE ou campo estruturado) e gerar próximas ocorrências no backend; notificações/lembretes (cron/webhooks) como evolução.
- Visualização: filtros por período, exportação (CSV), metas por categoria/envelope, e alertas de estouro de orçamento.
- Testes: cobertura para CRUDs (despesas, envelopes, pagamentos), agregações por categoria, recorrências e render do gráfico.

Dependências e contexto
- App Router com AuthProvider e UI de cartões/botões/inputs; Recharts para gráficos; hook de finanças como fonte única de dados.

Resumo executivo
- O módulo Finanças oferece visão consolidada de gastos, envelopes e contas a pagar, com registro rápido de despesas. Para a nova implementação, priorizar server actions + RLS, validação robusta, regras sólidas de recorrência e melhorias de UX/performance/testes, mantendo visualizações claras e responsivas.