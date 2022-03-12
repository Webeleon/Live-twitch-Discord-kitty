import { Test, TestingModule } from '@nestjs/testing';
import { KittyService } from './kitty.service';
import { TypeormSqliteTestingModule } from '../test-utils/typeorm-sqlite-testing-module';
import { Repository } from 'typeorm';
import { Kitty } from './kitty.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KittenSex } from './enum/sex.enum';
import { User } from '../user/user.entity';
import { NotFoundException } from '@nestjs/common';
import { REDIS_CLIENT } from '@webeleon/nestjs-redis';
import { KittyImageGenerator } from './kitty-image-generator.provider';

describe('KittyService', () => {
  let kittyService: KittyService;
  let kittyRepo: Repository<Kitty>;
  let userRepo: Repository<User>;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...TypeormSqliteTestingModule()],
      providers: [
        KittyService,
        {
          provide: REDIS_CLIENT,
          useValue: {
            TTL: jest.fn(),
            set: jest.fn(),
          },
        },
        {
          provide: KittyImageGenerator,
          useValue: {
            generate: jest.fn(),
          },
        },
      ],
    }).compile();

    kittyService = module.get<KittyService>(KittyService);
    kittyRepo = module.get<Repository<Kitty>>(getRepositoryToken(Kitty));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(async () => {
    await module.close();
  });

  const seedKittens = async () => {
    const user1 = userRepo.create({
      discordId: 'user_1',
    });
    const user2 = userRepo.create({
      discordId: 'user_2',
    });
    await userRepo.insert(user1);
    await userRepo.insert(user2);

    await kittyRepo.insert({
      name: 'coco',
      sex: KittenSex.MALE,
      eyeColor: 'ffffff',
      furColor: 'fffff',
      user: user1,
    });

    await kittyRepo.insert({
      name: 'foo',
      sex: KittenSex.FEMALE,
      eyeColor: 'ffffff',
      furColor: 'fffff',
      user: user2,
    });
  };

  it('should be defined', () => {
    expect(kittyService).toBeDefined();
  });

  it('generate random color', () => {
    for (let i = 0; i < 100; i++) {
      expect(kittyService.generateRandomColor()).toHaveLength(6);
    }
  });

  it('generate random sex', () => {
    const sexes: KittenSex[] = [];
    for (let j = 0; j < 100000; j++) {
      const sex = kittyService.generateRandomSex();
      expect(sex).toMatch(new RegExp(`${KittenSex.MALE}|${KittenSex.FEMALE}`));
      sexes.push(sex);
    }
    const count = sexes.reduce(
      (carry, item) => {
        carry[item]++;
        return carry;
      },
      {
        [KittenSex.MALE]: 0,
        [KittenSex.FEMALE]: 0,
      },
    );
    const ratio = count[KittenSex.MALE] / count[KittenSex.FEMALE];
    expect(ratio).toBeGreaterThan(0.95);
    expect(ratio).toBeLessThan(1.05);
  });

  it('fetch the list of kitties in the database', async () => {
    await kittyRepo.insert({
      name: 'test1',
      sex: KittenSex.MALE,
      furColor: '000000',
      eyeColor: '000000',
    });
    await kittyRepo.insert({
      name: 'test2',
      sex: KittenSex.MALE,
      furColor: '000000',
      eyeColor: '000000',
    });

    const list = await kittyService.list();
    expect(list).toHaveLength(2);
  });

  it('create a kitty with random properties', async () => {
    const user = await userRepo.create({
      uuid: '123',
      discordId: '123',
    });
    await userRepo.insert(user);
    await kittyService.create({
      name: 'chat de test',
      user,
    });

    const kitties = await kittyRepo.find();
    expect(kitties).toHaveLength(1);
    const kitty = kitties[0];
    expect(kitty.uuid).toBeDefined();
    expect(kitty.name).toBe('chat de test');
    expect(kitty.sex).toMatch(
      new RegExp(`${KittenSex.FEMALE}|${KittenSex.MALE}`),
    );
    expect(kitty.furColor).toHaveLength(6);
    expect(kitty.eyeColor).toHaveLength(6);
  });

  it('find the list of kitties by discord userID', async () => {
    await seedKittens();

    const kitties = await kittyService.listByDiscordId('user_1');
    expect(kitties).toHaveLength(1);
    expect(kitties[0].name).toBe('coco');
  });

  describe('pet kitten', () => {
    beforeEach(async () => {
      await seedKittens();
    });

    it('raise the affection level by one', async () => {
      await kittyService.petKitten('user_1', 'coco');

      const coco = await kittyRepo.findOne({
        relations: ['user'],
        where: {
          name: 'coco',
          user: {
            discordId: 'user_1',
          },
        },
      });

      expect(coco.affection).toBe(1);
    });
  });

  describe('find kitten by discordId and name', () => {
    it('return the kitten if exist', async () => {
      await seedKittens();

      const kitten = await kittyService.findOneByDiscordIdAndKittenName(
        'user_1',
        'coco',
      );

      expect(kitten).toBeDefined();
      expect(kitten.name).toBe('coco');
      expect(kitten.sex).toBe(KittenSex.MALE);
    });
    it('throw a not found error if the not found', async () => {
      await seedKittens();

      expect(
        kittyService.findOneByDiscordIdAndKittenName('user_1', 'invalid'),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
