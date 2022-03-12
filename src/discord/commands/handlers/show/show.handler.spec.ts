import { ShowHandler } from './show.handler';
import { Test, TestingModule } from '@nestjs/testing';
import { KittyService } from '../../../../kitty/kitty.service';
import { Message } from 'discord.js';
import { KittenSex } from '../../../../kitty/enum/sex.enum';
import { NotFoundException } from '@nestjs/common';
import { appConfig } from '../../../../configurations/app.config';

describe('[Handler] show', () => {
  let showHandler: ShowHandler;
  const kittyServiceMock = {
    findOneByDiscordIdAndKittenName: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KittyService,
          useValue: kittyServiceMock,
        },
        ShowHandler,
        {
          provide: appConfig.KEY,
          useValue: {
            baseUrl: 'http://localhost',
          },
        },
      ],
    }).compile();
    showHandler = testingModule.get<ShowHandler>(ShowHandler);
  });

  it('is defined', () => {
    expect(showHandler).toBeDefined();
    expect(showHandler).toBeInstanceOf(ShowHandler);
    jest.resetAllMocks();
  });

  it('respond to `show <name>` case insensitive', () => {
    expect(showHandler.test('show marcel')).toBe(true);
    expect(showHandler.test('SHOW marcel')).toBe(true);
    expect(showHandler.test('it show marcel')).toBe(false);
    // expect(showHandler.test('show marcel et johnny')).toBe(false);
  });

  it('get the kitten name from the command', () => {
    expect(showHandler.getKittenName('show marcel')).toBe('marcel');
    expect(showHandler.getKittenName('SHOW marcel')).toBe('marcel');
    expect(showHandler.getKittenName('show marceL')).toBe('marceL');
    expect(showHandler.getKittenName('show marcel et sylvie')).toBe('marcel');
  });

  describe('run', () => {
    it('return an existing kitten in an embed', async () => {
      kittyServiceMock.findOneByDiscordIdAndKittenName.mockResolvedValue({
        name: 'marcel',
        sex: KittenSex.MALE,
        furColor: 'ffffff',
      });

      const embed = await showHandler.run('show marcel', {
        author: {
          id: 'user_1',
        },
      } as Message);

      expect(embed.title).toBe('marcel');
      expect(embed.description.length).toBeGreaterThan(1);
    });

    it('return an error embed', async () => {
      kittyServiceMock.findOneByDiscordIdAndKittenName.mockRejectedValueOnce(
        new NotFoundException('marcel not found'),
      );

      const embed = await showHandler.run('show marcel', {
        author: {
          id: 'user_1',
        },
      } as Message);

      expect(embed.title).toBe(
        'Ooooh your kitten marcel does not seems to exist...',
      );
      expect(embed.description).toBe(
        'use the command list to display your kitties.',
      );
    });
  });
});
