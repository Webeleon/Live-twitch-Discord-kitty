import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { Kitty } from '../src/kitty/kitty.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('KittyController (e2e)', () => {
  let app: INestApplication;
  let kittyRepo: Repository<Kitty>;

  beforeEach(async () => {
    process.env.DB_TYPE = 'better-sqlite3';
    process.env.DB_DATABASE = ':memory:';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    kittyRepo = moduleFixture.get<Repository<Kitty>>(getRepositoryToken(Kitty));
  });

  afterEach(async () => {
    await kittyRepo.delete({});
    await app.close();
  });

  it('[GET] /kitty', async () => {
    const { body, status } = await request(app.getHttpServer()).get('/kitty');

    expect(status).toBe(200);
    expect(body).toStrictEqual([]);
  });

  it('[POST] /kitty', async () => {
    const { body, status } = await request(app.getHttpServer())
      .post('/kitty')
      .send({
        name: 'gerard',
      });
    expect(status).toBe(201);
    expect(body.uuid).toBeDefined();
    expect(body.name).toBe('gerard');
    expect(body.dna).toHaveLength(6);

    const get = await request(app.getHttpServer()).get('/kitty');

    expect(get.status).toBe(200);
    expect(get.body).toHaveLength(1);
  });
});
