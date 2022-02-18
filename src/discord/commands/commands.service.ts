import { Injectable } from '@nestjs/common';
import { StartHandler } from './handlers/start.handler';
import { Message } from 'discord.js';
import { CommandHandler } from './interfaces/command-handler.interface';

@Injectable()
export class CommandsService {
  commands: CommandHandler[];

  constructor(private readonly startHandler: StartHandler) {
    this.commands = [startHandler];
  }

  async dispatch(messageWithoutPrefix: string, message: Message) {
    for (const handler of this.commands) {
      if (handler.test(messageWithoutPrefix))
        return handler.run(messageWithoutPrefix, message);
    }
  }
}
