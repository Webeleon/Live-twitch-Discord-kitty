import { Injectable } from '@nestjs/common';
import { StartHandler } from './handlers/start/start.handler';
import { Message } from 'discord.js';
import { CommandHandler } from './interfaces/command-handler.interface';
import { ListHandler } from './handlers/list/list.handler';
import { ShowHandler } from './handlers/show/show.handler';

@Injectable()
export class CommandsService {
  commands: CommandHandler[];

  constructor(
    private readonly startHandler: StartHandler,
    private readonly listHandler: ListHandler,
    private readonly showHandler: ShowHandler,
  ) {
    this.commands = [startHandler, listHandler, showHandler];
  }

  async dispatch(messageWithoutPrefix: string, message: Message) {
    for (const handler of this.commands) {
      if (handler.test(messageWithoutPrefix))
        return handler.run(messageWithoutPrefix, message);
    }
  }
}
