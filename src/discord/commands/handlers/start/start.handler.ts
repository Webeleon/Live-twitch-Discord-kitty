import { CommandHandler } from '../../interfaces/command-handler.interface';
import { Message, MessageEmbed } from 'discord.js';
import { KittyService } from '../../../../kitty/kitty.service';
import { UserService } from '../../../../user/user.service';
import { Injectable } from '@nestjs/common';
import { Kitty } from '../../../../kitty/kitty.entity';

@Injectable()
export class StartHandler implements CommandHandler {
  regex = new RegExp('^(?:init|start)\\s?(\\w*)?', 'i');

  constructor(
    private readonly kittyService: KittyService,
    private readonly userService: UserService,
  ) {}

  test(message: string): boolean {
    return this.regex.test(message);
  }

  async run(
    messageWithoutPrefix: string,
    message: Message,
  ): Promise<MessageEmbed> {
    if (await this.userService.userExist(message.author.id)) {
      return this.generateUserAlreadyExistEmbed();
    }

    const user = await this.userService.getOrCreateUserByDiscordId(
      message.author.id,
    );
    const name = this.getKittenNameFromMessage(messageWithoutPrefix);

    const kitty = await this.kittyService.create({
      name,
      user,
    });

    return this.generateSuccessMessage(kitty);
  }

  generateSuccessMessage(kitty: Kitty): MessageEmbed {
    const message = new MessageEmbed()
      .setTitle("welcome to kitten's club")
      .setDescription(`You've got youself a kitten named ${kitty.name}`)
      .addField('sex', kitty.sex)
      .addField('eye color', kitty.eyeColor)
      .addField('fur color', kitty.furColor)
      .setColor(`#${kitty.furColor}`);

    return message;
  }

  getKittenNameFromMessage(message: string): string {
    const [cmd, name] = message.match(this.regex);
    return name;
  }

  generateUserAlreadyExistEmbed() {
    return new MessageEmbed()
      .setTitle('You already registered')
      .setDescription('You can only register once to get a free kitty...')
      .setImage(
        'https://i.kym-cdn.com/photos/images/original/000/481/790/669.jpg',
      );
  }
}
