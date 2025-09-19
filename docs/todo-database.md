# Plano de Database - Sistema de Banco de Dados com Drizzle ORM

## Visão Geral
Implementação completa do sistema de banco de dados usando Drizzle ORM, com schemas normalizados, migrações SQL e configuração de segurança (RLS) baseada nos requisitos identificados nas auditorias.

## Objetivos da Fase
- Definir schemas para todos os módulos baseados nas auditorias
- Implementar migrações SQL para criação das tabelas
- Configurar Row Level Security (RLS) no Supabase
- Criar seeds para desenvolvimento
- Implementar integração com Drizzle ORM

## Tarefas Detalhadas

### 1. Configuração do Drizzle
- [ ] Configurar `drizzle.config.ts`
- [ ] Instalar dependências do Drizzle
- [ ] Configurar pasta `database/schema/`
- [ ] Configurar pasta `database/migrations/`
- [ ] Configurar integração com Supabase
- [ ] Criar script para geração de migrações

### 2. Schemas do Banco de Dados

#### Core Tables
- [ ] `users` - Perfis de usuários (base auth do Supabase)
- [ ] `user_profiles` - Dados complementares dos usuários
- [ ] `user_preferences` - Preferências visuais e de acessibilidade
- [ ] `user_goals` - Metas diárias dos usuários

#### Módulo Alimentação (baseado em alimentacao-auditoria.md)
- [ ] `meal_plans` - Planos de refeição do usuário
- [ ] `meal_records` - Registros diários de refeições
- [ ] `hydration_records` - Registros de hidratação diária

#### Módulo Autoconhecimento (baseado em autoconhecimento-auditoria.md)
- [ ] `self_knowledge_notes` - Notas de autoconhecimento
- [ ] `self_knowledge_categories` - Categorias das notas

#### Módulo Concursos (baseado em concursos-auditoria.md)
- [ ] `contests` - Concursos/Exames
- [ ] `contest_disciplines` - Disciplinas dos concursos
- [ ] `contest_topics` - Tópicos das disciplinas
- [ ] `questions` - Banco de questões
- [ ] `simulations` - Simulados configurados
- [ ] `simulation_attempts` - Tentativas de simulados
- [ ] `simulation_responses` - Respostas das tentativas

#### Módulo Finanças (baseado em financas-auditoria.md)
- [ ] `expense_categories` - Categorias de despesas
- [ ] `expenses` - Registros de despesas
- [ ] `virtual_envelopes` - Envelopes virtuais
- [ ] `scheduled_payments` - Pagamentos agendados

#### Módulo Hiperfocos (baseado em hiperfocos-auditoria.md)
- [ ] `hyperfocus_projects` - Projetos de hiperfoco
- [ ] `hyperfocus_tasks` - Tarefas dos projetos
- [ ] `hyperfocus_sessions` - Sessões de foco
- [ ] `hyperfocus_rotations` - Histórico de alternância

#### Módulo Estudos (baseado em estudos-auditoria.md)
- [ ] `study_sessions` - Sessões de estudo
- [ ] `pomodoro_sessions` - Sessões Pomodoro
- [ ] `study_goals` - Metas de estudo

#### Módulo Perfil (baseado em perfil-auditoria.md)
- [ ] `user_backup_data` - Dados de backup/exportação

#### Módulo Receitas (baseado em receitas-auditoria.md)
- [ ] `recipes` - Receitas
- [ ] `recipe_ingredients` - Ingredientes das receitas
- [ ] `recipe_instructions` - Instruções das receitas
- [ ] `shopping_lists` - Listas de compras
- [ ] `shopping_list_items` - Itens das listas

#### Módulo Saúde (baseado em saude-auditoria.md)
- [ ] `health_metrics` - Métricas de saúde
- [ ] `medications` - Medicamentos
- [ ] `medication_schedules` - Horários de medicamentos

#### Módulo Sono (baseado em sono-auditoria.md)
- [ ] `sleep_records` - Registros de sono
- [ ] `sleep_goals` - Metas de sono

### 3. Migrações SQL
- [ ] Criar migração inicial com todas as tabelas
- [ ] Configurar chaves estrangeiras e índices
- [ ] Adicionar constraints e validações
- [ ] Implementar RLS policies
- [ ] Criar funções e triggers necessários

### 4. Row Level Security (RLS)
- [ ] Configurar RLS para todas as tabelas
- [ ] Implementar políticas por user_id
- [ ] Adicionar políticas para operações CRUD
- [ ] Implementar segurança baseada em funções
- [ ] Testar políticas de segurança

### 5. Seeds para Desenvolvimento
- [ ] Criar `database/seed/` com dados de exemplo
- [ ] Implementar script de seed
- [ ] Adicionar usuários de teste
- [ ] Popular dados para cada módulo
- [ ] Documentar estrutura dos seeds

### 6. Tipos TypeScript
- [ ] Gerar tipos a partir dos schemas
- [ ] Criar `types/database.ts` com tipos principais
- [ ] Implementar tipos para cada módulo
- [ ] Adicionar tipos de utilitário
- [ ] Configurar sincronização automática

## Entregáveis Esperados
- Schemas Drizzle para todos os módulos
- Migrações SQL completas
- Sistema RLS configurado e seguro
- Seeds para desenvolvimento
- Tipos TypeScript gerados
- Documentação do banco de dados

## Prioridades
1. Schemas bem normalizados e consistentes
2. Segurança robusta com RLS
3. Performance com índices adequados
4. Documentação clara da estrutura

## Referências
- Baseado nos requisitos identificados em todas as auditorias
- Segue padrões de modelagem relacional
- Alinhado com estrutura definida em docs/todo.md

## Notas de Implementação
- Priorizar normalização e integridade referencial
- Implementar auditoria de dados importantes
- Considerar performance em consultas frequentes
- Garantir consistência entre módulos