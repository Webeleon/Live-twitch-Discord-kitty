import { Test, TestingModule } from '@nestjs/testing';
import { KittyController } from './kitty.controller';

describe('KittyController', () => {
  let controller: KittyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KittyController],
    }).compile();

    controller = module.get<KittyController>(KittyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
