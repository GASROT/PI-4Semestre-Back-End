import { app } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('Conexao com o banco estabelecida com sucesso.');

    app.listen(env.PORT, () => {
      console.log(`API running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Falha ao conectar no banco de dados.', error);
    process.exit(1);
  }
}

void bootstrap();
