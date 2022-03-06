import { CommandHandler } from '../../interfaces/command-handler.interface';
import { Message, MessageEmbed } from 'discord.js';
import { Injectable, Logger } from '@nestjs/common';
import { KittyService } from '../../../../kitty/kitty.service';
import { OnCooldownError } from '../../../../kitty/error/on-cooldown.error';

@Injectable()
export class PetHandler implements CommandHandler {
  regex = /^(?:pet )(\w+)/i;

  constructor(private readonly kittyService: KittyService) {}

  test(message: string): boolean {
    return this.regex.test(message);
  }

  async run(
    messageWithoutPrefix: string,
    message: Message,
  ): Promise<MessageEmbed> {
    const kittenName = this.getPetName(messageWithoutPrefix);
    const embed = new MessageEmbed();

    try {
      const kitty = await this.kittyService.petKitten(
        message.author.id,
        kittenName,
      );

      embed.setTitle(`${kittenName} gain affection for you`);
      embed.setDescription(`:heart: affection: ${kitty.affection}`);
    } catch (error) {
      if (error instanceof OnCooldownError) {
        embed.setTitle(
          `${kittenName} can not be petted right now... come back in ${error.cooldown} seconds...`,
        );
        embed.setColor('RED');
      } else {
        Logger.error(error, PetHandler.name);
        throw error;
      }
    }

    return embed;
  }

  getPetName(messageWithoutPrefix: string): string {
    const [cmd, name] = messageWithoutPrefix.match(this.regex);
    return name;
  }
}
