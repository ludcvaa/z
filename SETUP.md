# StayFocus - Setup Inicial

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Banco de dados PostgreSQL ou SQLite
- Conta no Supabase (opcional, para autenticação e storage)

## Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd stayfocus
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```

   Edite o arquivo `.env.local` com suas configurações:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/stayfocus?schema=public"

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

   # Next.js
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Configure o banco de dados**
   ```bash
   # Gere as migrações
   npm run db:generate

   # Execute as migrações
   npm run db:migrate

   # (Opcional) Abra o Drizzle Studio
   npm run db:studio
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`.

## Scripts Disponíveis

### Desenvolvimento
- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run dev:db` - Inicia o servidor de desenvolvimento e o Drizzle Studio
- `npm run build` - Build para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint
- `npm run lint:fix` - Executa o ESLint e corrige problemas automaticamente
- `npm run type-check` - Verificação de tipos TypeScript

### Banco de Dados
- `npm run db:generate` - Gera arquivos de migração Drizzle
- `npm run db:migrate` - Executa migrações no banco de dados
- `npm run db:studio` - Abre o Drizzle Studio
- `npm run db:seed` - Popula o banco de dados com dados iniciais

### Testes
- `npm test` - Executa testes
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Executa testes com coverage

### Formatação
- `npm run format` - Formata o código com Prettier
- `npm run format:check` - Verifica se o código está formatado

### Utilitários
- `npm run clean` - Limpa diretórios de build
- `npm run setup` - Instala dependências e gera migrações

## Estrutura do Projeto

```
stayfocus/
├── src/
│   ├── app/                 # Páginas Next.js 15
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilitários e configurações
│   ├── server-actions/      # Server Actions
│   ├── database/            # Schema e migrações Drizzle
│   ├── hooks/               # Hooks personalizados
│   ├── types/               # Tipos TypeScript
│   ├── styles/              # Estilos globais
│   ├── tests/               # Testes
│   └── docs/                # Documentação
├── public/                  # Arquivos estáticos
├── messages/                # Arquivos de internacionalização
└── docs/                    # Documentação adicional
```

## Configurações Importantes

### Next.js
- Versão 15 com App Router
- Turbopack para desenvolvimento rápido
- TypeScript configurado
- Internacionalização com next-intl

### Banco de Dados
- Drizzle ORM para queries type-safe
- Migrações automáticas
- Suporte a PostgreSQL/SQLite

### Autenticação
- Supabase SSR para autenticação
- Middleware para proteção de rotas
- Cookies seguros

### UI/UX
- Tailwind CSS v4
- shadcn/ui components
- Tema claro/escuro
- Design responsivo

### Ferramentas de Desenvolvimento
- ESLint com configuração Next.js
- Prettier para formatação
- Jest para testes
- Drizzle Studio para gerenciamento de DB

## Próximos Passos

1. **Configurar Autenticação**
   - Crie um projeto no Supabase
   - Configure os provedores de login
   - Implemente as páginas de auth

2. **Definir Schema do Banco**
   - Crie as tabelas necessárias
   - Defina relacionamentos
   - Popule com dados iniciais

3. **Implementar Funcionalidades**
   - Gerenciamento de tarefas
   - Rastreamento de tempo
   - Dashboard e relatórios

4. **Configurar Deploy**
   - Vercel, Netlify ou self-hosted
   - Variáveis de ambiente de produção
   - Banco de dados de produção

## Troubleshooting

### Problemas Comuns

**Erro de build do TypeScript**
```bash
npm run type-check
# Corrija os erros indicados
```

**Problemas com o banco de dados**
```bash
# Verifique a conexão
npm run db:studio
# Recrie as migrações
npm run db:generate
```

**Problemas com dependências**
```bash
# Limpe e reinstale
npm run clean
npm install
```

### Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a MIT License.