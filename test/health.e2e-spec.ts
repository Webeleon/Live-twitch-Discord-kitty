import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { REDIS_CLIENT } from '@webeleon/nestjs-redis';
import { Repository } from 'typeorm';
import { Kitty } from '../src/kitty/kitty.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { KittenSex } from '../src/kitty/enum/sex.enum';

describe('Health', () => {
  let app: INestApplication;
  let kitty: Kitty;

  beforeEach(async () => {
    process.env.DB_TYPE = 'better-sqlite3';
    process.env.DB_DATABASE = ':memory:';
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(REDIS_CLIENT)
      .useValue({
        TTL: jest.fn(),
        set: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const kittyRepo = moduleFixture.get<Repository<Kitty>>(
      getRepositoryToken(Kitty),
    );
    const userRepo = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );

    const user = userRepo.create({
      discordId: 'coco',
    });
    await userRepo.save([user]);

    kitty = kittyRepo.create({
      name: 'super kitty',
      user,
      sex: KittenSex.MALE,
      eyeColor: 'ffffff',
      furColor: 'ffffff',
      affection: 0,
    });
    await kittyRepo.save(kitty);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/heath', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/kitty/:uuid/image.png', async () => {
    return request(app.getHttpServer())
      .get(`/kitty/${kitty.uuid}/image.png`)
      .expect('Content-Type', 'image/png')
      .expect(200);
  });
});
