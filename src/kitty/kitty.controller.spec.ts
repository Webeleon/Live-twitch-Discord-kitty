import { Test, TestingModule } from '@nestjs/testing';
import { KittyController } from './kitty.controller';
import { KittyService } from './kitty.service';
import { Response } from 'express';

describe('KittyController', () => {
  let controller: KittyController;

  const kittyServiceMock = {
    getKittyImageById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KittyController],
      providers: [
        {
          provide: KittyService,
          useValue: kittyServiceMock,
        },
      ],
    }).compile();

    controller = module.get<KittyController>(KittyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('kitty image', async () => {
    const response = {
      setHeader: () => {
        return {
          send: jest.fn(),
        };
      },
    } as unknown as Response;
    await controller.getKittyImage('foo', response);

    expect(kittyServiceMock.getKittyImageById).toHaveBeenCalled();
  });
});
