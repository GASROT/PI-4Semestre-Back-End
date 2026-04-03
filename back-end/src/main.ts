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
