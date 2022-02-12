import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { DISCORD_CONFIG } from '../configurations/discord.config';

describe('DiscordService', () => {
  let discordService: DiscordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: DISCORD_CONFIG,
          useValue: {
            prefix: 'kitties',
          },
        },
      ],
    }).compile();

    discordService = module.get<DiscordService>(DiscordService);
  });

  it('should be defined', () => {
    expect(discordService).toBeDefined();
  });

  it('[startWithPrefix] check if message start with the configured prefix case insensitive', () => {
    expect(discordService.startWithPrefix('kitties start')).toBe(true);
    expect(discordService.startWithPrefix('KITTIES start')).toBe(true);
    expect(discordService.startWithPrefix('kitty start')).toBe(false);
  });
});
