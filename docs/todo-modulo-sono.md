# Plano do Módulo Sono - Monitoramento e Otimização do Sono

## Visão Geral
Implementação do módulo de sono que permite aos usuários monitorar padrões de sono, analisar qualidade do descanso, estabelecer metas de sono e receber recomendações para melhorar a higiene do sono.

## Referência
Baseado na auditoria em `docs/sono-auditoria.md`

## Objetivos do Módulo
- Registrar horários de dormir e acordar
- Avaliar subjetivamente a qualidade do sono
- Analisar padrões e tendências de sono
- Estabelecer e acompanhar metas de sono
- Receber recomendações personalizadas

## Tarefas Detalhadas

### 1. Estrutura da Página
- [ ] Criar `app/(auth)/sono/page.tsx` (dashboard de sono)
- [ ] Criar `app/(auth)/sono/registro/page.tsx` (registro de sono)
- [ ] Criar `app/(auth)/sono/analise/page.tsx` (análise e padrões)
- [ ] Criar `app/(auth)/sono/rotina/page.tsx` (rotina de sono)
- [ ] Criar `app/(auth)/sono/ambiente/page.tsx` (ambiente de sono)
- [ ] Adicionar loading states para cada página
- [ ] Implementar fallbacks para não autenticados

### 2. Server Actions
- [ ] Criar `server-actions/sono/sleep-records.ts`
  - [ ] `recordSleep()` - Registrar novo registro de sono
  - [ ] `updateSleepRecord()` - Atualizar registro existente
  - [ ] `deleteSleepRecord()` - Excluir registro
  - [ ] `getSleepRecords()` - Obter registros do usuário
  - [ ] `getSleepRecordsByDateRange()` - Filtrar por período
  - [ ] `calculateSleepDuration()` - Calcular duração
  - [ ] `getSleepQuality()` - Calcular qualidade

- [ ] Criar `server-actions/sono/sleep-analysis.ts`
  - [ ] `analyzeSleepPatterns()` - Analisar padrões
  - [ ] `getSleepTrends()` - Obter tendências
  - [ ] `calculateSleepEfficiency()` - Calcular eficiência
  - [ ] `identifySleepIssues()` - Identificar problemas
  - [ ] `generateSleepReport()` - Gerar relatório

- [ ] Criar `server-actions/sono/sleep-goals.ts`
  - [ ] `setSleepGoals()` - Definir metas de sono
  - [ ] `getSleepGoals()` - Obter metas atuais
  - [ ] `trackGoalProgress()` - Acompanhar progresso
  - [ ] `updateGoalsBasedOnPatterns()` - Atualizar metas
  - [ ] `getGoalAchievements()` - Obter conquistas

- [ ] Criar `server-actions/sono/sleep-environment.ts`
  - [ ] `recordSleepEnvironment()` - Registrar ambiente
  - [ ] `getEnvironmentFactors()` - Obter fatores
  - [ ] `analyzeEnvironmentImpact()` - Analisar impacto
  - [ ] `getEnvironmentRecommendations()` - Obter recomendações

- [ ] Criar `server-actions/sono/sleep-routine.ts`
  - [ ] `createSleepRoutine()` - Criar rotina
  - [ ] `updateSleepRoutine()` - Atualizar rotina
  - [ ] `trackRoutineCompliance()` - Acompanhar adesão
  - [ ] `getRoutineSuggestions()` - Obter sugestões

### 3. Componentes de Funcionalidades

#### Dashboard de Sono
- [ ] Criar `components/features/sono/sleep-dashboard.tsx`
- [ ] Implementar painéis principais:
  - [ ] Sono da última noite (duração, qualidade)
  - [ ] Média semanal/mensal
  - [ ] Progresso em relação às metas
  - [ ] Score geral de sono
  - [ ] Próximo horário recomendado para dormir
- [ ] Adicionar gráfico de evolução semanal
- [ ] Implementar quick actions (registrar sono, ver análise)
- [ ] Adicionar insights rápidos e dicas
- [ ] Implementar integração com módulo saúde

#### Registro de Sono
- [ ] Criar `components/features/sono/sleep-tracker.tsx`
- [ ] Implementar formulário de registro com:
  - [ ] Horário de dormir (data/hora)
  - [ ] Horário de acordar (data/hora)
  - [ ] Qualidade subjetiva (1-5 estrelas)
  - [ ] Dificuldade para adormecer (1-5)
  - [ ] Número de despertares
  - [ ] Sentimento ao acordar (ruim/regular/bom/ótimo)
  - [ ] Notas adicionais
- [ ] Adicionar cálculo automático de duração
- [ ] Implementar entrada rápida (ontem/hoje)
- [ ] Adicionar sugestões baseadas no histórico
- [ ] Implementar timer para dormir/agora

#### Análise de Padrões
- [ ] Criar `components/features/sono/sleep-patterns.tsx`
- [ ] Implementar visualizações:
  - [ ] Gráfico de duração do sono por dia
  - [ ] Heatmap de horários de dormir/acordar
  - [ ] Consistência do sono (desvio padrão)
  - [ ] Qualidade média por dia da semana
  - [ ] Correlação com outras atividades
- [ ] Adicionar identificação de padrões:
  - [ ] Sono irregular vs consistente
  - [ ] Tendências de melhoria/piora
  - [ ] Impacto de fins de semana
  - [ ] Sazonalidade
- [ ] Implementar comparação com padrões ideais
- [ ] Adicionar exportação de relatórios

#### Metas e Progresso
- [ ] Criar `components/features/sono/sleep-goals.tsx`
- [ ] Implementar definição de metas:
  - [ ] Duração ideal de sono (horas)
  - [ ] Horário ideal de dormir/acordar
  - [ ] Consistência semanal
  - [ ] Qualidade mínima alvo
