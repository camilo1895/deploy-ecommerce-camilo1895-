import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middleware/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return {
            property: error.property,
            constraints: error.constraints,
          };
        });

        return new BadRequestException({
          alert: 'Se han detectado los siguientes errores',
          errors: cleanErrors,
        });
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log('Servidor iniciado en el puerto 3000');
}
bootstrap();
