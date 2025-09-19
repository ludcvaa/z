Auditoria do Módulo: Receitas (app/receitas)

Resumo geral
- Objetivo: permitir que o usuário gerencie receitas culinárias (CRUD), visualize detalhes, crie lista de compras a partir de receitas selecionadas e marque favoritas.
- Escopo: conjunto de páginas client-side com autenticação obrigatória; hooks de dados para operações; experiência com filtros, destaque de favoritas e integração com a lista de compras.

Arquitetura e composição (rotas principais)
- /receitas: listagem com busca, filtro por categoria, cartões com informações resumidas (categoria, dificuldade, tempo, porções, ingredientes), ação para seleção e geração de lista de compras.
- /receitas/adicionar: formulário para criar receita (nome, categoria, ingredientes, modo de preparo, tempo, porções, dificuldade, favorita).
- /receitas/[id]: detalhes da receita com badges, tempo, porções, datas e ações (editar, excluir, favoritar, adicionar à lista de compras, compartilhar).
- /receitas/[id]/editar: formulário de edição com preenchimento inicial e salvamento.
- /receitas/lista-compras: lista de compras vinculada a receitas (parâmetro ?receitas=...), permite adicionar itens, marcar como comprados e limpar itens comprados; exibe progresso e resumo por categoria.

Funcionalidades principais
- Listagem e filtros
  - Busca por nome; filtro por categoria dinâmica com base nos dados carregados.
  - Seleção de receitas para gerar lista de compras (botão flutuante com contagem e link para rota de lista-compras).

- CRUD de receitas
  - Criar, visualizar, atualizar, excluir; estado de favorita com toggle.
  - Campos suportados: nome, categoria, ingredientes, modo de preparo, tempo (min), porções, dificuldade (fácil/médio/difícil), favorita.

- Lista de compras
  - Geração automática a partir de receitas selecionadas (query string), itens agrupados por categoria, marcação de comprados e limpeza de itens comprados.
  - Adição manual de itens com quantidade e categoria; cálculo de progresso global e por categoria.

Layout e experiência
- Tema escuro com cards, badges, inputs, seletores; skeleton de carregamento em /receitas/loading e /receitas/[id]/loading.
- Ações com confirmação simples (confirm/alert) e feedback via texto; estados de carregamento padrão.

Estado, dados e integrações
- Hook use-receitas centraliza dados de receitas e lista de compras; todas as páginas são client components.
- Integração provável com Supabase para persistência; busca/filtragem e seleção via estado local.
- Comunicação Receitas -> Lista de Compras via query string; também pode ser acionada a partir da página de detalhes.

Pontos de atenção para reimplementação (Next.js 15 + Supabase, melhores práticas)
- Server-first + RLS: mover CRUD e geração de lista para server actions; validar e sanitizar entradas (Zod), aplicar políticas por user_id.
- Modelo de dados: normalizar entidades (receita, ingrediente, categoria, lista_item) com FKs e timestamps; índices por user_id e categoria; campos de dificuldade e favorita.
- Usabilidade: substituir alert/confirm por diálogos/feedback acessíveis; autosave e rascunho para formulários; upload de imagem da receita; compartilhamento (link público com permissões).
- Lista de compras: permitir agrupamento personalizado (setores do mercado), ordenação manual, exportação (PDF/CSV) e histórico de listas.
- Acessibilidade e i18n: aria, foco, contraste; textos prontos para tradução.
- Performance: paginação/infinite scroll na listagem; cache/revalidateTag; memoização de filtros.
- Testes: CRUD completo, seleção e geração de lista, marcação de comprados, progresso e edição; testes de rota com query string.

Dependências e contexto
- App Router, AuthProvider, UI de cards/badges/inputs/selects; hooks especializados do módulo.

Resumo executivo
- O módulo Receitas cobre o ciclo completo de gerenciamento de receitas e lista de compras. Para a reimplementação rígida, priorizar server actions com RLS, modelo normalizado, validação robusta, UX acessível e melhorias de performance/testes, mantendo integração com alimentação e planejamento diário quando necessário.