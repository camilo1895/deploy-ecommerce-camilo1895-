import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close(); // 🔴 Cierra la aplicación después de ejecutar los tests
  });

  it('Get /users/ Returns an array of users with an OK status code', async () => {
    const req = await request(app.getHttpServer()).get('/users');

    console.log(req.body);

    expect(req.status).toBe(200); // 🔴 Falla si la ruta requiere autenticación
    expect(req.body).toBeInstanceOf(Array);
  });
});
/*
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  }); */
