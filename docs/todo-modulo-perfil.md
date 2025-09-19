# Plano do Módulo Perfil - Gestão de Conta e Preferências

## Visão Geral
Implementação do módulo de perfil que permite ao usuário gerenciar dados pessoais, metas diárias, preferências de acessibilidade/visual e exportar/importar dados da conta.

## Referência
Baseado na auditoria em `docs/perfil-auditoria.md`

## Objetivos do Módulo
- Gerenciar informações pessoais do usuário
- Configurar metas diárias personalizadas
- Definir preferências visuais e de acessibilidade
- Oferecer backup/importação de dados
- Fornecer ajuda e documentação

## Tarefas Detalhadas

### 1. Estrutura das Páginas
- [ ] Criar `app/(auth)/perfil/page.tsx` (página principal)
- [ ] Criar `app/(auth)/perfil/ajuda/page.tsx` (página de ajuda)
- [ ] Implementar layout em grid (duas colunas em desktop)
- [ ] Adicionar breadcrumbs e navegação
- [ ] Implementar loading states
- [ ] Configurar streaming com Suspense

### 2. Server Actions
- [ ] Criar `server-actions/perfil/profile.ts`
  - [ ] `updateProfile()`, `getProfile()`
  - [ ] `updateDisplayName()`, `getUserInfo()`
- [ ] Criar `server-actions/perfil/preferences.ts`
  - [ ] `updatePreferences()`, `getPreferences()`
  - [ ] `saveThemePreferences()`, `resetPreferences()`
- [ ] Criar `server-actions/perfil/goals.ts`
  - [ ] `updateDailyGoals()`, `getDailyGoals()`
  - [ ] `validateGoals()`, `resetGoals()`
- [ ] Criar `server-actions/perfil/backup.ts`
  - [ ] `exportUserData()`, `importUserData()`
  - [ ] `validateImportData()`, `resetAllData()`

### 3. Componentes de Funcionalidades

#### Informações Pessoais
- [ ] Criar `components/features/perfil/personal-info.tsx`
- [ ] Exibir e-mail (somente leitura)
- [ ] Implementar edição de nome de exibição
- [ ] Adicionar validação de nome não vazio
- [ ] Implementar botão de salvar com feedback
- [ ] Adicionar avatar personalizado
- [ ] Implementar informações adicionais opcionais

#### Metas Diárias
- [ ] Criar `components/features/perfil/daily-goals.tsx`
- [ ] Implementar campos numéricos para:
  - [ ] Horas de sono
  - [ ] Tarefas por dia
  - [ ] Copos de água
  - [ ] Pausas por hora
- [ ] Adicionar validações de intervalos
- [ ] Implementar salvamento automático
- [ ] Adicionar visualização de progresso
- [ ] Implementar metas personalizáveis adicionais

#### Preferências Visuais/Acessibilidade
- [ ] Criar `components/features/perfil/visual-preferences.tsx`
- [ ] Implementar switches para:
  - [ ] Alto contraste
  - [ ] Texto grande
  - [ ] Redução de estímulos
- [ ] Aplicar preferências imediatamente no DOM
- [ ] Implementar preview ao vivo das mudanças
- [ ] Adicionar botão de salvar preferências
- [ ] Implementar reset para padrões
- [ ] Adicionar mais opções de acessibilidade

#### Backup e Dados
- [ ] Criar `components/features/perfil/backup-manager.tsx`
- [ ] Implementar exportação de dados em JSON
- [ ] Adicionar assinatura e versão ao exportar
- [ ] Implementar importação de dados com validação
- [ ] Adicionar pré-visualização antes de importar
- [ ] Implementar reset de configurações com confirmação
- [ ] Adicionar histórico de backups
- [ ] Implementar criptografia opcional

### 4. Página de Ajuda
- [ ] Criar `components/features/perfil/help-page.tsx`
- [ ] Documentar o formato JSON esperado para importação
- [ ] Adicionar tutoriais e guias
- [ ] Implementar busca na ajuda
- [ ] Adicionar FAQ
- [ ] Implementar feedback e suporte
- [ ] Adicionar changelog e novidades

### 5. Validações e Schemas
- [ ] Criar `lib/validations/perfil.ts`
- [ ] Implementar schema para perfil (display_name)
- [ ] Implementar schema para preferências (tema, acessibilidade)
- [ ] Implementar schema para metas (valores numéricos)
- [ ] Implementar schema para importação/exportação
- [ ] Adicionar validações robustas de segurança
- [ ] Implementar sanitização de dados

### 6. Hooks Customizados
- [ ] Criar `hooks/use-perfil.ts`
- [ ] Implementar gerenciamento de perfil
- [ ] Implementar aplicação de temas
- [ ] Adicionar sincronização com backend
- [ ] Implementar validações locais
- [ ] Adicionar estratégias de cache

### 7. Sistema de Temas
- [ ] Implementar provider de tema global
- [ ] Adicionar classes CSS para:
  - [ ] Alto contraste
  - [ ] Texto grande
  - [ ] Redução de estímulos
- [ ] Implementar persistência no backend
- [ ] Adicionar transições suaves
- [ ] Implementar preferências no SSR
- [ ] Adicionar suporte a prefers-reduced-motion

### 8. Segurança e Privacidade
- [ ] Implementar RLS por user_id
- [ ] Adicionar validação de importação com Zod
- [ ] Implementar assinatura digital para exportações
- [ ] Adicionar log de auditoria para alterações
- [ ] Implementar confirmações para ações críticas
- [ ] Adicionar limites de tamanho para importações
- [ ] Implementar sanitização de dados

### 9. Performance e Otimização
- [ ] Implementar revalidateTag para dados de perfil
- [ ] Adicionar cache para preferências de tema
- [ ] Otimizar aplicação de classes CSS
- [ ] Implementar lazy loading para ajuda
- [ ] Adicionar otimizações para exportação grande

### 10. UX e Acessibilidade
- [ ] Adicionar skeletons para carregamento
- [ ] Implementar toast notifications
- [ ] Substituir alert/confirm por diálogos acessíveis
- [ ] Implementar navegação por teclado
- [ ] Adicionar ARIA labels apropriados
- [ ] Implementar contraste adequado
- [ ] Adicionar suporte a leitores de tela

## Entregáveis Esperados
- Sistema completo de gerenciamento de perfil
- Configuração de metas e preferências
- Sistema de backup/importação seguro
- Página de ajuda documentada
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Aplicação SSR de preferências visuais
3. Validação robusta de importação
4. UX acessível e segura

## Notas de Implementação
- Aplicar classes no SSR para evitar flash visual
- Implementar versionamento do JSON exportado
- Priorizar acessibilidade e segurança
- Garantir consistência entre módulos
- Implementar observabilidade crítica