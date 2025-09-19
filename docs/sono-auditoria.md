Auditoria do Módulo: Sono (app/sono)

Resumo geral
- Objetivo: registrar sono diário (horários, qualidade, observações), configurar lembretes de dormir/acordar e visualizar padrões semanais básicos.
- Escopo: página client-side com autenticação obrigatória, integrada ao hook use-sono para persistência e cálculo de estatísticas. UI com abas para registrar, visualizar e configurar lembretes.

Arquitetura e composição
- Rota: /sono. Três abas:
  - Registrar Sono: formulário para horários de dormir/acordar, qualidade (1-10) e observações; cálculo automático de horas de sono; dicas rápidas.
  - Visualizar Padrões: cartão com estatísticas da última semana (média de horas, qualidade média, consistência e tendências) com tratamento para ausência de dados.
  - Lembretes: configuração de lembretes (ativar/desativar, horários de dormir/acordar e dias da semana), com salvamento via hook.
- Layout: tema escuro, cards, inputs, badges e switches; herda RootLayout.

Funcionalidades por bloco
- Autenticação
  - Bloqueio e CTA de login para não autenticados; loading inicial.

- Registro de sono
  - Validações mínimas; calcula duração total (considerando virada do dia); feedback via toasts.

- Estatísticas
  - Estatística semanal com tendências (aumentando/diminuindo/estável) para horas e qualidade; consistência; resumo e padrões identificados (melhor dia, horários comuns).

- Lembretes
  - Flags e horários para dormir/acordar; persiste configuração com dias da semana; feedback via toasts.

Estado, dados e integrações
- Hook use-sono expõe: registrosSono, configuracaoLembretes, estatisticas e operações salvarRegistroSono/atualizarLembretes.
- Dados diários com campos: bedtime, wake_time, sleep_quality, notes, date. Configuração: bedtime_reminder_enabled/time, wake_reminder_enabled/time, weekdays.

Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
- Server-first + RLS: mover persistência de registros e lembretes para server actions com políticas por user_id; validar entradas (Zod) e sanitizar textos.
- Modelagem: tabelas para registros de sono e configuração de lembretes; índices por user_id e date; normalização de weekdays.
- UX e acessibilidade: toasts consistentes, diálogos acessíveis, skeletons; foco/aria; i18n.
- Data/timezone: lidar com virada de dia e timezone explicitamente (colunas time e date separadas, ou timestamps com TZ + cálculos no server).
- Observabilidade: auditar alterações de lembretes/registro; possibilidade de notificações push no futuro.
- Testes: casos de cálculo de horas, salvar/editar, visualização sem dados, salvar lembretes, tendências.

Dependências e contexto
- App Router com AuthProvider; UI de cards, inputs, tabs, switches e toasts (sonner); hook use-sono.

Resumo executivo
- O módulo Sono oferece registro diário e lembretes com visão semanal simples. Na reimplementação, priorizar server actions com RLS, modelagem sólida de datas/horários, validação forte e UX acessível, além de testes cobrindo cálculos e persistência.