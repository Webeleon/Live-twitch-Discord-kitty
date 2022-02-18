import { CommandHandler } from '../interfaces/command-handler.interface';
import { Message, MessageEmbed } from 'discord.js';

export class StartHandler implements CommandHandler {
  test(message: string): boolean {
    return /^start|init/i.test(message);
  }

  async run(
    messageWithoutPrefix: string,
    message: Message,
  ): Promise<MessageEmbed> {
    return new MessageEmbed().setTitle('welcome!');
  }
}
