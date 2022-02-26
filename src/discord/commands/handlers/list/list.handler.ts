import { CommandHandler } from '../../interfaces/command-handler.interface';
import { Message, MessageEmbed } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { KittyService } from '../../../../kitty/kitty.service';

@Injectable()
export class ListHandler implements CommandHandler {
  regex = /^list$/i;

  constructor(private readonly kittyService: KittyService) {}

  test(message: string): boolean {
    return this.regex.test(message);
  }

  async run(
    messageWithoutPrefix: string,
    message: Message,
  ): Promise<MessageEmbed> {
    const usersKitties = await this.kittyService.listByDiscordId(
      message.author.id,
    );
    const embed = new MessageEmbed();
    embed.setTitle('Your kitties');

    const description: string[] = [];
    for (const kitten of usersKitties) {
      description.push(`:${kitten.sex}_sign: ${kitten.name}`);
    }
    embed.setDescription(description.join('\n'));

    return embed;
  }
}
