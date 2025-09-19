# Plano do Módulo Autoconhecimento - Sistema de Notas Pessoais

## Visão Geral
Implementação do módulo de autoconhecimento que centraliza anotações do usuário em três categorias (Quem sou, Meus porquês, Meus padrões) com criação, edição, exclusão e busca.

## Referência
Baseado na auditoria em `docs/autoconhecimento-auditoria.md`

## Objetivos do Módulo
- Organizar notas em três categorias pré-definidas
- Permitir criação, edição e exclusão de notas
- Implementar busca textual dentro de cada categoria
- Oferecer experiência fluida entre lista e editor
- Garantir persistência segura com server actions

## Tarefas Detalhadas

### 1. Estrutura da Página
- [ ] Criar `app/(auth)/autoconhecimento/page.tsx`
- [ ] Implementar layout com abas para categorias
- [ ] Configurar navegação entre lista e editor
- [ ] Adicionar loading states adequados
- [ ] Implementar fallback para não autenticados

### 2. Server Actions
- [ ] Criar `server-actions/autoconhecimento/notes.ts`
- [ ] Implementar `createNote()` action
- [ ] Implementar `updateNote()` action
- [ ] Implementar `deleteNote()` action
- [ ] Implementar `getNotesByCategory()` action
- [ ] Implementar `searchNotes()` action
- [ ] Adicionar validações Zod robustas
- [ ] Implementar tratamento de erros

### 3. Componentes de Funcionalidades

#### Sistema de Abas
- [ ] Criar `components/features/autoconhecimento/category-tabs.tsx`
- [ ] Implementar três categorias: "Quem sou", "Meus porquês", "Meus padrões"
- [ ] Adicionar estilos distintos por categoria
- [ ] Implementar navegação entre categorias
- [ ] Adicionar indicador visual de categoria ativa
- [ ] Sincronizar estado com URL (query string)

#### Lista de Notas
- [ ] Criar `components/features/autoconhecimento/notes-list.tsx`
- [ ] Implementar cards de notas com título, prévia e data
- [ ] Adicionar campo de busca por título e conteúdo
- [ ] Implementar filtros por categoria
- [ ] Adicionar ordenação por data de atualização
- [ ] Implementar ações de editar e excluir
- [ ] Adicionar paginação ou infinite scroll

#### Editor de Notas
- [ ] Criar `components/features/autoconhecimento/note-editor.tsx`
- [ ] Implementar formulário com título e conteúdo
- [ ] Adicionar modo de criação e edição
- [ ] Implementar validação de campos obrigatórios
- [ ] Adicionar salvamento automático (draft)
- [ ] Implementar botões de cancelar e salvar
- [ ] Adicionar contador de caracteres
- [ ] Implementar rich text básico (negrito, itálico, lista)

#### Visualização Individual
- [ ] Criar `app/(auth)/autoconhecimento/[noteId]/page.tsx`
- [ ] Implementar página detalhe da nota
- [ ] Adicionar navegação entre notas da mesma categoria
- [ ] Implementar ações de editar e excluir
- [ ] Adicionar histórico de alterações

### 4. Validações e Schemas
- [ ] Criar `lib/validations/autoconhecimento.ts`
- [ ] Implementar schema para notas (title, content, category)
- [ ] Adicionar validações de tamanho mínimo e máximo
- [ ] Implementar sanitização de conteúdo
- [ ] Adicionar validação de categoria válida
- [ ] Implementar proteção contra XSS

### 5. Hooks Customizados
- [ ] Criar `hooks/use-autoconhecimento.ts`
- [ ] Implementar gerenciamento de notas por categoria
- [ ] Implementar estado de busca e filtros
- [ ] Adicionar gerenciamento de editor
- [ ] Implementar otimizações de cache
- [ ] Adicionar sincronização com URL

### 6. UX e Melhorias
- [ ] Adicionar skeletons durante carregamento
- [ ] Implementar toast notifications para feedback
- [ ] Adicionar confirmações para exclusão
- [ ] Implementar indicador de nota sendo editada
- [ ] Adicionar atalhos de teclado
- [ ] Implementar modo foco (distraction-free)

### 7. Performance e Otimização
- [ ] Implementar revalidateTag para notas
- [ ] Adicionar virtual scrolling para listas longas
- [ ] Implementar cache local para notas recentes
- [ ] Otimizar queries de busca
- [ ] Adicionar debounce para busca textual

### 8. Segurança e Privacidade
- [ ] Implementar RLS por user_id
- [ ] Adicionar criptografia para conteúdo sensível
- [ ] Implementar log de auditoria para alterações
- [ ] Adicionar opção de exportação segura
- [ ] Implementar exclusão permanente com confirmação

## Entregáveis Esperados
- Página de autoconhecimento funcional
- Server actions para todas as operações
- Sistema de categorias com abas
- Editor de notas com rich text
- Busca e filtros funcionais
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Validação robusta com Zod
3. UX fluida entre lista e editor
4. Performance com cache estratégico

## Notas de Implementação
- Implementar concorrência com timestamps
- Adicionar estratégia de versionamento
- Garantir sanitização de conteúdo
- Priorizar server-first approach
- Implementar sincronização com URL para deep-linking