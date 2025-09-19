// SQL queries otimizadas para o módulo de alimentação

// Índices recomendados para o Supabase
export const RECOMMENDED_INDEXES = [
  // Índices para meal_plans
  'CREATE INDEX IF NOT EXISTS idx_meal_plans_user_id ON meal_plans(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_meal_plans_user_active ON meal_plans(user_id, is_active)',
  'CREATE INDEX IF NOT EXISTS idx_meal_plans_dates ON meal_plans(start_date, end_date)',
  'CREATE INDEX IF NOT EXISTS idx_meal_plans_created ON meal_plans(created_at DESC)',

  // Índices para meals
  'CREATE INDEX IF NOT EXISTS idx_meals_plan_id ON meals(meal_plan_id)',
  'CREATE INDEX IF NOT EXISTS idx_meals_type ON meals(type)',

  // Índices para meal_records
  'CREATE INDEX IF NOT EXISTS idx_meal_records_user_date ON meal_records(user_id, date)',
  'CREATE INDEX IF NOT EXISTS idx_meal_records_meal_type ON meal_records(meal_type)',
  'CREATE INDEX IF NOT EXISTS idx_meal_records_completed ON meal_records(is_completed)',
  'CREATE INDEX IF NOT EXISTS idx_meal_records_plan_id ON meal_records(meal_plan_id)',
  'CREATE INDEX IF NOT EXISTS idx_meal_records_datetime ON meal_records(date, time)',

  // Índices para water_intake
  'CREATE INDEX IF NOT EXISTS idx_water_intake_user_date ON water_intake(user_id, date)',
  'CREATE INDEX IF NOT EXISTS idx_water_intake_datetime ON water_intake(date, time)',

  // Índices para hydration_goals
  'CREATE INDEX IF NOT EXISTS idx_hydration_goals_user ON hydration_goals(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_hydration_goals_active ON hydration_goals(user_id, start_date)',

  // Índices compostos para consultas frequentes
  'CREATE INDEX IF NOT EXISTS idx_meal_records_user_type_date ON meal_records(user_id, meal_type, date)',
  'CREATE INDEX IF NOT EXISTS idx_meal_records_user_date_completed ON meal_records(user_id, date, is_completed)',
  'CREATE INDEX IF NOT EXISTS idx_water_intake_user_date_time ON water_intake(user_id, date, time)'
]

