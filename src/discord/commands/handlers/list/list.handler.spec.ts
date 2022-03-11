import { ListHandler } from './list.handler';
import { Test, TestingModule } from '@nestjs/testing';
import { KittyService } from '../../../../kitty/kitty.service';
import { Kitty } from '../../../../kitty/kitty.entity';
import { KittenSex } from '../../../../kitty/enum/sex.enum';
import { Message } from 'discord.js';

describe('[Handler] list kitties', () => {
  let listHandler: ListHandler;
  const kittyServiceMock = {
    listByDiscordId: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ListHandler,
        {
          provide: KittyService,
          useValue: kittyServiceMock,
        },
      ],
    }).compile();

    listHandler = testingModule.get<ListHandler>(ListHandler);
  });

  describe('test command', () => {
    it('accept <prefix> list case insensitive', () => {
      expect(listHandler.test('list')).toBe(true);
      expect(listHandler.test('LIST')).toBe(true);
    });
  });

  describe('run command', () => {
    it('return an embed with the kittens of the requested player', async () => {
      const kittiesFixture: Kitty[] = [
        {
          name: 'foo',
          sex: KittenSex.FEMALE,
          furColor: 'ffffff',
          eyeColor: '000000',
          uuid: 'fake cat id',
          user: {
            uuid: 'fake id',
            discordId: 'coco',
            kitties: [],
            fishes: 0,
            coins: 0,
          },
        },
      ];
      kittyServiceMock.listByDiscordId.mockResolvedValue(kittiesFixture);

      const embed = await listHandler.run('list', {
        author: {
          id: 'coco',
        },
      } as Message);

      expect(embed.title).toBe('Your kitties');
      expect(embed.description.split('\n')).toHaveLength(1);
    });
  });
});
