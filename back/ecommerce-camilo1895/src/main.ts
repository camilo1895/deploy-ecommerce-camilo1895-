import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middleware/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerGlobal);
  app.use(auth(auth0Config));
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
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce-camilo1895')
    .setDescription(
      'Esta es una API construida con Nest para ser empleada en el modulo 4 de la especialidad Backend de la carrera FullStack Developer',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
  console.log('Servidor iniciado en el puerto 3000');
}
bootstrap();