// Queries otimizadas
export const OPTIMIZED_QUERIES = {
  // Buscar planos de refeição ativos do usuário
  getActiveMealPlans: `
    SELECT
      mp.*,
      json_agg(
        json_build_object(
          'id', m.id,
          'type', m.type,
          'name', m.name,
          'description', m.description,
          'calories', m.calories,
          'protein', m.protein,
          'carbs', m.carbs,
          'fat', m.fat,
          'fiber', m.fiber,
          'time', m.time
        )
      ) as meals
    FROM meal_plans mp
    LEFT JOIN meals m ON mp.id = m.meal_plan_id
    WHERE mp.user_id = $1
      AND mp.is_active = true
      AND mp.end_date >= CURRENT_DATE
    GROUP BY mp.id
    ORDER BY mp.created_at DESC
  `,

  // Buscar registros de refeição por data com paginação
  getMealRecordsByDatePaginated: `
    SELECT
      mr.*,
      mp.name as meal_plan_name
    FROM meal_records mr
    LEFT JOIN meal_plans mp ON mr.meal_plan_id = mp.id
    WHERE mr.user_id = $1
      AND mr.date = $2
    ORDER BY mr.time ASC
    LIMIT $3 OFFSET $4
  `,

  // Buscar registros por tipo e intervalo de datas
  getMealRecordsByTypeAndRange: `
    SELECT
      mr.*,
      mp.name as meal_plan_name
    FROM meal_records mr
    LEFT JOIN meal_plans mp ON mr.meal_plan_id = mp.id
    WHERE mr.user_id = $1
      AND mr.meal_type = $2
      AND mr.date BETWEEN $3 AND $4
    ORDER BY mr.date DESC, mr.time ASC
  `,

  // Resumo nutricional diário com agregação
  getDailyNutritionSummary: `
    SELECT
      date,
      COUNT(*) as total_meals,
      COUNT(CASE WHEN is_completed THEN 1 END) as completed_meals,
      COALESCE(SUM(calories), 0) as total_calories,
      COALESCE(SUM(protein), 0) as total_protein,
      COALESCE(SUM(carbs), 0) as total_carbs,
      COALESCE(SUM(fat), 0) as total_fat,
      COALESCE(SUM(fiber), 0) as total_fiber
    FROM meal_records
    WHERE user_id = $1
      AND date BETWEEN $2 AND $3
    GROUP BY date
    ORDER BY date
  `,

  // Hidratação diária com agregação
  getDailyHydrationSummary: `
    SELECT
      date,
      COUNT(*) as intake_count,
      COALESCE(SUM(amount), 0) as total_amount,
      hg.daily_goal as goal_amount,
      ROUND((COALESCE(SUM(amount), 0) * 100.0 / NULLIF(hg.daily_goal, 0)), 2) as percentage
    FROM water_intake wi
    LEFT JOIN hydration_goals hg ON wi.user_id = hg.user_id
      AND hg.start_date <= wi.date
      AND (hg.end_date >= wi.date OR hg.end_date IS NULL)
    WHERE wi.user_id = $1
      AND wi.date BETWEEN $2 AND $3
    GROUP BY date, hg.daily_goal
    ORDER BY date
  `,

  // Buscar estatísticas gerais
  getNutritionStats: `
    WITH date_range AS (
      SELECT generate_series($1::date, $2::date, '1 day'::interval) as date
    )
    SELECT
      dr.date,
      COALESCE(mr.total_meals, 0) as meal_count,
      COALESCE(mr.total_calories, 0) as calories,
      COALESCE(wi.total_water, 0) as water_intake,
      COALESCE(mr.completed_meals, 0) as completed_meals
    FROM date_range dr
    LEFT JOIN (
      SELECT
        date,
        COUNT(*) as total_meals,
        COALESCE(SUM(calories), 0) as total_calories,
        COUNT(CASE WHEN is_completed THEN 1 END) as completed_meals
      FROM meal_records
      WHERE user_id = $3
        AND date BETWEEN $1 AND $2
      GROUP BY date
    ) mr ON dr.date = mr.date
    LEFT JOIN (
      SELECT
        date,
        COALESCE(SUM(amount), 0) as total_water
      FROM water_intake
      WHERE user_id = $3
        AND date BETWEEN $1 AND $2
      GROUP BY date
    ) wi ON dr.date = wi.date
    ORDER BY dr.date
  `,

  // Buscar planos com performance para dashboard
  getMealPlansWithPerformance: `
    SELECT
      mp.*,
      COUNT(mr.id) as total_records,
      COUNT(CASE WHEN mr.is_completed THEN 1 END) as completed_records,
      ROUND((COUNT(CASE WHEN mr.is_completed THEN 1 END) * 100.0 / NULLIF(COUNT(mr.id), 0)), 2) as completion_rate
    FROM meal_plans mp
    LEFT JOIN meal_records mr ON mp.id = mr.meal_plan_id
    WHERE mp.user_id = $1
    GROUP BY mp.id
    ORDER BY mp.created_at DESC
  `,

  // Buscar água ingerida por hora do dia
  getWaterIntakeByHour: `
    SELECT
      EXTRACT(HOUR FROM time::time) as hour,
      COUNT(*) as intake_count,
      COALESCE(SUM(amount), 0) as total_amount
    FROM water_intake
    WHERE user_id = $1
      AND date BETWEEN $2 AND $3
    GROUP BY EXTRACT(HOUR FROM time::time)
    ORDER BY hour
  `,

  // Buscar refeições mais frequentes
  getMostFrequentMeals: `
    SELECT
      name,
      COUNT(*) as frequency,
      AVG(calories) as avg_calories,
      AVG(protein) as avg_protein,
      AVG(carbs) as avg_carbs,
      AVG(fat) as avg_fat
    FROM meal_records
    WHERE user_id = $1
      AND date BETWEEN $2 AND $3
      AND name IS NOT NULL
    GROUP BY name
    ORDER BY frequency DESC
    LIMIT $4
  `
}

