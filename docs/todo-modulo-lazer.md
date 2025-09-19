# Plano do Módulo Lazer - Gestão de Atividades de Lazer e Bem-Estar

## Visão Geral
Implementação do módulo de lazer que ajuda o usuário a registrar e acompanhar atividades de lazer, estabelecer metas de tempo para descanso, e manter um equilíbrio saudável entre produtividade e recreação.

## Referência
Baseado na auditoria em `docs/lazer-auditoria.md`

## Objetivos do Módulo
- Registrar atividades de lazer com categorização
- Estabelecer e acompanhar metas de tempo para lazer
- Analisar padrões de atividades recreativas
- Fornecer insights sobre equilíbrio vida-trabalho
- Oferecer recomendações personalizadas de atividades

## Tarefas Detalhadas

### 1. Estrutura da Página
- [ ] Criar `app/(auth)/lazer/page.tsx`
- [ ] Implementar layout em dashboard com múltiplas seções
- [ ] Adicionar loading states
- [ ] Implementar fallback para não autenticados
- [ ] Configurar streaming com Suspense boundaries

### 2. Server Actions
- [ ] Criar `server-actions/lazer/activities.ts`
  - [ ] `createActivity()` - Criar nova atividade de lazer
  - [ ] `updateActivity()` - Atualizar atividade existente
  - [ ] `deleteActivity()` - Excluir atividade
  - [ ] `getActivities()` - Listar atividades do usuário
  - [ ] `getActivitiesByDateRange()` - Filtrar por período
  - [ ] `getActivityStats()` - Obter estatísticas consolidadas

- [ ] Criar `server-actions/lazer/categories.ts`
  - [ ] `createCategory()` - Criar categoria personalizada
  - [ ] `updateCategory()` - Atualizar categoria
  - [ ] `deleteCategory()` - Excluir categoria
  - [ ] `getCategories()` - Listar categorias
  - [ ] `getDefaultCategories()` - Obter categorias padrão

- [ ] Criar `server-actions/lazer/goals.ts`
  - [ ] `setLeisureGoals()` - Definir metas de lazer
  - [ ] `getLeisureGoals()` - Obter metas atuais
  - [ ] `updateGoalProgress()` - Atualizar progresso
  - [ ] `getGoalAchievements()` - Obter conquistas

### 3. Componentes de Funcionalidades

#### Registro de Atividades
- [ ] Criar `components/features/lazer/activity-tracker.tsx`
- [ ] Implementar formulário de registro com campos:
  - [ ] Nome da atividade
  - [ ] Categoria (seleção ou criação)
  - [ ] Duração em minutos
  - [ ] Data e horário
  - [ ] Nível de satisfação (1-5)
  - [ ] Notas opcionais
- [ ] Adicionar auto-completar de atividades recentes
- [ ] Implementar timer integrado para duração
- [ ] Adicionar sugestões baseadas no histórico

#### Categorias de Lazer
- [ ] Criar `components/features/lazer/category-manager.tsx`
- [ ] Implementar lista de categorias com cores e ícones
- [ ] Adicionar categorias padrão:
  - [ ] Esportes e Atividades Físicas
  - [ ] Leitura
  - [ ] Filmes e Séries
  - [ ] Música
  - [ ] Jogos
  - [ ] Social
  - [ ] Arte e Criatividade
  - [ ] Natureza
  - [ ] Aprendizado
  - [ ] Relaxamento
- [ ] Permitir criação de categorias personalizadas
- [ ] Implementar edição e exclusão de categorias
- [ ] Adicionar estatísticas por categoria

#### Metas e Progresso
- [ ] Criar `components/features/lazer/leisure-goals.tsx`
- [ ] Implementar definição de metas:
  - [ ] Meta diária de tempo de lazer
  - [ ] Meta semanal por categoria
  - [ ] Meta de variedade de atividades
  - [ ] Meta de satisfação média
- [ ] Adicionar visualização de progresso com barras e gráficos
- [ ] Implementar alertas de metas não alcançadas
- [ ] Adicionar celebrações de conquistas
- [ ] Implementar histórico de metas

