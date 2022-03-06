import { CommandHandler } from '../../interfaces/command-handler.interface';
import { Message, MessageEmbed } from 'discord.js';
import { Injectable } from '@nestjs/common';
import { KittyService } from '../../../../kitty/kitty.service';

@Injectable()
export class ShowHandler implements CommandHandler {
  regex = /^(?:show )(\w+)/i;

  constructor(private readonly kittyService: KittyService) {}

  test(message: string): boolean {
    return this.regex.test(message);
  }

  async run(
    messageWithoutPrefix: string,
    message: Message,
  ): Promise<MessageEmbed> {
    const embed = new MessageEmbed();
    const kittenName = this.getKittenName(messageWithoutPrefix);

    try {
      const kitten = await this.kittyService.findOneByDiscordIdAndKittenName(
        message.author.id,
        kittenName,
      );

      embed.setTitle(kitten.name);
      embed.setColor(`#${kitten.furColor}`);
      embed.setDescription(`sex: :${kitten.sex}_sign:
      :eyes: eye color: ${kitten.eyeColor}
      :cat: fur color: ${kitten.furColor}
      :heart: affection: ${kitten.affection}`);
    } catch (error) {
      embed.setTitle(
        `Ooooh your kitten ${kittenName} does not seems to exist...`,
      );
      embed.setDescription('use the command list to display your kitties.');
      embed.setColor('RED');
    }

    return embed;
  }

  getKittenName(messageWithoutPrefix: string): string {
    const [cmd, kittenName] = messageWithoutPrefix.match(this.regex);
    return kittenName;
  }
}
