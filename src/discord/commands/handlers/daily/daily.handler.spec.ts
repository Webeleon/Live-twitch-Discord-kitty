import { Test, TestingModule } from '@nestjs/testing';
import { DailyHandler } from './daily.handler';
import { UserService } from '../../../../user/user.service';
import { Message } from 'discord.js';
import { OnCooldownError } from '../../../../common/error/on-cooldown.error';

describe('handler daily', () => {
  let dailyHandler: DailyHandler;

  const userServiceMock = {
    dailyBonus: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        DailyHandler,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    dailyHandler = testingModule.get<DailyHandler>(DailyHandler);
  });

  it('should be defined', () => {
    expect(dailyHandler).toBeDefined();
  });

  it('respond to `daily` case insensitive', () => {
    expect(dailyHandler.test('daily')).toBe(true);
    expect(dailyHandler.test('DAILY')).toBe(true);
    expect(dailyHandler.test('use daily')).toBe(false);
  });

  describe('run', () => {
    it('a success embed', async () => {
      userServiceMock.dailyBonus.mockResolvedValueOnce({
        fishes: 3,
        coins: 100,
      });

      const embed = await dailyHandler.run('daily', {
        author: {
          id: 'user_1',
        },
      } as Message);

      expect(embed.title).toBe(
        `Here is your daily bonus come in 24h for the next one!`,
      );
      expect(embed.description.length).toBeGreaterThan(0);
    });

    it('a cooldown embed 2h', async () => {
      userServiceMock.dailyBonus.mockRejectedValueOnce(
        new OnCooldownError(2 * 60 * 62),
      );

      const embed = await dailyHandler.run('daily', {
        author: {
          id: 'user_1',
        },
      } as Message);

      expect(embed.title).toBe(
        `Come back in 2 hours for you next daily bonus.`,
      );
    });

    it('a cooldown embed 12 minutes', async () => {
      userServiceMock.dailyBonus.mockRejectedValueOnce(
        new OnCooldownError(12 * 61),
      );

      const embed = await dailyHandler.run('daily', {
        author: {
          id: 'user_1',
        },
      } as Message);

      expect(embed.title).toBe(
        `Come back in 12 minutes for you next daily bonus.`,
      );
    });

    it('a cooldown embed 7 seconds', async () => {
      userServiceMock.dailyBonus.mockRejectedValueOnce(new OnCooldownError(7));

      const embed = await dailyHandler.run('daily', {
        author: {
          id: 'user_1',
        },
      } as Message);

      expect(embed.title).toBe(
        `Come back in 7 seconds for you next daily bonus.`,
      );
    });
  });
});
