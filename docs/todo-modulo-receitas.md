# Plano do Módulo Receitas - Gestão Completa de Receitas e Listas de Compras

## Visão Geral
Implementação do módulo de receitas que permite aos usuários gerenciar um livro de receitas pessoal, planejar refeições semanais e gerar listas de compras inteligentes, com integração com o módulo de alimentação.

## Referência
Baseado na auditoria em `docs/receitas-auditoria.md`

## Objetivos do Módulo
- Criar e gerenciar um livro de receitas pessoal
- Planejar refeições semanais com integração ao calendário
- Gerar listas de compras inteligentes baseadas nas receitas
- Organizar ingredientes e calcular informações nutricionais
- Sincronizar com o módulo de alimentação

## Tarefas Detalhadas

### 1. Estrutura das Páginas
- [ ] Criar `app/(auth)/receitas/page.tsx` (catálogo de receitas)
- [ ] Criar `app/(auth)/receitas/[id]/page.tsx` (detalhe da receita)
- [ ] Criar `app/(auth)/receitas/criar/page.tsx` (criar/editar receita)
- [ ] Criar `app/(auth)/receitas/planejamento/page.tsx` (planejamento semanal)
- [ ] Criar `app/(auth)/receitas/lista-compras/page.tsx` (listas de compras)
- [ ] Adicionar loading states para cada página
- [ ] Implementar fallbacks para não autenticados

### 2. Server Actions
- [ ] Criar `server-actions/receitas/recipes.ts`
  - [ ] `createRecipe()` - Criar nova receita
  - [ ] `updateRecipe()` - Atualizar receita existente
  - [ ] `deleteRecipe()` - Excluir receita
  - [ ] `getRecipes()` - Listar receitas com filtros
  - [ ] `getRecipeById()` - Obter detalhes de uma receita
  - [ ] `searchRecipes()` - Buscar receitas
  - [ ] `rateRecipe()` - Avaliar receita
  - [ ] `toggleFavorite()` - Marcar/desmarcar favorita

- [ ] Criar `server-actions/receitas/ingredients.ts`
  - [ ] `addIngredient()` - Adicionar ingrediente à receita
  - [ ] `updateIngredient()` - Atualizar ingrediente
  - [ ] `removeIngredient()` - Remover ingrediente
  - [ ] `getRecipeIngredients()` - Listar ingredientes
  - [ ] `calculateNutrition()` - Calcular informações nutricionais

- [ ] Criar `server-actions/receitas/instructions.ts`
  - [ ] `addInstruction()` - Adicionar passo da receita
  - [ ] `updateInstruction()` - Atualizar passo
  - [ ] `reorderInstructions()` - Reordenar passos
  - [ ] `getRecipeInstructions()` - Listar instruções

- [ ] Criar `server-actions/receitas/meal-planning.ts`
  - [ ] `planMeal()` - Planejar refeição
  - [ ] `updateMealPlan()` - Atualizar planejamento
  - [ ] `getWeeklyPlan()` - Obter planejamento semanal
  - [ ] `generateShoppingList()` - Gerar lista de compras
  - [ ] `getPlannedMeals()` - Obter refeições planejadas

- [ ] Criar `server-actions/receitas/shopping-lists.ts`
  - [ ] `createShoppingList()` - Criar lista de compras
  - [ ] `updateShoppingList()` - Atualizar lista
  - [ ] `addItemToList()` - Adicionar item à lista
  - [ ] `markItemAsPurchased()` - Marcar item como comprado
  - [ ] `getShoppingLists()` - Listar listas
  - [ ] `deleteShoppingList()` - Excluir lista

### 3. Componentes de Funcionalidades

#### Catálogo de Receitas
- [ ] Criar `components/features/receitas/recipe-catalog.tsx`
- [ ] Implementar busca por nome, ingredientes ou tags
- [ ] Adicionar filtros por:
  - [ ] Categoria (café da manhã, almoço, jantar, sobremesa)
  - [ ] Tempo de preparo
  - [ ] Dificuldade (fácil, médio, difícil)
  - [ ] Restrições dietéticas
  - [ ] Avaliação
- [ ] Implementar visualização em grid e lista
- [ ] Adicionar paginação ou infinite scroll
- [ ] Implementar cards com imagem, título, tempo e avaliação

#### Detalhe da Receita
- [ ] Criar `components/features/receitas/recipe-detail.tsx`
- [ ] Exibir informações completas:
  - [ ] Título, descrição, imagem
  - [ ] Tempo de preparo e cozimento
  - [ ] Porções e dificuldade
  - [ ] Lista de ingredientes com medidas
  - [ ] Instruções passo a passo
  - [ ] Informações nutricionais
  - [ ] Avaliações e comentários
- [ ] Implementar botões de favoritar e compartilhar
- [ ] Adicionar seção de receitas similares
- [ ] Implementar impressão da receita

