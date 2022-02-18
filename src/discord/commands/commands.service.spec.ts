import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start.handler';
import { Message } from 'discord.js';

describe('CommandsService', () => {
  let commandsService: CommandsService;
  const startCommandHandlerMock = {
    test: jest.fn(),
    run: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandsService,
        {
          provide: StartHandler,
          useValue: startCommandHandlerMock,
        },
      ],
    }).compile();

    commandsService = module.get<CommandsService>(CommandsService);
  });

  it('should be defined', () => {
    expect(commandsService).toBeDefined();
  });

  it('dispatch commands to the correct handler', async () => {
    startCommandHandlerMock.test.mockReturnValue(true);
    startCommandHandlerMock.run.mockResolvedValue('foo');

    const response = await commandsService.dispatch('start', {} as Message);
    expect(startCommandHandlerMock.run).toHaveBeenCalled();
    expect(response).toBe('foo');
  });
});
