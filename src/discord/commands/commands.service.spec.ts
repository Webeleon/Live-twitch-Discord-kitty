import { Test, TestingModule } from '@nestjs/testing';
import { CommandsService } from './commands.service';
import { StartHandler } from './handlers/start/start.handler';
import { Message } from 'discord.js';
import { ListHandler } from './handlers/list/list.handler';
import { ShowHandler } from './handlers/show/show.handler';
import { PetHandler } from './handlers/pet/pet.handler';
import { DailyHandler } from './handlers/daily/daily.handler';

describe('CommandsService', () => {
  let commandsService: CommandsService;
  const commandHandlerMock = {
    test: jest.fn(),
    run: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommandsService,
        {
          provide: StartHandler,
          useValue: commandHandlerMock,
        },
        {
          provide: ListHandler,
          useValue: commandHandlerMock,
        },
        {
          provide: ShowHandler,
          useValue: commandHandlerMock,
        },
        {
          provide: PetHandler,
          useValue: commandHandlerMock,
        },
        {
          provide: DailyHandler,
          useValue: commandHandlerMock,
        },
      ],
    }).compile();

    commandsService = module.get<CommandsService>(CommandsService);
  });

  it('should be defined', () => {
    expect(commandsService).toBeDefined();
  });

  it('dispatch commands to the correct handler', async () => {
    commandHandlerMock.test.mockReturnValue(true);
    commandHandlerMock.run.mockResolvedValue('foo');

    const response = await commandsService.dispatch('start', {} as Message);
    expect(commandHandlerMock.run).toHaveBeenCalled();
    expect(response).toBe('foo');
  });
});
