# Back-End - Sistema de Gerenciamento de Mesas

API REST para gerenciamento de bar/restaurante, desenvolvida com Node.js, Express, Prisma e Supabase (PostgreSQL + Auth).

## Stack

- Node.js + TypeScript
- Express 5
- Prisma ORM
- Supabase (PostgreSQL e Auth)

## Tree do projeto

```text
back-end/
|-- README.md
|-- eslint.config.mjs
|-- package.json
|-- prisma.config.ts
|-- tsconfig.build.json
|-- tsconfig.json
|-- bruno/
|   `-- collection.json
|-- prisma/
|   `-- schema.prisma
`-- src/
	|-- app.ts
	|-- main.ts
	|-- common/
	|   |-- dto/
	|   |   `-- id-param.dto.ts
	|   |-- guards/
	|   |   `-- auth.guard.ts
	|   `-- pipes/
	|       `-- validation.pipe.ts
	|-- config/
	|   |-- env.ts
	|   |-- prisma.ts
	|   `-- supabase.ts
	|-- interceptors/
	|   |-- request-context.interceptor.ts
	|   `-- response-timing.interceptor.ts
	|-- middlewares/
	|   `-- error-handler.ts
	|-- modules/
	|   |-- auth/
	|   |   |-- auth.controller.ts
	|   |   |-- auth.dto.ts
	|   |   |-- auth.routes.ts
	|   |   `-- auth.service.ts
	|   |-- fornecedores/
	|   |   |-- fornecedores.controller.ts
	|   |   |-- fornecedores.dto.ts
	|   |   |-- fornecedores.routes.ts
	|   |   `-- fornecedores.service.ts
	|   |-- mesas/
	|   |   |-- mesas.controller.ts
	|   |   |-- mesas.dto.ts
	|   |   |-- mesas.routes.ts
	|   |   `-- mesas.service.ts
	|   |-- pedidos/
	|   |   |-- pedidos.controller.ts
	|   |   |-- pedidos.dto.ts
	|   |   |-- pedidos.routes.ts
	|   |   `-- pedidos.service.ts
	|   |-- produtos/
	|   |   |-- produtos.controller.ts
	|   |   |-- produtos.dto.ts
	|   |   |-- produtos.routes.ts
	|   |   `-- produtos.service.ts
	|   `-- usuarios/
	|       |-- usuarios.controller.ts
	|       |-- usuarios.dto.ts
	|       |-- usuarios.routes.ts
	|       `-- usuarios.service.ts
	|-- repositories/
	|   |-- fornecedores.repository.ts
	|   |-- mesas.repository.ts
	|   |-- pedidos.repository.ts
	|   |-- produtos.repository.ts
	|   `-- usuarios.repository.ts
	|-- routes/
	|   |-- health.routes.ts
	|   `-- index.ts
	|-- types/
	|   `-- express/
	|       `-- index.d.ts
	`-- utils/
		|-- async-handler.ts
		|-- http-error.ts
		`-- request-params.ts
```

## Estrutura principal

- src/main.ts: bootstrap da aplicacao e conexao com banco
- src/app.ts: middlewares e registro de rotas
- src/routes/index.ts: hub de rotas API v1
- src/modules: modulos de dominio (auth, usuarios, mesas, pedidos, produtos, fornecedores)
- src/repositories: acesso ao banco e operacoes Prisma
- src/common/pipes: validacao e transformacao de entrada
- src/common/guards: autenticacao e autorizacao
- src/interceptors: contexto de request e tempo de resposta
- prisma/schema.prisma: modelo relacional
- bruno/BarRestaurante-API.collection.json: collection JSON para importacao em ferramenta de testes

## Fluxo da requisicao

1. Middleware global: CORS, logging, JSON, contexto de request
2. Guard: autenticacao por Bearer token
3. Interceptor: registro de tempo e finalizacao da resposta
4. Pipe: validacao e transformacao de `body` e `params`
5. Controller: entrada HTTP
6. Service: regra de negocio
7. Repository: acesso ao banco via Prisma
8. Interceptor de saida: log de duracao e status da resposta

## Requisitos

- Node.js 20+
- npm
- Projeto Supabase com Postgres habilitado

## Configuracao

1. Instale dependencias:

```bash
npm install
```

2. Crie seu arquivo .env a partir do exemplo:

```bash
cp .env.example .env
```

3. Preencha as variaveis no .env:

- DATABASE_URL
- DIRECT_URL
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- PORT (opcional)

## Banco de dados

Sincronizar schema com o banco:

```bash
npx prisma db push
```

Gerar client Prisma:

```bash
npx prisma generate
```

## Executar projeto

Desenvolvimento:

```bash
npm run start:dev
```

Build:

```bash
npm run build
```

Producao:

```bash
npm run start
```

## Base URL

```text
http://localhost:3000/api/v1
```

## Rotas

Health:

- GET /health

Auth:

- POST /auth/login
- GET /auth/me

Usuarios:

- POST /usuarios
- GET /usuarios
- GET /usuarios/:id
- PATCH /usuarios/:id
- DELETE /usuarios/:id

Mesas:

- POST /mesas
- GET /mesas
- GET /mesas/:id
- PATCH /mesas/:id
- POST /mesas/:id/abrir
- POST /mesas/:id/fechar

Produtos:

- POST /produtos
- GET /produtos
- GET /produtos/:id
- PATCH /produtos/:id
- DELETE /produtos/:id

Fornecedores:

- POST /fornecedores
- GET /fornecedores
- GET /fornecedores/:id
- PATCH /fornecedores/:id
- DELETE /fornecedores/:id

Pedidos:

- POST /pedidos
- GET /pedidos
- GET /pedidos/:id
- POST /pedidos/:id/itens
- PATCH /pedidos/:id/status
- PATCH /pedidos/:id/cancelar

## Testes de API

Voce pode importar a collection JSON:

- bruno/BarRestaurante-API.collection.json

## Observacoes

- O endpoint POST /usuarios cria usuario na base da aplicacao e tenta sincronizar no Supabase Auth.
- O JWT e retornado no endpoint POST /auth/login (campo data.access_token).
