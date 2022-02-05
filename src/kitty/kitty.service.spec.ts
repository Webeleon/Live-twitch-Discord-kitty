import { Test, TestingModule } from '@nestjs/testing';
import { KittyService } from './kitty.service';

describe('KittyService', () => {
  let service: KittyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KittyService],
    }).compile();

    service = module.get<KittyService>(KittyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
