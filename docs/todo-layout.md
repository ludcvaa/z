# Plano de Layout - Sistema de Layout e Componentes UI

## Visão Geral
Implementação do sistema de layout global, componentes UI base e componentes de layout, seguindo o padrão estabelecido nas auditorias com tema escuro e design responsivo.

## Objetivos da Fase
- Criar layout principal do aplicativo
- Implementar componentes UI base com shadcn/ui
- Desenvolver componentes de layout (header, navigation, footer)
- Configurar tema escuro e gerenciamento de estilos
- Garantir responsividade em todos os dispositivos

## Tarefas Detalhadas

### 1. Layout Principal
- [ ] Implementar `app/layout.tsx` (root layout)
- [ ] Configurar providers globais (Auth, Theme, etc.)
- [ ] Implementar estrutura HTML semântica
- [ ] Adicionar meta tags e configuração de viewport
- [ ] Configurar fontes e estilos globais
- [ ] Implementar error boundaries

### 2. Componentes UI Base (shadcn/ui)
- [ ] Configurar components.json para shadcn/ui
- [ ] Instalar componentes base:
  - [ ] Button
  - [ ] Card
  - [ ] Input
  - [ ] Form
  - [ ] Dialog
  - [ ] Tabs
  - [ ] Progress
  - [ ] Badge
  - [ ] Select
  - [ ] Checkbox
  - [ ] Switch
- [ ] Customizar componentes para tema escuro
- [ ] Implementar variantes personalizadas

### 3. Componentes de Layout
- [ ] Criar `components/layout/header.tsx`
  - [ ] Navegação principal
  - [ ] Menu de usuário com avatar
  - [ ] Busca global
  - [ ] Notificações
  - [ ] Responsividade mobile

- [ ] Criar `components/layout/navigation.tsx`
  - [ ] Menu lateral ou superior
  - [ ] Links para todos os módulos
  - [ ] Indicadores de módulos ativos
  - [ ] Acesso rápido aos principais recursos

- [ ] Criar `components/layout/footer.tsx`
  - [ ] Links importantes
  - [ ] Informações legais
  - [ ] Versão do aplicativo
  - [ ] Links de ajuda

### 4. Sistema de Temas
- [ ] Configurar tema escuro como padrão
- [ ] Implementar provider de tema
- [ ] Adicionar opção de alternância de tema (se necessário)
- [ ] Implementar preferências de acessibilidade:
  - [ ] Alto contraste
  - [ ] Texto grande
  - [ ] Redução de estímulos
- [ ] Garantir consistência visual em todos os componentes

### 5. Componentes Compartilhados
- [ ] Criar `components/shared/loading-skeleton.tsx`
- [ ] Criar `components/shared/error-boundary.tsx`
- [ ] Criar `components/shared/date-navigator.tsx`
- [ ] Criar `components/shared/toast-notifications.tsx`
- [ ] Implementar componentes de feedback visual

### 6. Layout para Áreas Autenticadas
- [ ] Implementar `app/(auth)/layout.tsx`
- [ ] Configurar layout protegido por autenticação
- [ ] Adicionar breadcrumbs para navegação
- [ ] Implementar estrutura consistente para páginas internas
- [ ] Adicionar loading states globais

## Entregáveis Esperados
- Layout principal funcional e responsivo
- Biblioteca completa de componentes UI base
- Componentes de layout implementados
- Sistema de temas configurado
- Componentes compartilhados reutilizáveis

## Prioridades
1. Layout principal com providers globais
2. Componentes UI base funcionais
3. Sistema de navegação intuitivo
4. Tema escuro consistente e acessível

## Referências
- Baseado nos padrões identificados nas auditorias dos módulos
- Segue padrões do shadcn/ui para componentes
- Alinhado com estrutura definida em docs/todo.md

## Notas de Implementação
- Todos os módulos auditados usam tema escuro
- Priorizar acessibilidade e navegação por teclado
- Implementar loading states consistentes
- Garantir responsividade em todos os breakpoints