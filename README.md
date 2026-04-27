<<<<<<< HEAD
# Back-End - Sistema de Gerenciamento de Mesas

API REST para gerenciamento de bar/restaurante, desenvolvida com Node.js, Express, Prisma e Supabase (PostgreSQL + Auth).

## Stack

- Node.js + TypeScript
- Express 5
- Prisma ORM
- Supabase (PostgreSQL e Auth)

## Estrutura principal

- src/main.ts: bootstrap da aplicacao e conexao com banco
- src/app.ts: middlewares e registro de rotas
- src/routes/index.ts: hub de rotas API v1
- src/modules: modulos de dominio (auth, usuarios, mesas, pedidos, produtos, fornecedores)
- prisma/schema.prisma: modelo relacional
- bruno/BarRestaurante-API.collection.json: collection JSON para importacao em ferramenta de testes

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
=======
# Projeto Interdisciplinar - PI 4º Semestre Backend

## 📋 Índice
1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Contexto Técnico e Ambiente](#contexto-técnico-e-ambiente)
3. [Discussão Detalhada sobre NestJS](#discussão-detalhada-sobre-nestjs)
4. [Arquitetura e Padrões](#arquitetura-e-padrões)
5. [Configuração do Projeto](#configuração-do-projeto)
6. [Guia Especializado - Trabalhando com NestJS](#guia-especializado---trabalhando-com-nestjs)
7. [Segurança e Banco de Dados](#segurança-e-banco-de-dados)
8. [Próximos Passos](#próximos-passos)

---

## 📦 Visão Geral do Projeto

Este projeto implementa um **Backend robusto e escalável** utilizando **NestJS (v10+)** com **TypeScript (5.x/6.x)**, seguindo rigorosamente as melhores práticas de arquitetura empresarial em camadas (Controllers → Services → Repositories).

**Stack Técnico:**
- 🟦 **Runtime:** Node.js 18+
- 📘 **Linguagem:** TypeScript 5.x/6.x
- 🏗️ **Framework:** NestJS 10+ (Progressive Node.js Framework)
- 🗄️ **Database:** MongoDB com TypeORM/Prisma
- ✅ **Validação:** class-validator + class-transformer
- 🔐 **Autenticação:** JWT (implementação futura)

---

## 🔧 Contexto Técnico e Ambiente

### Linguagem e Configuração

**TypeScript 5.x/6.x:**
- Suporte completo a tipos estáticos, genéricos e decoradores (TC39 Stage 3)
- Module Resolution: `nodenext` para máxima compatibilidade com ESM moderno
- Configured para usar aliases de caminho (`@/*` → `src/*`)

### Configuração TypeScript Atual (Verificada ✓)

```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "target": "ES2020",
    "lib": ["ES2020"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "test"]
}
```

**✅ VERIFICAÇÃO:** A configuração com `"ignoreDeprecations": "5.0"` não é necessária na configuração moderna. O TypeScript 5.x suporta nativamente path aliases sem deprecações.

---

## 🎯 Discussão Detalhada sobre NestJS

### 1. O que é NestJS? Por que usar?

**NestJS** é um framework **progressive** e **opinativo** para construir aplicações Node.js eficazes e escaláveis. Ele combina:

- ✅ **Programação Orientada a Objetos (OOP)** - Classes, interfaces, herança
- ✅ **Programação Funcional** - Pipes, Guards, Interceptors
- ✅ **Programação Reativa** - RxJS integrado
- ✅ **Injeção de Dependência (DI)** - IoC Container nativo

**Por que usar NestJS em relação a Express?**

| Aspecto | Express | NestJS |
|--------|---------|--------|
| **Estrutura** | Minimalista, flexível | Arquitetura opinionada |
| **Validação** | Manual ou middleware adicional | Pipe system nativo |
| **Type Safety** | TypeScript básico | Full TypeScript + Decorators |
| **Escalabilidade** | Cresce com complexidade | Pronto para escala empresarial |
| **Testing** | Necessita setup | Jest pré-configurado |
| **Arquitetura em Camadas** | Sem suporte nativo | Suporte completo (Controllers → Services → Repositories) |
| **Decoradores** | Não suporta | Suporta completamente |
| **ORM Integração** | Manual | TypeORM + Prisma prontos |
| **Documentação API** | Swagger manual | Swagger automático com `@nestjs/swagger` |
| **DI Container** | Não possui | IoC Container completo |

### 2. Arquitetura NestJS - Fluxo de Requisição

```
┌─────────────────────────────────────────────────────────────┐
│                    INCOMING REQUEST                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  1. MIDDLEWARE GLOBAL          │
        │  - CORS, logging, compression  │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  2. GUARDS (Authentication)    │
        │  - JWT, Roles, Permissions     │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  3. INTERCEPTORS (In)          │
        │  - Logging, timing, context    │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  4. PIPES (Transformation)     │
        │  - Validation, transformation  │
        │  - ValidationPipe, ParseIntPipe│
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  5. CONTROLLER                 │
        │  - Route handler               │
        │  - @Get(), @Post(), @Put()...  │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  6. SERVICE                    │
        │  - Business logic              │
        │  - Repository calls            │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  7. REPOSITORY/DATABASE        │
        │  - Data persistence            │
        │  - ORM operations              │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  8. INTERCEPTORS (Out)         │
        │  - Response transformation     │
        │  - Logging, error handling     │
        └────────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    RESPONSE SENT                            │
└─────────────────────────────────────────────────────────────┘
```

### 3. Componentes Principais - Explicação Detalhada

#### **Controllers**
- **Responsabilidade:** Receber requisições HTTP e orquestrar o fluxo
- **O que NÃO fazer:** Lógica de negócio, acesso direto ao banco
- **Exemplo:**

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }
}
```

#### **Services**
- **Responsabilidade:** Contém toda lógica de negócio
- **Comunicação:** Com repositórios ou DTOs
- **Exemplo:**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  findAll() {
    return this.usuariosRepository.find();
  }

  findOne(id: string) {
    return this.usuariosRepository.findOneBy({ id });
  }

  create(createUsuarioDto: CreateUsuarioDto) {
    const usuario = this.usuariosRepository.create(createUsuarioDto);
    return this.usuariosRepository.save(usuario);
  }
}
```

#### **DTOs (Data Transfer Objects)**
- **Responsabilidade:** Definir estrutura e validação de dados de entrada/saída
- **Usar em:** Controllers (entrada) e responses (saída)
- **Nunca expor:** Entities diretamente ao cliente
- **Exemplo:**

```typescript
import { IsString, IsEmail, IsStrongPassword, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  nome: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  }, { message: 'Senha fraca' })
  senha: string;
}
```

#### **Entities (ORM Models)**
- **Responsabilidade:** Representar tabelas do banco de dados
- **Isolamento:** Nunca expor diretamente ao cliente (sempre via DTO)
- **Exemplo (TypeORM):**

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  senhaHash: string; // ⚠️ NUNCA retornar ao cliente

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  criadoEm: Date;
}
```

#### **Modules**
- **Responsabilidade:** Agrupar funcionalidades relacionadas (Feature Modules)
- **Exportar:** Apenas serviços necessários para outros módulos
- **Exemplo:**

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Disponível fora do módulo
})
export class UsuariosModule {}
```

#### **Pipes**
- **Responsabilidade:** Transformação e validação de dados
- **Timing:** Executa ANTES do handler do controller
- **Pipelines Comuns:**
  - `ValidationPipe` - Valida contra DTO
  - `ParseIntPipe` - Converte string para number
  - `ParseUUIDPipe` - Valida UUIDs
  - Custom pipes - Lógica personalizada

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidarIdadePipe implements PipeTransform {
  transform(value: any) {
    if (value.idade < 18) {
      throw new BadRequestException('Usuário deve ter 18+ anos');
    }
    return value;
  }
}

// Uso no controller:
@Post()
create(@Body(ValidarIdadePipe) createUsuarioDto: CreateUsuarioDto) {
  return this.usuariosService.create(createUsuarioDto);
}
```

#### **Guards (Autenticação/Autorização)**
- **Responsabilidade:** Determinar se requisição pode prosseguir
- **Timing:** Executa APÓS middlewares, ANTES de pipes
- **Exemplo:**

```typescript
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      // Validar token JWT aqui
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

// Uso no controller:
@UseGuards(JwtGuard)
@Get('perfil')
getPerfil() {
  return { usuario: 'dados' };
}
```

#### **Interceptors**
- **Responsabilidade:** Adicionar lógica antes/depois da execução do handler
- **Casos de Uso:** Logging, transformação de resposta, tratamento de erros
- **Exemplo:**

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformarRespostaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const agora = Date.now();

    return next.handle().pipe(
      map((data) => ({
        statusCode: 200,
        message: 'Sucesso',
        data,
        timestamp: new Date(),
        tempo: `${Date.now() - agora}ms`,
      })),
    );
  }
}

// Registrar globalmente em main.ts:
app.useGlobalInterceptors(new TransformarRespostaInterceptor());
```

### 4. Verificação das Informações Fornecidas

| Informação | Status | Observações |
|-----------|--------|------------|
| Arquitetura em camadas (Controller → Service → Repository) | ✅ **CORRETO** | Padrão recomendado pela comunidade NestJS |
| TypeScript 5.x/6.x com módulo `nodenext` | ✅ **CORRETO** | Melhor compatibilidade com ESM |
| Uso de Aliases com `@/*` | ✅ **CORRETO** | Simplifica imports, evita `../../../` |
| `ignoreDeprecations": "5.0"` | ⚠️ **DESNECESSÁRIO** | Pode ser removido, TypeScript 5.x suporta nativamente |
| ValidationPipe global com `whitelist: true` e `transform: true` | ✅ **CORRETO** | Filtra dados não esperados e transforma tipos |
| Feature Modules organization | ✅ **CORRETO** | Escalável e maintenível |
| DTOs para proteção de campos sensíveis | ✅ **CORRETO** | CRÍTICO - nunca expor entidades diretamente |
| DatabaseModule centralizado | ✅ **CORRETO** | Mas entities isoladas por módulo é opcional |

---

## 🏗️ Arquitetura e Padrões

### Estrutura de Pastas Recomendada

```
src/
├── app.module.ts                 # Módulo raiz
├── main.ts                        # Entry point
│
├── common/
│   ├── decorators/               # Decoradores customizados
│   ├── filters/                  # Exception filters
│   ├── guards/                   # Guards (Auth, Roles)
│   ├── interceptors/             # Interceptors
│   ├── exceptions/               # Custom exceptions
│   └── constants/                # Constantes globais
│
├── config/
│   ├── database.config.ts       # Configuração do banco
│   ├── environment.ts           # Variáveis de ambiente
│   └── typeorm.config.ts        # TypeORM config
│
├── database/
│   ├── database.module.ts       # DatabaseModule
│   └── migrations/              # Migrações TypeORM
│
├── auth/                         # Feature Module
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── entities/
│   │   └── refresh-token.entity.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── guards/
│       └── jwt.guard.ts
│
├── usuarios/                     # Feature Module
│   ├── usuarios.controller.ts
│   ├── usuarios.service.ts
│   ├── usuarios.module.ts
│   ├── dto/
│   │   ├── create-usuario.dto.ts
│   │   └── update-usuario.dto.ts
│   ├── entities/
│   │   └── usuario.entity.ts
│   └── repositories/            # (Opcional se usar Repository pattern)
│       └── usuarios.repository.ts
│
└── produtos/                     # Feature Module
    ├── produtos.controller.ts
    ├── produtos.service.ts
    ├── produtos.module.ts
    ├── dto/
    │   ├── create-produto.dto.ts
    │   └── update-produto.dto.ts
    └── entities/
        └── produto.entity.ts
```

### CLI Workflow - Gerando CRUDs

**Comando básico:**
```bash
nest g resource usuarios
```

**Resultado gerado:**
- ✅ Module
- ✅ Controller
- ✅ Service
- ✅ DTOs (create, update)
- ✅ Entities
- ✅ E2E tests

**Comando avançado com opções:**
```bash
nest g resource usuarios --no-spec           # Sem testes
nest g resource usuarios --flat              # Sem pasta separada
nest g resource usuarios --skip-import       # Sem importação automática
```

---

## ⚙️ Configuração do Projeto

### main.ts - Configuração Completa Recomendada

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ============ CORS CONFIGURATION ============
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  // ============ GLOBAL PREFIX ============
  app.setGlobalPrefix('api/v1');

  // ============ GLOBAL PIPES ============
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // Remove props não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se houver props extras
      transform: true,        // Transforma tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ============ SWAGGER DOCUMENTATION ============
  const config = new DocumentBuilder()
    .setTitle('API - Projeto Interdisciplinar')
    .setDescription('API Backend com NestJS')
    .setVersion('1.0.0')
    .addBearerAuth()  // Para JWT
    .addTag('Usuarios', 'Gerenciamento de usuários')
    .addTag('Produtos', 'Gerenciamento de produtos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ============ START SERVER ============
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📚 Swagger disponível em: http://localhost:${PORT}/api/docs`);
}

bootstrap();
```

### app.module.ts - Módulo Raiz

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProdutosModule } from './produtos/produtos.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(DatabaseConfig()),
    UsuariosModule,
    ProdutosModule,
    AuthModule,
  ],
})
export class AppModule {}
```

---

## 👨‍🔬 Guia Especializado - Trabalhando com NestJS

### Seção 1: Injeção de Dependência (Dependency Injection)

**O que é DI?**
NestJS usa um IoC Container para gerenciar dependências automaticamente. você não cria instâncias manualmente com `new`.

```typescript
// ❌ SEM DI (acoplado, difícil de testar)
class UsuariosService {
  private database = new DatabaseConnection();

  findAll() {
    return this.database.query('SELECT * FROM usuarios');
  }
}

// ✅ COM DI (desacoplado, testável)
@Injectable()
export class UsuariosService {
  constructor(private readonly database: DatabaseService) {}

  findAll() {
    return this.database.query('SELECT * FROM usuarios');
  }
}
```

**Registrar providers:**

```typescript
@Module({
  providers: [
    UsuariosService,                    // Forma abreviada
    {
      provide: 'DATABASE',
      useValue: new DatabaseConnection(),
    },
    {
      provide: AutoService,
      useClass: AutoServiceImpl,        // Interface → Implementação
    },
  ],
})
export class UsuariosModule {}
```

**Injetar providers:**

```typescript
constructor(
  private readonly usuariosService: UsuariosService,
  @Inject('DATABASE') private database: DatabaseConnection,
) {}
```

### Seção 2: Validação com Class-Validator

**Instalação:**
```bash
npm install class-validator class-transformer
```

**Decoradores mais comuns:**

```typescript
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsDate,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser texto' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100)
  nome: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Senha deve ter 8+ chars, maiúscula, minúscula, número e símbolo',
  })
  senha: string;

  @IsPhoneNumber('BR')
  @IsOptional()
  telefone?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dataNascimento?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnderecoDto)
  @IsOptional()
  enderecos?: EnderecoDto[];
}

export class EnderecoDto {
  @IsString()
  @IsNotEmpty()
  rua: string;

  @IsString()
  @IsNotEmpty()
  cidade: string;

  @IsString()
  @IsNotEmpty()
  cep: string;
}
```

**Validação customizada:**

```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ name: 'isEmailUnique', async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private usuariosService: UsuariosService) {}

  async validate(email: string) {
    const usuario = await this.usuariosService.findByEmail(email);
    return !usuario;
  }

  defaultMessage() {
    return 'Email já está registrado';
  }
}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint,
    });
  };
}

// Uso:
export class CreateUsuarioDto {
  @IsEmailUnique()
  email: string;
}
```

### Seção 3: Tratamento de Erros e Exception Filters

**Exceções built-in em NestJS:**

```typescript
import {
  BadRequestException,      // 400
  UnauthorizedException,    // 401
  ForbiddenException,       // 403
  NotFoundException,        // 404
  ConflictException,        // 409
  InternalServerErrorException, // 500
} from '@nestjs/common';

// Lançar erros:
if (!usuario) {
  throw new NotFoundException(`Usuário com id ${id} não encontrado`);
}

if (email === usuarioExistente.email) {
  throw new ConflictException('Email já está registrado');
}
```

**Exception Filter customizado:**

```typescript
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Erro interno do servidor';
    let errors: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'] || message;
        errors = exceptionResponse['error'] || null;
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }
}

// Registrar em main.ts:
app.useGlobalFilters(new AllExceptionsFilter());
```

### Seção 4: Logging Estruturado

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  findAll() {
    this.logger.debug('Recuperando todos os usuários');
    this.logger.log('Usuários listados com sucesso');
    // ...
  }

  create(createUsuarioDto: CreateUsuarioDto) {
    this.logger.warn('Novo usuário sendo criado com email: ' + createUsuarioDto.email);
    try {
      // lógica
      this.logger.log(`Usuário criado com sucesso: ${usuario.id}`);
    } catch (error) {
      this.logger.error('Erro ao criar usuário', error.stack);
      throw error;
    }
  }
}
```

### Seção 5: Middlewares

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  }
}

// Registrar no módulo:
@Module({
  // ...
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(CorsMiddleware)
      .forRoutes(UsuariosController);
  }
}
```

---

## 🔐 Segurança e Banco de Dados

### Proteção de Campos Sensíveis

**❌ NUNCA fazer isso:**
```typescript
@Get(':id')
@UseGuards(JwtGuard)
async findOne(@Param('id') id: string) {
  return this.usuariosService.findOne(id); // Retorna Entity com senhaHash!
}
```

**✅ SEMPRE fazer isso:**
```typescript
// entities/usuario.entity.ts
@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ select: false }) // ⚠️ Não incluir por padrão
  senhaHash: string;

  @Column()
  email: string;
}

// dto/usuario.response.dto.ts
export class UsuarioResponseDto {
  id: string;
  nome: string;
  email: string;
  // senhaHash NUNCA aqui!
}

// usuarios.service.ts
async findOne(id: string): Promise<UsuarioResponseDto> {
  const usuario = await this.usuariosRepository.findOneBy({ id });
  if (!usuario) throw new NotFoundException();

  const { senhaHash, ...resultado } = usuario;
  return resultado;
}

// O melhor: usar QueryBuilder para ser mais explícito
async findOne(id: string) {
  return this.usuariosRepository
    .createQueryBuilder('usuario')
    .select(['usuario.id', 'usuario.nome', 'usuario.email'])
    .where('usuario.id = :id', { id })
    .getOne();
}
```

### Integração com Banco de Dados

**Instalação TypeORM + MongoDB:**
```bash
npm install typeorm @nestjs/typeorm
npm install mongodb  # ou mongoose com @nestjs/mongoose
```

**database.config.ts:**

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Produto } from '../produtos/entities/produto.entity';

export function DatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'mongodb',
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/meu-projeto',
    entities: [Usuario, Produto],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    useUnifiedTopology: true,
  };
}
```

**Ou com Prisma (alternativa moderna):**

```bash
npm install @prisma/client
npx prisma init
```

**schema.prisma:**
```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Usuario {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  nome      String
  email     String    @unique
  senhaHash String    @default("")
  role      String    @default("USER")
  criadoEm  DateTime  @default(now())
  atualizadoEm DateTime @updatedAt

  @@map("usuarios")
}
```

---

## 🚀 Próximos Passos

### 1. **Autenticação JWT**
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
npm install --save-dev @types/passport-jwt
```

