import { CommandHandler } from '../../interfaces/command-handler.interface';
import { Message, MessageEmbed } from 'discord.js';
import { UserService } from '../../../../user/user.service';
import { OnCooldownError } from '../../../../common/error/on-cooldown.error';
import { DailyBonus } from '../../../../user/dto/daily-bonus.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DailyHandler implements CommandHandler {
  constructor(private readonly userService: UserService) {}

  test(messageWithoutPrefix: string): boolean {
    return /^daily$/i.test(messageWithoutPrefix);
  }

  async run(
    messageWithoutPrefix: string,
    message: Message,
  ): Promise<MessageEmbed> {
    try {
      const dailyBonus = await this.userService.dailyBonus(message.author.id);
      return this.successEmbed(dailyBonus);
    } catch (error) {
      if (error instanceof OnCooldownError) {
        return this.errorEmbed(error);
      }
      throw error;
    }
  }

  errorEmbed(error: OnCooldownError): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setColor('RED');
    let cooldown;
    if (error.cooldown <= 60) {
      cooldown = `${error.cooldown} seconds`;
    } else if (error.cooldown <= 60 * 60) {
      cooldown = `${Math.round(error.cooldown / 60)} minutes`;
    } else {
      cooldown = `${Math.round(error.cooldown / (60 * 60))} hours`;
    }

    embed.setTitle(`Come back in ${cooldown} for you next daily bonus.`);
    return embed;
  }

  successEmbed(bonus: DailyBonus): MessageEmbed {
    const embed = new MessageEmbed();

    embed.setTitle(`Here is your daily bonus come in 24h for the next one!`);
    embed.setDescription(`:fish: ${bonus.fishes}
    :dollar: ${bonus.coins}`);
    embed.setColor('GREEN');

    return embed;
  }
}
