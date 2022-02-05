import { Test, TestingModule } from '@nestjs/testing';
import { KittyService } from './kitty.service';
import { TypeormSqliteTestingModule } from '../test-utils/typeorm-sqlite-testing-module';
import { Repository } from 'typeorm';
import { Kitty } from './kitty.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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

  it('generate random dna', () => {
    for (let i = 0; i < 1000; i++) {
      const randomDNA = kittyService.generateRandomDna();
      expect(randomDNA).toHaveLength(6);
    }
  });

  it('fetch the list of kitties in the database', async () => {
    await kittyRepo.insert({
      name: 'test1',
      dna: 'dna1',
    });
    await kittyRepo.insert({
      name: 'test2',
      dna: 'dna2',
    });

    const list = await kittyService.list();
    expect(list).toHaveLength(2);
  });

  it('create a kitty with a random dna', async () => {
    await kittyService.create({ name: 'chat de test' });

    const kitties = await kittyRepo.find();
    expect(kitties).toHaveLength(1);
    const kitty = kitties[0];
    expect(kitty.uuid).toBeDefined();
    expect(kitty.name).toBe('chat de test');
    expect(kitty.dna).toHaveLength(6);
  });
});