### 2. **Validação com Zod (Alternativa a class-validator)**
```bash
npm install zod @anatine/zod-nestjs
```

### 3. **Rate Limiting e Segurança**
```bash
npm install @nestjs/throttler
```

### 4. **Testes E2E com Jest**
```bash
npm install --save-dev @nestjs/testing
```

### 5. **Cache com Redis**
```bash
npm install @nestjs/cache-manager cache-manager
```

### 6. **Documentação com Swagger**
```bash
npm install @nestjs/swagger swagger-ui-express
```

---

## 📚 Recursos Oficiais

- **Documentação NestJS:** https://docs.nestjs.com/
- **CLI Reference:** https://docs.nestjs.com/cli/overview
- **TypeORM Documentation:** https://typeorm.io/
- **Prisma Documentation:** https://www.prisma.io/docs/
- **Class Validator:** https://github.com/typestack/class-validator
- **JWT Strategy:** https://docs.nestjs.com/techniques/authentication

---

## 📝 Resumo Executivo

| Aspecto | Recomendação |
|--------|--------------|
| **Padrão de Arquitetura** | Usar Feature Modules por domínio |
| **Validação de Dados** | Sempre com ValidationPipe global + DTOs |
| **Proteção de Dados** | Nunca expor Entities, usar DTOs para responses |
| **Organização**: Por feature, não por tipo de arquivo |
| **Banco de Dados** | TypeORM (mais flexível) ou Prisma (mais moderno) |
| **Autenticação** | JWT com Passport.js |
| **Testes** | Jest com @nestjs/testing |
| **Documentação** | Swagger automático com @nestjs/swagger |

---

**Última atualização:** Abril de 2026  
**Documentação válida para:** NestJS 10.x+, TypeScript 5.x/6.x
>>>>>>> prototipo/back-end
