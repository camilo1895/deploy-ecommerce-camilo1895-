import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerGlobal } from './middleware/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import { config as auth0Config } from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ProductsService } from './products/products.service';
import { CategoriesService } from './categories/categories.service';
import { UsersService } from './users/users.service';

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

  //Precarga de Categories

  const categoriesService = app.get(CategoriesService);
  await categoriesService.addCategories();

  //Precarga de Products
  const productsService = app.get(ProductsService);
  await productsService.precargaProducts();

  //Crea usuario Admin

  const userService = app.get(UsersService);
  await userService.userAdmin({
    name: 'Camilo Guarnizo',
    email: 'camilo@example.com',
    password: 'Password123!',
    validatePassword: 'Password123!',
    address: 'Calle Falsa 123',
    phone: '3512345678',
    country: 'Argentina',
    city: 'Córdoba',
    isAdmin: 'admin', // este campo es opcional
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log('Servidor iniciado en el puerto 3000');
}
bootstrap();