#### Criar/Editar Receita
- [ ] Criar `components/features/receitas/recipe-form.tsx`
- [ ] Implementar formulário multi-seções:
  - [ ] Informações básicas
  - [ ] Ingredientes (adicionar/remover dinamicamente)
  - [ ] Instruções (reordenável com drag-and-drop)
  - [ ] Informações nutricionais
  - [ ] Tags e categorias
- [ ] Adicionar upload de imagem
- [ ] Implementar preview da receita
- [ ] Adicionar validação em tempo real
- [ ] Implementar salvamento automático (draft)

#### Planejamento Semanal
- [ ] Criar `components/features/receitas/meal-planner.tsx`
- [ ] Implementar visão semanal com calendário
- [ ] Adicionar drag-and-drop de receitas para dias/refeições
- [ ] Implementar sugestões baseadas no histórico
- [ ] Adicionar visualização rápida das receitas
- [ ] Implementar botão para gerar lista de compras
- [ ] Adicionar estatísticas de planejamento
- [ ] Implementar templates de planejamento

#### Listas de Compras Inteligentes
- [ ] Criar `components/features/receitas/shopping-list.tsx`
- [ ] Implementar agrupamento automático por categorias:
  - [ ] Frutas e vegetais
  - [ ] Carnes e peixes
  - [ ] Laticínios
  - [ ] Grãos e cereais
  - [ ] Temperos e condimentos
  - [ ] Produtos de limpeza
- [ ] Adicionar verificação de itens já comprados
- [ ] Implementar estimativa de custos
- [ ] Adicionar integração com supermercados locais
- [ ] Implementar compartilhamento da lista
- [ ] Adicionar modo offline

#### Informações Nutricionais
- [ ] Criar `components/features/receitas/nutrition-info.tsx`
- [ ] Implementar cálculo automático baseado em ingredientes
- [ ] Exibir informações:
  - [ ] Calorias
  - [ ] Macronutrientes (proteínas, carboidratos, gorduras)
  - [ ] Micronutrientes principais
  - [ ] Alergênicos
- [ ] Adicionar comparação com metas diárias
- [ ] Implementar integração com perfil de saúde

### 4. Validações e Schemas
- [ ] Criar `lib/validations/receitas.ts`
- [ ] Implementar schema para receitas:
  ```typescript
  z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
    prepTime: z.number().min(1),
    cookTime: z.number().min(0),
    servings: z.number().min(1),
    difficulty: z.enum(['fácil', 'médio', 'difícil']),
    category: z.string(),
    image: z.string().url().optional(),
    tags: z.array(z.string())
  })
  ```
- [ ] Implementar schema para ingredientes
- [ ] Implementar schema para instruções
- [ ] Implementar schema para listas de compras
- [ ] Adicionar validações de medidas e quantidades

### 5. Hooks Customizados
- [ ] Criar `hooks/use-receitas.ts`
- [ ] Implementar gerenciamento de receitas
- [ ] Implementar estado de planejamento
- [ ] Implementar gerenciamento de listas
- [ ] Adicionar cálculos nutricionais
- [ ] Implementar estratégias de cache

### 6. Features Avançadas
- [ ] Implementar importação de receitas de URLs
- [ ] Adicionar scanner de códigos de barras para ingredientes
- [ ] Implementar substituição inteligente de ingredientes
- [ ] Adicionar modo de colaboração (compartilhar receitas)
- [ ] Implementar IA para sugestões de receitas
- [ ] Adicionar integração com delivery de ingredientes

### 7. Integrações
- [ ] Integrar com módulo de alimentação
- [ ] Sincronizar planejamento com calendário
- [ ] Compartilhar dados com perfil nutricional
- [ ] Implementar integração com supermercados
- [ ] Adicionar exportação para outros formatos

### 8. Performance e Otimização
- [ ] Implementar revalidateTag para dados de receitas
- [ ] Adicionar lazy loading para imagens
- [ ] Implementar cache de ingredientes comuns
- [ ] Otimizar cálculos nutricionais
- [ ] Adicionar streaming para componentes pesados

### 9. UX e Acessibilidade
- [ ] Adicionar skeletons para carregamento
- [ ] Implementar feedback visual claro
- [ ] Adicionar modo de impressão
- [ ] Implementar navegação por teclado
- [ ] Adicionar ARIA labels apropriados
- [ ] Implementar responsividade mobile

## Entregáveis Esperados
- Sistema completo de gestão de receitas
- Planejamento semanal de refeições
- Listas de compras inteligentes
- Cálculos nutricionais automáticos
- Integrações com outros módulos
- Documentação do módulo

## Prioridades
1. Server actions com RLS
2. Sistema de planejamento semanal
3. Listas de compras inteligentes
4. Integração com módulo alimentação

## Notas de Implementação
- Priorizar server-first approach
- Implementar RLS rigoroso por user_id
- Garantir UX intuitiva para planejamento
- Implementar validações robustas
- Adicionar tratamento robusto de erros