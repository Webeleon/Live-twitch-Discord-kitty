import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, Intents, MessageEmbed } from 'discord.js';
import {
  DISCORD_CONFIG,
  DiscordConfig,
} from '../configurations/discord.config';

@Injectable()
export class DiscordService {
  client: Client;

  constructor(@Inject(DISCORD_CONFIG) private readonly config: DiscordConfig) {
    Logger.log(
      `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=0&scope=bot%20applications.commands`,
      DiscordService.name,
    );
  }

  async startClient() {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    this.client.once('ready', () => {
      Logger.log('Discord client ready', DiscordService.name);
    });

    this.client.on('error', (error) => {
      Logger.error(error.message, DiscordService.name);
    });

    this.client.login(this.config.token);
  }

  registerCommands() {
    Logger.log('Registering commands', DiscordService.name);
    this.client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (!this.startWithPrefix(message.cleanContent)) return;

      await message.channel.send({
        embeds: [
          new MessageEmbed({
            title: 'Work In Progress',
            description:
              'Ce bot est codé en live sur le stream twitch de webeleon!',
            url: 'http://twitch.tv/webeleon',
            footer: {
              text: 'Version alpha, toutes les données seront effacé lors du passage en beta.',
            },
          }),
        ],
      });
    });
  }

  startWithPrefix(message: string): boolean {
    return !!message.match(new RegExp(`^${this.config.prefix}`, 'i'));
  }
}