// Estratégias de query optimization
export const QUERY_STRATEGIES = {
  // Usar CTEs para consultas complexas
  withCTE: (query: string, cteName: string, cteQuery: string) => `
    WITH ${cteName} AS (${cteQuery})
    ${query}
  `,

  // Usar window functions para rankings
  withWindowFunction: (query: string, windowFunc: string) => `
    ${query.replace(/SELECT/, `SELECT ${windowFunc},`)}
  `,

  // Usar materialized views para dados agregados
  materializedViews: {
    dailyNutritionSummary: `
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_nutrition_summary AS
      SELECT
        user_id,
        date,
        COUNT(*) as total_meals,
        COUNT(CASE WHEN is_completed THEN 1 END) as completed_meals,
        COALESCE(SUM(calories), 0) as total_calories,
        COALESCE(SUM(protein), 0) as total_protein,
        COALESCE(SUM(carbs), 0) as total_carbs,
        COALESCE(SUM(fat), 0) as total_fat,
        COALESCE(SUM(fiber), 0) as total_fiber
      FROM meal_records
      GROUP BY user_id, date
      WITH DATA
    `,

    dailyHydrationSummary: `
      CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_hydration_summary AS
      SELECT
        user_id,
        date,
        COUNT(*) as intake_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM water_intake
      GROUP BY user_id, date
      WITH DATA
    `
  },

  // Funções para refresh de materialized views
  refreshMaterializedViews: [
    'REFRESH MATERIALIZED VIEW mv_daily_nutrition_summary',
    'REFRESH MATERIALIZED VIEW mv_daily_hydration_summary'
  ]
}

// Configurações de performance para o Supabase
export const SUPABASE_PERFORMANCE_CONFIG = {
  // Pool connections
  pool_size: 20,
  max_overflow: 10,
  pool_timeout: 30,

  // Query timeout
  statement_timeout: 10000, // 10 segundos
  idle_in_transaction_session_timeout: 300000, // 5 minutos

  // Cache settings
  shared_buffers: '256MB',
  effective_cache_size: '1GB',
  work_mem: '4MB',

  // Maintenance settings
  autovacuum: true,
  analyze_threshold: 50,
  vacuum_threshold: 100
}

// Função para otimizar queries dinamicamente
export function optimizeQuery(query: string, params: any[]): { query: string; params: any[] } {
  let optimizedQuery = query
  let optimizedParams = [...params]

  // Remover SELECT * desnecessários
  optimizedQuery = optimizedQuery.replace(/SELECT \*/g, 'SELECT id, created_at, updated_at')

  // Adicionar LIMIT se não existir
  if (!optimizedQuery.match(/LIMIT\s+\d+/i)) {
    optimizedQuery += ' LIMIT 1000'
  }

  // Otimizar ORDER BY para usar índices
  optimizedQuery = optimizedQuery.replace(
    /ORDER BY\s+(\w+)\s+(ASC|DESC)/gi,
    'ORDER BY $1 $2 NULLS LAST'
  )

  return { query: optimizedQuery, params: optimizedParams }
}

// Monitor de performance de queries
export class QueryPerformanceMonitor {
  private metrics: Map<string, { count: number; totalTime: number; avgTime: number }> = new Map()

  trackQuery(query: string, executionTime: number) {
    const queryHash = this.hashQuery(query)

    if (!this.metrics.has(queryHash)) {
      this.metrics.set(queryHash, { count: 0, totalTime: 0, avgTime: 0 })
    }

    const metric = this.metrics.get(queryHash)!
    metric.count++
    metric.totalTime += executionTime
    metric.avgTime = metric.totalTime / metric.count
  }

  private hashQuery(query: string): string {
    // Simplificar query para hash (remover parâmetros e formatação)
    return query
      .replace(/\s+/g, ' ')
      .replace(/\$\d+/g, '?')
      .toLowerCase()
      .trim()
  }

  getSlowQueries(threshold: number = 1000): Array<{ query: string; avgTime: number; count: number }> {
    return Array.from(this.metrics.entries())
      .filter(([_, metric]) => metric.avgTime > threshold)
      .map(([query, metric]) => ({
        query,
        avgTime: metric.avgTime,
        count: metric.count
      }))
      .sort((a, b) => b.avgTime - a.avgTime)
  }

  getMetrics() {
    return this.metrics
  }

  clear() {
    this.metrics.clear()
  }
}

// Exportar instância do monitor
export const queryMonitor = new QueryPerformanceMonitor()