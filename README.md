# Projeto Back-end (NestJS)

Este é o repositório do back-end da aplicação, construído com tecnologias modernas para garantir uma arquitetura robusta, escalável e de fácil manutenção.

## 🚀 Tecnologias Utilizadas

Este projeto utiliza a seguinte stack:

- **[NestJS](https://nestjs.com/)**: Um framework Node.js progressivo para a construção de aplicações do lado do servidor eficientes, confiáveis e escaláveis. Ele utiliza TypeScript por padrão e combina elementos de POO (Programação Orientada a Objetos), PF (Programação Funcional) e PRF (Programação Reativa Funcional).
- **[TypeScript](https://www.typescriptlang.org/)**: Um superconjunto de JavaScript que adiciona tipagem estática opcional, trazendo mais segurança e produtividade ao desenvolvimento.
- **[Jest](https://jestjs.io/)**: Framework de testes em JavaScript, utilizado nativamente pelo NestJS para testes unitários e ponta-a-ponta (e2e).

*(Dica: Se você estiver usando um ORM como Prisma ou TypeORM, ou um banco de dados específico como PostgreSQL ou MongoDB, você pode listá-los aqui)*

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Um gerenciador de pacotes, como [npm](https://www.npmjs.com/), [Yarn](https://yarnpkg.com/) ou [pnpm](https://pnpm.io/).
- *(Opcional)* Banco de dados local rodando ou Docker para provisionamento de containers.

## 🛠️ Como iniciar o projeto

Siga os passos abaixo para rodar a API no seu ambiente local:

**1. Clone o repositório**
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

**2. Instale as dependências**
Usando npm:
```bash
npm install
```

**3. Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` (se houver) e preencha as variáveis necessárias (como credenciais de banco de dados, chaves secretas, etc).
```bash
cp .env.example .env
```

**4. Inicie o servidor de desenvolvimento**
```bash
npm run start:dev
```

Após executar o comando, o NestJS iniciará o servidor (com *hot-reload* ativado para observar as mudanças no código) e a API estará disponível, por padrão, em `http://localhost:3000`.

## 📦 Scripts Disponíveis

No diretório do projeto, você pode rodar os seguintes comandos principais:

- **Execução**
  - `npm run start`: Inicia a aplicação.
  - `npm run start:dev`: Inicia a aplicação em modo de desenvolvimento (watch mode).
  - `npm run start:prod`: Inicia a aplicação em modo de produção (após o build).

- **Build**
  - `npm run build`: Compila a aplicação TypeScript para JavaScript na pasta `dist`.

- **Testes**
  - `npm run test`: Executa os testes unitários.
  - `npm run test:e2e`: Executa os testes ponta-a-ponta (End-to-End).
  - `npm run test:cov`: Executa os testes e gera um relatório de cobertura de código.

## 📂 Estrutura de Diretórios Padrão

O NestJS possui uma arquitetura altamente modular. Aqui está a estrutura básica inicial:

```text
├── src/
│   ├── app.controller.ts      # Controlador básico com uma única rota
│   ├── app.controller.spec.ts # Testes unitários para o controlador
│   ├── app.module.ts          # Módulo raiz da aplicação
│   ├── app.service.ts         # Serviço básico com um método simples
│   └── main.ts                # Ponto de entrada da aplicação, onde a instância do Nest é criada
├── test/                      # Diretório destinado aos testes E2E
├── dist/                      # Arquivos compilados (gerados após o build)
├── package.json               # Dependências e scripts do projeto
├── tsconfig.json              # Configurações do compilador TypeScript
└── nest-cli.json              # Configurações da CLI do Nest
```

Conforme a aplicação crescer, você pode criar pastas para cada **Módulo** da aplicação (ex: `users/`, `auth/`, `products/`), contendo seus respectivos *Controllers*, *Services*, *DTOs* e *Entities*.