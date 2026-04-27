# Tree do Projeto

## Estrutura atual

```text
prototipo-backend/
|-- README.md
|-- TREE.md
`-- back-end/
    |-- README.md
    |-- package.json
    |-- package-lock.json
    |-- eslint.config.mjs
    |-- prisma.config.ts
    |-- tsconfig.json
    |-- tsconfig.build.json
    |-- bruno/
    |   `-- BarRestaurante-API.collection.json
    |-- prisma/
    |   `-- schema.prisma
    `-- src/
        |-- app.ts
        |-- main.ts
        |-- config/
        |   |-- env.ts
        |   |-- prisma.ts
        |   `-- supabase.ts
        |-- middlewares/
        |   `-- error-handler.ts
        |-- routes/
        |   |-- health.routes.ts
        |   `-- index.ts
        |-- utils/
        |   |-- async-handler.ts
        |   |-- http-error.ts
        |   `-- request-params.ts
        `-- modules/
            |-- auth/
            |   |-- auth.controller.ts
            |   |-- auth.routes.ts
            |   `-- auth.service.ts
            |-- fornecedores/
            |   |-- fornecedores.controller.ts
            |   |-- fornecedores.routes.ts
            |   `-- fornecedores.service.ts
            |-- mesas/
            |   |-- mesas.controller.ts
            |   |-- mesas.routes.ts
            |   `-- mesas.service.ts
            |-- pedidos/
            |   |-- pedidos.controller.ts
            |   |-- pedidos.routes.ts
            |   `-- pedidos.service.ts
            |-- produtos/
            |   |-- produtos.controller.ts
            |   |-- produtos.routes.ts
            |   `-- produtos.service.ts
            `-- usuarios/
                |-- usuarios.controller.ts
                |-- usuarios.routes.ts
                `-- usuarios.service.ts
```

## Dominio atual do banco

```text
Usuario
|-- UsuarioRole
`-- UsuarioMesa

Mesa
|-- UsuarioMesa
`-- Pedido

Pedido
`-- ItemPedido

Produto
|-- ItemPedido
|-- ProdutoCategoria
`-- ProdutoFornecedor

Categoria
`-- ProdutoCategoria

Fornecedor
`-- ProdutoFornecedor
```

## Proposta para suportar web, mobile e Arduino

A API atual ja consegue crescer para varios clientes, mas vale organizar as entradas por tipo de consumidor e separar bem autenticacao, pedidos em tempo real e integracao com hardware.

```text
prototipo-backend/
|-- back-end/
|   |-- prisma/
|   `-- src/
|       |-- app.ts
|       |-- main.ts
|       |-- config/
|       |-- middlewares/
|       |-- routes/
|       |   |-- index.ts
|       |   |-- health.routes.ts
|       |   |-- web.routes.ts
|       |   |-- mobile.routes.ts
|       |   `-- device.routes.ts
|       |-- modules/
|       |   |-- auth/
|       |   |-- usuarios/
|       |   |-- mesas/
|       |   |-- pedidos/
|       |   |-- produtos/
|       |   |-- fornecedores/
|       |   |-- comandas/
|       |   |-- pagamentos/
|       |   `-- dispositivos/
|       |-- integrations/
|       |   |-- arduino/
|       |   |   |-- arduino.service.ts
|       |   |   |-- arduino.mapper.ts
|       |   |   `-- arduino.routes.ts
|       |   `-- supabase/
|       |-- sockets/
|       |   |-- index.ts
|       |   `-- pedidos.gateway.ts
|       `-- shared/
|           |-- dto/
|           |-- types/
|           `-- constants/
|-- front-web/
`-- front-mobile/
```

## Sugestao de responsabilidade por cliente

```text
Web
|-- painel administrativo
|-- caixa
|-- cozinha
`-- relatorios

Mobile React Native
|-- garcom
|-- consulta de mesas
|-- abertura de pedidos
`-- acompanhamento em tempo real

Arduino
|-- identificacao do dispositivo
|-- leitura/envio de comando simples
|-- consulta de status da comanda
`-- sincronizacao leve com a API
```

## Proximos modulos recomendados

```text
comandas
pagamentos
dispositivos
auditoria
notificacoes
```

## Observacoes de arquitetura

- Manter uma API unica faz sentido, desde que as permissoes sejam separadas por perfil e por tipo de cliente.
- Para React Native, o backend deve expor autenticacao por token e rotas enxutas para sincronizacao.
- Para Arduino, prefira payloads curtos, identificador de dispositivo, chave propria e rotas dedicadas.
- Pedidos e status de mesa tendem a precisar de atualizacao em tempo real; WebSocket ou Supabase Realtime podem ajudar.
- O schema Prisma ja cobre boa parte do fluxo de restaurante, mas `comandas`, `pagamentos` e `dispositivos` devem virar entidades proprias em breve.
