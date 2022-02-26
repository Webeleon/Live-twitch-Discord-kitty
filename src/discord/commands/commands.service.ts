import { Injectable } from '@nestjs/common';
import { StartHandler } from './handlers/start.handler';
import { Message } from 'discord.js';
import { CommandHandler } from './interfaces/command-handler.interface';
import { ListHandler } from './handlers/list.handler';

@Injectable()
export class CommandsService {
  commands: CommandHandler[];

  constructor(
    private readonly startHandler: StartHandler,
    private readonly listHandler: ListHandler,
  ) {
    this.commands = [startHandler, listHandler];
  }

  async dispatch(messageWithoutPrefix: string, message: Message) {
    for (const handler of this.commands) {
      if (handler.test(messageWithoutPrefix))
        return handler.run(messageWithoutPrefix, message);
    }
  }
}
