import { PetHandler } from './pet.handler';
import { Test, TestingModule } from '@nestjs/testing';
import { KittyService } from '../../../../kitty/kitty.service';

describe('[Handler] pet', () => {
  let petHandler: PetHandler;
  const kittyServiceMock = {
    pet: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        PetHandler,
        {
          provide: KittyService,
          useValue: kittyServiceMock,
        },
      ],
    }).compile();

    petHandler = testingModule.get<PetHandler>(PetHandler);
  });

  it('respond to pet <name> case insensitive', () => {
    expect(petHandler.test('pet marcel')).toBe(true);
    expect(petHandler.test('PET marcel')).toBe(true);
    expect(petHandler.test('use the command pet marcel')).toBe(false);
  });

  it('can extract the pet name', () => {
    expect(petHandler.getPetName('pet marcel')).toBe('marcel');
    expect(petHandler.getPetName('pet marcel le roi')).toBe('marcel');
  });
});