- [ ] Adicionar visualização de progresso:
  - [ ] Dias com meta alcançada
  - [ ] Média vs meta
  - [ ] Tendências de progresso
  - [ ] Streaks (consecutivos)
- [ ] Implementar sistema de conquistas
- [ ] Adicionar ajuste automático de metas
- [ ] Implementar celebrações de metas

#### Ambiente de Sono
- [ ] Criar `components/features/sono/sleep-environment.tsx`
- [ ] Implementar registro de fatores ambientais:
  - [ ] Temperatura do quarto
  - [ ] Nível de luz/escuridão
  - [ ] Nível de ruído
  - [ ] Qualidade do colchão/travesseiro
  - [ ] Dispositivos eletrônicos presentes
  - [ ] Uso de protetor auditivo/visual
- [ ] Adicionar análise de impacto:
  - [ ] Correlação ambiente x qualidade
  - [ ] Sugestões de otimização
  - [ ] Histórico de melhorias
- [ ] Implementar checklist de boas práticas
- [ ] Adicionar integração com dispositivos IoT

#### Rotina de Sono
- [ ] Criar `components/features/sono/sleep-routine.tsx`
- [ ] Implementar planejador de rotina:
  - [ ] Atividades pré-sono (1h antes)
  - [ ] Tempo sem telas
  - [ ] Meditação/relaxamento
  - [ ] Leitura
  - [ ] Banho morno
  - [ ] Exercícios leves
- [ ] Adicionar sistema de lembretes:
  - [ ] "Hora de começar a rotina"
  - [ ] "Desligar dispositivos"
  - [ ] "Horário de dormir"
- [ ] Implementar acompanhamento de adesão
- [ ] Adicionar sugestões personalizadas
- [ ] Implementar integração com calendário

#### Insights e Recomendações
- [ ] Criar `components/features/sono/sleep-insights.tsx`
- [ ] Implementar análise inteligente:
  - [ ] Identificação de problemas crônicos
  - [ ] Recomendações baseadas em padrões
  - [ ] Sugestões de ajuste de rotina
  - [ ] Alertas para padrões preocupantes
  - [ ] Dicas de higiene do sono
- [ ] Adicionar explainability para insights
- [ ] Implementar planos de ação personalizados
- [ ] Adicionar integração com profissionais
- [ ] Implementar sistema de aprendizado contínuo

### 4. Validações e Schemas
- [ ] Criar `lib/validations/sono.ts`
- [ ] Implementar schema para registros de sono:
  ```typescript
  z.object({
    bedTime: z.date(),
    wakeTime: z.date(),
    quality: z.number().min(1).max(5),
    difficultyFallingAsleep: z.number().min(1).max(5),
    nightAwakenings: z.number().min(0),
    morningFeeling: z.enum(['ruim', 'regular', 'bom', 'ótimo']),
    notes: z.string().max(500).optional()
  })
  ```
- [ ] Implementar schema para metas de sono
- [ ] Implementar schema para ambiente
- [ ] Adicionar validações de lógica temporal
- [ ] Implementar sanitização de dados

### 5. Hooks Customizados
- [ ] Criar `hooks/use-sono.ts`
- [ ] Implementar gerenciamento de registros
- [ ] Implementar análise de padrões
- [ ] Implementar estado de metas
- [ ] Adicionar cálculos de qualidade
- [ ] Implementar estratégias de cache

### 6. Integração com Dispositivos
- [ ] Implementar integração com:
  - [ ] Apple Health (Sleep)
  - [ ] Google Fit (Sleep)
  - [ ] Wearables (Apple Watch, Fitbit, etc.)
  - [ ] Aplicativos de sono dedicados
- [ ] Adicionar importação/exportação de dados
- [ ] Implementar sincronização automática
- [ ] Adicionar tratamento de conflitos
- [ ] Implementar detecção automática de sono

### 7. Features Avançadas
- [ ] Implementar análise de fases do sono (se disponível)
- [ ] Adicionar monitoramento de ronco (se disponível)
- [ ] Implementar correlação com outras métricas de saúde
- [ ] Adicionar modo "jet lag" para viagens
- [ ] Implementar análise de impacto da cafeína/álcool
- [ ] Adicionar integração com módulo saúde

### 8. Performance e Otimização
- [ ] Implementar revalidateTag para dados de sono
- [ ] Adicionar otimizações para cálculos complexos
- [ ] Implementar cache local para dados recentes
- [ ] Otimizar gráficos de tendências
- [ ] Adicionar streaming para componentes pesados

### 9. UX e Acessibilidade
- [ ] Adicionar skeletons para carregamento
- [ ] Implementar feedback visual claro
- [ ] Adicionar modo noturno
- [ ] Implementar navegação por teclado
- [ ] Adicionar ARIA labels apropriados
- [ ] Implementar responsividade mobile
- [ ] Adicionar animações suaves

## Entregáveis Esperados
- Sistema completo de monitoramento de sono
- Análise detalhada de padrões
- Sistema de metas e progresso
- Otimização de ambiente e rotina
- Integrações com dispositivos
- Recomendações personalizadas

## Prioridades
1. Server actions com RLS
2. Registro simples e intuitivo
3. Análise acionável de padrões
4. Integração com módulo saúde

## Notas de Implementação
- Priorizar server-first approach
- Implementar RLS rigoroso por user_id
- Garantir UX noturna amigável
- Implementar detecção automática quando possível
- Adicionar tratamento robusto de erros
- Considerar privacidade de dados sensíveis