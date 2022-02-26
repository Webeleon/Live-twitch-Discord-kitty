import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start/start.handler';
import { Message } from 'discord.js';
import { ListHandler } from './handlers/list/list.handler';

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
        {
          provide: ListHandler,
          useValue: {
            test: jest.fn(),
            run: jest.fn(),
          },
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
