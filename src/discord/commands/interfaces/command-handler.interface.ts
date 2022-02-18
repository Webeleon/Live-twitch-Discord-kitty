import { Message, MessageEmbed } from 'discord.js';

export interface CommandHandler {
  test: (message: string) => boolean;
  run: (
    messageWithoutPrefix: string,
    message?: Message,
  ) => Promise<MessageEmbed>;
}
