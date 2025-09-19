Auditoria do Módulo: Perfil (app/perfil)

Resumo geral
- Objetivo: permitir que o usuário gerencie dados pessoais, metas diárias, preferências de acessibilidade/visual e exporte/importe dados da conta, além de acessar uma página de ajuda específica.
- Escopo: páginas client-side com autenticação obrigatória; integração direta a um hook de perfil para CRUD de perfil, metas e preferências; oferece backup (exportação JSON), importação e reset de configurações.

Arquitetura e composição
- Rotas:
  - /perfil: página principal de configuração de conta.
  - /perfil/ajuda: página de ajuda com orientações e o formato JSON esperado para importação/backup (documentação embutida).
- Composição principal da página /perfil:
  - Cabeçalho com breadcrumbs e ação “Ajuda”.
  - Cartões em grid (duas colunas em telas grandes):
    1) Informações Pessoais: e-mail (somente leitura), nome de exibição e ação de salvar.
    2) Metas Diárias: horas de sono, tarefas por dia, copos de água, pausas por hora; ação de salvar.
    3) Preferências Visuais: alto contraste, texto grande e redução de estímulos; aplicação imediata (classes no root) e ação de salvar.
    4) Backup e Dados: exportar JSON, importar dados e resetar todas as configurações (zona de perigo com confirmação).
- Layout: tema escuro herdado do app; uso de cartões, inputs, switches e botões; página protegida por autenticação.

Funcionalidades por bloco
- Autenticação
  - Bloqueia acesso a usuários não autenticados e exibe CTA para login; estado de carregamento inicial.

- Informações Pessoais
  - Editar nome de exibição; validação simples (não vazio); persistência via hook de perfil.

- Metas Diárias
  - Definir metas numéricas (sono, tarefas, água e pausas); persistência via hook de perfil.

- Preferências Visuais/Acessibilidade
  - Alternar alto contraste, texto grande e redução de estímulos.
  - Aplicação imediata no DOM via classes globais; opção de “Salvar Preferências” para persistir no backend.

- Backup e Dados
  - Exportar dados do usuário (JSON) via ação dedicada.
  - Importar dados no formato JSON documentado em /perfil/ajuda.
  - Resetar todas as configurações com confirmação.

Estado, dados e integrações
- Hook useProfile centraliza carregamento e salvamento de: profile (display_name), preferences (high_contrast, large_text, reduced_stimuli) e goals (sleep_hours, daily_tasks, water_glasses, break_frequency).
- Fluxo de carregamento: tela de loading até que auth e dados do perfil sejam resolvidos; sincronização dos estados locais com dados carregados.
- Import/Export: operações orientadas a JSON; a página de ajuda expõe o schema esperado para evitar erros na importação.

Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
- Server-first + RLS: mover leituras/mutações (perfil, metas, preferências, import/export, reset) para server actions; garantir políticas por user_id e validações de entrada.
- Preferências aplicadas no servidor: aplicar classes (alto contraste, texto grande, redução de estímulos) já no SSR/streaming para evitar flash visual; considerar persistência em cookie ou cabeçalho para hidratação consistente.
- Validação e UX: substituir alert/confirm por toasts e diálogos acessíveis; validação com Zod para importações e formulários; mensagens de erro/sucesso claras.
- Importação/Exportação: assinar e versionar o JSON exportado; validar versão no import; sanitizar strings.
- Acessibilidade e i18n: revisar rótulos, foco, leitura por leitor de tela; preparar traduções.
- Observabilidade e auditoria: registrar eventos críticos (reset/import) com carimbo de usuário/tempo.
- Testes: cenários de salvar perfil/metas/preferências, aplicar classes de acessibilidade, exportar/importar e resetar; testes de regressão visual para temas.

Taxonomia e contexto (para LLMs)
- Profile: dados de usuário exibidos publicamente (display_name) e e-mail.
- Preferences: opções visuais e de acessibilidade (alto contraste, texto grande, redução de estímulos) com efeito global.
- Goals: metas numéricas diárias usadas por outros módulos (sono, tarefas, água, pausas).
- Backup/Import: ciclo de exportação/importação de dados da conta num JSON versionado; ajuda embutida em /perfil/ajuda especifica o schema.

Resumo executivo
- O módulo de Perfil concentra configurações pessoais, metas e preferências de acessibilidade, além de ferramentas de backup/import/reset. Para a nova base em Next.js 15 + Supabase, priorizar server actions com RLS, aplicação SSR das preferências visuais, validação robusta (especialmente na importação), UX acessível e cobertura de testes para garantir segurança e consistência entre módulos.