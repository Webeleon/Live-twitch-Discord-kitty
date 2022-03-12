import { Test, TestingModule } from '@nestjs/testing';
import { KittyImageGenerator } from './kitty-image-generator.provider';
import { KittenSex } from './enum/sex.enum';
import { Kitty } from './kitty.entity';

const kitty = {
  uuid: 'foo',
  sex: KittenSex.MALE,
  name: 'cocolo',
  affection: 1,
  eyeColor: 'ffffff',
  furColor: 'ffffff',
} as Kitty;

describe('kitty image generator', () => {
  let kittyImageGenerator: KittyImageGenerator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KittyImageGenerator],
    }).compile();

    kittyImageGenerator = module.get<KittyImageGenerator>(KittyImageGenerator);
  });

  it('kitty to svg', () => {
    expect(kittyImageGenerator.kittyToSvg(kitty)).toMatchSnapshot();
  });

  it('svg to png', async () => {
    const buffer = await kittyImageGenerator.generate(kitty);
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
