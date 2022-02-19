import { Test, TestingModule } from '@nestjs/testing';
import { KittyService } from './kitty.service';
import { TypeormSqliteTestingModule } from '../test-utils/typeorm-sqlite-testing-module';
import { Repository } from 'typeorm';
import { Kitty } from './kitty.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KittenSex } from './enum/sex.enum';

describe('KittyService', () => {
  let kittyService: KittyService;
  let kittyRepo: Repository<Kitty>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeormSqliteTestingModule()],
      providers: [KittyService],
    }).compile();

    kittyService = module.get<KittyService>(KittyService);
    kittyRepo = module.get<Repository<Kitty>>(getRepositoryToken(Kitty));
  });

  afterEach(async () => {
    await kittyRepo.delete({});
  });

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
    await kittyService.create({ name: 'chat de test' });

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
});
