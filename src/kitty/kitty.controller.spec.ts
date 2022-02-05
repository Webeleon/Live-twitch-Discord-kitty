import { Test, TestingModule } from '@nestjs/testing';
import { KittyController } from './kitty.controller';
import { KittyService } from './kitty.service';

describe('KittyController', () => {
  let kittyController: KittyController;
  const kittyServiceMock = {
    list: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KittyService,
          useValue: kittyServiceMock,
        },
      ],
      controllers: [KittyController],
    }).compile();

    kittyController = module.get<KittyController>(KittyController);
  });

  it('should be defined', () => {
    expect(kittyController).toBeDefined();
  });

  it('list', async () => {
    await kittyController.list();
    expect(kittyServiceMock.list).toHaveBeenCalled();
  });

  it('create', async () => {
    await kittyController.create({ name: 'test' });
    expect(kittyServiceMock.create).toHaveBeenCalledWith({ name: 'test' });
  });
});
