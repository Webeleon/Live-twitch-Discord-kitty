import { Inject, Injectable, Logger } from '@nestjs/common';
import { Client, Intents, Message } from 'discord.js';
import { discordConfig } from '../configurations/discord.config';
import { ConfigType } from '@nestjs/config';
import { CommandsService } from './commands/commands.service';

@Injectable()
export class DiscordService {
  client: Client;

  constructor(
    @Inject(discordConfig.KEY)
    private readonly config: ConfigType<typeof discordConfig>,
    private readonly commandService: CommandsService,
  ) {
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

    await this.client.login(this.config.token);
  }

  registerCommands() {
    Logger.log('Registering commands', DiscordService.name);
    this.client.on('messageCreate', (message) => this.onMessage(message));
  }

  async onMessage(message: Message): Promise<void> {
    if (message.author.bot) return;
    if (!this.startWithPrefix(message.cleanContent)) return;

    try {
      const response = await this.commandService.dispatch(
        this.getMessageContentWithoutPrefix(message.content),
        message,
      );

      response
        .setFooter({
          text: `This bot is in dev, data will be wiped. Developed live on twitch.`,
        })
        .setURL('https://twitch.tv/webeleon');

      await message.reply({
        embeds: [response],
      });
    } catch (e) {
      Logger.error(e.message, e.stack, DiscordService.name);
    }
  }

  getMessageContentWithoutPrefix(messageContent: string): string {
    return messageContent
      .replace(new RegExp(`^${this.config.prefix}`, 'i'), '')
      .trim();
  }

  startWithPrefix(message: string): boolean {
    return !!message.match(new RegExp(`^${this.config.prefix}`, 'i'));
  }
}
