import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal);
  await app.listen(process.env.PORT ?? 3000);
  console.log('Servidor iniciado en el puerto 3000');
}
bootstrap();