#### Análise e Insights
- [ ] Criar `components/features/lazer/leisure-analytics.tsx`
- [ ] Implementar painéis com:
  - [ ] Gráfico de tempo por categoria (pizza)
  - [ ] Evolução semanal/mensal (linha)
  - [ ] Distribuição por dia da semana
  - [ ] Correlação lazer x produtividade
  - [ ] Padrões de horários preferidos
- [ ] Adicionar insights e recomendações
- [ ] Implementar comparação com períodos anteriores
- [ ] Adicionar exportação de relatórios

#### Medidor de Diversão
- [ ] Criar `components/features/lazer/fun-meter.tsx`
- [ ] Implementar indicador visual de satisfação
- [ ] Adicionar cálculo de índice de diversão semanal
- [ ] Implementar correlação com outros indicadores
- [ ] Adicionar recomendações para aumentar satisfação
- [ ] Implementar metas de bem-estar

#### Calendário de Lazer
- [ ] Criar `components/features/lazer/leisure-calendar.tsx`
- [ ] Implementar visão mensal de atividades
- [ ] Adicionar filtragem por categoria
- [ ] Implementar rápida criação de atividades
- [ ] Adicionar visualização de densidade de atividades
- [ ] Implementar navegação entre meses

### 4. Validações e Schemas
- [ ] Criar `lib/validations/lazer.ts`
- [ ] Implementar schema para atividades:
  ```typescript
  z.object({
    name: z.string().min(1).max(100),
    categoryId: z.string().uuid(),
    duration: z.number().min(1).max(1440), // minutos
    date: z.date(),
    satisfaction: z.number().min(1).max(5),
    notes: z.string().max(500).optional()
  })
  ```
- [ ] Implementar schema para categorias
- [ ] Implementar schema para metas
- [ ] Adicionar validações de data e horário
- [ ] Implementar sanitização de inputs

### 5. Hooks Customizados
- [ ] Criar `hooks/use-lazer.ts`
- [ ] Implementar gerenciamento de atividades
- [ ] Implementar gerenciamento de categorias
- [ ] Implementar estado de metas e progresso
- [ ] Adicionar cálculos de estatísticas
- [ ] Implementar estratégias de cache

### 6. Performance e Otimização
- [ ] Implementar revalidateTag para dados de lazer
- [ ] Adicionar lazy loading para gráficos
- [ ] Implementar cache local para atividades recentes
- [ ] Otimizar queries de agregação
- [ ] Adicionar streaming para componentes pesados

### 7. UX e Acessibilidade
- [ ] Adicionar skeletons para carregamento
- [ ] Implementar toast notifications para feedback
- [ ] Adicionar confirmações para exclusões
- [ ] Implementar navegação por teclado
- [ ] Adicionar ARIA labels apropriados
- [ ] Implementar modo de alto contraste
- [ ] Adicionar animações suaves

### 8. Integrações
- [ ] Integrar com módulo de saúde (correlação lazer-saúde)
- [ ] Compartilhar dados com dashboard principal
- [ ] Sincronizar metas com perfil do usuário
- [ ] Implementar integração com calendário do sistema
- [ ] Adicionar sugestões baseadas em outras atividades

### 9. Features Avançadas
- [ ] Implementar modo "offline" com sincronização posterior
- [ ] Adicionar lembretes para pausas de lazer
- [ ] Implementar desafios e conquistas
- [ ] Adicionar modo social (compartilhamento opcional)
- [ ] Implementar aprendizado de padrões com ML básico

## Entregáveis Esperados
- Página de lazer completa e funcional
- Sistema de registro e categorização de atividades
- Definição e acompanhamento de metas
- Análises e insights sobre padrões
- Integrações com outros módulos
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Registro simples e intuitivo de atividades
3. Sistema de metas claro e motivador
4. Análises que gerem valor para o usuário

## Notas de Implementação
- Priorizar server-first approach
- Implementar RLS rigoroso por user_id
- Garantir UX fluida e motivadora
- Adicionar gamificação para engajamento
- Implementar tratamento robusto de erros