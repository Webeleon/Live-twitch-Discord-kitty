import { Test, TestingModule } from '@nestjs/testing';
import { DiscordService } from './discord.service';
import { getConfigToken } from '@nestjs/config';
import { CommandsService } from './commands/commands.service';

describe('DiscordService', () => {
  let discordService: DiscordService;
  const commandsServiceMock = {
    dispatch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: CommandsService,
          useValue: commandsServiceMock,
        },
        {
          provide: getConfigToken('discord'),
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

  it('[getMessageContentWithoutPrefix]', () => {
    expect(discordService.getMessageContentWithoutPrefix('kitties start')).toBe(
      'start',
    );
    expect(discordService.getMessageContentWithoutPrefix('KITTIES start')).toBe(
      'start',
    );
    expect(
      discordService.getMessageContentWithoutPrefix('kitties pet mistigri'),
    ).toBe('pet mistigri');

    expect(
      discordService.getMessageContentWithoutPrefix('kitties pet kitties'),
    ).toBe('pet kitties');
  });

  it('[startWithPrefix] check if message start with the configured prefix case insensitive', () => {
    expect(discordService.startWithPrefix('kitties start')).toBe(true);
    expect(discordService.startWithPrefix('KITTIES start')).toBe(true);
    expect(discordService.startWithPrefix('kitty start')).toBe(false);
  });
});
